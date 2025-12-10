'use client';

import { ReactNode } from 'react';

interface GameContainerProps {
  children: ReactNode;
  phase?: string;
  showScanlines?: boolean;
}

export function GameContainer({ children, phase, showScanlines = true }: GameContainerProps) {
  const isAlert = phase === 'security_alert';
  
  return (
    <div className={`
      min-h-screen relative overflow-hidden
      ${isAlert ? 'bg-keen-darkred' : 'bg-keen-black'}
      transition-colors duration-500
    `}>
      {/* CRT Scanlines Overlay */}
      {showScanlines && (
        <div 
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, black 1px, black 2px)',
            backgroundSize: '100% 2px',
          }}
        />
      )}
      
      {/* CRT Vignette */}
      <div 
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.4) 100%)',
        }}
      />
      
      {/* Screen flicker effect (subtle) */}
      <div className="fixed inset-0 pointer-events-none z-30 animate-flicker opacity-[0.02] bg-white" />
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Corner decoration - Webrix logo */}
      <div className="fixed bottom-4 right-4 z-20 opacity-50">
        <span className="font-pixel text-keen-cyan text-xs">WEBRIX</span>
      </div>
    </div>
  );
}
