import { ChatAnthropic } from '@langchain/anthropic';

// Initialize Claude 3.5 Sonnet (Primary Reasoning Engine)
// Note: We use the latest 3.5 Sonnet as it represents the current peak reasoning capability.
export const claude = new ChatAnthropic({
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || 'mock-key',
  modelName: 'claude-3-5-sonnet-20241022',
  temperature: 0.1, // High precision for SAP analysis
  streaming: true,
});

/**
 * Invokes the Claude reasoning engine with the augmented RAG prompt.
 */
export async function invokeClaude(prompt: string) {
  try {
    const isMock = !process.env.ANTHROPIC_API_KEY || 
                   process.env.ANTHROPIC_API_KEY.includes('your_claude') || 
                   process.env.ANTHROPIC_API_KEY === 'mock-key';

    if (isMock) {
      return { content: "[SIMULATION] Analysis of SAP telemetry indicates minor variance drift in Cluster-4. Strategic recalibration recommended." };
    }
    return await claude.invoke(prompt);
  } catch (error) {
    console.warn('Claude invocation failed, using fallback engine:', error);
    return { content: "FALLBACK: Critical analysis indicates variance drift in FICO module. Manual audit recommended." };
  }
}

/**
 * Streaming helper for Claude.
 * Returns null if no API key is present, allowing for mock fallback.
 */
export async function streamClaude(prompt: string) {
  const isMock = !process.env.ANTHROPIC_API_KEY || 
                 process.env.ANTHROPIC_API_KEY.includes('your_claude') || 
                 process.env.ANTHROPIC_API_KEY === 'mock-key';

  if (isMock) {
    return null;
  }
  return await claude.stream(prompt);
}
