import { generateEmbedding } from './embeddings';
import { performVectorSearch } from './vector-search';
import { PromptTemplate } from '@langchain/core/prompts';

/**
 * Orchestrates the Retrieval-Augmented Generation (RAG) pipeline.
 * Aggregates institutional context with user queries for Claude's analysis.
 */
export async function executeRagPipeline(query: string, orgId?: string) {
  try {
    // 1. Vectorize Query (returns 1536-dim vector)
    const embedding = await generateEmbedding(query);

    // 2. Retrieve Context with multi-tenant isolation
    const contextResults = await performVectorSearch(embedding, 0.5, 5, orgId);
    const contextString = contextResults
      .map((r: any) => `[Source: ${r.metadata?.source || 'Internal'}] ${r.content}`)
      .join('\n\n');

    // 3. Construct Augmented Prompt
    const template = PromptTemplate.fromTemplate(`
      SYSTEM: You are the GenAISAP Institutional Intelligence Engine. 
      Use the following retrieved SAP context to answer the executive directive.
      If you don't know the answer based on the context, state that clearly but provide a heuristic projection.

      INSTITUTIONAL CONTEXT:
      {context}

      EXECUTIVE DIRECTIVE:
      {query}

      RESPONSE ARCHITECTURE:
      - Professional, authoritative tone.
      - References to SAP modules (FICO, SD, MM).
      - Risk-first analysis.
    `);

    const formattedPrompt = await template.format({
      context: contextString,
      query: query
    });

    return {
      prompt: formattedPrompt,
      context: contextResults
    };
  } catch (error) {
    console.error('RAG Pipeline failure:', error);
    return { prompt: query, context: [] };
  }
}
