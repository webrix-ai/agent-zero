'use client';

import { useEffect, useState } from 'react';

export interface LeaderboardEntry {
  full_name: string;
  company_name?: string;
  challenge_attempts: number;
  completed_at: string;
  challenge_started_at: string;
  email?: string;
}

export function formatDuration(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return '--';
  
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  
  if (isNaN(start) || isNaN(end)) return '--';
  
  const seconds = Math.floor((end - start) / 1000);
  
  if (seconds < 0) return '--';
  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m${remainingSeconds}s`;
}

export function formatLeaderboardName(entry: LeaderboardEntry, index: number): { name: string; company?: string } {
  const firstName = entry.full_name?.split(' ')[0]?.toUpperCase();
  const companyName = entry.company_name?.toUpperCase();
  
  if (!firstName) {
    const hackerNames = [
      'AGENT', 'HACKER', 'GHOST', 'CIPHER', 'SHADOW', 'ZERO', 'PHOENIX', 'VIPER',
      'ROGUE', 'STORM', 'BYTE', 'PIXEL', 'NEXUS', 'VECTOR', 'PULSE', 'NOVA',
      'APEX', 'BLADE', 'CRYPTO', 'DELTA', 'ECHO', 'FLUX', 'GLITCH', 'HELIX',
      'ION', 'JADE', 'KARMA', 'LYNX', 'MATRIX', 'NEON', 'OMEGA', 'PRISM'
    ];
    const baseName = hackerNames[index % hackerNames.length];
    const randomNum = Math.floor(Math.random() * 900) + 100;
    return { name: `${baseName}_${randomNum}` };
  }
  
  return { name: firstName, company: companyName };
}

interface LeaderboardProps {
  maxEntries?: number;
  currentUserEmail?: string;
  showTitle?: boolean;
  titleSize?: 'sm' | 'lg';
  autoRefresh?: boolean;
  refreshInterval?: number;
  /** 'top' shows top N entries, 'around-user' shows entries around the current user */
  mode?: 'top' | 'around-user';
}

interface DisplayEntry extends LeaderboardEntry {
  rank: number;
}

export function Leaderboard({ 
  maxEntries = 10,
  currentUserEmail,
  showTitle = true,
  titleSize = 'sm',
  autoRefresh = false,
  refreshInterval = 30000,
  mode = 'top',
}: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    if (autoRefresh) {
      const interval = setInterval(fetchLeaderboard, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // Calculate display entries based on mode
  const getDisplayEntries = (): DisplayEntry[] => {
    if (leaderboard.length === 0) return [];

    if (mode === 'top') {
      // Simple top N entries
      return leaderboard.slice(0, maxEntries).map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
    }

    // 'around-user' mode: find user position and show context
    const userIndex = currentUserEmail 
      ? leaderboard.findIndex(entry => entry.email === currentUserEmail)
      : -1;

    if (userIndex === -1) {
      // User not found in leaderboard, show top entries
      return leaderboard.slice(0, maxEntries).map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
    }

    const totalEntries = maxEntries;
    const beforeCount = 4; // Show 4 entries before user (5 after)

    let startIndex = Math.max(0, userIndex - beforeCount);
    let endIndex = startIndex + totalEntries;

    // Adjust if we're near the end
    if (endIndex > leaderboard.length) {
      endIndex = leaderboard.length;
      startIndex = Math.max(0, endIndex - totalEntries);
    }

    // Adjust if we're near the start
    if (startIndex === 0 && endIndex < totalEntries) {
      endIndex = Math.min(leaderboard.length, totalEntries);
    }

    return leaderboard.slice(startIndex, endIndex).map((entry, index) => ({
      ...entry,
      rank: startIndex + index + 1,
    }));
  };

  const displayEntries = getDisplayEntries();

  // Get user's rank for the title
  const userRank = currentUserEmail 
    ? leaderboard.findIndex(entry => entry.email === currentUserEmail) + 1
    : 0;

  if (isLoading) {
    return (
      <div className="border-4 border-keen-cyan bg-keen-darkblue p-3 sm:p-4">
        <p className="text-keen-cyan font-pixel text-xs text-center animate-pulse">
          LOADING...
        </p>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="border-4 border-keen-cyan bg-keen-darkblue p-3 sm:p-4">
        <p className="text-keen-gray font-pixel text-xs text-center">
          NO ENTRIES YET
        </p>
      </div>
    );
  }

  return (
    <div className="border-4 border-keen-cyan bg-keen-darkblue p-3 sm:p-4">
      {showTitle && (
        <div className="flex items-center justify-center gap-2 mb-3">
          <img 
            src="https://ztespqmrsydpdxtdaytd.supabase.co/storage/v1/object/public/public-webrix/trophy-image.png" 
            alt="Trophy" 
            className={titleSize === 'lg' ? 'w-8 h-8 sm:w-10 sm:h-10 object-contain' : 'w-5 h-5 sm:w-6 sm:h-6 object-contain'}
          />
          <p className={`text-keen-cyan font-pixel text-center ${titleSize === 'lg' ? 'text-sm sm:text-lg' : 'text-xs sm:text-sm'}`}>
            {mode === 'around-user' && userRank > 0 
              ? `YOUR RANK: #${userRank} OF ${leaderboard.length}`
              : 'LEADERBOARD'
            }
          </p>
        </div>
      )}
      {/* Header row */}
      <div className="flex items-center px-2 py-1 border-b border-keen-cyan/30 mb-2">
        <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
          <span className="font-pixel text-[10px] text-keen-cyan/70 w-5 sm:w-6 shrink-0">#</span>
          <span className="font-pixel text-[10px] text-keen-cyan/70">NAME</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <span className="font-pixel text-[10px] text-keen-cyan/70 w-12 sm:w-14 text-right">TIME</span>
          <span className="font-pixel text-[10px] text-keen-cyan/70 w-8 sm:w-14 text-right">TRIES</span>
        </div>
      </div>

      <div className="space-y-1">
        {displayEntries.map((entry) => {
          const isCurrentUser = currentUserEmail && entry.email === currentUserEmail;
          const displayRank = entry.rank;
          const { name, company } = formatLeaderboardName(entry, entry.rank - 1);
          return (
            <div 
              key={`${entry.rank}-${entry.email}`}
              className={`flex items-center px-2 py-1.5 ${
                isCurrentUser 
                  ? 'bg-keen-yellow/20 border border-keen-yellow' 
                  : ''
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                <span className={`font-pixel text-[10px] sm:text-xs w-5 sm:w-6 shrink-0 ${
                  displayRank === 1 ? 'text-keen-yellow' : 
                  displayRank === 2 ? 'text-keen-gray' : 
                  displayRank === 3 ? 'text-orange-400' : 'text-keen-green'
                }`}>
                  {displayRank}
                </span>
                <span className={`font-pixel text-[10px] sm:text-xs truncate ${isCurrentUser ? 'text-keen-yellow' : 'text-keen-green'}`}>
                  {name}
                  {isCurrentUser && ' (YOU)'}
                  {company && !isCurrentUser && (
                    <span className="text-keen-gray/60 ml-1">({company})</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <span className="font-pixel text-[10px] sm:text-xs text-keen-magenta w-12 sm:w-14 text-right">
                  {formatDuration(entry.challenge_started_at, entry.completed_at)}
                </span>
                <span className="font-pixel text-[10px] sm:text-xs text-keen-cyan w-8 sm:w-10 text-right">
                  {entry.challenge_attempts}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
