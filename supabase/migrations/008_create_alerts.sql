-- Create Alerts Table
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  alert_type text not null,
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  title text not null,
  description text,
  sap_module text check (sap_module in ('FICO', 'SD', 'MM', 'HR', 'PP')),
  affected_entities jsonb default '[]'::jsonb not null,
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved')),
  detected_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resolved_at timestamp with time zone
);

create index if not exists idx_alerts_org_id on public.alerts(organization_id);
create index if not exists idx_alerts_status on public.alerts(status);
