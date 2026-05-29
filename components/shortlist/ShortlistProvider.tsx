'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname } from '@/i18n/routing';
import { analytics } from '@/lib/analytics';
import { debounce, replaceUrlParam } from '@/lib/url';
import {
  parseShortlistParam,
  readStoredShortlist,
  serializeShortlist,
  writeStoredShortlist,
  SHORTLIST_LIMIT,
  SHORTLIST_PARAM,
  type ShortlistItem,
} from '@/lib/shortlist';

type Notice = { key: number; message: string };

type ShortlistContextValue = {
  shortlist: ShortlistItem[];
  count: number;
  hydrated: boolean;
  isInShortlist: (collectionSlug: string, rugSlug: string) => boolean;
  add: (collectionSlug: string, rugSlug: string) => void;
  remove: (collectionSlug: string, rugSlug: string) => void;
  toggle: (collectionSlug: string, rugSlug: string) => void;
  clear: () => void;
  // Drawer
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  // Shared-view mode (URL carried a shortlist on first load)
  isSharedView: boolean;
  dismissSharedView: () => void;
  // Transient toast
  notice: Notice | null;
  notify: (message: string) => void;
};

const ShortlistContext = createContext<ShortlistContextValue | null>(null);

export function useShortlist(): ShortlistContextValue {
  const ctx = useContext(ShortlistContext);
  if (!ctx) {
    throw new Error('useShortlist must be used within a ShortlistProvider');
  }
  return ctx;
}

const has = (items: ShortlistItem[], cs: string, rs: string) =>
  items.some((i) => i.collectionSlug === cs && i.rugSlug === rs);

export function ShortlistProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [items, setItems] = useState<ShortlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  // ── Hydration: a ?shortlist= in the URL wins over localStorage (this is
  //    exactly how a shared link makes the recipient see the sender's set).
  useEffect(() => {
    const fromUrl = parseShortlistParam(
      new URLSearchParams(window.location.search).get(SHORTLIST_PARAM)
    );
    if (fromUrl.length > 0) {
      setItems(fromUrl);
      writeStoredShortlist(fromUrl); // URL overwrites localStorage
      setIsSharedView(true);
      analytics.sharedShortlistReceived(fromUrl.length);
    } else {
      setItems(readStoredShortlist());
    }
    setHydrated(true);
    // Intentionally run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Persist to URL + localStorage in lockstep (debounced 200ms). Re-runs on
  //    navigation so the shortlist param re-attaches to each new page's URL,
  //    keeping the link shareable from anywhere on the site.
  const persist = useRef(
    debounce((value: string) => {
      replaceUrlParam(SHORTLIST_PARAM, value || null);
    }, 200)
  ).current;

  useEffect(() => {
    if (!hydrated) return;
    writeStoredShortlist(items);
    persist(serializeShortlist(items));
  }, [items, hydrated, pathname, persist]);

  useEffect(() => () => persist.cancel(), [persist]);

  // ── Back/forward: adopt the shortlist encoded in the history entry.
  useEffect(() => {
    const onPopState = () => {
      const fromUrl = parseShortlistParam(
        new URLSearchParams(window.location.search).get(SHORTLIST_PARAM)
      );
      if (fromUrl.length > 0) setItems(fromUrl);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // ── Toast auto-dismiss.
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(id);
  }, [notice]);

  const notify = useCallback((message: string) => {
    setNotice({ key: Date.now(), message });
  }, []);

  const isInShortlist = useCallback(
    (cs: string, rs: string) => has(items, cs, rs),
    [items]
  );

  const add = useCallback(
    (cs: string, rs: string) => {
      setIsSharedView(false);
      setItems((prev) => {
        if (has(prev, cs, rs)) return prev;
        if (prev.length >= SHORTLIST_LIMIT) {
          notify(
            `Shortlist limit reached (${SHORTLIST_LIMIT} pieces). Remove some to add more.`
          );
          return prev;
        }
        analytics.shortlistAdded(cs, rs);
        return [...prev, { collectionSlug: cs, rugSlug: rs }];
      });
    },
    [notify]
  );

  const remove = useCallback((cs: string, rs: string) => {
    setIsSharedView(false);
    setItems((prev) => {
      if (!has(prev, cs, rs)) return prev;
      analytics.shortlistRemoved(cs, rs);
      return prev.filter((i) => !(i.collectionSlug === cs && i.rugSlug === rs));
    });
  }, []);

  const toggle = useCallback(
    (cs: string, rs: string) => {
      if (has(items, cs, rs)) remove(cs, rs);
      else add(cs, rs);
    },
    [items, add, remove]
  );

  const clear = useCallback(() => {
    setIsSharedView(false);
    setItems([]);
  }, []);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
    analytics.shortlistDrawerOpened();
  }, []);

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const dismissSharedView = useCallback(() => setIsSharedView(false), []);

  const value = useMemo<ShortlistContextValue>(
    () => ({
      shortlist: items,
      count: items.length,
      hydrated,
      isInShortlist,
      add,
      remove,
      toggle,
      clear,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      isSharedView,
      dismissSharedView,
      notice,
      notify,
    }),
    [
      items,
      hydrated,
      isInShortlist,
      add,
      remove,
      toggle,
      clear,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      isSharedView,
      dismissSharedView,
      notice,
      notify,
    ]
  );

  return (
    <ShortlistContext.Provider value={value}>
      {children}
    </ShortlistContext.Provider>
  );
}
