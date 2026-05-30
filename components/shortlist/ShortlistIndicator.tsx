'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'motion/react';
import { Bookmark } from 'lucide-react';
import { useShortlist } from './ShortlistProvider';

export function ShortlistIndicator() {
  const { count, openDrawer, hydrated, isDrawerOpen } = useShortlist();
  const controls = useAnimationControls();
  const prev = useRef(0);

  // Quick pulse whenever an item is added (count rises past the first one).
  useEffect(() => {
    if (count > prev.current && prev.current > 0) {
      controls.start({ scale: [1, 1.15, 1], transition: { duration: 0.2 } });
    }
    prev.current = count;
  }, [count, controls]);

  const visible = hydrated && count > 0 && !isDrawerOpen;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="shortlist-indicator"
          type="button"
          onClick={openDrawer}
          aria-label={`Open shortlist (${count} ${
            count === 1 ? 'piece' : 'pieces'
          })`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{ backgroundColor: 'var(--accent)' }}
          className="fixed right-6 bottom-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
        >
          <motion.span
            animate={controls}
            className="relative flex items-center justify-center"
          >
            <Bookmark
              className="h-6 w-6"
              style={{ color: 'var(--canvas)', fill: 'var(--canvas)' }}
              aria-hidden="true"
            />
            <span
              style={{
                backgroundColor: 'var(--canvas)',
                color: 'var(--accent)',
              }}
              className="absolute -top-2.5 -right-2.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-medium tabular-nums"
            >
              {count}
            </span>
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
