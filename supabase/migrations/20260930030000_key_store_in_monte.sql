-- ============================================================================
-- KEY store inside the MONTÊ Supabase project.
-- Every object here belongs to KEY and is named key_* (or *_key_*): nothing of
-- MONTÊ is touched. KEY admins are listed in key_admins, so an admin of MONTÊ
-- is not an admin of KEY (and vice versa).
-- ============================================================================

-- --- tables -------------------------------------------------------------------
create table if not exists public.key_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.key_products (
  id uuid primary key default gen_random_uuid(),
  name text,
  slug text unique,
  description text,
  price numeric,
  compare_at_price numeric,
  category_id uuid references public.key_categories (id) on delete set null,
  image_url text,
  images jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  stock integer not null default 0,
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  legacy_id integer unique,
  variants jsonb not null default '[]'::jsonb
);
create index if not exists key_products_active_idx on public.key_products (active);
create index if not exists key_products_category_id_idx on public.key_products (category_id);
create index if not exists key_products_variants_gin on public.key_products using gin (variants);

create table if not exists public.key_site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.key_banners (
  id bigint primary key,
  title text not null default '',
  subtitle text not null default '',
  cta text not null default '',
  image_path text,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.key_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  cep text,
  address text,
  address_number text,
  city text,
  state text,
  payment_method text not null default 'pix',
  subtotal numeric not null check (subtotal >= 0),
  shipping numeric not null default 0 check (shipping >= 0),
  discount numeric not null default 0 check (discount >= 0),
  total numeric not null check (total >= 0),
  coupon text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists key_orders_created_at_idx on public.key_orders (created_at desc);
create index if not exists key_orders_status_idx on public.key_orders (status);

create table if not exists public.key_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.key_orders (id) on delete cascade,
  product_id uuid not null references public.key_products (id),
  product_name text not null,
  size text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric not null check (unit_price >= 0),
  created_at timestamptz not null default now(),
  color text
);
create index if not exists key_order_items_order_idx on public.key_order_items (order_id);
create index if not exists key_order_items_product_idx on public.key_order_items (product_id);

-- who can use the KEY panel (independent from MONTÊ's admins)
create table if not exists public.key_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- one-time activation codes to create panel access (only hashes are stored)
create table if not exists public.key_setup_codes (
  code_hash text primary key,
  created_at timestamptz not null default now(),
  used_at timestamptz,
  used_by uuid
);

alter table public.key_categories enable row level security;
alter table public.key_products enable row level security;
alter table public.key_site_settings enable row level security;
alter table public.key_banners enable row level security;
alter table public.key_orders enable row level security;
alter table public.key_order_items enable row level security;
alter table public.key_admins enable row level security;
alter table public.key_setup_codes enable row level security;
revoke all on public.key_setup_codes from anon, authenticated;

-- --- access helpers ------------------------------------------------------------------
create or replace function public.is_key_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.key_admins a where a.user_id = auth.uid());
$$;

create or replace function public.key_normalize_code(p_code text)
returns text
language sql
immutable
set search_path = ''
as $$
  select upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
$$;

create or replace function public.key_issue_setup_code()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  bytes bytea := extensions.gen_random_bytes(12);
  raw text := '';
  i int;
begin
  for i in 0..11 loop
    raw := raw || substr(alphabet, (get_byte(bytes, i) % 32) + 1, 1);
  end loop;
  insert into public.key_setup_codes (code_hash) values (encode(extensions.digest(raw, 'sha256'), 'hex'));
  return substr(raw, 1, 4) || '-' || substr(raw, 5, 4) || '-' || substr(raw, 9, 4);
end;
$$;

-- First access with an activation code: creates the account (or, for an account that
-- exists but was never used, defines its password) and makes it a KEY admin.
create or replace function public.key_setup_admin(p_code text, p_email text, p_password text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(coalesce(p_email, '')));
  v_hash text := encode(extensions.digest(public.key_normalize_code(p_code), 'sha256'), 'hex');
  v_uid uuid;
  v_pass text;
  v_last timestamptz;
