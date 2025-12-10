import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { getSystemPrompt, SessionData } from '@/lib/prompts';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, phase, sessionData } = await req.json() as {
      messages: { role: 'user' | 'assistant'; content: string }[];
      phase: string;
      sessionData: SessionData;
    };

    const systemPrompt = getSystemPrompt(phase, sessionData);

    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
