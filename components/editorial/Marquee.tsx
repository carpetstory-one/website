import React from 'react';
import { pressLogos } from '@/lib/press';

export function Marquee() {
  return (
    <section className="bg-accent text-canvas border-ink-faint relative z-10 flex items-center overflow-hidden border-y py-10">
      <div className="marquee-content flex w-[200%]">
        {/* Render twice for continuous loop */}
        <div className="flex w-1/2 items-center justify-around px-4">
          {pressLogos.map((item, idx) => (
            <span
              key={`a-${idx}`}
              className={`px-8 text-[16px] tracking-[-0.01em] whitespace-nowrap md:text-[22px] ${item.italic ? 'font-display italic' : 'font-body font-medium'}`}
            >
              {item.name}
            </span>
          ))}
        </div>
        <div
          className="flex w-1/2 items-center justify-around px-4"
          aria-hidden="true"
        >
          {pressLogos.map((item, idx) => (
            <span
              key={`b-${idx}`}
              className={`px-8 text-[16px] tracking-[-0.01em] whitespace-nowrap md:text-[22px] ${item.italic ? 'font-display italic' : 'font-body font-medium'}`}
            >
              {item.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
