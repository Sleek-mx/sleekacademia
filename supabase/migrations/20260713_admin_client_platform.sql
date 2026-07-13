alter table public.service_requests
  add column if not exists pricing_type text,
  add column if not exists pricing_snapshot jsonb not null default '{}'::jsonb,
  add column if not exists accepted_at timestamptz,
  add column if not exists accepted_by text,
  add column if not exists accepted_deadline timestamptz,
  add column if not exists materials_complete boolean not null default false,
  add column if not exists clarification_note text not null default '',
  add column if not exists decline_reason text not null default '',
  add column if not exists delivered_at timestamptz,
  add column if not exists first_downloaded_at timestamptz,
  add column if not exists completed_at timestamptz;

create table if not exists public.revisions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.service_requests(id) on delete cascade,
  user_id text not null,
  requested_by text not null default '',
  instructions text not null check (char_length(instructions) between 1 and 4000),
  included boolean not null default true,
  status text not null default 'requested' check (status in ('requested', 'accepted', 'in_progress', 'redelivered', 'closed')),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists revisions_one_included_per_order_idx
  on public.revisions (order_id)
  where included = true;

create index if not exists revisions_order_created_idx
  on public.revisions (order_id, created_at);

create table if not exists public.order_read_states (
  order_id uuid not null references public.service_requests(id) on delete cascade,
  user_id text not null,
  last_message_read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (order_id, user_id)
);

create table if not exists public.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique check (char_length(token_hash) = 64),
  csrf_hash text not null check (char_length(csrf_hash) = 64),
  username text not null check (username = 'MCX'),
  ip_hash text not null default '',
  user_agent_hash text not null default '',
  last_seen_at timestamptz not null,
  idle_expires_at timestamptz not null,
  absolute_expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists admin_sessions_expiry_idx
  on public.admin_sessions (idle_expires_at, absolute_expires_at)
  where revoked_at is null;

create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  actor text not null default '',
  ip_hash text not null default '',
  user_agent_hash text not null default '',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists security_events_created_idx
  on public.security_events (created_at desc);

create or replace function public.prevent_security_event_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'security_events is append-only';
end;
$$;

drop trigger if exists security_events_append_only on public.security_events;
create trigger security_events_append_only
before update or delete on public.security_events
for each row execute function public.prevent_security_event_mutation();

create table if not exists public.platform_settings (
  id text primary key check (id = 'default'),
  settings jsonb not null default '{}'::jsonb,
  updated_by text not null default 'system',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.platform_settings (id, settings)
values ('default', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.revisions enable row level security;
alter table public.order_read_states enable row level security;
alter table public.admin_sessions enable row level security;
alter table public.security_events enable row level security;
alter table public.platform_settings enable row level security;

revoke all on public.revisions, public.order_read_states, public.admin_sessions, public.security_events, public.platform_settings
from anon, authenticated;
