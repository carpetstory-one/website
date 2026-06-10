'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { RugCard } from '@/components/rugs/RugCard';
import { RugFilters } from '@/components/rugs/RugFilters';
import { Pagination } from '@/components/rugs/Pagination';
import { useShortlist } from '@/components/shortlist/ShortlistProvider';
import { debounce } from '@/lib/url';
import {
  emptyFilters,
  hasActiveFilters,
  serializeFilters,
  type RugFilters as Filters,
  type FlatRug,
  type Material,
  type Make,
} from '@/lib/rugs';

type Facets = {
  bounds: { min: number; max: number };
  materials: Material[];
  makes: Make[];
  collectionOptions: Array<{ slug: string; name: string }>;
  collectionCount: number;
  catalogueTotal: number;
};

type Props = {
  /** The 24 (or fewer) rugs for the current page — already filtered + sorted server-side. */
  pageRugs: FlatRug[];
  /** Pieces resolved from a ?shortlist= link, for the shared-view overlay. */
  sharedRugs: FlatRug[];
  /** Filters parsed from the URL on the server (source of truth for what's shown). */
  filters: Filters;
  page: number;
  totalPages: number;
  matchingTotal: number;
  rangeStart: number;
  rangeEnd: number;
  facets: Facets;
};

export function RugsContent({
  pageRugs,
  sharedRugs,
  filters: serverFilters,
  page,
  totalPages,
  matchingTotal,
  rangeStart,
  rangeEnd,
  facets,
}: Props) {
  const t = useTranslations('RugsPage');
  const { isSharedView } = useShortlist();

  const router = useRouter();
  const pathname = usePathname(); // locale-less, e.g. "/rugs"
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local mirror of the URL filters so the sidebar reacts instantly while the
  // server round-trip is in flight; re-synced whenever the URL filters change
  // (server response, back/forward navigation). Using the render-phase reset
  // pattern (not an effect) keeps it in lockstep without a cascading render.
  const [filters, setFilters] = useState<Filters>(serverFilters);
  const serverKey = serializeFilters(serverFilters);
  const [syncedKey, setSyncedKey] = useState(serverKey);
  if (serverKey !== syncedKey) {
    setSyncedKey(serverKey);
    setFilters(serverFilters);
  }

  // Build a locale-less path+query, preserving a live ?shortlist= param.
  const buildHref = useCallback(
    (f: Filters, targetPage: number) => {
      const qs = new URLSearchParams(serializeFilters(f));
      const sl = searchParams.get('shortlist');
      if (sl) qs.set('shortlist', sl);
      if (targetPage > 1) qs.set('page', String(targetPage));
      const q = qs.toString();
      return q ? `${pathname}?${q}` : pathname;
    },
    [pathname, searchParams]
  );

  // Pagination links reflect the committed (server) filters, always from page n.
  const hrefForPage = useCallback(
    (targetPage: number) => buildHref(serverFilters, targetPage),
    [buildHref, serverFilters]
  );

  // Filter changes reset to page 1. Debounced + replace() so dragging the price
  // slider or toggling chips quickly doesn't spam the history stack.
  const navigate = useMemo(
    () =>
      debounce((href: string, push: boolean) => {
        startTransition(() => {
          if (push) router.push(href, { scroll: false });
          else router.replace(href, { scroll: false });
        });
      }, 150),
    [router]
  );
  useEffect(() => () => navigate.cancel(), [navigate]);

  const update = useCallback(
    (patch: Partial<Filters>) => {
      setFilters((prev) => {
        const next = { ...prev, ...patch };
        navigate(buildHref(next, 1), false);
        return next;
      });
    },
    [navigate, buildHref]
  );

  const clearAll = useCallback(() => {
    const cleared = emptyFilters();
    setFilters(cleared);
    navigate(buildHref(cleared, 1), false);
  }, [navigate, buildHref]);

  // Shared-view overlay: when the visitor arrived via a shared link, show only
  // the shared pieces (no pagination). Otherwise show the server page slice.
  const sharedActive = isSharedView && sharedRugs.length > 0;
  const displayRugs = sharedActive ? sharedRugs : pageRugs;
  const active = hasActiveFilters(filters);

  const countLabel = sharedActive
    ? t('showing', { shown: sharedRugs.length, total: sharedRugs.length })
    : t('range', {
        start: rangeStart,
        end: rangeEnd,
        total: matchingTotal,
      });

  const subtitle = useMemo(
    () =>
      t('subtitle', {
        total: facets.catalogueTotal,
        count: facets.collectionCount,
      }),
    [t, facets.catalogueTotal, facets.collectionCount]
  );

  return (
    <>
      {/* Compact hero strip */}
      <header className="rugx-hero">
        <span className="rugx-hero-label">{t('eyebrow')}</span>
        <h1 className="rugx-hero-title">{t('title')}</h1>
        <p className="rugx-hero-sub">{subtitle}</p>
      </header>

      {/* Sidebar Layout */}
      <div className="rugx-layout">
        {/* Left Sidebar */}
        <aside className="rugx-sidebar">
          <div className="rugx-filterwrap">
            <RugFilters
              filters={filters}
              update={update}
              matchingCount={matchingTotal}
              onClearAll={clearAll}
              bounds={facets.bounds}
              materials={facets.materials}
              makes={facets.makes}
              collectionOptions={facets.collectionOptions}
            />
          </div>
        </aside>

        {/* Main Content (Grid) */}
        <main className="rugx-main">
          <div className="rugx-results">
            <p className="rugx-count">{countLabel}</p>
            {active && !sharedActive && (
              <button type="button" className="rugx-clear" onClick={clearAll}>
                {t('clearFilters')}
              </button>
            )}
          </div>

          {displayRugs.length === 0 ? (
            <div className="rugx-empty" role="status">
              <p>{t('noRugs')}</p>
              <button
                type="button"
                className="rugx-empty-btn"
                onClick={clearAll}
              >
                {t('clearFilters')}
              </button>
            </div>
          ) : (
            <div
              className={`rugx-grid${isPending ? ' is-pending' : ''}`}
              aria-busy={isPending}
            >
              {displayRugs.map((rug, i) => (
                <RugCard key={rug.id} rug={rug} index={i} eager={i < 6} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Pagination sits full-width below the whole grid, where the products
          end — not inside the product column beside the filter sidebar. */}
      {displayRugs.length > 0 && !sharedActive && (
        <Pagination page={page} totalPages={totalPages} hrefFor={hrefForPage} />
      )}
    </>
  );
}
