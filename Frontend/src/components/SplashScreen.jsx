import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fade-out animation after 1200ms (1.2 seconds)
    const timer = setTimeout(() => {
      setIsFading(true);
      // Completely unmount after transition completes (300ms)
      const unmountTimer = setTimeout(() => {
        if (onFinish) onFinish();
      }, 300);
      return () => clearTimeout(unmountTimer);
    }, 1200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-300 select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center space-y-6 animate-pulse">
        {/* Logo Graphic (Option 2: Hexagon + Checklist + Checkmark) */}
        <div className="relative w-68 h-48 flex items-center justify-center">
          <svg className="w-full h-full drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>
            
            {/* Hexagon Outline */}
            <path 
              d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" 
              stroke="url(#hexGradient)" 
              strokeWidth="4" 
              strokeLinejoin="round" 
              fill="#090d16" 
            />

            {/* Checklist Lines & Bullets */}
            <circle cx="33" cy="38" r="4" fill="#06b6d4" />
            <rect x="45" y="35" width="28" height="6" rx="3" fill="#cbd5e1" />

            <circle cx="33" cy="50" r="4" fill="#06b6d4" />
            <rect x="45" y="47" width="22" height="6" rx="3" fill="#cbd5e1" />

            <circle cx="33" cy="62" r="4" fill="#06b6d4" />
            <rect x="45" y="59" width="16" height="6" rx="3" fill="#cbd5e1" />

            {/* Checkmark Badge */}
            <g transform="translate(58, 55)">
              <circle cx="12" cy="12" r="14" fill="#090d16" stroke="#06b6d4" strokeWidth="3" />
              <path d="M6 12L10 16L18 8" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </div>

        {/* Brand Typography */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-black tracking-widest uppercase font-mono text-white">
            TASK<span className="text-cyan-400">QUEUE</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono tracking-widest text-cyan-500/80 uppercase">
            <span>—</span>
            <span>Task Management</span>
            <span>—</span>
          </div>
        </div>
      </div>
    </div>
  );
}