'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useShortlist } from './ShortlistProvider';

export function SharedShortlistBanner() {
  const { isSharedView, count, openDrawer, dismissSharedView, hydrated } =
    useShortlist();
  const [bannerVisible, setBannerVisible] = useState(false);

  // Show the announcement banner for ~6s when a shared shortlist is received.
  useEffect(() => {
    if (!isSharedView) {
      setBannerVisible(false);
      return;
    }
    setBannerVisible(true);
    const id = setTimeout(() => setBannerVisible(false), 6000);
    return () => clearTimeout(id);
  }, [isSharedView]);

  if (!hydrated) return null;

  return (
    <>
      {/* Transient announcement banner */}
      <AnimatePresence>
        {bannerVisible && count > 0 && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            style={{ backgroundColor: 'var(--ink)', color: 'var(--canvas)' }}
            className="fixed left-1/2 top-[84px] z-[95] flex max-w-[90vw] -translate-x-1/2 items-center gap-3 rounded-full px-5 py-3 text-[13px] shadow-lg"
          >
            <span>
              Someone shared {count} {count === 1 ? 'piece' : 'pieces'} with you.
            </span>
            <button
              type="button"
              onClick={openDrawer}
              className="shrink-0 underline underline-offset-4"
            >
              View shortlist
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent "viewing a shared selection" chip */}
      <AnimatePresence>
        {isSharedView && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            style={{
              backgroundColor: 'var(--canvas)',
              color: 'var(--ink-soft)',
              border: '1px solid var(--ink-faint)',
            }}
            className="fixed bottom-6 left-6 z-[85] flex items-center gap-2 rounded-full px-3 py-2 shadow-sm"
          >
            <span className="text-[10px] uppercase tracking-[0.16em]">
              Viewing a shared selection
            </span>
            <button
              type="button"
              onClick={dismissSharedView}
              aria-label="Dismiss shared selection notice"
              className="flex h-4 w-4 items-center justify-center transition-colors hover:text-accent"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