begin
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Digite um e-mail válido.';
  end if;
  if char_length(coalesce(p_password, '')) < 8 then
    raise exception 'A senha precisa ter pelo menos 8 caracteres.';
  end if;
  perform 1 from public.key_setup_codes where code_hash = v_hash and used_at is null for update;
  if not found then
    raise exception 'Código de ativação inválido ou já usado.';
  end if;

  select u.id, u.encrypted_password, u.last_sign_in_at into v_uid, v_pass, v_last
  from auth.users u where lower(u.email) = v_email and u.deleted_at is null limit 1;
  if v_uid is not null then
    if v_last is null then
      update auth.users
        set encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf', 10)),
            email_confirmed_at = coalesce(email_confirmed_at, now()),
            updated_at = now()
        where id = v_uid;
    elsif v_pass is null or extensions.crypt(p_password, v_pass) <> v_pass then
      raise exception 'Este e-mail já tem uma conta. Use a senha dessa conta.';
    end if;
  else
    v_uid := gen_random_uuid();
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change,
      email_change_token_current, phone_change, phone_change_token, reauthentication_token
    ) values (
      '00000000-0000-0000-0000-000000000000', v_uid, 'authenticated', 'authenticated', v_email,
      extensions.crypt(p_password, extensions.gen_salt('bf', 10)), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now(),
      '', '', '', '', '', '', '', ''
    );
    insert into auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values (
      gen_random_uuid(), v_uid::text, v_uid,
      jsonb_build_object('sub', v_uid::text, 'email', v_email, 'email_verified', true, 'phone_verified', false),
      'email', now(), now(), now()
    );
  end if;

  insert into public.key_admins (user_id, email) values (v_uid, v_email) on conflict (user_id) do nothing;
  update public.key_setup_codes set used_at = now(), used_by = v_uid where code_hash = v_hash;
  return jsonb_build_object('ok', true, 'email', v_email);
end;
$$;

-- an admin can issue a code to invite someone else
create or replace function public.key_new_setup_code()
returns text
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_key_admin() then
    raise exception 'Acesso negado';
  end if;
  return public.key_issue_setup_code();
end;
$$;

-- --- store functions (same rules as before, on the key_* tables) ----------------------
create or replace function public.create_key_order(
  p_order_number text, p_customer_name text, p_customer_email text, p_customer_phone text,
  p_cep text, p_address text, p_address_number text, p_city text, p_state text,
  p_payment_method text, p_coupon text, p_items jsonb
)
returns table(order_id uuid, order_number text, subtotal numeric, shipping numeric, discount numeric, total numeric)
language plpgsql
security definer
set search_path = ''
as $$
declare
  item jsonb; v_product_id uuid; v_color text; v_size text; v_qty integer;
  v_price numeric; v_subtotal numeric := 0; v_shipping numeric := 0; v_discount numeric := 0; v_total numeric := 0;
  v_order_id uuid; v_order_number text; v_variants jsonb; v_available integer;
  v_city text := lower(trim(coalesce(p_city, ''))); v_state text := upper(trim(coalesce(p_state, '')));
