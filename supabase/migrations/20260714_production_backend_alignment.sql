alter table public.service_requests
  add column if not exists word_count text not null default '',
  add column if not exists exam_hours text not null default '',
  add column if not exists urgency text not null default '';

alter table public.revisions
  add column if not exists started_at timestamptz,
  add column if not exists completed_at timestamptz;

alter table public.revisions
  drop constraint if exists revisions_status_check;

alter table public.revisions
  add constraint revisions_status_check
  check (status in ('requested', 'accepted', 'in_progress', 'redelivered', 'completed', 'cancelled', 'closed'));
