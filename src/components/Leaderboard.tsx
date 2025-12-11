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

export function formatLeaderboardName(entry: LeaderboardEntry, index: number): string {
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
    return `${baseName}_${randomNum}`;
  }
  
  if (companyName) {
    return `${firstName} from ${companyName}`;
  }
  
  return firstName;
}

interface LeaderboardProps {
  maxEntries?: number;
  currentUserEmail?: string;
  showTitle?: boolean;
  titleSize?: 'sm' | 'lg';
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function Leaderboard({ 
  maxEntries = 10,
  currentUserEmail,
  showTitle = true,
  titleSize = 'sm',
  autoRefresh = false,
  refreshInterval = 30000,
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
            LEADERBOARD
          </p>
        </div>
      )}
      <div className="space-y-2">
        {leaderboard.slice(0, maxEntries).map((entry, index) => {
          const isCurrentUser = currentUserEmail && entry.email === currentUserEmail;
          return (
            <div 
              key={index}
              className={`flex justify-between items-center px-2 py-2 ${
                isCurrentUser 
                  ? 'bg-keen-yellow/20 border-2 border-keen-yellow animate-pulse' 
                  : 'border border-keen-darkblue'
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className={`font-pixel text-xs shrink-0 ${
                  index === 0 ? 'text-keen-yellow' : 
                  index === 1 ? 'text-keen-gray' : 
                  index === 2 ? 'text-orange-400' : 'text-keen-green'
                }`}>
                  {index + 1}.
                </span>
                <span className={`font-pixel text-xs truncate ${isCurrentUser ? 'text-keen-yellow' : 'text-keen-green'}`}>
                  {formatLeaderboardName(entry, index)}
                  {isCurrentUser && ' (YOU)'}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-2">
                <span className="font-pixel text-xs text-keen-magenta">
                  {formatDuration(entry.challenge_started_at, entry.completed_at)}
                </span>
                <span className="font-pixel text-xs text-keen-cyan whitespace-nowrap">
                  {entry.challenge_attempts}x
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
