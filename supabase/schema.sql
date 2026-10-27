-- Run this once in Supabase: SQL Editor > New query > paste > Run

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  event text not null,
  created_at timestamptz not null default now(),
  unique (user_id, event)
);

alter table public.registrations enable row level security;

create policy "read own registrations"
  on public.registrations for select using (auth.uid() = user_id);

create policy "add own registrations"
  on public.registrations for insert with check (auth.uid() = user_id);

create policy "remove own registrations"
  on public.registrations for delete using (auth.uid() = user_id);
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.admin_overview()
returns table (
  id uuid, email text, phone text, full_name text, college text,
  year text, created_at timestamptz, last_sign_in_at timestamptz
)
language sql
security definer
set search_path = public, auth
stable
as $$
  select u.id, u.email::text, u.phone::text, p.full_name, p.college, p.year,
         u.created_at, u.last_sign_in_at
  from auth.users u
  left join public.profiles p on p.id = u.id
  where public.is_admin()
  order by u.created_at desc;
$$;

revoke execute on function public.admin_overview() from public, anon;
grant execute on function public.admin_overview() to authenticated;

create policy "Admins read all registrations" on public.registrations
  for select using (public.is_admin());