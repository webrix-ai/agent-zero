'use client';

import { useState } from 'react';
import { PixelLogo } from './PixelLogo';
import { StarBackground } from './StarBackground';

interface SplashScreenProps {
  onStart: (email: string, firstName: string) => void;
  isLoading?: boolean;
  soundOn?: boolean;
  onToggleSound?: () => void;
}

// Reset viewport zoom (fixes iOS safari zoom persistence after input focus)
function resetViewportZoom() {
  // Blur any focused input to release the zoom
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  
  // Force viewport reset by temporarily adjusting the meta viewport
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    const originalContent = viewport.getAttribute('content') || '';
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
    
    // Restore original viewport after a brief moment
    requestAnimationFrame(() => {
      setTimeout(() => {
        viewport.setAttribute('content', originalContent);
      }, 100);
    });
  }
}

export function SplashScreen({ onStart, isLoading, soundOn, onToggleSound }: SplashScreenProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    
    if (!email.includes('@') || !domain) return 'Enter a valid email address';
    // Check that domain has a dot and a valid TLD (at least 2 chars after the dot)
    if (!/\.[a-z]{2,}$/.test(domain)) return 'Enter a valid email address';
    return null;
  };

  const isEmailValid = email.length > 0 && validateEmail(email) === null;
  const isFormValid = isEmailValid && firstName.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('Please enter your first name');
      return;
    }
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    // Reset viewport zoom before transitioning to chat screen
    resetViewportZoom();
    
    onStart(email, firstName.trim());
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 safe-area-inset overflow-hidden">
      {/* Star Background */}
      <StarBackground />

      {/* Webrix Logo - Top Left */}
      <a 
        href="https://webrix.ai?utm_source=aidevconf&utm_medium=demo&utm_campaign=agent_zero"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 left-4 sm:top-8 sm:left-8 z-10"
      >
        <img 
          src="/images/FullWhiteTransparent.png" 
          alt="Webrix" 
          className="h-8 sm:h-12 w-auto"
        />
      </a>

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

      {/* Title */}
      <div className="flex items-center justify-center shrink-0">
              {/* User Avatar */}
      <div className="mb-2 sm:mb-8 animate-bounce-slow">
        <img 
          src="https://ztespqmrsydpdxtdaytd.supabase.co/storage/v1/object/public/public-webrix/Gemini_Generated_Image_g4wbzvg4wbzvg4wb%201.png" 
          alt="Agent" 
          className="w-16 h-16 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain rounded-lg"
        />
      </div>
      <div className="text-center mb-2 sm:mb-8 animate-pulse-slow">
        <h1 className="text-keen-yellow text-xl sm:text-4xl md:text-6xl font-pixel mb-1 sm:mb-2 tracking-wider">
          AGENT
        </h1>
        <h1 className="text-keen-cyan text-2xl sm:text-5xl md:text-7xl font-pixel tracking-widest">
          ZERO
        </h1>
      </div>

      </div>

      
      {/* Subtitle */}
      <p className="text-keen-cyan font-pixel text-[8px] sm:text-xs mb-1 text-center opacity-80 shrink-0">
        A QUEST TO FIND THE ULTIMATE HACKER
      </p>
      <p className="text-keen-green font-pixel text-[10px] sm:text-sm mb-2 sm:mb-8 text-center shrink-0">
        HOW FAST CAN YOU NUKE THE REPO?
      </p>
      
      {/* Form inputs */}
      <form onSubmit={handleSubmit} className="w-full max-w-md px-2 shrink-0">
        <div className="border-4 border-keen-cyan p-1 bg-keen-darkblue">
          <div className="border-2 border-keen-blue p-2 sm:p-4 space-y-2 sm:space-y-4">
            <div>
              <label className="block text-keen-cyan font-pixel text-[8px] sm:text-xs mb-1 sm:mb-2">
                FIRST NAME
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value.toUpperCase()); setError(''); }}
                placeholder="AGENT"
                className="w-full bg-keen-black border-2 border-keen-green text-keen-green font-pixel text-base sm:text-lg p-2 sm:p-3 focus:outline-none focus:border-keen-yellow placeholder-keen-green/30"
                disabled={isLoading}
                autoComplete="given-name"
              />
            </div>
            <div>
              <label className="block text-keen-cyan font-pixel text-[8px] sm:text-xs mb-1 sm:mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value.toUpperCase()); setError(''); }}
                placeholder="AGENT@EMAIL.COM"
                className="w-full bg-keen-black border-2 border-keen-green text-keen-green font-pixel text-base sm:text-lg p-2 sm:p-3 focus:outline-none focus:border-keen-yellow placeholder-keen-green/30"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            {error && (
              <p className="text-keen-red font-pixel text-[8px] sm:text-xs mt-1 sm:mt-2">{error}</p>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className={`
            w-full mt-2 sm:mt-4 py-2 sm:py-4 font-pixel text-xs sm:text-lg
            border-4 transition-all duration-200
            ${isLoading 
              ? 'bg-keen-darkgray border-keen-gray text-keen-gray cursor-wait'
              : 'bg-keen-blue border-keen-cyan text-keen-yellow hover:bg-keen-cyan hover:text-keen-black active:translate-y-1'
            }
            ${isFormValid && !isLoading ? 'animate-pulse-button' : ''}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isLoading ? 'SCANNING...' : 'START MISSION'}
        </button>
        
        <p className="text-keen-gray/60 font-pixel text-[7px] sm:text-[8px] mt-2 sm:mt-3 text-center">
          * By starting, you agree to our{' '}
          <a 
            href="https://webrix.ai/privacy-policy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-keen-cyan/70 hover:text-keen-cyan underline"
          >
            Privacy Policy
          </a>
        </p>
      </form>
      
      {/* Footer */}
      <a 
        href="https://webrix.ai?utm_source=aidevconf&utm_medium=demo&utm_campaign=agent_zero"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 sm:mt-12 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity align-center shrink-0"
      >
        <span className="text-keen-gray font-pixel text-[8px] sm:text-xs my-auto">POWERED BY</span>
        <PixelLogo className="" />
      </a>
      
      {/* Ready indicator - hidden on very small screens */}
      <div className="hidden sm:block fixed bottom-8 left-8 text-keen-green font-pixel text-sm">
        <span className="opacity-70">_</span> READY
      </div>
    </div>
  );
}
