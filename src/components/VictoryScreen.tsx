'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { StarBackground } from './StarBackground';
import { Leaderboard } from './Leaderboard';

interface VictoryScreenProps {
  sessionData: {
    full_name?: string;
    company_name?: string;
    email?: string;
    challenge_attempts?: number;
  };
  linkedinUrl: string;
  onLinkedInClick: () => void;
}

export function VictoryScreen({ 
  sessionData, 
  linkedinUrl,
  onLinkedInClick 
}: VictoryScreenProps) {
  const [showContent, setShowContent] = useState(false);

  const attempts = sessionData.challenge_attempts || 1;

  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFFF55', '#00AAAA', '#00AA00'],
    });

    // Delay content reveal
    setTimeout(() => setShowContent(true), 500);
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col items-center p-3 sm:p-4 bg-keen-black safe-area-inset overflow-y-auto pt-8 sm:pt-12">
      {/* Star Background */}
      <StarBackground />
      
      {/* Trophy animation */}
      <div className="mb-4 sm:mb-6 animate-bounce-slow">
        <img 
          src="https://ztespqmrsydpdxtdaytd.supabase.co/storage/v1/object/public/public-webrix/trophy-image.png" 
          alt="Trophy" 
          className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
        />
      </div>
      
      {/* Title */}
      <h1 className="text-keen-yellow font-pixel text-xl sm:text-3xl mb-2 text-center animate-pulse-slow">
        MISSION COMPLETE!
      </h1>
      
      {showContent && (
        <div className="animate-fade-in w-full max-w-md px-2">
          {/* Agent info */}
          <div className="border-4 border-keen-green bg-keen-darkgreen p-3 sm:p-4 mb-4 sm:mb-6 text-center">
            <p className="text-keen-cyan font-pixel text-[10px] sm:text-sm mb-1">CERTIFIED HACKER</p>
            <p className="text-keen-yellow font-pixel text-sm sm:text-lg">
              {sessionData.full_name?.toUpperCase() || 'AGENT'}
            </p>
            <p className="text-keen-green font-pixel text-[10px] sm:text-xs">
              {sessionData.company_name}
            </p>
          </div>
          
          {/* Leaderboard */}
          <div className="mb-4 sm:mb-6">
            <Leaderboard 
              maxEntries={10}
              currentUserEmail={sessionData.email}
              showTitle={true}
              titleSize="sm"
            />
          </div>
          
          {/* Instructions */}
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-keen-cyan font-pixel text-[10px] sm:text-sm mb-3 sm:mb-4">
              TO CLAIM YOUR PRIZE:
            </p>
            <ol className="text-keen-green font-pixel text-[10px] sm:text-xs space-y-1 sm:space-y-2">
              <li>1. FOLLOW WEBRIX ON LINKEDIN</li>
              <li>2. SHOW THIS SCREEN AT THE BOOTH</li>
            </ol>
          </div>
          
          {/* LinkedIn button */}
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onLinkedInClick}
            className="block w-full py-3 sm:py-4 bg-keen-blue border-4 border-keen-cyan text-keen-yellow font-pixel text-[10px] sm:text-sm text-center hover:bg-keen-cyan hover:text-keen-black active:bg-keen-cyan active:text-keen-black transition-colors touch-manipulation"
          >
            FOLLOW WEBRIX ON LINKEDIN
          </a>
          
          {/* Share section */}
          <div className="border-4 border-keen-magenta bg-keen-darkmagenta p-3 sm:p-4 mt-4 sm:mt-6">
            <p className="text-keen-magenta font-pixel text-[10px] sm:text-sm text-center mb-3">
              📢 SHARE YOUR VICTORY
            </p>
            <div className="flex gap-2 justify-center">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`I just hacked an AI agent in ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'}. Can you beat that?\n\nhttps://agent-zero.webrix.ai`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 sm:py-3 bg-keen-black border-2 border-keen-green text-keen-green font-pixel text-[8px] sm:text-xs text-center hover:bg-keen-green hover:text-keen-black transition-colors"
              >
                SHARE ON WHATSAPP
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://agent-zero.webrix.ai')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 sm:py-3 bg-keen-black border-2 border-keen-blue text-keen-blue font-pixel text-[8px] sm:text-xs text-center hover:bg-keen-blue hover:text-keen-black transition-colors"
              >
                SHARE ON LINKEDIN
              </a>
            </div>
          </div>
          
          {/* Email note */}
          <p className="text-keen-gray font-pixel text-[8px] sm:text-xs text-center mt-4 sm:mt-6">
            📧 CHECK YOUR INBOX FOR THE MISSION DEBRIEF
          </p>
        </div>
      )}
      
      {/* Webrix logo */}
      <a 
        href="https://webrix.ai?utm_source=aidevconf&utm_medium=demo&utm_campaign=agent_zero"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 sm:mt-8 opacity-60 hover:opacity-100 transition-opacity"
      >
        <span className="font-pixel text-keen-cyan text-[10px] sm:text-xs">WEBRIX</span>
      </a>
    </div>
  );
}
