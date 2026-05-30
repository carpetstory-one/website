import React from 'react';
import { LazyVideo } from './LazyVideo';

const VIDEO_POSTER =
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&q=60&auto=format&fit=crop';

export function ImmersiveVideo() {
  return (
    <section className="immersive" id="immersive">
      <div className="immersive-sticky">
        <div className="immersive-bg" id="immersive-bg"></div>
        <div className="immersive-title">
          <span
            className="word"
            id="imm-word-1"
            style={{ '--imm-tx': '0px' } as React.CSSProperties}
          >
            Eight months.
          </span>
          <span
            className="word it"
            id="imm-word-2"
            style={{ '--imm-tx': '0px' } as React.CSSProperties}
          >
            One pair of hands.
          </span>
        </div>
        <div className="immersive-frame" id="immersive-frame">
          <LazyVideo poster={VIDEO_POSTER} />
        </div>
        <div className="immersive-meta">
          <span className="date">The Making, In Motion</span>
          <span className="scroll-cue" id="imm-cue">
            Scroll to immerse
          </span>
        </div>
      </div>
    </section>
  );
}
