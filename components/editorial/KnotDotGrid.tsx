import React from 'react';

/**
 * Static dot grid for Knot count sections.
 */
export function KnotDotGrid({
  count,
  className = '',
}: {
  count: 1 | 10 | 100;
  className?: string;
}) {
  const dots = Array.from({ length: count }).map((_, i) => (
    <span key={i} className="d in" /> // Start visible for Phase 2
  ));

  return (
    <div
      className={`dots-${count} ${className}`}
      id={count === 100 ? 'dots-100' : undefined}
    >
      {dots}
    </div>
  );
}
