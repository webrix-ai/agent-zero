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
    const speed = 10; // Slightly faster for mobile
    
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

  const userAvatarUrl = "https://ztespqmrsydpdxtdaytd.supabase.co/storage/v1/object/public/public-webrix/Gemini_Generated_Image_g4wbzvg4wbzvg4wb%201.png";
  const agentAvatarUrl = "https://ztespqmrsydpdxtdaytd.supabase.co/storage/v1/object/public/public-webrix/Gemini_Generated_Image_v83y3ev83y3ev83y%201.png";

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} gap-2`}>
      {/* Agent Avatar (left side for bot messages) */}
      {isBot && (
        <div className="shrink-0">
          <img 
            src={agentAvatarUrl}
            alt="SENTINEL-9" 
            className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg"
          />
        </div>
      )}
      
      <div
        className={`
          max-w-[85%] sm:max-w-[85%] p-2 sm:p-4 font-pixel text-[10px] sm:text-sm leading-relaxed
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
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 pb-1 sm:pb-2 border-b border-current opacity-70">
            <span className="text-[8px] sm:text-xs">SENTINEL-9</span>
          </div>
        )}
        {!isBot && (
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 pb-1 sm:pb-2 border-b border-current opacity-70">
            <span className="text-[8px] sm:text-xs">YOU</span>
          </div>
        )}
        <div className="whitespace-pre-wrap break-words">
          {displayedContent}
          {isTyping && <span className="ml-1 opacity-70">▓</span>}
        </div>
      </div>
      
      {/* User Avatar (right side for user messages) */}
      {!isBot && (
        <div className="shrink-0">
          <img 
            src={userAvatarUrl}
            alt="You" 
            className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
