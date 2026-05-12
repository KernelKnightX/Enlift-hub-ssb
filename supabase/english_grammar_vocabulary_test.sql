create table if not exists public.english_test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  score integer not null,
  correct_count integer not null,
  incorrect_count integer not null,
  unanswered_count integer not null,
  accuracy numeric(5, 2) not null,
  time_taken_seconds integer not null,
  strongest_category text not null,
  weakest_category text not null,
  answers jsonb not null default '[]'::jsonb,
  completed_at timestamptz not null default now()
);

create index if not exists english_test_attempts_user_id_idx
  on public.english_test_attempts (user_id);

create index if not exists english_test_attempts_completed_at_idx
  on public.english_test_attempts (completed_at desc);

alter table public.english_test_attempts enable row level security;

create policy "App clients can insert English test attempts"
  on public.english_test_attempts
  for insert
  with check (length(user_id) > 0);

create policy "Authenticated users can read their own English test attempts"
  on public.english_test_attempts
  for select
  using (auth.uid()::text = user_id);
