-- Enable the pgvector extension to work with embeddings
create extension if not exists vector;

-- Create a table for institutional knowledge and document chunks
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  metadata jsonb default '{}'::jsonb,
  embedding vector(3072), -- Optimized for text-embedding-3-large
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster vector search using IVFFlat or HNSW (HNSW is generally better for performance)
create index on public.documents using hnsw (embedding vector_cosine_ops);

-- Function to perform similarity search
create or replace function match_documents (
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
