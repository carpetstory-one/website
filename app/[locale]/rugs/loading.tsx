import { Nav } from '@/components/editorial/Nav';
import { Footer } from '@/components/editorial/Footer';
import { PER_PAGE } from '@/lib/rugs';

/**
 * Instant loading skeleton shown while the server fetches/paginates the
 * catalogue (initial load and on page navigation).
 */
export default function RugsLoading() {
  return (
    <div className="bg-canvas relative flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1" style={{ backgroundColor: '#ffffff' }}>
        <header className="rugx-hero">
          <span className="rugx-hero-label">All pieces</span>
          <span className="rugx-skeleton rugx-skeleton-title" />
          <span className="rugx-skeleton rugx-skeleton-sub" />
        </header>

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
              <span className="sr-only">Loading pieces…</span>
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
