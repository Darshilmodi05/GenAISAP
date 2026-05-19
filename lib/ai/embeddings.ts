import { OpenAIEmbeddings } from '@langchain/openai';

// Initialize OpenAI Embeddings for semantic vectorization
export const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY || 'mock-key',
  modelName: 'text-embedding-3-large',
  dimensions: 1536, // Configured for 1536-dimensional vectors mapping perfectly to our database schema
});

/**
 * Generates a vector embedding for a given text string.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const isMock =
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY.includes('your_openai') ||
      process.env.OPENAI_API_KEY === 'mock-key';

    if (isMock) {
      // Return a deterministic dummy vector for development based on input length
      return new Array(1536).fill(0).map((_, i) => ((text.length + i) % 100) / 100);
    }
    return await embeddings.embedQuery(text);
  } catch (error) {
    console.error('Embedding generation failed:', error);
    return new Array(1536).fill(0);
  }
}
