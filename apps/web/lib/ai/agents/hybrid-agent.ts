import { streamClaude } from '../claude';
import { executeRagPipeline } from '../rag-pipeline';
import { mlService } from '@/lib/sap/ml-service';

/**
 * Hybrid Intelligence Agent
 * Coordinates between Claude's reasoning and the ML microservice's heavy workloads.
 */
export async function executeHybridIntelligence(query: string) {
  // 1. Execute RAG Pipeline for context
  const { prompt, context } = await executeRagPipeline(query);

  // 2. Determine if ML work is needed (Heuristic)
  let mlInsights: any[] = [];
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('forecast') || lowerQuery.includes('predict') || lowerQuery.includes('future')) {
    // Simulate fetching series data from SAP context
    const seriesData = [12.4, 13.1, 12.8, 14.5, 15.2, 14.8]; 
    console.log('Orchestrating ML Forecast Pipeline...');
    const forecast = await mlService.predictForecast(seriesData, 3);
    if (forecast && forecast.length > 0) {
      mlInsights.push({
        type: 'ML Forecast Prediction',
        narrative: `Predictive models forecast upcoming values shifting to [${forecast.map(v => v.toFixed(2)).join(', ')}].`,
        severity: 'info'
      });
    }
  }

  if (lowerQuery.includes('anomaly') || lowerQuery.includes('spike') || lowerQuery.includes('unusual')) {
    const spikeData = [100, 105, 110, 500, 108, 112];
    console.log('Orchestrating ML Anomaly Detection...');
    const anomalies = await mlService.analyzeSpikes(spikeData, 'INSTITUTIONAL_CORE');
    if (anomalies && anomalies.length > 0) {
      mlInsights.push(...anomalies);
    }
  }

  // 3. Enrich prompt with ML insights if available
  let finalPrompt = prompt;
  if (mlInsights.length > 0) {
    const mlSummary = mlInsights.map(m => `[ML ALERT: ${m.type}] ${m.narrative}`).join('\n');
    finalPrompt += `\n\nADDITIONAL ML TELEMETRY INSIGHTS:\n${mlSummary}`;
  }

  // 4. Invoke Claude for final synthesis
  return {
    stream: await streamClaude(finalPrompt),
    context: context,
    mlInsights: mlInsights
  };
}
