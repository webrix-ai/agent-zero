interface MessageProps {
  content: string;
  isBot: boolean;
  phase?: string;
  isBossBattle?: boolean;
}

export function Message({ content, isBot, phase, isBossBattle }: MessageProps) {
  // Clean content (remove option tags)
  const cleanContent = content
    .replace(/\[OPTION:[^\]]+\]/g, '')
    .replace(/\[PHASE:[^\]]+\]/g, '')
    .replace(/\[COMPLETE\]/g, '')
    .trim();

  // Don't render empty messages
  if (!cleanContent) {
    return null;
  }

  const isAlert = phase === 'security_alert';
  const isVictory = phase === 'victory';

  const userAvatarUrl = "https://ztespqmrsydpdxtdaytd.supabase.co/storage/v1/object/public/public-webrix/Gemini_Generated_Image_g4wbzvg4wbzvg4wb%201.png";
  const agentAvatarUrl = "https://ztespqmrsydpdxtdaytd.supabase.co/storage/v1/object/public/public-webrix/Gemini_Generated_Image_v83y3ev83y3ev83y%201.png";

  // Get message box styling based on phase and role
  const getMessageStyles = () => {
    if (isBossBattle) {
      if (isBot) {
        return 'bg-gradient-to-br from-red-950/90 to-red-900/80 border-2 border-red-500 text-red-200 shadow-lg shadow-red-900/50';
      }
      return 'bg-gradient-to-br from-orange-950/90 to-amber-900/80 border-2 border-orange-400 text-orange-200 shadow-lg shadow-orange-900/50';
    }
    
    if (isBot) {
      if (isAlert) {
        return 'bg-keen-darkred border-2 border-keen-red text-keen-lightred';
      }
      if (isVictory) {
        return 'bg-keen-darkgreen border-2 border-keen-green text-keen-yellow';
      }
      return 'bg-keen-darkblue border-2 border-keen-cyan text-keen-cyan';
    }
    
    return 'bg-keen-darkgray border-2 border-keen-yellow text-keen-yellow';
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} gap-2`}>
      {/* Agent Avatar (left side for bot messages) */}
      {isBot && (
        <div className="shrink-0">
          <img 
            src={agentAvatarUrl}
            alt="SENTINEL-9" 
            className={`w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg ${
              isBossBattle ? 'ring-2 ring-red-500/70 animate-pulse' : ''
            }`}
          />
        </div>
      )}
      
      <div
        className={`
          max-w-[85%] sm:max-w-[85%] p-2 sm:p-4 font-pixel text-[10px] sm:text-sm leading-relaxed
          ${getMessageStyles()}
          ${isBossBattle ? 'backdrop-blur-sm' : ''}
        `}
      >
        {isBot && (
          <div className={`flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 pb-1 sm:pb-2 border-b border-current ${
            isBossBattle ? 'opacity-90' : 'opacity-70'
          }`}>
            <span className="text-[8px] sm:text-xs">
              {isBossBattle ? 'SENTINEL-9' : 'SENTINEL-9'}
            </span>
          </div>
        )}
        {!isBot && (
          <div className={`flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 pb-1 sm:pb-2 border-b border-current ${
            isBossBattle ? 'opacity-90' : 'opacity-70'
          }`}>
            <span className="text-[8px] sm:text-xs">
              {isBossBattle ? '⚔️ YOU' : 'YOU'}
            </span>
          </div>
        )}
        <div className="whitespace-pre-wrap break-words">
          {cleanContent}
        </div>
      </div>
      
      {/* User Avatar (right side for user messages) */}
      {!isBot && (
        <div className="shrink-0">
          <img 
            src={userAvatarUrl}
            alt="You" 
            className={`w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg ${
              isBossBattle ? 'ring-2 ring-orange-400/70' : ''
            }`}
          />
        </div>
      )}
    </div>
  );
}
