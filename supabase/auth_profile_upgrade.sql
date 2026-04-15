alter table public.user_profiles
add column if not exists username text not null default '';

update public.user_profiles
set username = coalesce(nullif(trim(username), ''), split_part(email, '@', 1))
where username is null or trim(username) = '';

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
