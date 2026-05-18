-- Create Chat Sessions Table
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  organization_id uuid references public.organizations(id) on delete cascade,
  title text not null default 'New Conversation',
  sap_module text check (sap_module in ('FICO', 'SD', 'MM', 'HR', 'PP')),
  status text not null default 'active' check (status in ('active', 'archived')),
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for fast lookup
create index if not exists idx_chat_sessions_user_id on public.chat_sessions(user_id);
create index if not exists idx_chat_sessions_org_id on public.chat_sessions(organization_id);
