import React from 'react';

export function ImmersiveVideo() {
  return (
    <section className="immersive" id="immersive">
      <div className="immersive-sticky">
        <div className="immersive-bg" id="immersive-bg"></div>
        <div className="immersive-title">
          <span className="word" id="imm-word-1" style={{ '--imm-tx': '0px' } as React.CSSProperties}>Eight months.</span>
          <span className="word it" id="imm-word-2" style={{ '--imm-tx': '0px' } as React.CSSProperties}>One pair of hands.</span>
        </div>
        <div className="immersive-frame" id="immersive-frame">
          <video src="/videos/Calm_River_23_Apr_6KL-.mp4" autoPlay muted loop playsInline />
        </div>
        <div className="immersive-meta">
          <span className="date">The Making, In Motion</span>
          <span className="scroll-cue" id="imm-cue">Scroll to immerse</span>
        </div>
      </div>
    </section>
  );
}
