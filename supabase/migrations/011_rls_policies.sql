-- Enable Row Level Security (RLS) on all core tables
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.reports enable row level security;
alter table public.analytics_cache enable row level security;
alter table public.kpis enable row level security;
alter table public.dashboard_metrics enable row level security;
alter table public.performance_analytics enable row level security;
alter table public.close_phases enable row level security;
alter table public.job_status enable row level security;
alter table public.notifications enable row level security;
alter table public.alerts enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles Policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Organizations Policies
create policy "Users can view their own organization"
  on public.organizations for select
  using (exists (
    select 1 from public.profiles
    where public.profiles.id = auth.uid()
    and public.profiles.organization_id = public.organizations.id
  ));

-- Chat Sessions Policies
create policy "Users can manage their own chat sessions"
  on public.chat_sessions for all
  using (auth.uid() = user_id);

-- Chat Messages Policies
create policy "Users can manage their own chat messages"
  on public.chat_messages for all
  using (auth.uid() = user_id);

-- Reports Policies
create policy "Users can view reports in their organization"
  on public.reports for select
  using (exists (
    select 1 from public.profiles
    where public.profiles.id = auth.uid()
    and public.profiles.organization_id = public.reports.organization_id
  ));

create policy "Admins and Analysts can create reports"
  on public.reports for insert
  with check (exists (
    select 1 from public.profiles
    where public.profiles.id = auth.uid()
    and public.profiles.organization_id = public.reports.organization_id
    and public.profiles.role in ('admin', 'analyst')
  ));

-- Alerts Policies
create policy "Users can view alerts in their organization"
  on public.alerts for select
  using (exists (
    select 1 from public.profiles
    where public.profiles.id = auth.uid()
    and public.profiles.organization_id = public.alerts.organization_id
  ));

-- Notifications Policies
create policy "Users can manage their own notifications"
  on public.notifications for all
  using (auth.uid() = user_id);

-- Job Status Policies
create policy "Users can view their own jobs"
  on public.job_status for select
  using (auth.uid() = user_id);

-- Audit Logs Policies
create policy "Admins can view audit logs in their organization"
  on public.audit_logs for select
  using (exists (
    select 1 from public.profiles
    where public.profiles.id = auth.uid()
    and public.profiles.organization_id = public.audit_logs.organization_id
    and public.profiles.role = 'admin'
  ));
