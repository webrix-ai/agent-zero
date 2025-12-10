'use client';

interface OptionButtonsProps {
  options: string[];
  onSelect: (option: string) => void;
}

export function OptionButtons({ options, onSelect }: OptionButtonsProps) {
  const isSingleOption = options.length === 1;
  
  return (
    <div className="grid grid-cols-1 gap-2">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option)}
          className={`
            w-full p-2 sm:p-3 font-pixel text-[10px] sm:text-xs
            bg-keen-darkblue border-2 border-keen-cyan text-keen-cyan
            hover:bg-keen-cyan hover:text-keen-black
            active:bg-keen-cyan active:text-keen-black
            active:translate-y-0.5
            transition-all duration-150
            text-left
            touch-manipulation
            ${isSingleOption ? 'animate-pulse-button ring-2 ring-keen-yellow ring-offset-2 ring-offset-keen-black' : ''}
          `}
        >
          {isSingleOption && <span className="text-keen-yellow mr-1 sm:mr-2">👆</span>}
          {!isSingleOption && <span className="text-keen-yellow mr-1 sm:mr-2">{index + 1}.</span>}
          {option}
        </button>
      ))}
    </div>
  );
}
