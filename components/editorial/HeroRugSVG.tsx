import React from 'react';

export function HeroRugSVG() {
  return (
    <svg className="hero-rug-svg" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="warp" width="3" height="3" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="3" stroke="#1A1817" strokeWidth="0.3" opacity="0.5"/>
        </pattern>
        <pattern id="weft" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="0.5" fill="#6E1F23" opacity="0.4"/>
        </pattern>
        <radialGradient id="sunwash" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#6E1F23" stopOpacity="0.04"/>
          <stop offset="60%" stopColor="#C9B89A" stopOpacity="0.02"/>
          <stop offset="100%" stopColor="#F5F1EA" stopOpacity="0"/>
        </radialGradient>
      </defs>

      <rect x="120" y="80" width="960" height="540" fill="none" stroke="#1A1817" strokeWidth="1" opacity="0.85"
            strokeDasharray="3000" strokeDashoffset="3000"
            style={{ animation: 'drawFrame 2.8s var(--ease-out) 0.3s forwards' }}/>
      <rect x="140" y="100" width="920" height="500" fill="none" stroke="#1A1817" strokeWidth="0.5" opacity="0.4"
            strokeDasharray="2900" strokeDashoffset="2900"
            style={{ animation: 'drawFrame 2.6s var(--ease-out) 0.5s forwards' }}/>

      <rect x="140" y="100" width="920" height="500" fill="url(#warp)" opacity="0"
            style={{ animation: 'fadeRug 2s var(--ease-out) 1.6s forwards, shimmerWarp 9s var(--ease) 3.6s infinite' }}/>
      <rect x="140" y="100" width="920" height="500" fill="url(#weft)" opacity="0"
            style={{ animation: 'fadeRug 2s var(--ease-out) 2s forwards, breatheWeft 11s var(--ease) 4s infinite' }}/>
      <rect x="140" y="100" width="920" height="500" fill="url(#sunwash)" opacity="0"
            style={{ animation: 'fadeRug 2s var(--ease-out) 3s forwards, sunDrift 14s linear 5s infinite', transformOrigin: 'center' }}/>

      <g id="hero-medallion" className="parallax-layer" data-depth="0.04" style={{ transformOrigin: '600px 350px', transformBox: 'fill-box', opacity: 0, animation: 'medallionIn 2.5s var(--ease-out) 1.8s forwards, medallionBreathe 8s var(--ease) 4.3s infinite' }}>
        <ellipse cx="600" cy="350" rx="180" ry="120" fill="none" stroke="#6E1F23" strokeWidth="1.2" opacity="0.8"/>
        <ellipse cx="600" cy="350" rx="155" ry="100" fill="none" stroke="#6E1F23" strokeWidth="0.8" opacity="0.6"/>
        <ellipse cx="600" cy="350" rx="130" ry="82" fill="#6E1F23" opacity="0.06"/>
        <path d="M 600 285 L 670 350 L 600 415 L 530 350 Z" fill="none" stroke="#6E1F23" strokeWidth="1" opacity="0.7"/>
        <path d="M 600 305 L 650 350 L 600 395 L 550 350 Z" fill="#6E1F23" opacity="0.18"/>
        <circle cx="600" cy="350" r="14" fill="#6E1F23" opacity="0.7"/>
        <circle cx="600" cy="350" r="6" fill="#1A1817"/>
        <circle cx="600" cy="200" r="4" fill="#6E1F23" opacity="0.5"/>
        <circle cx="600" cy="500" r="4" fill="#6E1F23" opacity="0.5"/>
        <circle cx="400" cy="350" r="4" fill="#6E1F23" opacity="0.5"/>
        <circle cx="800" cy="350" r="4" fill="#6E1F23" opacity="0.5"/>
      </g>

      <g className="parallax-layer" data-depth="0.025" opacity="0" style={{ animation: 'fadeRug 2s var(--ease-out) 2.3s forwards' }}>
        <path d="M 175 135 L 215 135 L 215 145 L 185 145 L 185 175 L 175 175 Z" fill="#6E1F23" opacity="0.55"/>
        <path d="M 1025 135 L 985 135 L 985 145 L 1015 145 L 1015 175 L 1025 175 Z" fill="#6E1F23" opacity="0.55"/>
        <path d="M 175 565 L 215 565 L 215 555 L 185 555 L 185 525 L 175 525 Z" fill="#6E1F23" opacity="0.55"/>
        <path d="M 1025 565 L 985 565 L 985 555 L 1015 555 L 1015 525 L 1025 525 Z" fill="#6E1F23" opacity="0.55"/>
      </g>

      <g opacity="0" style={{ animation: 'fadeRug 2s var(--ease-out) 2.5s forwards' }}>
        <line x1="240" y1="118" x2="960" y2="118" stroke="#1A1817" strokeWidth="0.4" strokeDasharray="4 6" opacity="0.5"/>
        <line x1="240" y1="582" x2="960" y2="582" stroke="#1A1817" strokeWidth="0.4" strokeDasharray="4 6" opacity="0.5"/>
      </g>

      <g opacity="0" style={{ animation: 'fadeRug 1.6s var(--ease-out) 2.7s forwards' }}>
        <line x1="240" y1="220" x2="320" y2="220" stroke="#6E1F23" strokeWidth="0.6" opacity="0.4"/>
        <line x1="880" y1="220" x2="960" y2="220" stroke="#6E1F23" strokeWidth="0.6" opacity="0.4"/>
        <line x1="240" y1="480" x2="320" y2="480" stroke="#6E1F23" strokeWidth="0.6" opacity="0.4"/>
        <line x1="880" y1="480" x2="960" y2="480" stroke="#6E1F23" strokeWidth="0.6" opacity="0.4"/>
      </g>

      <g className="parallax-layer" data-depth="0.07" opacity="0" style={{ animation: 'fadeRug 3s var(--ease-out) 3.2s forwards' }}>
        <circle cx="0" cy="0" r="1.6" fill="#6E1F23" opacity="0.5" style={{ animation: 'mote1 18s linear infinite' }}/>
        <circle cx="0" cy="0" r="1" fill="#1A1817" opacity="0.45" style={{ animation: 'mote2 22s linear infinite' }}/>
        <circle cx="0" cy="0" r="1.3" fill="#8B7355" opacity="0.55" style={{ animation: 'mote3 26s linear infinite' }}/>
        <circle cx="0" cy="0" r="0.8" fill="#6E1F23" opacity="0.4" style={{ animation: 'mote4 20s linear infinite' }}/>
        <circle cx="0" cy="0" r="1.1" fill="#1A1817" opacity="0.35" style={{ animation: 'mote5 24s linear infinite' }}/>
        <circle cx="0" cy="0" r="0.9" fill="#8B7355" opacity="0.5" style={{ animation: 'mote6 28s linear infinite' }}/>
      </g>
    </svg>
  );
}
