import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = createServerClient();
    const body = await req.json();
    const { sessionId, ...data } = body;

    if (sessionId) {
      // Update existing session
      const { data: session, error } = await supabase
        .from('sessions')
        .update(data)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) {
        console.error('Session update error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json(session);
    } else {
      // Create new session
      const { data: session, error } = await supabase
        .from('sessions')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('Session create error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      // Log the email_entered event
      await supabase.from('events').insert({
        session_id: session.id,
        event_type: 'email_entered',
        event_data: { email: data.email },
      });
      
      return NextResponse.json(session);
    }
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
