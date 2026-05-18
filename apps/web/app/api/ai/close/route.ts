import { NextRequest, NextResponse } from 'next/server';
import { executeCloseAgent } from '@/lib/ai/agents/close-agent';
import { LangChainAdapter } from 'ai';
import DOMPurify from 'isomorphic-dompurify';

export async function POST(req: NextRequest) {
  try {
    const { directive, contextData } = await req.json();
    const safeDirective = DOMPurify.sanitize(directive || '', { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    const { stream: aiStream, context } = await executeCloseAgent(safeDirective, contextData);

    if (aiStream) {
      return LangChainAdapter.toDataStreamResponse(aiStream);
    } else {
      // Mock fallback if API key is missing
      const mockResponse = `Variance Analysis Complete: The drift was localized to currency translation differences. Reconciliation successful. Context Nodes: ${context.length}`;
      
      return NextResponse.json({
        success: true,
        data: { message: mockResponse }
      });
    }
  } catch (error) {
    console.error('Close Agent Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
