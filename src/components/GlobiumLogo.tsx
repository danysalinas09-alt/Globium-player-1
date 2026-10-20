import React, { useState } from 'react';

interface GlobiumLogoProps {
  className?: string;
  variant?: 'full' | 'mark' | 'horizontal' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light';
  showTagline?: boolean;
}

export const GlobiumLogo: React.FC<GlobiumLogoProps> = ({
  className = '',
  variant = 'horizontal',
  size = 'md',
  theme = 'dark',
  showTagline = true,
}) => {
  const [imgError, setImgError] = useState(false);

  // Exact vector reproduction of the official GLOBIUM "e" brand icon (used for mark / sidebar)
  const renderEMark = (iconSizeClass: string) => (
    <svg
      viewBox="0 0 520 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${iconSizeClass} shrink-0 drop-shadow-[0_2px_8px_rgba(230,0,40,0.25)]`}
      aria-label="GLOBIUM English Logo"
    >
      <defs>
        {/* Left Wing Gradient: Deep Royal Blue -> Rich Purple -> Vibrant Red */}
        <linearGradient id="globium_left_wing" x1="40" y1="230" x2="190" y2="310" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0018c8" />
          <stop offset="35%" stopColor="#2a10a8" />
          <stop offset="65%" stopColor="#791487" />
          <stop offset="100%" stopColor="#e60028" />
        </linearGradient>

        {/* Right Wing Gradient: Vibrant Red -> Rich Purple -> Deep Royal Blue */}
        <linearGradient id="globium_right_wing" x1="290" y1="465" x2="475" y2="245" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e60028" />
          <stop offset="35%" stopColor="#791487" />
          <stop offset="65%" stopColor="#2a10a8" />
          <stop offset="100%" stopColor="#0018c8" />
        </linearGradient>
      </defs>

      {/* Top-Right Red Dot (Head) */}
      <circle cx="396" cy="74" r="35" fill="#e60028" />

      {/* 1. Left Wing: Starts blue at (42, 235), swoops down and right, turns purple to red at (185, 305) */}
      <path
        d="M 42 235 C 75 285, 125 325, 185 305"
        stroke="url(#globium_left_wing)"
        strokeWidth="58"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Main 'e' Loop, Crossbar & Bowl: Pure Vibrant Red */}
      <path
        d="M 185 305
           C 240 275, 275 175, 315 115
           C 355 95, 385 145, 385 215
           C 385 270, 320 280, 205 280
           C 155 335, 185 435, 295 465"
        stroke="#e60028"
        strokeWidth="58"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Right Wing: Starts red at (295, 465), swoops up-right, turns purple to blue at (472, 245) */}
      <path
        d="M 295 465 C 385 485, 445 400, 472 245"
        stroke="url(#globium_right_wing)"
        strokeWidth="58"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Standalone Mark: Uses the uploaded official 'just e' image
  if (variant === 'mark') {
    const markSizes = {
      xs: 'w-7 h-7',
      sm: 'w-9 h-9',
      md: 'w-11 h-11',
      lg: 'w-14 h-14',
      xl: 'w-20 h-20',
    };
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <img
          src="/assets/aistudio/just_e_c489924f.png"
          alt="GLOBIUM English"
          className={`${markSizes[size]} object-contain block`}
          loading="eager"
        />
      </div>
    );
  }

  // Circular Badge with border & backdrop
  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-2xl p-2 bg-white shadow-lg border border-white/60 hover:scale-105 transition-all duration-300 group ${className}`}
        title="GLOBIUM English · Open your world"
      >
        {renderEMark('w-10 h-10 group-hover:scale-105 transition-transform')}
      </div>
    );
  }

  // Official Uploaded Logo Asset for Horizontal & Full variants
  // Uses /assets/aistudio/Globium_English_Logo_434f380d.png
  const imageHeights = {
    xs: 'h-7',
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-11',
    lg: 'h-13 sm:h-14',
    xl: 'h-18 sm:h-20',
  };

  if (!imgError) {
    return (
      <div
        className={`inline-flex items-center bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-md border border-white/70 select-none transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${className}`}
        title="GLOBIUM English · Open your world"
      >
        <img
          src="/assets/aistudio/Globium_English_Logo_434f380d.png"
          alt="GLOBIUM English - Open your world"
          className={`${imageHeights[size]} w-auto object-contain block`}
          onError={() => setImgError(true)}
          loading="eager"
        />
      </div>
    );
  }

  // Fallback if image fails to load
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center shrink-0">
        <div className="absolute inset-0 bg-[#e60028]/25 blur-md rounded-full -z-10" />
        {renderEMark('w-9 h-9')}
      </div>
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-2">
          <span className="font-black tracking-tight text-white text-lg">GLOBIUM</span>
          <span className="font-black rounded-md tracking-wider uppercase text-xs px-2.5 py-0.5 bg-[#e60028] text-white">
            ENGLISH
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-rose-300 mt-1">
            Open your world
          </span>
        )}
      </div>
    </div>
  );
};
