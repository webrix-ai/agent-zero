'use client';

interface OptionButtonsProps {
  options: string[];
  onSelect: (option: string) => void;
}

export function OptionButtons({ options, onSelect }: OptionButtonsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option)}
          className="
            w-full p-3 font-pixel text-xs sm:text-sm
            bg-keen-darkblue border-2 border-keen-cyan text-keen-cyan
            hover:bg-keen-cyan hover:text-keen-black
            active:translate-y-0.5
            transition-all duration-150
            text-left
          "
        >
          <span className="text-keen-yellow mr-2">{index + 1}.</span>
          {option}
        </button>
      ))}
    </div>
  );
}
