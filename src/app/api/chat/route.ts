import { openai } from '@ai-sdk/openai';
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
      model: openai('gpt-5-mini-2025-08-07'),
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
