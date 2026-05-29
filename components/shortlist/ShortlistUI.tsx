'use client';

import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'motion/react';
import { useShortlist } from './ShortlistProvider';
import { ShortlistIndicator } from './ShortlistIndicator';
import { SharedShortlistBanner } from './SharedShortlistBanner';

// The drawer is only fetched the first time the user opens it (Part 6 — perf).
const ShortlistDrawer = dynamic(
  () => import('./ShortlistDrawer').then((m) => m.ShortlistDrawer),
  { ssr: false }
);

export function ShortlistUI() {
  const { isDrawerOpen, notice } = useShortlist();

  return (
    <>
      <SharedShortlistBanner />
      <ShortlistIndicator />

      <AnimatePresence>{isDrawerOpen && <ShortlistDrawer />}</AnimatePresence>

      {/* Transient toast (limit reached, link copied, …) */}
      <AnimatePresence>
        {notice && (
          <motion.div
            key={notice.key}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundColor: 'var(--ink)', color: 'var(--canvas)' }}
            className="fixed bottom-6 left-1/2 z-[130] max-w-[90vw] -translate-x-1/2 rounded-full px-5 py-3 text-center text-[13px] shadow-lg"
          >
            {notice.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
