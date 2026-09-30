-- KEY: keep only the table privileges the site uses (row level security already
-- filters the rows; this also hides admin/order tables from the public API schema).
revoke all on public.key_admins, public.key_orders, public.key_order_items from anon;
revoke all on public.key_admins from authenticated;
revoke insert, delete, truncate, references, trigger on public.key_orders, public.key_order_items from authenticated;
revoke insert, update, delete, truncate, references, trigger on public.key_products, public.key_categories from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.key_site_settings, public.key_banners from anon;
revoke delete, truncate, references, trigger on public.key_site_settings, public.key_banners from authenticated;
