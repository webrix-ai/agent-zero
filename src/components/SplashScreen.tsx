'use client';

import { useState } from 'react';
import { PixelLogo } from './PixelLogo';

interface SplashScreenProps {
  onStart: (email: string) => void;
  isLoading?: boolean;
}

export function SplashScreen({ onStart, isLoading }: SplashScreenProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'protonmail.com', 'mail.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    
    if (!email.includes('@') || !domain) return 'Enter a valid email address';
    if (personalDomains.includes(domain)) return 'Please use your work email';
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }
    onStart(email);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Title */}
      <div className="text-center mb-8 animate-pulse-slow">
        <h1 className="text-keen-yellow text-4xl md:text-6xl font-pixel mb-2 tracking-wider">
          OPERATION
        </h1>
        <h1 className="text-keen-cyan text-5xl md:text-7xl font-pixel tracking-widest">
          MCP
        </h1>
      </div>
      
      {/* Pixel art DevBot */}
      <div className="mb-8 animate-bounce-slow">
        <div className="text-6xl">🤖</div>
      </div>
      
      {/* Subtitle */}
      <p className="text-keen-green font-pixel text-sm mb-8 text-center">
        CAN YOU HACK THE AI?
      </p>
      
      {/* Email input */}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="border-4 border-keen-cyan p-1 bg-keen-darkblue">
          <div className="border-2 border-keen-blue p-4">
            <label className="block text-keen-cyan font-pixel text-xs mb-2">
              INSERT WORK EMAIL TO START
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="agent@company.com"
              className="w-full bg-keen-black border-2 border-keen-green text-keen-green font-pixel text-lg p-3 focus:outline-none focus:border-keen-yellow placeholder-keen-green/30"
              disabled={isLoading}
              autoComplete="email"
              autoFocus
            />
            {error && (
              <p className="text-keen-red font-pixel text-xs mt-2">{error}</p>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !email}
          className={`
            w-full mt-4 py-4 font-pixel text-lg
            border-4 transition-all duration-200
            ${isLoading 
              ? 'bg-keen-darkgray border-keen-gray text-keen-gray cursor-wait'
              : 'bg-keen-blue border-keen-cyan text-keen-yellow hover:bg-keen-cyan hover:text-keen-black active:translate-y-1'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isLoading ? 'SCANNING...' : 'START MISSION'}
        </button>
      </form>
      
      {/* Footer */}
      <div className="mt-12 flex items-center gap-2 opacity-60">
        <span className="text-keen-gray font-pixel text-xs">POWERED BY</span>
        <PixelLogo className="h-4" />
      </div>
      
      {/* Blinking cursor decoration */}
      <div className="fixed bottom-8 left-8 text-keen-green font-pixel text-sm">
        <span className="animate-blink">_</span> READY
      </div>
    </div>
  );
}
