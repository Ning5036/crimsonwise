-- CrimsonWise — Supabase schema (Option D)
-- Run this once in Supabase SQL Editor after creating a Tokyo (ap-northeast-1) or Singapore project.

------------------------------------------------------------------------------
-- 1) public_feedback: satisfaction survey from the 民眾衛教版 (/public)
------------------------------------------------------------------------------
create table if not exists public.public_feedback (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  ts          timestamptz,
  lang        text not null check (lang in ('zh-TW','en','id','vi')),
  stars       smallint not null check (stars between 1 and 5),
  concept     text not null,
  suggestion  text,
  client_id   uuid,
  quiz_score  smallint,
  quiz_total  smallint
);

-- Partial unique index: legacy rows with NULL client_id are allowed; new rows
-- with a non-NULL client_id are deduplicated across retries / multi-tab flushes.
create unique index if not exists public_feedback_client_id_key
  on public.public_feedback (client_id)
  where client_id is not null;

alter table public.public_feedback enable row level security;

-- Anon may INSERT only (no SELECT / UPDATE / DELETE).
drop policy if exists pf_anon_insert on public.public_feedback;
create policy pf_anon_insert
  on public.public_feedback
  for insert
  to anon
  with check (true);

------------------------------------------------------------------------------
-- 2) sessions: clinical version (placeholder — wire up when we tackle the
--    clinical backend migration).
------------------------------------------------------------------------------
create table if not exists public.sessions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  lang            text,
  patient         jsonb,       -- age, sex, weightKg, hb, plt, ...
  decision        jsonb,       -- decision, reason, predictedHb, ...
  survey          jsonb,       -- satisfaction, betterUnderstanding, suggestions
  risk_level      text,
  physician_name  text,
  client_id       uuid
);

create unique index if not exists sessions_client_id_key
  on public.sessions (client_id)
  where client_id is not null;

alter table public.sessions enable row level security;

drop policy if exists s_anon_insert on public.sessions;
create policy s_anon_insert
  on public.sessions
  for insert
  to anon
  with check (true);

------------------------------------------------------------------------------
-- Admin access:
--   * Download rows from Supabase Dashboard (Table Editor → export CSV), OR
--   * Use the service_role key from a serverless function — NEVER ship it in
--     the client bundle.
------------------------------------------------------------------------------
