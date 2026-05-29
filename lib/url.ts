/**
 * lib/url.ts — Shallow URL query-param updates via the native History API.
 *
 * We deliberately use window.history.replaceState rather than the next-intl /
 * Next.js router's replace(): in the App Router, router.replace() re-runs server
 * components on every call, which would defeat the "client-side only, no server
 * re-render, 60fps" requirements for live filtering and shortlist edits.
 * Next.js patches the History API so useSearchParams() still reflects these
 * changes and back/forward keeps working ("Using the native History API").
 *
 * Both the filter bar and the shortlist provider write through here; each helper
 * merges into the *existing* search string and only touches its own key, so the
 * filter param and the shortlist param never clobber each other. Using
 * window.location.pathname preserves the active locale prefix (/en, /fr, /de).
 */

export function replaceUrlParam(key: string, value: string | null): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (value && value.length > 0) {
    url.searchParams.set(key, value);
  } else {
    url.searchParams.delete(key);
  }
  window.history.replaceState(window.history.state, '', url);
}

type Debounced<Args extends unknown[]> = ((...args: Args) => void) & {
  cancel: () => void;
};

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  ms: number
): Debounced<Args> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, ms);
  };
  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };
  return debounced;
}
