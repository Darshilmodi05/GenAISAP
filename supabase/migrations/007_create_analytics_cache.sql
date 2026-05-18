-- Create Analytics Cache Table
create table if not exists public.analytics_cache (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  metric_key text not null,
  sap_module text check (sap_module in ('FICO', 'SD', 'MM', 'HR', 'PP')),
  value jsonb default '{}'::jsonb not null,
  computed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone not null
);

-- Create KPIs Table (queried by SAP dashboard service)
create table if not exists public.kpis (
  id uuid primary key default gen_random_uuid(),
  revenue_mtd text,
  revenue_trend text,
  open_pos int,
  po_trend int,
  dso text,
  dso_trend text,
  system_health text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Dashboard Metrics Table (queried by metrics API route)
create table if not exists public.dashboard_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'default',
  revenue_mtd text,
  revenue_trend text,
  open_pos int,
  dso text,
  dso_trend text,
  system_health text,
  active_users int,
  api_calls int,
  data_sync text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Performance Analytics Table (inserted by telemetry/monitoring)
create table if not exists public.performance_analytics (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamp with time zone not null,
  active_users int not null,
  total_requests int not null,
  average_response_time float not null,
  error_rate float not null,
  top_endpoints jsonb default '[]'::jsonb not null,
  tenant_metrics jsonb default '{}'::jsonb not null
);

-- Create Close Phases Table (queried by closing service)
create table if not exists public.close_phases (
  id serial primary key,
  period text not null,
  title text not null,
  status text not null check (status in ('pending', 'in-progress', 'blocked', 'complete')),
  progress int not null default 0,
  blockers_count int not null default 0
);

-- Create Job Status Table (queried by BullMQ background queue)
create table if not exists public.job_status (
  job_id text primary key,
  tenant_id text not null,
  user_id uuid references public.profiles(id) on delete set null,
  type text not null,
  status text not null check (status in ('processing', 'completed', 'failed')),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  result jsonb,
  error text
);

-- Create Notifications Table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null,
  user_id uuid references public.profiles(id) on delete cascade,
  type text not null,
  subject text not null,
  message text not null,
  priority text not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists idx_analytics_cache_org_id on public.analytics_cache(organization_id);
create index if not exists idx_dashboard_metrics_tenant on public.dashboard_metrics(tenant_id);
create index if not exists idx_perf_analytics_timestamp on public.performance_analytics(timestamp);
create index if not exists idx_close_phases_period on public.close_phases(period);
create index if not exists idx_job_status_tenant on public.job_status(tenant_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id);
