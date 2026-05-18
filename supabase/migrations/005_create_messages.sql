-- Create Chat Messages Table
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chat_sessions(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade not null,
  tenant_id text not null default 'default',
  role text not null check (role in ('user', 'assistant', 'system')),
  message text not null,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists idx_chat_messages_session_id on public.chat_messages(session_id);
create index if not exists idx_chat_messages_user_id on public.chat_messages(user_id);
create index if not exists idx_chat_messages_tenant_id on public.chat_messages(tenant_id);
