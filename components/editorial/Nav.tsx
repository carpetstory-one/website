'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LocaleSwitcher } from './LocaleSwitcher';

const WhatsAppIcon = ({ className = '' }: { className?: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function Nav() {
  const t = useTranslations('Nav');
  const tc = useTranslations('Common');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const body = document.body;
    if (open) {
      const prev = body.style.overflow;
      body.style.overflow = 'hidden';
      return () => {
        body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navLinks = [
    { href: '/collection', label: t('collection') },
    { href: '/craft', label: t('craft') },
    { href: '/heritage', label: t('heritage') },
    { href: '/journal', label: t('journal') },
    { href: '/trade', label: t('trade') },
    { href: '/inquiry', label: t('inquiry') },
  ];

  return (
    <>
      <nav id="nav" aria-label="Primary">
        <Link href="/" className="brand" aria-label={t('brand')}>
          {t('brand')}
        </Link>

        <div className="nav-right hidden md:flex">
          <Link href="/trade" className="nav-trade link">
            {t('trade')}
          </Link>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp magnetic"
            aria-label={`${t('whatsapp')} — opens in new tab`}
          >
            <WhatsAppIcon />
            {t('whatsapp')}
          </a>
          <LocaleSwitcher />
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t('openMenu')}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2"
        >
          <span className="sr-only">{t('openMenu')}</span>
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
            <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="7" x2="22" y2="7" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={tc('menu')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as any }}
            className="md:hidden fixed inset-0 z-[200] bg-[var(--canvas)] flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(26,24,23,0.08)]">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="font-display text-[22px] tracking-[-0.02em]"
              >
                {t('brand')}
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t('closeMenu')}
                className="inline-flex items-center justify-center w-11 h-11 -mr-2"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>

            <motion.nav
              aria-label="Mobile"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
              }}
              className="flex-1 flex flex-col px-5 py-8 gap-1 overflow-y-auto"
            >
              {navLinks.map((l) => (
                <motion.div
                  key={l.href}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-4 font-display font-light text-[32px] leading-[1.05] tracking-[-0.02em] text-[var(--ink)] border-b border-[rgba(26,24,23,0.08)]"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}

              <motion.a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                className="mt-6 inline-flex items-center gap-3 py-4 text-[var(--accent)] text-[15px] tracking-[0.04em]"
              >
                <WhatsAppIcon />
                {t('whatsapp')}
              </motion.a>
            </motion.nav>

            <div className="px-5 py-6 border-t border-[rgba(26,24,23,0.08)] flex items-center justify-end">
              <LocaleSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
