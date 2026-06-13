'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Route-level error boundary for the /rugs listing. Catches failures from the
 * Sanity fetch / pagination render and offers a retry.
 */
export default function RugsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('RugsPage');

  useEffect(() => {
    // Surface for monitoring; the digest links to the server-side log entry.
    console.error('[rugs] failed to load catalogue:', error);
  }, [error]);

  return (
    <div
      className="rugx-error"
      role="alert"
      style={{ backgroundColor: '#ffffff' }}
    >
      <h1 className="rugx-error-title">{t('errorTitle')}</h1>
      <p className="rugx-error-text">{t('errorText')}</p>
      <button type="button" className="rugx-empty-btn" onClick={() => reset()}>
        {t('errorRetry')}
      </button>
    </div>
  );
}
