'use client';

import { QRCodeSVG } from 'qrcode.react';
import { StarBackground } from '@/components/StarBackground';
import { PixelLogo } from '@/components/PixelLogo';
import { Leaderboard } from '@/components/Leaderboard';

const GAME_URL = 'https://agent-zero.webrix.ai';

export default function TVPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-keen-black my-auto">
      {/* Star Background */}
      <StarBackground />
      
      <div className="w-full max-w-4xl flex flex-col items-center gap-8">
        {/* Title */}
        <div className="text-center animate-pulse-slow">
          <h1 className="text-keen-yellow text-4xl sm:text-5xl md:text-6xl font-pixel mb-2 tracking-wider">
            AGENT
          </h1>
          <h1 className="text-keen-cyan text-5xl sm:text-6xl md:text-7xl font-pixel tracking-widest">
            ZERO
          </h1>
        </div>
        
        {/* User Avatar */}
        <div className="animate-bounce-slow">
          <img 
            src="https://ztespqmrsydpdxtdaytd.supabase.co/storage/v1/object/public/public-webrix/Gemini_Generated_Image_g4wbzvg4wbzvg4wb%201.png" 
            alt="Agent" 
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain rounded-lg"
          />
        </div>
        
        {/* Subtitle */}
        <p className="text-keen-cyan font-pixel text-xs sm:text-sm md:text-base text-center opacity-80">
          A QUEST TO FIND THE ULTIMATE HACKER
        </p>
        <p className="text-keen-green font-pixel text-sm sm:text-base md:text-lg text-center -mt-4">
          HOW FAST CAN YOU NUKE THE REPO?
        </p>
        
        {/* Prize Banner */}
        <div className="border-4 border-keen-magenta bg-keen-darkmagenta px-6 py-3 animate-pulse-slow">
          <p className="text-keen-yellow font-pixel text-sm sm:text-base md:text-lg text-center">
            🏆 WIN THE CHALLENGE - WIN A PRIZE! 🏆
          </p>
        </div>
        
        {/* Main content: QR Code + Leaderboard */}
        <div className="w-full flex flex-col md:flex-row gap-8 items-center md:items-stretch justify-center">
          
          {/* QR Code Section */}
          <div className="flex flex-col items-center">
            <div className="border-4 border-keen-cyan bg-keen-darkblue p-4 sm:p-6">
              <p className="text-keen-cyan font-pixel text-xs sm:text-sm mb-4 text-center">
                SCAN TO PLAY
              </p>
              <div className="bg-white p-3 sm:p-4 rounded flex items-center justify-center">
                <QRCodeSVG 
                  value={GAME_URL}
                  size={180}
                  level="H"
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              </div>
              <p className="text-keen-green font-pixel text-[8px] sm:text-xs mt-4 text-center">
                {GAME_URL.replace('https://', '')}
              </p>
            </div>
          </div>
          
          {/* CTA + Leaderboard Section */}
          <div className="flex flex-col items-center flex-1 max-w-md">
            {/* CTA */}
            <div className="border-4 border-keen-yellow bg-keen-darkblue p-4 mb-4 w-full animate-pulse-slow">
              <p className="text-keen-yellow font-pixel text-lg sm:text-xl md:text-2xl text-center">
                CAN YOU BEAT THEM?
              </p>
            </div>
            
            {/* Leaderboard */}
            <div className="w-full">
              <Leaderboard 
                maxEntries={10}
                showTitle={true}
                titleSize="lg"
                autoRefresh={true}
                refreshInterval={15000}
                mode="top"
              />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <a 
          href="https://webrix.ai?utm_source=aidevconf&utm_medium=demo&utm_campaign=agent_zero"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          <span className="text-keen-gray font-pixel text-xs">POWERED BY</span>
          <PixelLogo className="" />
        </a>
      </div>
    </div>
  );
}
