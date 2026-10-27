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
