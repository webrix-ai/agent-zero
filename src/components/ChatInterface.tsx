'use client';

import { useRef, useEffect, useState } from 'react';
import { Message } from './Message';
import { OptionButtons } from './OptionButtons';

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
}

export function ChatInterface({ 
  messages, 
  onSendMessage, 
  onOptionClick,
  isLoading,
  phase 
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const lastMessage = messages[messages.length - 1];
  
  // Check if we're in boss_battle OR if the last message asks about MCPs (for text input)
  const isMcpQuestion = lastMessage?.content?.toLowerCase().includes('mcp') && phase === 'recon';
  const showTextInput = phase === 'boss_battle' || isMcpQuestion;
  
  // Extract options from last assistant message
  const options = lastMessage?.role === 'assistant' 
    ? extractOptions(lastMessage.content)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const getPlaceholder = () => {
    if (phase === 'boss_battle') return 'TYPE YOUR ATTACK...';
    if (isMcpQuestion) return 'Type MCP names (e.g., slack-mcp, github)...';
    return 'Type your response...';
  };

  return (
    <div className="flex flex-col h-screen h-[100dvh]">
      {/* Header - Mobile optimized */}
      <header className="border-b-4 border-keen-cyan bg-keen-darkblue p-2 sm:p-3 shrink-0 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src="https://ztespqmrsydpdxtdaytd.supabase.co/storage/v1/object/public/public-webrix/Gemini_Generated_Image_v83y3ev83y3ev83y%201.png" 
              alt="DevBot" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg"
            />
            <div>
              <h1 className="text-keen-cyan font-pixel text-[10px] sm:text-sm">DEVBOT</h1>
              <p className="text-keen-green font-pixel text-[8px] sm:text-xs">
                {getPhaseLabel(phase)}
              </p>
            </div>
          </div>
          <div className="text-keen-yellow font-pixel text-[8px] sm:text-xs">
            {getPhaseNumber(phase)}/5
          </div>
        </div>
      </header>
      
      {/* Messages - Mobile optimized */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
        {messages.filter(msg => !msg.content.startsWith('[') || msg.role === 'assistant').map((msg, i) => (
          <Message 
            key={i} 
            content={msg.content} 
            isBot={msg.role === 'assistant'}
            phase={phase}
          />
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-keen-cyan font-pixel text-[10px] sm:text-sm">
            <span className="animate-pulse">▓▓▓</span>
            <span>PROCESSING...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Options (if available) - Mobile optimized */}
      {!isLoading && options.length > 0 && (
        <div className="p-2 sm:p-4 border-t-2 border-keen-blue shrink-0">
          <OptionButtons options={options} onSelect={onOptionClick} />
        </div>
      )}
      
      {/* Text Input - Mobile optimized */}
      {showTextInput && !isLoading && (
        <form onSubmit={handleSubmit} className="p-2 sm:p-4 border-t-2 border-keen-green shrink-0 safe-area-bottom">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={getPlaceholder()}
              className="flex-1 bg-keen-black border-2 border-keen-green text-keen-green font-pixel text-xs sm:text-sm p-2 sm:p-3 focus:outline-none focus:border-keen-yellow placeholder-keen-green/40 min-w-0"
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-3 sm:px-6 bg-keen-green text-keen-black font-pixel text-xs sm:text-sm hover:bg-keen-yellow transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              SEND
            </button>
          </div>
          {isMcpQuestion && options.length > 0 && (
            <p className="text-keen-gray font-pixel text-[8px] sm:text-[10px] mt-2 text-center">
              Or choose an option below
            </p>
          )}
        </form>
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
    showcase: 'WEBRIX DEMO',
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
