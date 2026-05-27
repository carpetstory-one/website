import React from 'react';
import { pressLogos } from '@/lib/press';

export function Marquee() {
  return (
    <section className="py-10 bg-accent text-canvas relative z-10 overflow-hidden flex items-center border-y border-ink-faint">
      <div className="flex w-[200%] marquee-content">
        {/* Render twice for continuous loop */}
        <div className="flex w-1/2 justify-around items-center px-4">
          {pressLogos.map((item, idx) => (
            <span 
              key={`a-${idx}`} 
              className={`text-[16px] md:text-[22px] tracking-[-0.01em] whitespace-nowrap px-8 ${item.italic ? 'font-display italic' : 'font-body font-medium'}`}
            >
              {item.name}
            </span>
          ))}
        </div>
        <div className="flex w-1/2 justify-around items-center px-4" aria-hidden="true">
          {pressLogos.map((item, idx) => (
            <span 
              key={`b-${idx}`} 
              className={`text-[16px] md:text-[22px] tracking-[-0.01em] whitespace-nowrap px-8 ${item.italic ? 'font-display italic' : 'font-body font-medium'}`}
            >
              {item.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
