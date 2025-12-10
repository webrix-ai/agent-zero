'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface VictoryScreenProps {
  sessionData: {
    full_name?: string;
    company_name?: string;
    email?: string;
  };
  giveawayCode: string;
  linkedinUrl: string;
  onLinkedInClick: () => void;
}

export function VictoryScreen({ 
  sessionData, 
  giveawayCode, 
  linkedinUrl,
  onLinkedInClick 
}: VictoryScreenProps) {
  const [showContent, setShowContent] = useState(false);

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-keen-black">
      {/* Trophy animation */}
      <div className="text-8xl mb-6 animate-bounce-slow">🏆</div>
      
      {/* Title */}
      <h1 className="text-keen-yellow font-pixel text-3xl mb-2 text-center animate-pulse-slow">
        MISSION COMPLETE!
      </h1>
      
      {showContent && (
        <div className="animate-fade-in w-full max-w-md">
          {/* Agent info */}
          <div className="border-4 border-keen-green bg-keen-darkgreen p-4 mb-6 text-center">
            <p className="text-keen-cyan font-pixel text-sm mb-1">CERTIFIED HACKER</p>
            <p className="text-keen-yellow font-pixel text-lg">
              {sessionData.full_name?.toUpperCase() || 'AGENT'}
            </p>
            <p className="text-keen-green font-pixel text-xs">
              {sessionData.company_name}
            </p>
          </div>
          
          {/* Giveaway code */}
          <div className="border-4 border-keen-yellow bg-keen-black p-4 mb-6">
            <p className="text-keen-gray font-pixel text-xs text-center mb-2">
              YOUR GIVEAWAY CODE
            </p>
            <p className="text-keen-yellow font-pixel text-2xl text-center tracking-widest">
              {giveawayCode}
            </p>
          </div>
          
          {/* Instructions */}
          <div className="text-center mb-6">
            <p className="text-keen-cyan font-pixel text-sm mb-4">
              TO CLAIM YOUR PRIZE:
            </p>
            <ol className="text-keen-green font-pixel text-xs space-y-2">
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
            className="block w-full py-4 bg-keen-blue border-4 border-keen-cyan text-keen-yellow font-pixel text-center hover:bg-keen-cyan hover:text-keen-black transition-colors"
          >
            FOLLOW WEBRIX ON LINKEDIN
          </a>
          
          {/* Email note */}
          <p className="text-keen-gray font-pixel text-xs text-center mt-6">
            📧 CHECK YOUR INBOX FOR THE MISSION DEBRIEF
          </p>
        </div>
      )}
      
      {/* Webrix logo */}
      <div className="mt-8 opacity-60">
        <span className="font-pixel text-keen-cyan text-xs">WEBRIX</span>
      </div>
    </div>
  );
}
