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
    <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center p-4 safe-area-inset">
      {/* Title */}
      <div className="text-center mb-4 sm:mb-8 animate-pulse-slow">
        <h1 className="text-keen-yellow text-2xl sm:text-4xl md:text-6xl font-pixel mb-1 sm:mb-2 tracking-wider">
          AGENT
        </h1>
        <h1 className="text-keen-cyan text-3xl sm:text-5xl md:text-7xl font-pixel tracking-widest">
          ZERO
        </h1>
      </div>
      
      {/* User Avatar */}
      <div className="mb-4 sm:mb-8 animate-bounce-slow">
        <img 
          src="https://ztespqmrsydpdxtdaytd.supabase.co/storage/v1/object/public/public-webrix/Gemini_Generated_Image_g4wbzvg4wbzvg4wb%201.png" 
          alt="Agent" 
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain rounded-lg"
        />
      </div>
      
      {/* Subtitle */}
      <p className="text-keen-green font-pixel text-[10px] sm:text-sm mb-4 sm:mb-8 text-center">
      HOW FAST CAN YOU BRING PROD DOWN?
      </p>
      
      {/* Email input */}
      <form onSubmit={handleSubmit} className="w-full max-w-md px-2">
        <div className="border-4 border-keen-cyan p-1 bg-keen-darkblue">
          <div className="border-2 border-keen-blue p-3 sm:p-4">
            <label className="block text-keen-cyan font-pixel text-[8px] sm:text-xs mb-2">
              INSERT YOUR WORK EMAIL TO START
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="agent@company.com"
              className="w-full bg-keen-black border-2 border-keen-green text-keen-green font-pixel text-sm sm:text-lg p-2 sm:p-3 focus:outline-none focus:border-keen-yellow placeholder-keen-green/30"
              disabled={isLoading}
              autoComplete="email"
              autoFocus
            />
            {error && (
              <p className="text-keen-red font-pixel text-[8px] sm:text-xs mt-2">{error}</p>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !email}
          className={`
            w-full mt-3 sm:mt-4 py-3 sm:py-4 font-pixel text-sm sm:text-lg
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
      <a 
        href="https://webrix.ai?utm_source=aidevconf&utm_medium=demo&utm_campaign=agent_zero"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 sm:mt-12 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity align-center"
      >
        <span className="text-keen-gray font-pixel text-[8px] sm:text-xs">POWERED BY</span>
        <PixelLogo className="h-3 sm:h-4" />
      </a>
      
      {/* Ready indicator - hidden on very small screens */}
      <div className="hidden sm:block fixed bottom-8 left-8 text-keen-green font-pixel text-sm">
        <span className="opacity-70">_</span> READY
      </div>
    </div>
  );
}
