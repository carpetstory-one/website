'use client';

import React, { useCallback } from 'react';

/**
 * RangeSlider — accessible dual-thumb range, snapping to `step`.
 * Two overlaid native range inputs (the standard a11y-friendly approach).
 */
export function RangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  format: (n: number) => string;
}) {
  const [lo, hi] = value;
  const pct = (n: number) =>
    max === min ? 0 : ((n - min) / (max - min)) * 100;

  const setLo = useCallback(
    (n: number) => onChange([Math.min(n, hi), hi]),
    [hi, onChange]
  );
  const setHi = useCallback(
    (n: number) => onChange([lo, Math.max(n, lo)]),
    [lo, onChange]
  );

  return (
    <div className="rangex">
      <div className="rangex-head">
        <span>{format(lo)}</span>
        <span>{format(hi)}</span>
      </div>
      <div className="rangex-track">
        <div
          className="rangex-fill"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          aria-label="Minimum price"
          onChange={(e) => setLo(Number(e.target.value))}
          className="rangex-input"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          aria-label="Maximum price"
          onChange={(e) => setHi(Number(e.target.value))}
          className="rangex-input"
        />
      </div>
    </div>
  );
}
