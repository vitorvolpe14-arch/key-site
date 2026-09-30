-- KEY: panel admins turn a product on or off in the store. An inactive product is
-- hidden from the site (key_products_read) and refused by create_key_order.
create or replace function public.set_key_product_active(p_product_id uuid, p_active boolean)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_key_admin() then
    raise exception 'Acesso negado';
  end if;
  if p_active is null then
    raise exception 'Status inválido';
  end if;
  update public.key_products
    set active = p_active, updated_at = now()
    where id = p_product_id;
  if not found then
    raise exception 'Produto não encontrado';
  end if;
  return p_active;
end;
$$;

revoke all on function public.set_key_product_active(uuid, boolean) from public, anon;
grant execute on function public.set_key_product_active(uuid, boolean) to authenticated;
