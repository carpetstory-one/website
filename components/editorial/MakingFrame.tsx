'use client';

import React from 'react';
import { Reveal } from './Reveal';

export function MakingFrame({
  src,
  alt,
  caption,
  className = '',
  phClass = 'ph-1',
}: {
  src: string;
  alt: string;
  caption: string;
  className?: string;
  phClass?: string;
}) {
  return (
    <Reveal className={`making-frame relative ${className}`}>
      <div className={`ph ${phClass}`}>
        <div className="label-tag">{caption}</div>
        <img 
          src={src} 
          alt={alt} 
          loading="lazy" 
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000"
          onLoad={(e) => {
            (e.target as HTMLImageElement).style.opacity = '1';
          }}
        />
      </div>
    </Reveal>
  );
}
