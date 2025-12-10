'use client';

interface PixelLogoProps {
  className?: string;
}

export function PixelLogo({ className = 'h-6' }: PixelLogoProps) {
  return (
    <span className={`font-pixel text-keen-cyan ${className}`}>
      WEBRIX
    </span>
  );
}
