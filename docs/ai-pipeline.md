# GenAISAP AI Pipeline & Cognitive Orchestration

This document details the cognitive pipeline, vector-space indexing, and real-time narrative compilation models that drive AI-centric features across the GenAISAP workspace.

---

## 1. Pipeline Architecture Overview

The GenAISAP AI Pipeline coordinates transactional ERP datasets with foundational Large Language Models (LLMs) to detect anomalies, categorize postings, and generate natural language fiscal narratives.

```mermaid
flowchart LR
    Data_Source[S/4HANA OData Raw Stream] --> Classifier[Rule-Based / ML Classifier]
    Classifier --> |Identify Module: FICO / MM / SD| RAG_Query[Vector Search & RAG]
    
    subgraph Vector Database
        RAG_Query --> Vector_Match[match_embeddings PL/pgSQL]
        Vector_Match --> Context_Assembler[Context Assembler]
    end
    
    Context_Assembler --> LLM_Inference[Claude 3.5 Sonnet / GPT-4o]
    LLM_Inference --> Narrative_Compiler[Factual Evidence Injector]
    Narrative_Compiler --> Final_Output[Dynamic Glass UI / Citation Deck]
```

---

## 2. LLM Cognitive Engine Configuration

GenAISAP supports hot-swappable enterprise LLM models managed through the System Governance Console:

1.  **Claude 3.5 Sonnet (Primary Model)**
    *   *Role*: Main operational chat agent, complex narrative compiling, vector retrieval reconciliation.
    *   *Execution*: High reasoning efficiency with robust formatting structure constraints.
2.  **GPT-4o Omnidirectional (Fallback/Utility Model)**
    *   *Role*: Instantaneous heuristic queries, sub-task parallel execution.
3.  **Engine Tunings**:
    *   *Default System Temperature*: `0.15` (optimized for hyper-realistic fiscal accuracy and zero hallucination).
    *   *Default System Top-P*: `0.90`.
    *   *Context Capacity*: Up to `20` vector chunks pulled dynamically during single-session RAG execution.

---

## 3. Vector RAG Pipeline (pgvector & HNSW)

The platform embeds multi-tenant corporate manuals, reports, and audit logs into a low-latency database vectorspace.

### 3.1. Vector Embeddings Schema
All documents are partitioned into text chunks and embedded into **1536-dimensional float vectors** (compatible with OpenAI `text-embedding-3-small` or standard Titan models).

```sql
create table if not exists public.embeddings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  source_type text not null check (source_type in ('sap_document', 'report', 'knowledge_base')),
  source_id uuid,
  content_chunk text not null,
  embedding vector(1536),
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 3.2. Vector Indexes
To ensure sub-second vector matching over millions of document chunks, a Hierarchical Navigable Small World (**HNSW**) index is constructed over the embedding field:
```sql
create index if not exists idx_embeddings_vector 
on public.embeddings using hnsw (embedding vector_cosine_ops);
```

### 3.3. Similarity Matching Function
Cosine-similarity matching is calculated via the `public.match_embeddings` database function:
```sql
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
language plpgsql security definer as $$
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
```

---

## 4. Heuristic Module Classifier

A lightweight, high-speed Python heuristic engine classifies raw transaction descriptions before RAG processing:

*   **Logic Mapping**:
    *   *FICO (Finance & Controlling)*: Matches keywords like `ledger`, `audit`, `tax`, `reconciliation`, `invoice`, `accrual`.
    *   *MM (Materials Management)*: Matches keywords like `stock`, `inventory`, `warehouse`, `goods`, `procurement`.
    *   *SD (Sales & Distribution)*: Matches keywords like `order`, `shipment`, `customer`, `billing`, `quote`, `delivery`.
*   **Confidence Scoring**:
    $$\text{Confidence} = 0.5 + (\text{Keyword Matches} \times 0.1)$$
    If no matches are identified, it falls back gracefully to a general `ROOT` classification node with `0.4` confidence thresholding.

---

## 5. Narrative Compilation & AI Telemetry

### 5.1. Factual Evidence Injection
When a spike volume anomaly is detected by the Python ML service, the `evidence_compiler` executes:
1.  **Extracts Anomaly Vector**: e.g., Volume Spike detected on transaction $T$.
2.  **Appends Context**: Consolidates historical moving averages, transaction counts, and surrounding cross-module alerts.
3.  **Prompt Assembly**: Feeds the evidence structure into a deterministic string model to write professional natural language explanations (e.g. *"Transaction volume spiked 420% above FICO module baseline; correlated with quarter-end vendor invoice accrual entries."*).

### 5.2. Telemetry & Token Auditing
Every response generated is logged inside `public.messages` with absolute telemetry accounting details:
*   **`tokens_used`**: Tracks exact computational costs.
*   **`latency_ms`**: Tracks round-trip model inference speed.
*   **`confidence_score`**: Records the model's self-reported certainty rating.
*   **`citations`**: An array of reference IDs linking the generated text directly back to the original database embeddings.
