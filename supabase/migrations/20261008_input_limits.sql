-- 2026-10-08: bound anonymous INSERTs (anon policies are `with check (true)`).
-- NOT VALID: existing rows are not scanned, so legacy rows never block the migration;
-- new INSERTs and any UPDATE of an old row are checked. Idempotent (drop-if-exists first).
-- Run in Supabase SQL Editor (or `supabase db push`). Mirrors supabase/schema.sql.
alter table public.public_feedback
  drop constraint if exists public_feedback_concept_len,
  drop constraint if exists public_feedback_suggestion_len,
  drop constraint if exists public_feedback_quiz_score,
  drop constraint if exists public_feedback_quiz_total,
  drop constraint if exists public_feedback_quiz_range;
alter table public.public_feedback
  add constraint public_feedback_concept_len    check (char_length(concept) <= 200) not valid,
  add constraint public_feedback_suggestion_len check (char_length(suggestion) <= 2000) not valid,
  add constraint public_feedback_quiz_score     check (quiz_score between 0 and 50) not valid,
  add constraint public_feedback_quiz_total     check (quiz_total between 0 and 50) not valid,
  add constraint public_feedback_quiz_range
    check (quiz_score is null or quiz_total is null or quiz_score <= quiz_total) not valid;

alter table public.sessions
  drop constraint if exists sessions_lang_len,
  drop constraint if exists sessions_patient_size,
  drop constraint if exists sessions_decision_size,
  drop constraint if exists sessions_survey_size,
  drop constraint if exists sessions_risk_level,
  drop constraint if exists sessions_physician_len;
alter table public.sessions
  add constraint sessions_lang_len      check (char_length(lang) <= 10) not valid,
  add constraint sessions_patient_size  check (pg_column_size(patient) < 8192) not valid,
  add constraint sessions_decision_size check (pg_column_size(decision) < 8192) not valid,
  add constraint sessions_survey_size   check (pg_column_size(survey) < 8192) not valid,
  add constraint sessions_risk_level    check (risk_level in ('urgent','consider','watchful','unlikely')) not valid,
  add constraint sessions_physician_len check (char_length(physician_name) <= 100) not valid;
