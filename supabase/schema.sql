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
  quiz_total  smallint,
  -- Input bounds (anon INSERT policy is `with check (true)`); names match supabase/migrations/.
  constraint public_feedback_concept_len    check (char_length(concept) <= 200),
  constraint public_feedback_suggestion_len check (char_length(suggestion) <= 2000),
  constraint public_feedback_quiz_score     check (quiz_score between 0 and 50),
  constraint public_feedback_quiz_total     check (quiz_total between 0 and 50),
  constraint public_feedback_quiz_range
    check (quiz_score is null or quiz_total is null or quiz_score <= quiz_total)
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
  client_id       uuid,
  -- Input bounds; names match supabase/migrations/. UI maxLength keeps each jsonb well under 8 KB.
  constraint sessions_lang_len      check (char_length(lang) <= 10),
  constraint sessions_patient_size  check (pg_column_size(patient) < 8192),
  constraint sessions_decision_size check (pg_column_size(decision) < 8192),
  constraint sessions_survey_size   check (pg_column_size(survey) < 8192),
  constraint sessions_risk_level    check (risk_level in ('urgent','consider','watchful','unlikely')),
  constraint sessions_physician_len check (char_length(physician_name) <= 100)
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
