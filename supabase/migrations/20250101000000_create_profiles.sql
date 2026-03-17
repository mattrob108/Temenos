-- Create profiles table
-- Stores user profile data collected during onboarding

create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  name           text not null,
  email          text not null,
  birthdate      date not null,
  birth_location text not null,
  birth_time     time,
  plan           text not null default 'free',
  systems_unlocked jsonb not null default '[]'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Index for quick email lookups
create index if not exists profiles_email_idx on public.profiles(email);

-- Auto-update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

comment on table public.profiles is 'User profiles created during onboarding. One row per authenticated user.';
