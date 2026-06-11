'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import { EstimateTool } from './EstimateTool';
import { useIsMobile } from '@/hooks/useIsMobile';

const EASE = [0.32, 0.72, 0, 1] as const;

export function EstimateDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations('Estimate');
  const panelRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Mobile: slide up as a bottom sheet (matches the filter sheet).
  // Desktop: slide in from the right as a side drawer.
  const slide = isMobile
    ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }
    : { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>('button, a, input')?.focus()
    );
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{ backgroundColor: 'rgba(26,24,23,0.5)' }}
            className="fixed inset-0 z-[110]"
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('drawerTitle')}
            initial={slide.initial}
            animate={slide.animate}
            exit={slide.exit}
            transition={{ duration: 0.4, ease: EASE }}
            className="est-drawer"
            data-lenis-prevent
          >
            <div className="est-drawer-head">
              <div>
                <span className="est-drawer-eyebrow">{t('drawerEyebrow')}</span>
                <h2 className="est-drawer-title">{t('drawerTitle')}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t('drawerClose')}
                className="est-drawer-close"
              >
                ✕
              </button>
            </div>
            <div className="est-drawer-body">
              <EstimateTool source="rugs" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
