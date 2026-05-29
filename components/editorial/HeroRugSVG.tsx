"use client";

import React from 'react';
import Image from 'next/image';
import { blurDataURL } from '@/lib/blur';

const RUG_IMAGE =
  'https://plus.unsplash.com/premium_photo-1725721362177-d6edc29503f1?q=75&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export function HeroRugSVG() {
  return (
    <div className="hero-rug-frame">
      <div className="hero-rug-outer" aria-hidden="true" />
      <div className="hero-rug-inner">
        <Image
          src={RUG_IMAGE}
          alt="A hand-knotted Persian-pattern rug from the Carpetstory atelier in Jaipur"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 92vw, 70vw"
          placeholder="blur"
          blurDataURL={blurDataURL('#b89a78')}
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Corner brackets */}
      <span className="rug-corner rug-corner-tl" aria-hidden="true" />
      <span className="rug-corner rug-corner-tr" aria-hidden="true" />
      <span className="rug-corner rug-corner-bl" aria-hidden="true" />
      <span className="rug-corner rug-corner-br" aria-hidden="true" />
    </div>
  );
}
