-- Purchases table — records completed Stripe payments
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  system_id text not null,
  stripe_session_id text unique,
  amount_cents integer not null,
  currency text not null default 'usd',
  created_at timestamptz not null default now()
);

-- Index for fast lookups by user
create index idx_purchases_user_id on public.purchases(user_id);

-- RLS: users can read their own purchases
alter table public.purchases enable row level security;

create policy "Users can view own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

-- Only service role (webhook) can insert — no user-facing insert policy
