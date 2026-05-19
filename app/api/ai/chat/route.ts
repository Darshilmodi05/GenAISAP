import { NextRequest, NextResponse } from 'next/server';
import { executeHybridIntelligence } from '@/lib/ai/agents/hybrid-agent';
import DOMPurify from 'isomorphic-dompurify';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    let lastMessage = messages?.[messages.length - 1]?.content || '';
    
    // OWASP-compliant input sanitization
    lastMessage = DOMPurify.sanitize(lastMessage, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    const { stream: aiStream, context, mlInsights } = await executeHybridIntelligence(lastMessage);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendToken = (text: string) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        };

        // 1. Orchestration Telemetry
        sendToken('\n`[System: Initiating Neural RAG Pipeline...]`\n');
        await new Promise(r => setTimeout(r, 400));
        
        sendToken(`\`[System: Retrieved ${context.length} Institutional Data Nodes]\`\n`);
        
        if (mlInsights && mlInsights.length > 0) {
          sendToken(`\`[System: ML Anomaly Service Active - ${mlInsights.length} Observations Compiled]\`\n\n`);
        } else {
          sendToken('\n');
        }
        await new Promise(r => setTimeout(r, 400));

        // 2. Stream Generation
        const hasApiKey = process.env.ANTHROPIC_API_KEY && 
                          !process.env.ANTHROPIC_API_KEY.includes('your_claude') && 
                          process.env.ANTHROPIC_API_KEY !== 'mock-key';

        if (hasApiKey && aiStream) {
          // Stream real tokens from Claude
          for await (const chunk of aiStream) {
            if (chunk.content) {
              sendToken(chunk.content.toString());
            }
          }
        } else {
          // Fallback to high-fidelity mock synthesis for development
          let responseText = '';
          const lowerInput = lastMessage.toLowerCase();
          
          if (lowerInput.match(/\b(hello|hi|hey|greetings)\b/)) {
            responseText = `QUANTUM LINK ESTABLISHED. Greetings, Executive. I am the GenAISAP Institutional Intelligence Engine. I have full visibility into your S/4HANA telemetry clusters. How may I assist with your strategic interrogation today?`;
          } else if (lowerInput.includes('revenue') || lowerInput.includes('finance') || lowerInput.includes('fico')) {
            responseText = `Analysis of FICO_ALPHA ledger indicates a minor variance in period-over-period reconciliation. \n\n1. **Observation**: Detected a 2.4% drift in child entity ledgers.\n2. **Mitigation**: Recommended ACDOCA audit for high-value transactional clusters.\n3. **Forecast**: Stabilization expected within 48 hours if executive overrides are implemented.`;
          } else if (lowerInput.includes('supply') || lowerInput.includes('mm') || lowerInput.includes('inventory')) {
            responseText = `MM_CORE (Materials Management) telemetry identifies potential bottlenecking in regional supply chains. \n\n1. **Metric**: Inventory turnover velocity (MARC/MARD) currently at 86% of baseline in APJ region.\n2. **Action**: Initiating automated re-order triggers for critical stock nodes.\n3. **Risk Profile**: Moderate latency detected in upstream vendor fulfillment pipelines.`;
          } else if (lowerInput.includes('sales') || lowerInput.includes('sd') || lowerInput.includes('pipeline') || lowerInput.includes('order')) {
            responseText = `SD_PERF (Sales & Distribution) telemetry indicates high-velocity transactional throughput. \n\n1. **Observation**: Sales pipeline volume (VBAK/VBAP) increased by 12.4% in EMEA sector.\n2. **Insight**: Order-to-Cash (O2C) cycle time reduced by 4ms through neural fulfillment routing.\n3. **Recommendation**: Scale distribution nodes in Cluster-4 to accommodate projected Q3 volumes.`;
          } else {
            responseText = `Based on the institutional context retrieved (${context.length} nodes), I have analyzed your directive. \n\nStrategic Synthesis: Your query regarding "${lastMessage.substring(0, 30)}..." aligns with current vector shifts in the ${context[0]?.metadata?.source || 'ROOT'} module. I recommend initiating a heuristic deep-scan of the associated data nodes to validate these findings.`;
          }
          
          const words = responseText.split(' ');
          for (const word of words) {
            sendToken(word + ' ');
            await new Promise(r => setTimeout(r, 30));
          }
        }
        
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: 'Failed to process AI stream' }, { status: 500 });
  }
}
