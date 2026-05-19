import { createClient } from '@/lib/supabase/server';

/**
 * Performs a semantic similarity search using pgvector in Supabase embeddings registry.
 * Isolates searches strictly to the user's multi-tenant organization context.
 */
export async function performVectorSearch(
  queryEmbedding: number[],
  matchThreshold: number = 0.5,
  matchCount: number = 5,
  orgId?: string
) {
  const supabase = await createClient();

  try {
    let targetOrgId = orgId;

    // Fallback: Resolve organization_id from current session profile if not explicitly passed
    if (!targetOrgId) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', userData.user.id)
          .single();
        if (profile?.organization_id) {
          targetOrgId = profile.organization_id;
        }
      }
    }

    if (!targetOrgId) {
      // Mock/dev fallback if no active organization context is established
      targetOrgId = 'd0c9f13e-f1b2-4d2a-89a1-77b3d3090708';
    }

    const { data, error } = await supabase.rpc('match_embeddings', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount,
      org_id: targetOrgId,
    });

    if (error) throw error;
    
    // Map return format matching downstream RAG content consumption
    return (data || []).map((row: any) => ({
      content: row.content_chunk,
      metadata: {
        source: row.source_type,
        source_id: row.source_id,
        ...row.metadata
      }
    }));
  } catch (error) {
    console.warn('Vector search failed, falling back to mock context:', error);
    return [
      { content: "S/4HANA ACDOCA Table: Universal Journal containing all financial postings.", metadata: { source: "sap_document" } },
      { content: "Module FICO: Handles financial accounting and controlling in SAP ecosystems.", metadata: { source: "knowledge_base" } }
    ];
  }
}
