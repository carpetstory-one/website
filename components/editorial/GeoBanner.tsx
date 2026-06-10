'use client';

/**
 * GeoBanner — suggests switching locale based on the browser's preferred
 * language. Runs entirely on the client: reading request headers here would
 * opt the root layout (and therefore every page) into per-request dynamic
 * rendering, which is what kept the whole site off the CDN edge cache.
 */

import { useSyncExternalStore } from 'react';
import { routing } from '@/i18n/routing';
import { GeoBannerClient } from './GeoBannerClient';

type Locale = (typeof routing.locales)[number];

// Browser language never changes within a session, so a no-op subscription is
// enough; the server snapshot is empty so prerendered HTML stays banner-free.
const subscribe = () => () => {};
const getBrowserLanguage = () =>
  (navigator.languages?.[0] || navigator.language || '')
    .toLowerCase()
    .split('-')[0];
const getServerSnapshot = () => '';

export function GeoBanner({ locale }: { locale: string }) {
  const preferred = useSyncExternalStore(
    subscribe,
    getBrowserLanguage,
    getServerSnapshot
  );

  const suggested =
    preferred !== locale &&
    (routing.locales as readonly string[]).includes(preferred)
      ? (preferred as Locale)
      : null;

  if (!suggested) return null;

  return <GeoBannerClient suggestedLocale={suggested} />;
}
