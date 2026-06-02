'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { blurDataURL } from '@/lib/blur';
import { ShortlistToggleButton } from '@/components/shortlist/ShortlistToggleButton';
import type { FlatRug } from '@/lib/rugs';

// Asymmetric sizing — every 3rd card is taller, mirroring the collection grid.
const RATIOS = ['4 / 5', '1 / 1', '3 / 4'] as const;

export function RugCard({
  rug,
  index,
  eager = false,
}: {
  rug: FlatRug;
  index: number;
  eager?: boolean;
}) {
  const ratio = RATIOS[index % RATIOS.length];

  return (
    <article className="rugx-card">
      <ShortlistToggleButton
        collectionSlug={rug.collectionSlug}
        rugSlug={rug.rugSlug}
        rugName={`${rug.collectionName} ${rug.name}`}
      />
      <Link href={rug.href} className="group block">
        <div
          className="rugx-img"
          style={{
            aspectRatio: ratio,
            background: 'var(--canvas-muted, #f0ece3)',
          }}
        >
          <Image
            src={rug.image}
            alt={`${rug.name} — ${rug.collectionName} collection`}
            fill
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : undefined}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            placeholder="blur"
            blurDataURL={blurDataURL()}
            style={{ objectFit: 'cover', transition: 'transform 1.2s ease' }}
            className="group-hover:scale-[1.04]"
          />
        </div>
        <span className="rugx-collection">{rug.collectionName}</span>
        <h3 className="rugx-name">{rug.name}</h3>
      </Link>
    </article>
  );
}
