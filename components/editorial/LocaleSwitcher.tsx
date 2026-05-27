'use client';

import { useTransition, useState, useRef, useEffect } from 'react';
import { usePathname, useRouter, routing, localeLabels } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Locale = (typeof routing.locales)[number];

export function LocaleSwitcher() {
  const t = useTranslations('Locale');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const switchTo = (next: Locale) => {
    if (next === locale) {
      setOpen(false);
      return;
    }
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setOpen(false);
    startTransition(() => {
      router.replace({ pathname, query: params as Record<string, string> }, { locale: next });
    });
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('label')}
        className={`min-h-[44px] min-w-[44px] inline-flex items-center gap-1 px-2 text-[12px] sm:text-[13px] font-medium tracking-[0.02em] transition-opacity ${
          isPending ? 'opacity-50' : 'opacity-100 hover:opacity-70'
        }`}
      >
        <span>{t(locale)}</span>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t('label')}
          className="absolute right-0 top-full mt-2 min-w-[140px] bg-[var(--canvas)] border border-[rgba(26,24,23,0.12)] shadow-[0_8px_24px_-12px_rgba(26,24,23,0.18)] z-50"
        >
          {routing.locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                onClick={() => switchTo(l)}
                className={`w-full text-left px-4 py-3 min-h-[44px] text-[13px] tracking-[0.02em] flex items-center justify-between gap-3 transition-colors hover:bg-[var(--canvas-warm)] ${
                  l === locale ? 'text-[var(--accent)]' : 'text-[var(--ink)]'
                }`}
              >
                <span>{localeLabels[l]}</span>
                <span className="text-[11px] tracking-[0.16em] uppercase opacity-60">
                  {t(l)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
