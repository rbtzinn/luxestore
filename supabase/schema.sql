create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  username text not null default '',
  full_name text not null default '',
  avatar_url text,
  phone text,
  role text not null default 'customer' check (role in ('admin', 'staff', 'customer')),
  created_at timestamptz not null default now()
);

alter table public.user_profiles add column if not exists username text not null default '';

update public.user_profiles
set username = coalesce(nullif(trim(username), ''), split_part(email, '@', 1))
where username is null or trim(username) = '';

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  image_url text,
  parent_id uuid references public.categories(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(10,2) not null default 0,
  sale_price numeric(10,2),
  brand text not null default '',
  category_id uuid not null references public.categories(id) on delete restrict,
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  stock integer not null default 0,
  sku text not null unique,
  featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text not null default '',
  position integer not null default 0
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  image_url text not null,
  link_url text not null,
  position integer not null default 0,
  is_active boolean not null default true
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text not null default '',
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10,2) not null default 0,
  min_order_value numeric(10,2) not null default 0,
  max_uses integer not null default 0,
  used_count integer not null default 0,
  is_active boolean not null default true,
  expires_at date
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text not null default '',
  comment text not null default '',
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  status text not null,
  subtotal numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  coupon_code text,
  shipping_address jsonb not null,
  payment_method text not null,
  payment_status text not null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1,
  price numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at before update on public.categories for each row execute procedure public.set_updated_at();
drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at before update on public.products for each row execute procedure public.set_updated_at();
drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at before update on public.orders for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.user_profiles (id, email, username, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(nullif(new.raw_user_meta_data->>'username', ''), split_part(coalesce(new.email, ''), '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, ''), '@', 1)),
    'customer'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    username = excluded.username,
    full_name = excluded.full_name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.user_profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.banners enable row level security;
alter table public.coupons enable row level security;
alter table public.reviews enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories" on public.categories for select using (is_active = true or public.is_admin());
drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products for select using (is_active = true or public.is_admin());
drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read product images" on public.product_images;
create policy "Public can read product images" on public.product_images for select using (true);
drop policy if exists "Admins manage product images" on public.product_images;
create policy "Admins manage product images" on public.product_images for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read active banners" on public.banners;
create policy "Public can read active banners" on public.banners for select using (is_active = true or public.is_admin());
drop policy if exists "Admins manage banners" on public.banners;
create policy "Admins manage banners" on public.banners for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read active coupons" on public.coupons;
create policy "Public can read active coupons" on public.coupons for select using (is_active = true or public.is_admin());
drop policy if exists "Admins manage coupons" on public.coupons;
create policy "Admins manage coupons" on public.coupons for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read reviews" on public.reviews;
create policy "Public can read reviews" on public.reviews for select using (true);
drop policy if exists "Authenticated users create reviews" on public.reviews;
create policy "Authenticated users create reviews" on public.reviews for insert with check (auth.uid() = user_id);
drop policy if exists "Admins manage reviews" on public.reviews;
create policy "Admins manage reviews" on public.reviews for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Users read own profile" on public.user_profiles;
create policy "Users read own profile" on public.user_profiles for select using (auth.uid() = id or public.is_admin());
drop policy if exists "Users update own profile" on public.user_profiles;
create policy "Users update own profile" on public.user_profiles for update using (auth.uid() = id or public.is_admin()) with check (auth.uid() = id or public.is_admin());

drop policy if exists "Users read own orders" on public.orders;
create policy "Users read own orders" on public.orders for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "Users create own orders" on public.orders;
create policy "Users create own orders" on public.orders for insert with check (auth.uid() = user_id);
drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Users read order items" on public.order_items;
create policy "Users read order items" on public.order_items for select using (
  exists (
    select 1 from public.orders
    where public.orders.id = order_items.order_id
      and (public.orders.user_id = auth.uid() or public.is_admin())
  )
);
drop policy if exists "Users create order items" on public.order_items;
create policy "Users create order items" on public.order_items for insert with check (
  exists (
    select 1 from public.orders
    where public.orders.id = order_items.order_id
      and (public.orders.user_id = auth.uid() or public.is_admin())
  )
);
drop policy if exists "Admins manage order items" on public.order_items;
create policy "Admins manage order items" on public.order_items for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('catalog-assets', 'catalog-assets', true)
on conflict (id) do nothing;

drop policy if exists "Public can read catalog assets" on storage.objects;
create policy "Public can read catalog assets" on storage.objects for select using (bucket_id = 'catalog-assets');

drop policy if exists "Admins can upload catalog assets" on storage.objects;
create policy "Admins can upload catalog assets" on storage.objects for insert with check (bucket_id = 'catalog-assets' and public.is_admin());

drop policy if exists "Admins can update catalog assets" on storage.objects;
create policy "Admins can update catalog assets" on storage.objects for update using (bucket_id = 'catalog-assets' and public.is_admin()) with check (bucket_id = 'catalog-assets' and public.is_admin());

drop policy if exists "Admins can delete catalog assets" on storage.objects;
create policy "Admins can delete catalog assets" on storage.objects for delete using (bucket_id = 'catalog-assets' and public.is_admin());
