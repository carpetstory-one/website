'use client';

import { motion, useAnimationControls } from 'motion/react';
import { Bookmark } from 'lucide-react';
import { useShortlist } from './ShortlistProvider';

type Props = {
  collectionSlug: string;
  rugSlug: string;
  rugName: string;
  /** 'icon' = small corner button on a card; 'button' = labelled CTA. */
  variant?: 'icon' | 'button';
  className?: string;
};

export function ShortlistToggleButton({
  collectionSlug,
  rugSlug,
  rugName,
  variant = 'icon',
  className,
}: Props) {
  const { isInShortlist, toggle, hydrated } = useShortlist();
  const controls = useAnimationControls();

  // Render the "not saved" state until hydration so SSR and client markup match.
  const active = hydrated && isInShortlist(collectionSlug, rugSlug);

  const label = active
    ? `Remove ${rugName} from shortlist`
    : `Add ${rugName} to shortlist`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(collectionSlug, rugSlug);
    controls.start({ scale: [0.9, 1.1, 1], transition: { duration: 0.2 } });
  };

  if (variant === 'button') {
    return (
      <button
        type="button"
        aria-pressed={active}
        aria-label={label}
        onClick={handleClick}
        className={
          'flex w-full items-center justify-center gap-2 border px-7 py-4 text-[13px] tracking-[0.12em] uppercase transition-colors duration-300 ' +
          (active
            ? 'border-accent bg-accent text-[var(--canvas)]'
            : 'border-ink text-ink hover:bg-ink bg-transparent hover:text-[var(--canvas)]') +
          (className ? ' ' + className : '')
        }
      >
        <Bookmark
          className={'h-4 w-4 ' + (active ? 'fill-current' : 'fill-none')}
          aria-hidden="true"
        />
        {active ? '✓ In your shortlist' : 'Add to shortlist'}
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      aria-pressed={active}
      aria-label={label}
      title={active ? 'Remove from shortlist' : 'Add to shortlist'}
      onClick={handleClick}
      animate={controls}
      whileHover={{ scale: 1.1 }}
      style={{ backgroundColor: 'rgba(237,229,212,0.85)' }}
      className={
        'text-ink hover:text-accent absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors' +
        (className ? ' ' + className : '')
      }
    >
      <Bookmark
        className={
          'h-[18px] w-[18px] transition-colors ' +
          (active ? 'fill-accent text-accent' : 'fill-none')
        }
        aria-hidden="true"
      />
    </motion.button>
  );
}
