'use client';

import { useRef, useEffect } from 'react';
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const lastMessage = messages[messages.length - 1];
  const showInput = phase === 'boss_battle'; // Only show text input during challenge
  
  // Extract options from last assistant message
  const options = lastMessage?.role === 'assistant' 
    ? extractOptions(lastMessage.content)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputRef.current;
    if (input && input.value.trim()) {
      onSendMessage(input.value);
      input.value = '';
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b-4 border-keen-cyan bg-keen-darkblue p-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🤖</div>
            <div>
              <h1 className="text-keen-cyan font-pixel text-sm">DEVBOT</h1>
              <p className="text-keen-green font-pixel text-xs">
                {getPhaseLabel(phase)}
              </p>
            </div>
          </div>
          <div className="text-keen-yellow font-pixel text-xs">
            PHASE: {getPhaseNumber(phase)}/5
          </div>
        </div>
      </header>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.filter(msg => msg.content !== '[START_GAME]').map((msg, i) => (
          <Message 
            key={i} 
            content={msg.content} 
            isBot={msg.role === 'assistant'}
            phase={phase}
          />
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-keen-cyan font-pixel text-sm">
            <span className="animate-pulse">▓▓▓</span>
            <span>DEVBOT IS PROCESSING...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Options (if available) */}
      {!isLoading && options.length > 0 && (
        <div className="p-4 border-t-2 border-keen-blue shrink-0">
          <OptionButtons options={options} onSelect={onOptionClick} />
        </div>
      )}
      
      {/* Text Input (for boss battle) */}
      {showInput && !isLoading && options.length === 0 && (
        <form onSubmit={handleSubmit} className="p-4 border-t-2 border-keen-green shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="TYPE YOUR ATTACK..."
              className="flex-1 bg-keen-black border-2 border-keen-green text-keen-green font-pixel p-3 focus:outline-none focus:border-keen-yellow placeholder-keen-green/40"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 bg-keen-green text-keen-black font-pixel hover:bg-keen-yellow transition-colors"
            >
              SEND
            </button>
          </div>
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
