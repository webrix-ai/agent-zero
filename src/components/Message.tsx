'use client';

import { useState, useEffect } from 'react';

interface MessageProps {
  content: string;
  isBot: boolean;
  phase?: string;
}

export function Message({ content, isBot, phase }: MessageProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(isBot);

  // Clean content (remove option tags)
  const cleanContent = content
    .replace(/\[OPTION:[^\]]+\]/g, '')
    .replace(/\[PHASE:[^\]]+\]/g, '')
    .replace(/\[COMPLETE\]/g, '')
    .trim();

  useEffect(() => {
    if (!isBot) {
      setDisplayedContent(cleanContent);
      setIsTyping(false);
      return;
    }

    let index = 0;
    const speed = 15;
    
    const timer = setInterval(() => {
      if (index < cleanContent.length) {
        setDisplayedContent(cleanContent.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [cleanContent, isBot]);

  const isAlert = phase === 'security_alert';
  const isVictory = phase === 'victory';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`
          max-w-[90%] p-4 font-pixel text-sm leading-relaxed
          ${isBot 
            ? isAlert
              ? 'bg-keen-darkred border-2 border-keen-red text-keen-lightred'
              : isVictory
                ? 'bg-keen-darkgreen border-2 border-keen-green text-keen-yellow'
                : 'bg-keen-darkblue border-2 border-keen-cyan text-keen-cyan'
            : 'bg-keen-darkgray border-2 border-keen-yellow text-keen-yellow'
          }
        `}
      >
        {isBot && (
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-current opacity-50">
            <span>🤖</span>
            <span className="text-xs">DEVBOT</span>
          </div>
        )}
        <div className="whitespace-pre-wrap">
          {displayedContent}
          {isTyping && <span className="animate-blink ml-1">▓</span>}
        </div>
      </div>
    </div>
  );
}
