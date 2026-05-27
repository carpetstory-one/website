import React from 'react';

/**
 * Phase 2 & 3: BorderBeam uses CSS animations, so it is fully functional here.
 * Relies on .beam-host and .beamTravel keyframes in editorial.css.
 */
export function BorderBeam({
  children,
  delay = '0s',
  className = '',
}: {
  children: React.ReactNode;
  delay?: string;
  className?: string;
}) {
  return (
    <div 
      className={`beam-host ${className}`}
      style={{ '--beam-delay': delay } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
