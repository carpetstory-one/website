'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { LocaleSwitcher } from './LocaleSwitcher';
import { BrandLogo } from './BrandLogo';

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

const WHATSAPP_HREF = 'https://wa.me/919876543210';

// Primary nav destinations — single source of truth for desktop links + the
// mobile overlay menu so the two can never drift apart.
const NAV_LINKS = [
  { href: '/collection', key: 'collection' },
  { href: '/rugs', key: 'rugs' },
  { href: '/journal', key: 'journal' },
  { href: '/trade', key: 'trade' },
] as const;

export function Nav() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Resolve a label, tolerating message catalogs that don't yet have the key
  // (e.g. the new "rugs" link) — falls back to a sensible English default.
  const label = (key: string, fallback: string) => {
    const value = t(key as any);
    return value === `Nav.${key}` || value === key ? fallback : value;
  };

  // On the home page the nav stays transparent + light over the full-bleed
  // dark hero, then turns solid (cream/ink) once the hero is nearly scrolled
  // past. Elsewhere it goes solid almost immediately.
  useEffect(() => {
    const onScroll = () => {
      const threshold = isHome ? Math.max(window.innerHeight - 100, 200) : 24;
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isHome]);

  // Close the menu on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Body scroll-lock + ESC-to-close + focus management while the menu is open.
  useEffect(() => {
    if (!menuOpen) return;

    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    // Move focus into the panel for keyboard users.
    const firstLink = panelRef.current?.querySelector<HTMLElement>('a, button');
    firstLink?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      // Simple focus trap.
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      body.style.overflow = prevOverflow;
      // Return focus to the trigger.
      burgerRef.current?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        id="nav"
        aria-label="Primary"
        className={`${isHome ? 'nav--home' : ''} ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'is-open' : ''}`}
      >
        <a
          href="/"
          className="brand"
          aria-label="Carpetstory"
          suppressHydrationWarning
        >
          <BrandLogo size="sm" />
        </a>

        <div className="nav-right flex items-center gap-3 sm:gap-5 lg:gap-7">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-trade link hidden sm:inline-block"
            >
              {label(l.key, l.key[0].toUpperCase() + l.key.slice(1))}
            </Link>
          ))}
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp magnetic flex"
            aria-label={`${label('whatsapp', 'WhatsApp')} — opens in new tab`}
            suppressHydrationWarning
          >
            <WhatsAppIcon />
            <span className="hidden sm:inline">
              {label('whatsapp', 'WhatsApp')}
            </span>
          </a>
          <LocaleSwitcher />

          {/* Mobile burger — visible below the `sm` breakpoint only. */}
          <button
            ref={burgerRef}
            type="button"
            className={`nav-burger sm:hidden ${menuOpen ? 'is-open' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="nav-burger-line" />
            <span className="nav-burger-line" />
          </button>
        </div>
      </nav>

      {/* Full-screen editorial overlay menu (mobile). */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`mobile-menu ${menuOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!menuOpen}
        data-lenis-prevent
      >
        <nav className="mobile-menu-links" aria-label="Mobile">
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="mobile-menu-link"
              style={{ transitionDelay: `${0.06 + i * 0.05}s` }}
              onClick={() => setMenuOpen(false)}
            >
              {label(l.key, l.key[0].toUpperCase() + l.key.slice(1))}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
