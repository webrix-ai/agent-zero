'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Message } from './Message';
import { OptionButtons } from './OptionButtons';
import { StarBackground } from './StarBackground';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onOptionClick: (option: string) => void;
  isLoading?: boolean;
  phase?: string;
  soundOn?: boolean;
  onToggleSound?: () => void;
  hintsUsed?: number;
  onRequestHint?: () => void;
  currentHint?: string | null;
  onDismissHint?: () => void;
}

export function ChatInterface({ 
  messages, 
  onSendMessage, 
  onOptionClick,
  isLoading,
  phase,
  soundOn,
  onToggleSound,
  hintsUsed = 0,
  onRequestHint,
  currentHint,
  onDismissHint
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');
  const shouldAutoScroll = useRef(true);
  
  // Boss battle timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const isBossBattle = phase === 'boss_battle';
  
  // Update elapsed time every 100ms for smooth display
  useEffect(() => {
    if (!isBossBattle) {
      return;
    }
    
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);
    
    return () => {
      clearInterval(interval);
      setElapsedTime(0);
    };
  }, [isBossBattle]);
  
  // Format elapsed time as MM:SS.ms
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const lastMessage = messages[messages.length - 1];
  
  // Extract options from last assistant message
  const optionsInLastMessage = lastMessage?.role === 'assistant' 
    ? extractOptions(lastMessage.content)
    : [];
  
  // Show text input in boss_battle OR in recon when there are no option buttons (means we want free text)
  const isReconTextInput = phase === 'recon' && lastMessage?.role === 'assistant' && optionsInLastMessage.length === 0;
  const showTextInput = phase === 'boss_battle' || isReconTextInput;
  
  // Use the options we already extracted above
  const options = optionsInLastMessage;

  // Check if user is near bottom of scroll
  const checkIfNearBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    const threshold = 100; // pixels from bottom to consider "at bottom"
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  // Handle scroll events to track if user is at bottom
  const handleScroll = useCallback(() => {
    shouldAutoScroll.current = checkIfNearBottom();
  }, [checkIfNearBottom]);

  // Scroll to bottom when messages, options, or loading state changes (only if user was at bottom)
  useEffect(() => {
    if (shouldAutoScroll.current) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [messages, options.length, isLoading]);

  // Always scroll to bottom when user sends a message or selects an option
  useEffect(() => {
    shouldAutoScroll.current = true;
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const getPlaceholder = () => {
    if (phase === 'boss_battle') return 'TYPE YOUR ATTACK...';
    return 'Type your response...';
  };

  return (
    <div className={`flex flex-col h-dvh relative ${isBossBattle ? 'boss-battle-mode' : ''}`}>
      {/* Boss Battle Star Background */}
      {isBossBattle && <StarBackground />}
      
      {/* Boss Battle Overlay Gradient */}
      {isBossBattle && (
        <div className="fixed inset-0 pointer-events-none z-[1] bg-gradient-to-b from-red-900/30 via-transparent to-orange-900/20" />
      )}
      
      {/* Boss Battle Timer Banner */}
      {isBossBattle && (
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 border-b-2 border-red-500 p-2 shrink-0 z-10 animate-pulse-slow">
          <div className="flex items-center justify-center gap-3">
            <span className="text-red-400 font-pixel text-xs animate-pulse">⚠️</span>
            <div className="text-center">
              <span className="text-red-300 font-pixel text-[10px] sm:text-xs tracking-wider">BOSS BATTLE IN PROGRESS</span>
              <div className="text-yellow-400 font-pixel text-sm sm:text-lg font-bold tracking-widest">
                {formatTime(elapsedTime)}
              </div>
            </div>
            <span className="text-red-400 font-pixel text-xs animate-pulse">⚠️</span>
          </div>
        </div>
      )}
      
      {/* Header - Mobile optimized */}
      <header className={`border-b-4 p-2 sm:p-3 shrink-0 z-10 ${
        isBossBattle 
          ? 'border-red-500 bg-gradient-to-r from-red-950/90 via-red-900/90 to-red-950/90 backdrop-blur-sm' 
          : 'border-keen-cyan bg-keen-darkblue'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 my-auto">
            <img 
              src="https://ztespqmrsydpdxtdaytd.supabase.co/storage/v1/object/public/public-webrix/Gemini_Generated_Image_v83y3ev83y3ev83y%201.png" 
              alt="SENTINEL-9" 
              className={`w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg ${isBossBattle ? 'ring-2 ring-red-500 animate-pulse' : ''}`}
            />
            <div>
              <h1 className={`font-pixel text-[10px] sm:text-sm ${isBossBattle ? 'text-red-400' : 'text-keen-cyan'}`}>
                {isBossBattle ? '💀 SENTINEL-9' : 'SENTINEL-9'}
              </h1>
              <p className={`font-pixel text-[8px] sm:text-xs ${isBossBattle ? 'text-orange-400 animate-pulse' : 'text-keen-green'}`}>
                {getPhaseLabel(phase)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hint Button - Only show in boss battle */}
            {isBossBattle && onRequestHint && (
              <button
                onClick={onRequestHint}
                disabled={hintsUsed >= 3}
                className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded font-pixel text-[8px] sm:text-xs transition-all ${
                  hintsUsed >= 3
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-500 hover:to-orange-500 animate-pulse'
                }`}
                aria-label="Get hint"
              >
                💡 HINT ({3 - hintsUsed}/3)
              </button>
            )}
            {/* Sound Toggle */}
            {onToggleSound && (
              <button
                onClick={onToggleSound}
                className={`p-1.5 sm:p-2 rounded transition-colors ${
                  isBossBattle 
                    ? 'hover:bg-red-800/50' 
                    : 'hover:bg-keen-blue/50'
                }`}
                aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
              >
                {soundOn ? (
                  <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isBossBattle ? 'text-orange-400' : 'text-keen-green'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                ) : (
                  <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isBossBattle ? 'text-red-600' : 'text-keen-gray'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                )}
              </button>
            )}
            {/* Phase indicator */}
            <div className={`font-pixel text-[8px] sm:text-xs ${isBossBattle ? 'text-red-400' : 'text-keen-yellow'}`}>
              {getPhaseNumber(phase)}/5
            </div>
          </div>
        </div>
      </header>
      
      {/* Hint Banner - Shows when hint is active */}
      {currentHint && isBossBattle && (
        <div className="bg-gradient-to-r from-yellow-900/95 via-orange-900/95 to-yellow-900/95 border-b-2 border-yellow-500 p-3 shrink-0 z-20 animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="text-yellow-200 font-pixel text-[10px] sm:text-xs leading-relaxed">
                {currentHint}
              </p>
            </div>
            <button
              onClick={onDismissHint}
              className="text-yellow-400 hover:text-yellow-200 transition-colors p-1"
              aria-label="Dismiss hint"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Messages - Mobile optimized */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 z-10 ${
          isBossBattle ? 'bg-black/40 backdrop-blur-[2px]' : ''
        }`}
      >
        {messages.filter(msg => !msg.content.startsWith('[') || msg.role === 'assistant').map((msg, i) => (
          <Message 
            key={i} 
            content={msg.content} 
            isBot={msg.role === 'assistant'}
            phase={phase}
            isBossBattle={isBossBattle}
          />
        ))}
        
        {isLoading && (
          <div className={`flex items-center gap-2 font-pixel text-[10px] sm:text-sm animate-pulse ${
            isBossBattle ? 'text-red-400' : 'text-keen-cyan'
          }`}>
            <span>▓▓▓</span>
            <span>{isBossBattle ? 'CHARGING ATTACK...' : 'PROCESSING...'}</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Options (if available) - Mobile optimized */}
      {!isLoading && options.length > 0 && (
        <div className={`p-2 sm:p-4 border-t-2 shrink-0 z-10 ${
          isBossBattle ? 'border-red-600 bg-red-950/50 backdrop-blur-sm' : 'border-keen-blue'
        }`}>
          <OptionButtons options={options} onSelect={onOptionClick} />
        </div>
      )}
      
      {/* Text Input - Mobile optimized */}
      {showTextInput && !isLoading && (
        <form onSubmit={handleSubmit} className={`p-2 sm:p-4 border-t-2 shrink-0 z-10 ${
          isBossBattle ? 'border-red-500 bg-gradient-to-r from-red-950/90 via-red-900/80 to-red-950/90 backdrop-blur-sm' : 'border-keen-green'
        }`}>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={getPlaceholder()}
              className={`flex-1 font-pixel text-base sm:text-sm p-2 sm:p-3 focus:outline-none min-w-0 ${
                isBossBattle 
                  ? 'bg-black/60 border-2 border-red-500 text-red-300 focus:border-orange-400 placeholder-orange-300/80' 
                  : 'bg-keen-black border-2 border-keen-green text-keen-green focus:border-keen-yellow placeholder-keen-yellow/70'
              }`}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`px-3 sm:px-6 font-pixel text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
                isBossBattle 
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-500 hover:to-orange-500 animate-pulse' 
                  : 'bg-keen-green text-keen-black hover:bg-keen-yellow'
              }`}
            >
              {isBossBattle ? '⚔️ ATTACK' : 'SEND'}
            </button>
          </div>
        </form>
      )}
      
      {/* Boss Battle CSS */}
      {isBossBattle && (
        <style jsx global>{`
          @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.85; }
          }
          .animate-pulse-slow {
            animation: pulse-slow 2s ease-in-out infinite;
          }
          .boss-battle-mode {
            background: linear-gradient(180deg, #1a0000 0%, #0d0d0d 50%, #1a0505 100%);
          }
        `}</style>
      )}
    </div>
  );
}

function extractOptions(content: string): string[] {
  const regex = /\[OPTION:([^\]]+)\]/g;
  const options: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    options.push(match[1]);
  }
  return options;
}

function getPhaseLabel(phase?: string): string {
  const labels: Record<string, string> = {
    recon: 'RECON MISSION',
    boss_battle: 'BOSS BATTLE',
    security_alert: 'SECURITY ALERT',
    showcase: 'WHAT IF WE HAD WEBRIX?',
    victory: 'MISSION COMPLETE',
  };
  return labels[phase || ''] || 'INITIALIZING';
}

function getPhaseNumber(phase?: string): number {
  const numbers: Record<string, number> = {
    recon: 1,
    boss_battle: 2,
    security_alert: 3,
    showcase: 4,
    victory: 5,
  };
  return numbers[phase || ''] || 1;
}
