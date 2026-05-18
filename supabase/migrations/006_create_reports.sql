-- Create Reports Table
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  sap_module text check (sap_module in ('FICO', 'SD', 'MM', 'HR', 'PP')),
  report_type text,
  status text not null default 'draft' check (status in ('draft', 'processing', 'ready', 'failed')),
  content jsonb default '{}'::jsonb not null,
  file_url text,
  scheduled_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_reports_org_id on public.reports(organization_id);
create index if not exists idx_reports_created_by on public.reports(created_by);