begin
  if coalesce(jsonb_array_length(p_items), 0) = 0 then raise exception 'O pedido não possui itens.'; end if;
  if p_payment_method not in ('pix', 'card') then raise exception 'Forma de pagamento inválida.'; end if;
  if v_state <> 'CE' then raise exception 'No momento, entregas para esta UF ainda não estão disponíveis.'; end if;

  for item in select * from jsonb_array_elements(p_items) loop
    v_product_id := (item ->> 'product_id')::uuid;
    v_color := trim(coalesce(item ->> 'color', ''));
    v_size := upper(trim(coalesce(item ->> 'size', '')));
    v_qty := (item ->> 'quantity')::integer;

    if v_qty is null or v_qty <= 0 then raise exception 'Quantidade inválida.'; end if;
    if v_color = '' or v_size not in ('PP', 'P', 'M', 'G') then raise exception 'Variação inválida.'; end if;

    select p.price, p.variants into v_price, v_variants
    from public.key_products p where p.id = v_product_id and p.active = true for update;
    if not found then raise exception 'Produto indisponível.'; end if;

    v_available := null;
    select coalesce((variant -> 'sizes' ->> v_size)::integer, 0)
      into v_available
      from jsonb_array_elements(coalesce(v_variants, '[]'::jsonb)) variant
      where variant ->> 'name' = v_color limit 1;

    if v_available is null then raise exception 'Cor indisponível.'; end if;
    if v_available < v_qty then raise exception 'Estoque insuficiente para % / %.', v_color, v_size; end if;
    v_subtotal := v_subtotal + v_price * v_qty;
  end loop;

  if v_city = 'fortaleza' then v_shipping := 15;
  elsif v_city in ('caucaia', 'eusebio', 'eusébio', 'aquiraz', 'maracanau', 'maracanaú', 'maranguape', 'pacatuba', 'horizonte', 'itaitinga', 'guaiuba', 'guaiúba', 'chorozinho', 'pindoretama', 'sao goncalo do amarante', 'são gonçalo do amarante') then v_shipping := 20;
  else raise exception 'Frete ainda não disponível para esta cidade.'; end if;

  if v_subtotal >= 499 or upper(trim(coalesce(p_coupon, ''))) = 'KEYFRETE' then v_shipping := 0; end if;
  if upper(trim(coalesce(p_coupon, ''))) = 'KEY10' then v_discount := round(v_subtotal * 0.10, 2);
  elsif upper(trim(coalesce(p_coupon, ''))) not in ('', 'KEYFRETE') then raise exception 'Cupom inválido.'; end if;
  v_total := greatest(0, v_subtotal - v_discount + v_shipping);
  v_order_number := coalesce(nullif(trim(p_order_number), ''), 'KEY-' || lpad((floor(random() * 1000000))::text, 6, '0'));

  insert into public.key_orders (order_number, customer_name, customer_email, customer_phone, cep, address, address_number, city, state, payment_method, subtotal, shipping, discount, total, coupon, status)
  values (v_order_number, p_customer_name, p_customer_email, p_customer_phone, p_cep, p_address, p_address_number, p_city, p_state, p_payment_method, v_subtotal, v_shipping, v_discount, v_total, nullif(trim(p_coupon), ''), 'pending')
  returning id into v_order_id;

  for item in select * from jsonb_array_elements(p_items) loop
    v_product_id := (item ->> 'product_id')::uuid; v_color := trim(item ->> 'color'); v_size := upper(trim(item ->> 'size')); v_qty := (item ->> 'quantity')::integer;
    select p.price, p.variants into v_price, v_variants from public.key_products p where p.id = v_product_id for update;

    insert into public.key_order_items (order_id, product_id, product_name, color, size, quantity, unit_price)
    select v_order_id, v_product_id, p.name, v_color, v_size, v_qty, v_price from public.key_products p where p.id = v_product_id;

    select coalesce(jsonb_agg(
      case when e.variant ->> 'name' = v_color then
        jsonb_set(e.variant, '{sizes}', jsonb_set(coalesce(e.variant -> 'sizes', '{}'::jsonb), array[v_size], to_jsonb(coalesce((e.variant -> 'sizes' ->> v_size)::integer, 0) - v_qty), true))
      else e.variant end
      order by e.ord
    ), '[]'::jsonb) into v_variants
    from jsonb_array_elements(coalesce(v_variants, '[]'::jsonb)) with ordinality as e(variant, ord);

    update public.key_products
      set variants = v_variants,
          stock = (select coalesce(sum(coalesce((variant -> 'sizes' ->> 'PP')::integer, 0) + coalesce((variant -> 'sizes' ->> 'P')::integer, 0) + coalesce((variant -> 'sizes' ->> 'M')::integer, 0) + coalesce((variant -> 'sizes' ->> 'G')::integer, 0)), 0) from jsonb_array_elements(v_variants) variant),
          updated_at = now()
      where id = v_product_id;
  end loop;

  return query select v_order_id, v_order_number, v_subtotal, v_shipping, v_discount, v_total;
