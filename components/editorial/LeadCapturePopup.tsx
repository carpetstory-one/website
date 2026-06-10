'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Inquiry } from './Inquiry';
import { analytics } from '@/lib/analytics';

/* ── localStorage / sessionStorage keys ────────────────────────── */
const LS_SUBMITTED = 'submittedInquiryForm';
const LS_DONT_SHOW = 'emailPopupDontShowAgain';
const SS_SHOWN_THIS_SESSION = 'leadPopupShownThisSession';

/* ── Framer Motion variants ────────────────────────────────────── */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.65, 0, 0.35, 1] as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] as const },
  },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.05,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 16,
    transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] as const },
  },
};

/* ── Component ─────────────────────────────────────────────────── */
export function LeadCapturePopup() {
  const t = useTranslations('LeadCapturePopup');
  const [isOpen, setIsOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  /* Show popup after 8–10 s, once per session, unless suppressed */
  useEffect(() => {
    // Guard: SSR / storage unavailable
    if (typeof window === 'undefined') return;

    try {
      if (
        localStorage.getItem(LS_SUBMITTED) === 'true' ||
        localStorage.getItem(LS_DONT_SHOW) === 'true' ||
        sessionStorage.getItem(SS_SHOWN_THIS_SESSION) === 'true'
      ) {
        return; // don't show
      }
    } catch {
      return; // storage blocked (e.g. Safari incognito)
    }

    // Random delay between 8 000 ms and 10 000 ms
    const delay = 8000 + Math.random() * 2000;
    const timer = setTimeout(() => {
      setIsOpen(true);
      try {
        sessionStorage.setItem(SS_SHOWN_THIS_SESSION, 'true');
      } catch {
        /* ignore */
      }
      analytics.popupShown();
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  /* ── Handlers ──────────────────────────────────────────────── */
  const close = useCallback(() => {
    setIsOpen(false);
    analytics.popupClosed();
  }, []);

  const handleDontShowAgain = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(LS_DONT_SHOW, 'true');
    } catch {
      /* ignore */
    }
    analytics.popupDontShowAgain();
  }, []);

  const handleFormSuccess = useCallback(() => {
    try {
      localStorage.setItem(LS_SUBMITTED, 'true');
    } catch {
      /* ignore */
    }
    setHasSubmitted(true);
    analytics.popupFormSubmitted();
    // Auto-close after showing success for a moment
    setTimeout(() => setIsOpen(false), 3500);
  }, []);

  /* Keyboard: close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  /* Lock body scroll while open — use position:fixed to prevent
     Lenis smooth-scroll from moving the background page. */
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    const prev = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
    };
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.left = prev.left;
      document.body.style.right = prev.right;
      document.body.style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="lead-popup-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={close}
          aria-modal="true"
          role="dialog"
          aria-label={t('headline')}
        >
          <motion.div
            className="lead-popup-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            {/* ── Close button ─────────────────────────────── */}
            <button
              className="lead-popup-close"
              onClick={close}
              aria-label={t('close')}
              type="button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* ── Offer banner ──────────────────────────────── */}
            <div className="lead-popup-offer">
              <span className="lead-popup-eyebrow">{t('eyebrow')}</span>
              <h2 className="lead-popup-headline">{t('headline')}</h2>
              <p className="lead-popup-description">{t('description')}</p>
            </div>

            {/* ── Decorative divider ───────────────────────── */}
            <div className="lead-popup-divider" aria-hidden="true" />

            {/* ── Form or success message ───────────────────── */}
            {hasSubmitted ? (
              <div className="lead-popup-success" role="status" aria-live="polite">
                <div className="lead-popup-success-check">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="lead-popup-success-title">{t('successTitle')}</h3>
                <p className="lead-popup-success-body">{t('successBody')}</p>
              </div>
            ) : (
              <div className="lead-popup-form-wrapper">
                <Inquiry onSuccess={handleFormSuccess} />
              </div>
            )}

            {/* ── Don't show again ──────────────────────────── */}
            {!hasSubmitted && (
              <div className="lead-popup-footer">
                <button
                  className="lead-popup-dont-show"
                  onClick={handleDontShowAgain}
                  type="button"
                >
                  {t('dontShowAgain')}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
