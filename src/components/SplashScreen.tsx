/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Luxury Animated Splash Screen for Blousia®
 */

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Progress thread sweep
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 35);

    // Auto dismiss after 2.2 seconds with a smooth fade
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2000);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2300);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-500 select-none ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Brand Aesthetic Background Glows */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[60%] w-[60%] rounded-full bg-radial from-gold-950/20 via-transparent to-transparent blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/4 h-[60%] w-[60%] rounded-full bg-radial from-gold-950/20 via-transparent to-transparent blur-3xl" />
        
        {/* Soft Weaving Silk Vector Thread Animation */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <path 
            d="M -100,200 Q 300,450 800,100 T 1700,500" 
            fill="none" 
            stroke="url(#silk-gradient)" 
            strokeWidth="1.5"
            strokeDasharray="1000"
            className="animate-dash"
            style={{
              strokeDashoffset: 1000,
              animation: "dash 10s linear infinite"
            }}
          />
          <path 
            d="M -50,600 Q 500,150 1100,550 T 1800,200" 
            fill="none" 
            stroke="url(#silk-gradient)" 
            strokeWidth="1"
            strokeDasharray="800"
            className="animate-dash-reverse"
            style={{
              strokeDashoffset: 800,
              animation: "dash-reverse 8s linear infinite"
            }}
          />
          <defs>
            <linearGradient id="silk-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DFB257" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#DFB257" stopOpacity="1" />
              <stop offset="100%" stopColor="#8A6E2D" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Luxury Emblem & Title Container */}
      <div className="relative text-center space-y-6 px-4 max-w-md">
        {/* Emblem */}
        <div className="relative mx-auto h-24 w-24 flex items-center justify-center animate-fadeInScale">
          <div className="absolute inset-0 rounded-full border border-gold-500/30 animate-ping opacity-25" />
          <div className="absolute inset-2 rounded-full border border-gold-500/20 animate-spin" style={{ animationDuration: "12s" }} />
          
          {/* Main Royal Emblem ⚜️ */}
          <span className="text-5xl drop-shadow-[0_0_15px_rgba(223,178,87,0.4)]">⚜️</span>
        </div>

        {/* Text Logo */}
        <div className="space-y-2 animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold tracking-[0.35em] text-white select-none">
            B L O U S I A
          </h1>
          <p className="text-[9px] uppercase tracking-[0.5em] text-gold-400 font-bold">
            Haute Couture Atelier
          </p>
        </div>

        {/* Micro Loader Thread */}
        <div className="w-48 mx-auto h-[1px] bg-white/[0.08] relative overflow-hidden animate-fadeIn" style={{ animationDelay: "500ms" }}>
          <div 
            className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading details */}
        <p className="text-[8px] uppercase tracking-widest text-gray-500 font-mono font-bold select-none animate-pulse">
          Weaving Luxury Saree Blouses... {progress}%
        </p>
      </div>

      {/* Skip Button */}
      <button 
        onClick={handleSkip}
        className="absolute bottom-8 right-8 text-[9px] uppercase tracking-widest text-gray-500 hover:text-gold-400 border border-gray-800 hover:border-gold-500/50 px-3.5 py-1.5 transition-all bg-slate-950/40 backdrop-blur-xs cursor-pointer"
      >
        Skip Intro
      </button>

      {/* Extra custom CSS for silk paths and animations injected inline */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes dash-reverse {
          to {
            stroke-dashoffset: 1600;
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};
