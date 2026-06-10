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
import { parseShortlistParam, itemKey } from '@/lib/shortlist';
import { debounce } from '@/lib/url';
import {
  emptyFilters,
  hasActiveFilters,
  serializeFilters,
  parseFiltersFromParams,
  parsePageParam,
  filterAndSort,
  paginate,
  PER_PAGE,
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
  /** The full, field-trimmed catalogue (~110 rugs). Filtering, sorting and
   *  pagination all run in the browser so the route can stay static/ISR. */
  rugs: FlatRug[];
  facets: Facets;
};

type ViewProps = {
  displayRugs: FlatRug[];
  filters: Filters;
  facets: Facets;
  page: number;
  totalPages: number;
  matchingTotal: number;
  rangeStart: number;
  rangeEnd: number;
  sharedActive: boolean;
  sharedCount: number;
  isPending: boolean;
  update: (patch: Partial<Filters>) => void;
  clearAll: () => void;
  hrefForPage: (page: number) => string;
};

/**
 * Pure presentation for the /rugs page — hero strip, filter sidebar, grid and
 * pagination. Rendered both by RugsContent (live, URL-driven state) and by
 * RugsStatic (default state, used as the Suspense fallback baked into the
 * prerendered HTML), so the two can never drift apart.
 */
function RugsView({
  displayRugs,
  filters,
  facets,
  page,
  totalPages,
  matchingTotal,
  rangeStart,
  rangeEnd,
  sharedActive,
  sharedCount,
  isPending,
  update,
  clearAll,
  hrefForPage,
}: ViewProps) {
  const t = useTranslations('RugsPage');

  const active = hasActiveFilters(filters);

  const countLabel = sharedActive
    ? t('showing', { shown: sharedCount, total: sharedCount })
    : t('range', {
        start: rangeStart,
        end: rangeEnd,
        total: matchingTotal,
      });

  const subtitle = t('subtitle', {
    total: facets.catalogueTotal,
    count: facets.collectionCount,
  });

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

export function RugsContent({ rugs, facets }: Props) {
  const { isSharedView } = useShortlist();

  const router = useRouter();
  const pathname = usePathname(); // locale-less, e.g. "/rugs"
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // The URL stays the single source of truth for committed filter state —
  // shareable links, back/forward and reloads all restore it exactly.
  const urlFilters = useMemo(
    () => parseFiltersFromParams(searchParams),
    [searchParams]
  );
  const urlPage = parsePageParam(searchParams.get('page') ?? undefined);

  // Local mirror of the URL filters so the sidebar and grid react instantly
  // while the debounced URL replace is in flight; re-synced whenever the URL
  // filters change (back/forward navigation, shared links). The render-phase
  // reset pattern (not an effect) keeps it in lockstep without a cascading
  // render.
  const [filters, setFilters] = useState<Filters>(urlFilters);
  const urlKey = serializeFilters(urlFilters);
  const [syncedKey, setSyncedKey] = useState(urlKey);
  if (urlKey !== syncedKey) {
    setSyncedKey(urlKey);
    setFilters(urlFilters);
  }

  // A filter change always lands on page 1, but the ?page= param only catches
  // up after the debounced navigation. While the local filters are ahead of
  // the URL, ignore the stale page from the previous filter state.
  const filtersDirty = serializeFilters(filters) !== urlKey;
  const page = filtersDirty ? 1 : urlPage;

  // Client-side equivalent of the old server pipeline: filter + sort the full
  // catalogue, then cut the current page. ~110 rugs, so this is instant.
  const filtered = useMemo(
    () => filterAndSort(rugs, filters),
    [rugs, filters]
  );
  const pageData = useMemo(
    () => paginate(filtered, page, PER_PAGE),
    [filtered, page]
  );

  // Shared-shortlist view: when the URL carries ?shortlist=, resolve those
  // exact pieces from the loaded catalogue so the shared subset can render.
  const sharedRugs = useMemo(() => {
    const raw = searchParams.get('shortlist') ?? undefined;
    const items = parseShortlistParam(raw);
    if (items.length === 0) return [];
    const keys = new Set(items.map(itemKey));
    return rugs.filter((r) => keys.has(r.id));
  }, [searchParams, rugs]);

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

  // Pagination links reflect the committed (URL) filters, always from page n.
  const hrefForPage = useCallback(
    (targetPage: number) => buildHref(urlFilters, targetPage),
    [buildHref, urlFilters]
  );

  // Filter changes reset to page 1. Debounced + replace() so dragging the
  // price slider or toggling chips quickly doesn't spam the history stack.
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
  // the shared pieces (no pagination). Otherwise show the current page slice.
  const sharedActive = isSharedView && sharedRugs.length > 0;
  const displayRugs = sharedActive ? sharedRugs : pageData.items;

  return (
    <RugsView
      displayRugs={displayRugs}
      filters={filters}
      facets={facets}
      page={pageData.page}
      totalPages={pageData.totalPages}
      matchingTotal={pageData.total}
      rangeStart={pageData.start}
      rangeEnd={pageData.end}
      sharedActive={sharedActive}
      sharedCount={sharedRugs.length}
      isPending={isPending}
      update={update}
      clearAll={clearAll}
      hrefForPage={hrefForPage}
    />
  );
}

/**
 * Suspense fallback for RugsContent. useSearchParams() opts RugsContent out
 * of prerendering, so this is what gets serialized into the static HTML —
 * the identical default view (page 1, curated order, no filters), keeping the
 * first page of the grid fully server-rendered for SEO and LCP. React swaps
 * in the live view at hydration; for parameter-less visits the markup is
 * identical, so nothing visibly changes.
 */
export function RugsStatic({ rugs, facets }: Props) {
  const pathname = usePathname();
  const pageData = paginate(filterAndSort(rugs, emptyFilters()), 1, PER_PAGE);
  const noop = () => {};

  return (
    <RugsView
      displayRugs={pageData.items}
      filters={emptyFilters()}
      facets={facets}
      page={pageData.page}
      totalPages={pageData.totalPages}
      matchingTotal={pageData.total}
      rangeStart={pageData.start}
      rangeEnd={pageData.end}
      sharedActive={false}
      sharedCount={0}
      isPending={false}
      update={noop}
      clearAll={noop}
      hrefForPage={(p) => (p > 1 ? `${pathname}?page=${p}` : pathname)}
    />
  );
}
