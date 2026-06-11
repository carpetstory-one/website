import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { PER_PAGE } from '@/lib/rugs';
import { useTranslations } from 'next-intl';

/**
 * Instant loading skeleton shown while the server renders the collection
 * (this route is dynamic because filters/pagination live in the URL).
 */
export default function CollectionDetailLoading() {
  const t = useTranslations('RugsPage');
  return (
    <div className="bg-canvas relative flex min-h-screen flex-col">
      <Nav />

      {/* Hero placeholder — same 65vh footprint as the real hero */}
      <div
        aria-hidden="true"
        style={{
          position: 'relative',
          height: '65vh',
          minHeight: '480px',
          overflow: 'hidden',
          backgroundColor: 'var(--canvas-muted, #f0ece3)',
        }}
      />

      <main className="flex-1" style={{ backgroundColor: '#ffffff' }}>
        <div className="rugx-layout">
          <aside className="rugx-sidebar" aria-hidden="true">
            <div className="rugx-filterwrap">
              <span className="rugx-skeleton rugx-skeleton-filter" />
              <span className="rugx-skeleton rugx-skeleton-filter" />
              <span className="rugx-skeleton rugx-skeleton-filter" />
            </div>
          </aside>

          <main className="rugx-main">
            <div className="rugx-grid" aria-busy="true" role="status">
              <span className="sr-only">{t('loading')}</span>
              {Array.from({ length: PER_PAGE }).map((_, i) => (
                <div key={i} className="rugx-card" aria-hidden="true">
                  <span
                    className="rugx-skeleton rugx-skeleton-img"
                    style={{ aspectRatio: '3 / 4' }}
                  />
                  <span className="rugx-skeleton rugx-skeleton-line" />
                  <span className="rugx-skeleton rugx-skeleton-line short" />
                </div>
              ))}
            </div>
          </main>
        </div>
      </main>
      <Footer />
    </div>
  );
}
