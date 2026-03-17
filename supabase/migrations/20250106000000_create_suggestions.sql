-- Suggestion box: stores user feedback
create table if not exists public.suggestions (
  id          bigint generated always as identity primary key,
  user_id     uuid references auth.users(id) on delete set null,
  user_email  text,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- RLS: users can insert their own suggestions, only admins can read
alter table public.suggestions enable row level security;

create policy "Users can insert their own suggestions"
  on public.suggestions for insert
  to authenticated
  with check (auth.uid() = user_id);

comment on table public.suggestions is 'User-submitted feedback and suggestions from the in-app suggestion box.';
