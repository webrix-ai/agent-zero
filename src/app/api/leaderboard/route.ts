import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createServerClient();

    // Get top 10 completed sessions ordered by fewest attempts, then fastest time
    const { data: leaderboard, error } = await supabase
      .from('sessions')
      .select('full_name, company_name, challenge_attempts, completed_at, challenge_started_at, email')
      .eq('challenge_completed', true)
      .order('challenge_attempts', { ascending: true })
      .order('completed_at', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Leaderboard fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ leaderboard: leaderboard || [] });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
