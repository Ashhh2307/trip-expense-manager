import React from 'react';
import { Link } from 'react-router-dom';

/**
 * TravelWise Brand Logo Icon
 * A clean, minimalist, modern 3D Origami Paper Airplane soaring diagonally.
 * Designed with precise geometric facets, crisp lighting, and rich emerald-to-teal squircle background.
 */
export const LogoIcon = ({ size = 'md', className = '', animated = true }) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
    '2xl': 'w-16 h-16',
  };

  const currentSizeClass = sizeMap[size] || (typeof size === 'string' && size.includes('w-') ? size : 'w-10 h-10');

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-md group ${currentSizeClass} ${className}`}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full transition-transform duration-300 ${animated ? 'group-hover:scale-105 group-hover:-translate-y-0.5' : ''}`}
      >
        <defs>
          {/* Background Emerald-to-Teal Gradient */}
          <linearGradient id="twBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="55%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Top Left Main Wing (Brilliant White to Clean Soft Mint) */}
          <linearGradient id="planeTopWing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>

          {/* Right Wing (Soft Light Shading) */}
          <linearGradient id="planeRightWing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Left Keel Fold (Depth Shadow) */}
          <linearGradient id="planeKeelLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          {/* Right Keel Fold */}
          <linearGradient id="planeKeelRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Realistic Soft 3D Drop Shadow */}
          <filter id="plane3DShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#022c22" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 1. Squircle Base Container */}
        <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#twBgGradient)" />
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="16"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1.5"
        />

        {/* 2. Geometric 3D Origami Paper Plane */}
        <g filter="url(#plane3DShadow)">
          {/* Main Top-Left Wing (Crisp Pure White) */}
          <polygon
            points="53,12 11,32 30,40"
            fill="url(#planeTopWing)"
          />

          {/* Main Right-Bottom Wing (Soft Light Shading) */}
          <polygon
            points="53,12 30,40 39,52"
            fill="url(#planeRightWing)"
          />

          {/* Left Underbody Keel Fin (Deep Origami Fold) */}
          <polygon
            points="18,36 24,49 30,40"
            fill="url(#planeKeelLeft)"
          />

          {/* Right Underbody Keel Fin */}
          <polygon
            points="30,40 34,47 39,52"
            fill="url(#planeKeelRight)"
          />

          {/* Subtle Dorsal Center Crease Highlight */}
          <polygon
            points="53,12 30,40 33,31"
            fill="#FFFFFF"
            fillOpacity="0.9"
          />
        </g>
      </svg>
    </div>
  );
};

/**
 * Full Logo Component with Icon + Typography
 */
const Logo = ({
  size = 'md',
  showText = true,
  showTagline = true,
  taglineText = 'AI Travel & Itinerary Planner',
  asLink = false,
  to = '/ai-chat',
  className = '',
}) => {
  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon size={size} />

      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1 leading-tight">
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base">
              Travel<span className="text-emerald-600 dark:text-emerald-400">Wise</span>
            </span>
          </div>

          {showTagline && (
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide mt-0.5">
              {taglineText}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link
        to={to}
        className="inline-flex items-center hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
