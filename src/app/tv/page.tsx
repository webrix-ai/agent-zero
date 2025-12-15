"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { StarBackground } from "@/components/StarBackground";
import { Leaderboard } from "@/components/Leaderboard";

const GAME_URL = "https://agent-zero.webrix.ai";

// Marquee text repeated for seamless loop
const MARQUEE_TEXT = "🏆 WIN THE CHALLENGE - WIN A PRIZE! 🏆";
const MARQUEE_REPEAT = Array(10).fill(MARQUEE_TEXT).join("     •     ");

export default function TVPage() {
  return (
    <div className="h-screen w-full flex flex-col bg-keen-black overflow-hidden">
      {/* Star Background */}
      <StarBackground />

      {/* Marquee Banner - Top */}
      <div className="w-full border-y-4 border-keen-magenta bg-keen-darkmagenta py-3 relative z-20 overflow-hidden shrink-0">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-keen-yellow font-pixel text-xl lg:text-2xl xl:text-3xl">
            {MARQUEE_REPEAT}
          </span>
          <span className="text-keen-yellow font-pixel text-xl lg:text-2xl xl:text-3xl ml-8">
            {MARQUEE_REPEAT}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex w-full overflow-hidden">
        {/* Left Side - Branding, Image, CTA, QR Code (50%) */}
        <div className="w-1/2 flex flex-col p-6 lg:p-8 relative z-10 overflow-hidden">
          {/* Webrix Logo - Top Left */}
          <div className="mb-4 shrink-0">
            <Image
              src="/images/FullWhiteTransparent.png"
              alt="Webrix"
              width={180}
              height={50}
              className="object-contain"
            />
          </div>

          {/* Main Content - Centered */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 overflow-hidden">
            <div className="flex items-center justify-center">
              {/* User Avatar */}
              <div className="animate-bounce-slow">
                <img
                  src="https://ztespqmrsydpdxtdaytd.supabase.co/storage/v1/object/public/public-webrix/Gemini_Generated_Image_g4wbzvg4wbzvg4wb%201.png"
                  alt="Agent"
                  className="w-36 h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52 object-contain rounded-lg"
                />
              </div>
              {/* Title */}
              <div className="text-center animate-pulse-slow">
                <h1 className="text-keen-yellow text-5xl lg:text-6xl xl:text-7xl font-pixel mb-1 tracking-wider">
                  AGENT
                </h1>
                <h1 className="text-keen-cyan text-6xl lg:text-7xl xl:text-8xl font-pixel tracking-widest">
                  ZERO
                </h1>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-keen-cyan font-pixel text-sm lg:text-base text-center opacity-80">
              A QUEST TO FIND THE ULTIMATE HACKER
            </p>
            <p className="text-keen-green font-pixel text-base lg:text-lg text-center -mt-2">
              HOW FAST CAN YOU NUKE THE REPO?
            </p>

            {/* QR Code Section - Prominent for TV scanning */}
            <div className="border-4 border-keen-cyan bg-keen-darkblue p-4 lg:p-6">
              <p className="text-keen-cyan font-pixel text-base lg:text-lg mb-4 text-center">
                SCAN TO PLAY
              </p>
              <div className="bg-white p-3 lg:p-4 rounded flex items-center justify-center">
                <QRCodeSVG
                  value={GAME_URL}
                  size={220}
                  level="H"
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              </div>
              <p className="text-keen-green font-pixel text-xs lg:text-sm mt-4 text-center">
                {GAME_URL.replace("https://", "")}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Leaderboard (50%) */}
        <div className="w-1/2 flex flex-col p-6 lg:p-8 relative z-10 my-auto">
          {/* CTA Header */}
          <div className="border-4 border-keen-yellow bg-keen-darkblue p-4 lg:p-6 mb-4 animate-pulse-slow shrink-0">
            <p className="text-keen-yellow font-pixel text-2xl lg:text-3xl xl:text-4xl text-center">
              CAN YOU BEAT THEM?
            </p>
          </div>

          {/* Leaderboard - Takes remaining space */}
          <div className="flex-1">
            <Leaderboard
              maxEntries={10}
              showTitle={true}
              titleSize="lg"
              autoRefresh={true}
              refreshInterval={10000}
              mode="top"
            />
          </div>
        </div>
      </div>

      {/* Marquee Banner - Bottom */}
      <div className="w-full border-y-4 border-keen-magenta bg-keen-darkmagenta py-3 relative z-20 overflow-hidden shrink-0">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-keen-yellow font-pixel text-xl lg:text-2xl xl:text-3xl">
            {MARQUEE_REPEAT}
          </span>
          <span className="text-keen-yellow font-pixel text-xl lg:text-2xl xl:text-3xl ml-8">
            {MARQUEE_REPEAT}
          </span>
        </div>
      </div>

      {/* Marquee Animation Styles */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 45s linear infinite;
        }
      `}</style>
    </div>
  );
}