end;
$$;

create or replace function public.track_key_order(p_order_number text, p_customer_email text)
returns table(order_number text, customer_name text, customer_email text, city text, state text, subtotal numeric, shipping numeric, discount numeric, total numeric, status text, created_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select o.order_number, o.customer_name, o.customer_email, o.city, o.state,
         o.subtotal, o.shipping, o.discount, o.total, o.status, o.created_at
  from public.key_orders o
  where upper(trim(o.order_number)) = upper(trim(p_order_number))
    and lower(trim(o.customer_email)) = lower(trim(p_customer_email))
  limit 1;
$$;

-- cancels an order and gives its pieces back to stock
create or replace function public.cancel_key_order(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status text;
  v_item record;
  v_variants jsonb;
begin
  if not public.is_key_admin() then
    raise exception 'Acesso negado';
  end if;
  select o.status into v_status from public.key_orders o where o.id = p_order_id for update;
  if not found then
    raise exception 'Pedido não encontrado';
  end if;
  if v_status = 'cancelled' then
    return true;
  end if;

  for v_item in select i.product_id, i.color, i.size, i.quantity from public.key_order_items i where i.order_id = p_order_id loop
    select p.variants into v_variants from public.key_products p where p.id = v_item.product_id for update;
    if v_variants is null or jsonb_typeof(v_variants) <> 'array' then
      continue;
    end if;
    select coalesce(jsonb_agg(
      case when e.variant ->> 'name' = v_item.color then
        jsonb_set(e.variant, '{sizes}', jsonb_set(coalesce(e.variant -> 'sizes', '{}'::jsonb), array[v_item.size], to_jsonb(coalesce((e.variant -> 'sizes' ->> v_item.size)::integer, 0) + v_item.quantity), true))
      else e.variant end
      order by e.ord
    ), '[]'::jsonb) into v_variants
    from jsonb_array_elements(v_variants) with ordinality as e(variant, ord);
    update public.key_products
      set variants = v_variants,
          stock = (select coalesce(sum(coalesce((variant -> 'sizes' ->> 'PP')::integer, 0) + coalesce((variant -> 'sizes' ->> 'P')::integer, 0) + coalesce((variant -> 'sizes' ->> 'M')::integer, 0) + coalesce((variant -> 'sizes' ->> 'G')::integer, 0)), 0) from jsonb_array_elements(v_variants) variant),
          updated_at = now()
      where id = v_item.product_id;
  end loop;

  update public.key_orders set status = 'cancelled', updated_at = now() where id = p_order_id;
  return true;
end;
$$;

-- --- policies (orders are created only through create_key_order) -------------------------
drop policy if exists "key_categories_read" on public.key_categories;
create policy "key_categories_read" on public.key_categories
  for select to anon, authenticated using (true);

drop policy if exists "key_products_read" on public.key_products;
create policy "key_products_read" on public.key_products
  for select to anon, authenticated using (active or (select public.is_key_admin()));

drop policy if exists "key_site_settings_read" on public.key_site_settings;
create policy "key_site_settings_read" on public.key_site_settings
  for select to anon, authenticated using (true);
drop policy if exists "key_site_settings_insert" on public.key_site_settings;
create policy "key_site_settings_insert" on public.key_site_settings
  for insert to authenticated with check ((select public.is_key_admin()));
drop policy if exists "key_site_settings_update" on public.key_site_settings;
create policy "key_site_settings_update" on public.key_site_settings
  for update to authenticated using ((select public.is_key_admin())) with check ((select public.is_key_admin()));

drop policy if exists "key_banners_read" on public.key_banners;
create policy "key_banners_read" on public.key_banners
  for select to anon, authenticated using (enabled or (select public.is_key_admin()));
drop policy if exists "key_banners_insert" on public.key_banners;
create policy "key_banners_insert" on public.key_banners
  for insert to authenticated with check ((select public.is_key_admin()));
drop policy if exists "key_banners_update" on public.key_banners;
create policy "key_banners_update" on public.key_banners
  for update to authenticated using ((select public.is_key_admin())) with check ((select public.is_key_admin()));

drop policy if exists "key_orders_admin_read" on public.key_orders;
create policy "key_orders_admin_read" on public.key_orders
  for select to authenticated using ((select public.is_key_admin()));
drop policy if exists "key_orders_admin_update" on public.key_orders;
create policy "key_orders_admin_update" on public.key_orders
  for update to authenticated using ((select public.is_key_admin())) with check ((select public.is_key_admin()));

drop policy if exists "key_order_items_admin_read" on public.key_order_items;
create policy "key_order_items_admin_read" on public.key_order_items
  for select to authenticated using ((select public.is_key_admin()));
drop policy if exists "key_order_items_admin_update" on public.key_order_items;
create policy "key_order_items_admin_update" on public.key_order_items
  for update to authenticated using ((select public.is_key_admin())) with check ((select public.is_key_admin()));

drop policy if exists "key_admins_read" on public.key_admins;
create policy "key_admins_read" on public.key_admins
  for select to authenticated using ((select public.is_key_admin()));

-- --- function permissions ---------------------------------------------------------------------
revoke all on function public.is_key_admin() from public;
revoke all on function public.key_normalize_code(text) from public, anon, authenticated;
revoke all on function public.key_issue_setup_code() from public, anon, authenticated;
revoke all on function public.key_setup_admin(text, text, text) from public;
revoke all on function public.key_new_setup_code() from public, anon;
revoke all on function public.create_key_order(text, text, text, text, text, text, text, text, text, text, text, jsonb) from public;
revoke all on function public.track_key_order(text, text) from public;
revoke all on function public.cancel_key_order(uuid) from public, anon;

grant execute on function public.is_key_admin() to anon, authenticated;
grant execute on function public.key_setup_admin(text, text, text) to anon, authenticated;
grant execute on function public.key_new_setup_code() to authenticated;
grant execute on function public.create_key_order(text, text, text, text, text, text, text, text, text, text, text, jsonb) to anon, authenticated;
grant execute on function public.track_key_order(text, text) to anon, authenticated;
grant execute on function public.cancel_key_order(uuid) to authenticated;
grant execute on function public.key_issue_setup_code() to service_role;

-- --- photos (bucket key-assets, admin uploads go to the admin/ folder) --------------------------
insert into storage.buckets (id, name, public)
values ('key-assets', 'key-assets', true)
on conflict (id) do nothing;

drop policy if exists "key_assets_public_read" on storage.objects;
create policy "key_assets_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'key-assets');
drop policy if exists "key_assets_admin_insert" on storage.objects;
create policy "key_assets_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'key-assets' and (storage.foldername(name))[1] = 'admin' and (select public.is_key_admin()));
drop policy if exists "key_assets_admin_update" on storage.objects;
create policy "key_assets_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'key-assets' and (storage.foldername(name))[1] = 'admin' and (select public.is_key_admin()))
  with check (bucket_id = 'key-assets' and (storage.foldername(name))[1] = 'admin' and (select public.is_key_admin()));
drop policy if exists "key_assets_admin_delete" on storage.objects;
create policy "key_assets_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'key-assets' and (storage.foldername(name))[1] = 'admin' and (select public.is_key_admin()));
