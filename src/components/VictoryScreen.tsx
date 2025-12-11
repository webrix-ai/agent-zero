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
  soundOn?: boolean;
  onToggleSound?: () => void;
}

export function VictoryScreen({ 
  sessionData, 
  linkedinUrl,
  onLinkedInClick,
  soundOn,
  onToggleSound
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
    <div className="flex flex-col items-center p-3 sm:p-4 bg-keen-black safe-area-inset overflow-y-auto pt-8 sm:pt-12">
      {/* Star Background */}
      <StarBackground />

      {/* Sound Toggle Button - Top Right */}
      {onToggleSound && (
        <button
          onClick={onToggleSound}
          className="fixed top-4 right-4 sm:top-8 sm:right-8 px-3 py-2 border-2 border-keen-cyan bg-keen-darkblue hover:bg-keen-blue transition-colors z-50 flex items-center gap-2"
          aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
        >
          {soundOn ? (
            <>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-keen-green" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
              <span className="font-pixel text-[8px] sm:text-xs text-keen-green">SOUND ON</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-keen-gray" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
              <span className="font-pixel text-[8px] sm:text-xs text-keen-gray">SOUND OFF</span>
            </>
          )}
        </button>
      )}
      
      {/* Trophy animation - click to restart */}
      <button 
        onClick={() => window.location.reload()}
        className="mb-4 sm:mb-6 animate-bounce-slow cursor-pointer hover:scale-110 transition-transform"
        title="Click to play again"
      >
        <img 
          src="https://ztespqmrsydpdxtdaytd.supabase.co/storage/v1/object/public/public-webrix/trophy-image.png" 
          alt="Trophy - Click to play again" 
          className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
        />
      </button>
      
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
              mode="around-user"
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
