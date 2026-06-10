'use client';

import { useEffect, useRef, useState } from 'react';
import { SanityImage } from '@/components/SanityImage';
import { motion } from 'motion/react';
import { X, Bookmark } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useShortlist } from './ShortlistProvider';
import { analytics } from '@/lib/analytics';
import { resolveShortlist, serializeShortlist } from '@/lib/shortlist';

const EASE = [0.32, 0.72, 0, 1] as const;

import type { ShortlistCollectionSummary } from '@/lib/shortlist';

export function ShortlistDrawer({
  collections,
}: {
  collections: ShortlistCollectionSummary[];
}) {
  const router = useRouter();
  const { shortlist, count, remove, clear, closeDrawer, notify } =
    useShortlist();

  const [confirmClear, setConfirmClear] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const resolved = resolveShortlist(shortlist, collections);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
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

    // Move focus into the drawer.
    const focusFirst = () => {
      const el = panelRef.current?.querySelector<HTMLElement>(
        'button, a, [tabindex]:not([tabindex="-1"])'
      );
      el?.focus();
    };
    const raf = requestAnimationFrame(focusFirst);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeDrawer();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.left = prev.left;
      document.body.style.right = prev.right;
      document.body.style.width = prev.width;
      window.scrollTo(0, scrollY);
      previouslyFocused.current?.focus?.();
    };
  }, [closeDrawer]);

  const goToRug = (collectionSlug: string, rugSlug: string) => {
    closeDrawer();
    router.push(`/collection/${collectionSlug}/${rugSlug}`);
  };

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('shortlist', serializeShortlist(shortlist));
    try {
      await navigator.clipboard.writeText(url.toString());
      notify('Link copied');
      analytics.shortlistShareLinkCopied(count);
    } catch {
      notify('Could not copy link');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={closeDrawer}
        style={{ backgroundColor: 'rgba(26,24,23,0.5)' }}
        className="fixed inset-0 z-[110]"
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your shortlist"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{ backgroundColor: 'var(--canvas)', color: 'var(--ink)' }}
        className="fixed top-0 right-0 z-[120] flex h-full w-full flex-col sm:w-[380px]"
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-6 pt-7 pb-5"
          style={{ borderBottom: '1px solid var(--ink-faint)' }}
        >
          <div>
            <span
              className="block text-[11px] uppercase"
              style={{ letterSpacing: '0.18em', color: 'var(--ink-soft)' }}
            >
              Your shortlist
            </span>
            <h2
              className="mt-2"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 300,
                fontSize: '30px',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
              }}
            >
              {count} {count === 1 ? 'piece' : 'pieces'} saved.
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close shortlist"
            className="hover:text-accent -mt-1 -mr-2 flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* List */}
        <div
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4"
        >
          {resolved.length === 0 ? (
            <p
              className="mt-6 italic"
              style={{
                fontSize: '14px',
                color: 'var(--ink-soft)',
                lineHeight: 1.6,
              }}
            >
              Your shortlist is empty. Start saving pieces by tapping the
              bookmark icon on any rug.
            </p>
          ) : (
            <ul className="flex flex-col">
              {resolved.map(({ collection, rug }) => (
                <li
                  key={`${collection.slug}.${rug.slug}`}
                  className="flex items-center gap-4 py-3"
                  style={{ borderBottom: '1px solid var(--ink-faint)' }}
                >
                  <button
                    type="button"
                    onClick={() => goToRug(collection.slug, rug.slug)}
                    className="group flex flex-1 items-center gap-4 text-left"
                  >
                    <span
                      className="relative block h-[60px] w-[60px] shrink-0 overflow-hidden"
                      style={{ background: 'var(--canvas-muted, #f0ece3)' }}
                    >
                      {rug.image ? (
                        <SanityImage
                          src={rug.image}
                          alt={rug.name}
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0">
                      <span
                        className="block truncate"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '18px',
                          color: 'var(--ink)',
                        }}
                      >
                        {rug.name}
                      </span>
                      <span
                        className="mt-0.5 block text-[10px] uppercase"
                        style={{
                          letterSpacing: '0.14em',
                          color: 'var(--ink-soft)',
                        }}
                      >
                        {collection.name}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(collection.slug, rug.slug)}
                    aria-label={`Remove ${rug.name} from shortlist`}
                    className="hover:text-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors"
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer actions */}
        {resolved.length > 0 && (
          <div
            className="flex flex-col gap-3 px-6 pt-4 pb-7"
            style={{ borderTop: '1px solid var(--ink-faint)' }}
          >
            <button
              type="button"
              onClick={handleShare}
              className="flex w-full items-center justify-center gap-2 px-6 py-3.5 text-[13px] tracking-[0.12em] uppercase transition-colors"
              style={{ backgroundColor: 'var(--ink)', color: 'var(--canvas)' }}
            >
              <Bookmark className="h-4 w-4 fill-current" aria-hidden="true" />
              Share this shortlist
            </button>

            <button
              type="button"
              onClick={() => {
                analytics.shortlistInquiryInitiated(count);
                closeDrawer();
                router.push(
                  `/contact?shortlist=${serializeShortlist(shortlist)}`
                );
              }}
              className="hover:text-accent w-full px-6 py-3.5 text-center text-[13px] tracking-[0.12em] uppercase transition-colors"
              style={{ border: '1px solid var(--ink)', color: 'var(--ink)' }}
            >
              Inquire about these pieces →
            </button>

            {confirmClear ? (
              <p
                className="text-center text-[12px]"
                style={{ color: 'var(--ink-soft)' }}
              >
                Are you sure?{' '}
                <button
                  type="button"
                  onClick={() => {
                    clear();
                    setConfirmClear(false);
                  }}
                  className="hover:text-accent underline underline-offset-4"
                  style={{ color: 'var(--ink)' }}
                >
                  Yes, clear
                </button>{' '}
                ·{' '}
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="underline underline-offset-4"
                >
                  Cancel
                </button>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="hover:text-accent text-center text-[12px] underline underline-offset-4 transition-colors"
                style={{ color: 'var(--ink-soft)' }}
              >
                Clear shortlist
              </button>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
}
