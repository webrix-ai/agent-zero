import { createServerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

interface SessionEntry {
  full_name: string;
  company_name: string | null;
  challenge_attempts: number;
  completed_at: string;
  challenge_started_at: string;
  email: string | null;
}

export async function GET() {
  try {
    const supabase = createServerClient();

    // Get all completed sessions ordered by fewest attempts, then fastest time
    const { data: allEntries, error } = await supabase
      .from('sessions')
      .select('full_name, company_name, challenge_attempts, completed_at, challenge_started_at, email')
      .eq('challenge_completed', true)
      .order('challenge_attempts', { ascending: true })
      .order('completed_at', { ascending: true });

    if (error) {
      console.error('Leaderboard fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Deduplicate by full_name - keep only the best score (first occurrence since already sorted)
    const seenNames = new Set<string>();
    const leaderboard: SessionEntry[] = [];
    
    for (const entry of (allEntries || [])) {
      const name = entry.full_name?.toLowerCase()?.trim() || '';
      if (name && !seenNames.has(name)) {
        seenNames.add(name);
        leaderboard.push(entry);
      }
    }

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
