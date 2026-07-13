create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id text primary key,
  email text not null,
  full_name text not null,
  urgent_phone text not null default '',
  school text not null default '',
  avatar_url text not null default '',
  role text not null default 'student' check (role in ('student', 'tutor', 'admin')),
  notification_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(user_id) on delete cascade,
  idempotency_key text not null,
  service text not null check (service in ('essay', 'exam', 'tutoring', 'other')),
  subject text not null,
  title text not null default '',
  description text not null,
  deadline text not null default '',
  citation_style text not null default '',
  page_count text not null default '',
  exam_name text not null default '',
  exam_date text not null default '',
  attempt_status text not null default '',
  assistance_type text not null default '',
  name text not null,
  email text not null,
  urgent_phone text not null default '',
  school text not null default '',
  status text not null default 'Submitted',
  quote_cents integer not null default 0 check (quote_cents >= 0),
  paid_cents integer not null default 0 check (paid_cents >= 0),
  currency text not null default 'usd',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, idempotency_key)
);

create table if not exists public.request_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  actor_id text not null,
  type text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  user_id text not null,
  sender_id text not null,
  sender_role text not null check (sender_role in ('student', 'tutor', 'admin')),
  body text not null check (char_length(body) between 1 and 4000),
  idempotency_key text,
  created_at timestamptz not null default now(),
  unique (request_id, sender_id, idempotency_key)
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  user_id text not null,
  uploaded_by text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes integer not null check (size_bytes between 1 and 8388608),
  storage_path text not null unique,
  category text not null check (category in ('client', 'draft', 'final', 'ai-report')),
  delivery_locked boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  user_id text not null,
  provider text not null,
  provider_transaction_id text not null,
  milestone text not null check (milestone in ('deposit', 'balance')),
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'usd',
  status text not null check (status in ('pending', 'confirmed', 'failed', 'refunded')),
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint payments_provider_transaction_unique unique (provider, provider_transaction_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  request_id uuid references public.service_requests(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null default '',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists service_requests_user_updated_idx on public.service_requests (user_id, updated_at desc);
create index if not exists request_events_request_created_idx on public.request_events (request_id, created_at);
create index if not exists messages_request_created_idx on public.messages (request_id, created_at);
create index if not exists attachments_request_created_idx on public.attachments (request_id, created_at);
create index if not exists payments_request_created_idx on public.payments (request_id, created_at);
create index if not exists notifications_user_created_idx on public.notifications (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.service_requests enable row level security;
alter table public.request_events enable row level security;
alter table public.messages enable row level security;
alter table public.attachments enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;

revoke all on public.profiles, public.service_requests, public.request_events, public.messages, public.attachments, public.payments, public.notifications from anon, authenticated;

insert into storage.buckets (id, name, public)
values ('sleek-academia-private', 'sleek-academia-private', false)
on conflict (id) do update set public = false;
