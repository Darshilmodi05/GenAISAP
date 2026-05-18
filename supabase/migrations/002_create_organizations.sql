-- Create Organizations Table
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan text not null default 'free' check (plan in ('free', 'pro', 'enterprise')),
  sap_instance_url text,
  sap_credentials_encrypted text,
  settings jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists idx_organizations_slug on public.organizations(slug);
