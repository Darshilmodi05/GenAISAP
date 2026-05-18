import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import { executeHybridIntelligence } from '@/lib/ai/agents/hybrid-agent';
import { LangChainAdapter } from 'ai';
import { sanitizeInput } from '@/lib/security/sanitizer';

const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
});

export const maxDuration = 60; // Increased for heavy ML + RAG

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const { success } = await rateLimit(request, { max: 20, windowMs: 60 * 1000 });
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { messages } = chatSchema.parse(body);
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json({ error: 'Invalid message sequence' }, { status: 400 });
    }

    // OWASP Sanitization
    const sanitizedContent = sanitizeInput(lastMessage.content);

    // 1. Log the user message
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      message: sanitizedContent,
      role: 'user',
      tenant_id: user.user_metadata?.tenant_id || 'default',
    });

    // 2. Execute Neural RAG Pipeline with Hybrid ML Intelligence
    const { stream: aiStream, context, mlInsights } = await executeHybridIntelligence(sanitizedContent);

    // 3. Handle Streaming with Vercel AI SDK
    if (aiStream) {
      // Create a response using the LangChain stream
      return LangChainAdapter.toDataStreamResponse(aiStream, {
        callbacks: {
          onCompletion: async (completion: string) => {
            // Store completion in DB after stream finishes
            await supabase.from('chat_messages').insert({
              user_id: user.id,
              message: completion,
              role: 'assistant',
              tenant_id: user.user_metadata?.tenant_id || 'default',
              metadata: {
                context_nodes: context.length,
                ml_insights: mlInsights.length,
              }
            });
          }
        }
      });
    } else {
      // Mock fallback if API key is missing
      const mockResponse = `[SYSTEM: MOCK MODE] Analysis of "${sanitizedContent}" indicates potential drift in SAP FICO ledgers. RAG retrieved ${context.length} documents. ML Service detected ${mlInsights.length} anomalies.`;
      
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        message: mockResponse,
        role: 'assistant',
        tenant_id: user.user_metadata?.tenant_id || 'default',
      });

      return NextResponse.json({
        success: true,
        data: { message: mockResponse }
      });
    }
  } catch (error) {
    console.error('Neural Chat Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get chat history
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .eq('tenant_id', user.user_metadata?.tenant_id || 'default')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Chat history fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch chat history' },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
