-- Enable pgvector if not already active
create extension if not exists vector;

-- 1. Create table public.messages (Strict Schema Compliance)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chat_sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  content_type text not null default 'text/markdown' check (content_type in ('text', 'text/markdown', 'structured')),
  ai_model text,
  tokens_used int,
  latency_ms int,
  confidence_score float,
  citations jsonb default '[]'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast session query matching
create index if not exists idx_messages_session_id on public.messages(session_id);

-- 2. Create table public.embeddings (Strict Schema Compliance)
create table if not exists public.embeddings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  source_type text not null check (source_type in ('sap_document', 'report', 'knowledge_base')),
  source_id uuid,
  content_chunk text not null,
  embedding vector(1536), -- Optimized for standard 1536-dimensional embeddings (e.g. text-embedding-3-small)
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for HNSW fast vector search operations
create index if not exists idx_embeddings_org_id on public.embeddings(organization_id);
create index if not exists idx_embeddings_vector on public.embeddings using hnsw (embedding vector_cosine_ops);

-- 3. PL/pgSQL Function to Perform Similarity Searches on the New embeddings Table
create or replace function public.match_embeddings (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  org_id uuid
)
returns table (
  id uuid,
  source_type text,
  source_id uuid,
  content_chunk text,
  metadata jsonb,
  similarity float
)
language plpgsql
security definer
as $$
begin
  return query
  select
    embeddings.id,
    embeddings.source_type,
    embeddings.source_id,
    embeddings.content_chunk,
    embeddings.metadata,
    1 - (embeddings.embedding <=> query_embedding) as similarity
  from public.embeddings
  where embeddings.organization_id = org_id
    and 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  order by embeddings.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 4. Apply Row Level Security (RLS) policies on messages and embeddings
alter table public.messages enable row level security;
alter table public.embeddings enable row level security;

-- Messages RLS: Users can access messages belonging to their own chat sessions
create policy "Users can view messages in their sessions"
  on public.messages for select
  using (exists (
    select 1 from public.chat_sessions
    where public.chat_sessions.id = public.messages.session_id
      and public.chat_sessions.user_id = auth.uid()
  ));

create policy "Users can insert messages into their sessions"
  on public.messages for insert
  with check (exists (
    select 1 from public.chat_sessions
    where public.chat_sessions.id = public.messages.session_id
      and public.chat_sessions.user_id = auth.uid()
  ));

create policy "Users can delete messages in their sessions"
  on public.messages for delete
  using (exists (
    select 1 from public.chat_sessions
    where public.chat_sessions.id = public.messages.session_id
      and public.chat_sessions.user_id = auth.uid()
  ));

-- Embeddings RLS: Users can query embeddings belonging to their organization
create policy "Users can view embeddings in their organization"
  on public.embeddings for select
  using (exists (
    select 1 from public.profiles
    where public.profiles.id = auth.uid()
      and public.profiles.organization_id = public.embeddings.organization_id
  ));

create policy "Admins can manage embeddings in their organization"
  on public.embeddings for all
  using (exists (
    select 1 from public.profiles
    where public.profiles.id = auth.uid()
      and public.profiles.organization_id = public.embeddings.organization_id
      and public.profiles.role = 'admin'
  ));
