'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

type Props = {
  page: number;
  totalPages: number;
  /** Build a locale-less path+query (e.g. `/rugs?page=2`) for a given page. */
  hrefFor: (page: number) => string;
};

/**
 * Compact page sequence with ellipses: always shows first + last, the current
 * page and its immediate neighbours, e.g. 1 … 4 5 6 … 12.
 */
function pageSequence(current: number, total: number): Array<number | 'gap'> {
  if (total <= 1) return [1];
  const neighbours: number[] = [];
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    neighbours.push(i);
  }
  const out: Array<number | 'gap'> = [1];
  if (neighbours.length && neighbours[0] > 2) out.push('gap');
  out.push(...neighbours);
  if (neighbours.length && neighbours[neighbours.length - 1] < total - 1)
    out.push('gap');
  out.push(total);
  return out;
}

export function Pagination({ page, totalPages, hrefFor }: Props) {
  const t = useTranslations('Pagination');
  if (totalPages <= 1) return null;

  const sequence = pageSequence(page, totalPages);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    // A <div role="navigation"> rather than <nav>: the site's global
    // `nav { position: fixed }` rule would otherwise pin this to the top.
    <div className="rugx-pagination" role="navigation" aria-label={t('label')}>
      {hasPrev ? (
        <Link
          href={hrefFor(page - 1)}
          rel="prev"
          className="rugx-page-arrow"
          aria-label={t('previous')}
        >
          <span aria-hidden="true">←</span>
          <span className="rugx-page-arrow-text">{t('previous')}</span>
        </Link>
      ) : (
        <span className="rugx-page-arrow is-disabled" aria-disabled="true">
          <span aria-hidden="true">←</span>
          <span className="rugx-page-arrow-text">{t('previous')}</span>
        </span>
      )}

      <ol className="rugx-page-list">
        {sequence.map((item, i) =>
          item === 'gap' ? (
            <li key={`gap-${i}`} className="rugx-page-gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              {item === page ? (
                <span className="rugx-page-num is-current" aria-current="page">
                  {item}
                </span>
              ) : (
                <Link
                  href={hrefFor(item)}
                  className="rugx-page-num"
                  aria-label={t('goToPage', { page: item })}
                >
                  {item}
                </Link>
              )}
            </li>
          )
        )}
      </ol>

      {/* Mobile-only compact indicator (page list is hidden < 480px). */}
      <span className="rugx-page-status" aria-hidden="true">
        {t('status', { page, total: totalPages })}
      </span>

      {hasNext ? (
        <Link
          href={hrefFor(page + 1)}
          rel="next"
          className="rugx-page-arrow"
          aria-label={t('next')}
        >
          <span className="rugx-page-arrow-text">{t('next')}</span>
          <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span className="rugx-page-arrow is-disabled" aria-disabled="true">
          <span className="rugx-page-arrow-text">{t('next')}</span>
          <span aria-hidden="true">→</span>
        </span>
      )}
    </div>
  );
}
