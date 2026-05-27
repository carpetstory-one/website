'use client';

import { useEffect, useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, routing } from '@/i18n/routing';
import { useParams } from 'next/navigation';

type Locale = (typeof routing.locales)[number];
const COOKIE_DISMISSED = 'cs_geo_dismissed';
const COOKIE_LOCALE = 'NEXT_LOCALE';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[2]) : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function GeoBannerClient({
  suggestedLocale,
  countryName,
}: {
  suggestedLocale: Locale;
  countryName: string;
}) {
  const t = useTranslations('GeoBanner');
  const tLocale = useTranslations('Locale');
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [, startTransition] = useTransition();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getCookie(COOKIE_DISMISSED) === '1') return;
    if (getCookie(COOKIE_LOCALE)) return;
    const id = window.setTimeout(() => setVisible(true), 600);
    return () => window.clearTimeout(id);
  }, []);

  const dismiss = () => {
    setCookie(COOKIE_DISMISSED, '1');
    setVisible(false);
  };

  const accept = () => {
    setCookie(COOKIE_LOCALE, suggestedLocale);
    setCookie(COOKIE_DISMISSED, '1');
    setVisible(false);
    startTransition(() => {
      router.replace(
        { pathname, query: params as Record<string, string> },
        { locale: suggestedLocale }
      );
    });
  };

  const langLabel =
    suggestedLocale === 'de'
      ? tLocale('german')
      : suggestedLocale === 'fr'
      ? tLocale('french')
      : tLocale('english');

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label={t('ariaLabel')}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }}
          className="fixed left-3 right-3 bottom-3 sm:left-6 sm:right-auto sm:bottom-6 z-[300] max-w-[420px] bg-[var(--canvas)] border border-[rgba(26,24,23,0.12)] shadow-[0_24px_48px_-16px_rgba(26,24,23,0.18)] p-5 sm:p-6"
        >
          <p className="text-[14px] leading-[1.5] text-[var(--ink)] mb-4">
            {t('message', { country: countryName })}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={accept}
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 bg-[var(--accent)] text-[var(--canvas)] text-[12px] uppercase tracking-[0.12em] font-medium hover:bg-[var(--ink)] transition-colors"
            >
              {langLabel}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 text-[12px] uppercase tracking-[0.12em] font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
            >
              {t('dismiss')}
            </button>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label={t('dismiss')}
            className="absolute top-2 right-2 w-9 h-9 inline-flex items-center justify-center text-[var(--ink-soft)] hover:text-[var(--ink)]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" />
              <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
