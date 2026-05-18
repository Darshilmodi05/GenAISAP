-- Create Audit Logs Table
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id text,
  metadata jsonb default '{}'::jsonb not null,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_audit_logs_org_id on public.audit_logs(organization_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at);
