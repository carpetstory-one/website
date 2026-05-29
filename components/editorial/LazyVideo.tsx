'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Video sources for the "Making, In Motion" block.
 *
 * The original 6K MP4 is ~90 MB. After re-encoding (see the ffmpeg commands
 * in the perf handoff), drop the optimized files in /public/videos and update
 * the two constants below:
 *   VIDEO_MP4  → '/videos/making.mp4'   (H.264, ~1080p)
 *   VIDEO_WEBM → '/videos/making.webm'  (VP9 — leave '' until the file exists)
 *
 * WebM is listed first so supporting browsers pick it; MP4 is the fallback.
 */
const VIDEO_MP4 = '/videos/Calm_River_23_Apr_6KL-.mp4';
const VIDEO_WEBM = '';

export function LazyVideo({ poster }: { poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);

  // Inject sources only once the section is within ~600px of the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Once sources exist, play/pause with visibility so we don't decode offscreen.
  useEffect(() => {
    if (!load) return;
    const el = ref.current;
    if (!el) return;
    el.load();
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    >
      {load && VIDEO_WEBM && <source src={VIDEO_WEBM} type="video/webm" />}
      {load && <source src={VIDEO_MP4} type="video/mp4" />}
    </video>
  );
}
