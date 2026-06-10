'use client';

import { useEffect } from 'react';

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
      <h1 className="rugx-error-title">We couldn’t load the collection.</h1>
      <p className="rugx-error-text">
        Something went wrong while fetching the pieces. Please try again.
      </p>
      <button type="button" className="rugx-empty-btn" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
