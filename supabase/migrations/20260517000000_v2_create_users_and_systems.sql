-- Temenos v2 schema
-- Adds users (extended), user_systems, and user_custom_systems tables for the
-- mandala-based v2 platform. Coexists with v1 `profiles` table.

-- ============================================================================
-- users_v2: extended user/birth metadata for v2 platform
-- ============================================================================
create table if not exists public.users_v2 (
  id                   uuid primary key references auth.users(id) on delete cascade,
  email                text not null,
  birth_date           date,
  birth_time           time,
  birth_place          text,
  birth_place_lat      numeric(9,6),
  birth_place_lng      numeric(9,6),
  birth_time_is_guess  boolean not null default false,
  subscription_active  boolean not null default false,
  subscription_tier    text not null default 'free' check (subscription_tier in ('free','pro')),
  profile_updated_at   timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists users_v2_email_idx on public.users_v2(email);

-- ============================================================================
-- user_systems: data for each of the 9 mandala systems
-- ============================================================================
create table if not exists public.user_systems (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users_v2(id) on delete cascade,
  system_name     text not null check (system_name in (
    'western_astrology','vedic_astrology','human_design','gene_keys',
    'enneagram','mbti','spirit_animal','numerology','blood_type'
  )),
  user_value      text,
  data_snapshot   jsonb not null default '{}'::jsonb,
  source_api      text,
  fetched_date    timestamptz,
  is_stale        boolean not null default false,
  fallback_source text,
  fallback_active boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique(user_id, system_name)
);

create index if not exists user_systems_user_idx on public.user_systems(user_id);

-- ============================================================================
-- user_custom_systems: user-authored entries (paid tier)
-- ============================================================================
create table if not exists public.user_custom_systems (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users_v2(id) on delete cascade,
  system_name   text not null,
  system_type   text not null check (system_type in ('journal_entry','pattern','snapshot','custom')),
  content       text,
  qualities     jsonb not null default '[]'::jsonb,
  tags          jsonb not null default '[]'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists user_custom_systems_user_idx on public.user_custom_systems(user_id);

-- ============================================================================
-- updated_at triggers
-- ============================================================================
drop trigger if exists users_v2_updated_at on public.users_v2;
create trigger users_v2_updated_at
  before update on public.users_v2
  for each row execute function public.handle_updated_at();

drop trigger if exists user_systems_updated_at on public.user_systems;
create trigger user_systems_updated_at
  before update on public.user_systems
  for each row execute function public.handle_updated_at();

drop trigger if exists user_custom_systems_updated_at on public.user_custom_systems;
create trigger user_custom_systems_updated_at
  before update on public.user_custom_systems
  for each row execute function public.handle_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.users_v2            enable row level security;
alter table public.user_systems        enable row level security;
alter table public.user_custom_systems enable row level security;

-- users_v2: each user can only see/edit their own row
create policy "users_v2: select own"
  on public.users_v2 for select using (auth.uid() = id);
create policy "users_v2: insert own"
  on public.users_v2 for insert with check (auth.uid() = id);
create policy "users_v2: update own"
  on public.users_v2 for update using (auth.uid() = id) with check (auth.uid() = id);

-- user_systems: scoped to user_id
create policy "user_systems: select own"
  on public.user_systems for select using (auth.uid() = user_id);
create policy "user_systems: insert own"
  on public.user_systems for insert with check (auth.uid() = user_id);
create policy "user_systems: update own"
  on public.user_systems for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_systems: delete own"
  on public.user_systems for delete using (auth.uid() = user_id);

-- user_custom_systems: scoped to user_id
create policy "user_custom_systems: select own"
  on public.user_custom_systems for select using (auth.uid() = user_id);
create policy "user_custom_systems: insert own"
  on public.user_custom_systems for insert with check (auth.uid() = user_id);
create policy "user_custom_systems: update own"
  on public.user_custom_systems for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_custom_systems: delete own"
  on public.user_custom_systems for delete using (auth.uid() = user_id);

comment on table public.users_v2 is 'Temenos v2 extended user data; one row per authenticated user.';
comment on table public.user_systems is 'Per-user data for each of the 9 mandala systems; audit metadata included.';
comment on table public.user_custom_systems is 'Paid-tier user-authored entries (journal/patterns/snapshots).';
