import React from 'react';
import { LazyVideo } from './LazyVideo';

const VIDEO_POSTER =
  'https://i.pinimg.com/1200x/63/5e/fd/635efdfe1eb120e2b2a5a1948bfe528e.jpg';

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
