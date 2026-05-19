import { claude } from '../claude';
import { executeRagPipeline } from '../rag-pipeline';

/**
 * Month-End Close Agent
 * Specialized in fiscal reconciliation and variance commentary.
 */
export async function executeCloseAgent(directive: string, contextData: any) {
  // 1. Get Institutional Context
  const { prompt, context } = await executeRagPipeline(`Month-end close for period ${contextData.period}. ${directive}`);

  // 2. Build Specialized Close Prompt
  const closePrompt = `
    ${prompt}
    
    FISCAL DATA SNAPSHOT:
    ${JSON.stringify(contextData, null, 2)}

    TASK: Generate a professional executive commentary on the current close status.
    Identify risks, mention specific variances (if any), and provide a projected stabilization timeline.
  `;

  // 3. Return streaming response
  return {
    stream: await claude.stream(closePrompt),
    context: context
  };
}
