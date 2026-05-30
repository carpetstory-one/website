/**
 * lib/rugs.ts — Flat, faceted view over every rug in every collection.
 *
 * The /rugs page is a single flat index of all rugs (12 collections × 6 =
 * 72 pieces), complementing /collection which groups them by theme. Each card
 * still links to the existing rug detail route /collection/[slug]/[rugSlug].
 *
 * The seed data in lib/collections.ts only carries name / description / price /
 * image per rug; material, construction, size and colour live at the collection
 * level or not at all. So this module DERIVES the missing facets:
 *   • material  ← collection.meta.materials  (deterministic)
 *   • make      ← collection slug            (deterministic)
 *   • size      ← deterministic per-rug dimension (placeholder pool)
 *   • colours   ← keywords in the description, else a deterministic pick
 *
 * ⚠️ The synthesized size / colour values are PLACEHOLDERS so the filters are
 * fully functional today. Replace them with real per-rug data (add `dimensions`
 * and `colors` to each rug in lib/collections.ts) when the founder supplies it —
 * `buildFlatRug` already prefers any real field that is present.
 */

import { collections, type Collection, type Rug } from '@/lib/collections';

// ─────────────────────────────────────────────────────────────────────────────
// Facet option lists (the canonical chip/swatch sets)
// ─────────────────────────────────────────────────────────────────────────────

export const MATERIAL_OPTIONS = [
  'Wool',
  'Silk',
  'Cotton',
  'Wool & Silk',
  'Wool & Cotton',
] as const;
export type Material = (typeof MATERIAL_OPTIONS)[number];

export const MAKE_OPTIONS = [
  'Hand-knotted',
  'Hand-tufted',
  'Flatweave',
  'Machine-made',
] as const;
export type Make = (typeof MAKE_OPTIONS)[number];

export const SIZE_OPTIONS = [
  'Small',
  'Medium',
  'Large',
  'Oversized',
  'Runner',
] as const;
export type SizeBucket = (typeof SIZE_OPTIONS)[number];

export const COLOR_OPTIONS = [
  { id: 'red', label: 'Red & Maroon', swatch: '#6E1F23' },
  { id: 'blue', label: 'Blue', swatch: '#2a3a5c' },
  { id: 'green', label: 'Green', swatch: '#4a5e3a' },
  { id: 'neutral', label: 'Neutral/Beige', swatch: '#c9b89a' },
  { id: 'ink', label: 'Black & Ink', swatch: '#1A1817' },
  { id: 'gold', label: 'Gold', swatch: '#b89048' },
  {
    id: 'multi',
    label: 'Multi',
    swatch: 'conic-gradient(from 0deg,#6E1F23,#b89048,#2a3a5c,#4a5e3a,#6E1F23)',
  },
] as const;
export type ColorId = (typeof COLOR_OPTIONS)[number]['id'];

export const SORT_OPTIONS = [
  { id: 'curated', label: 'Curated' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'name-asc', label: 'Name (A–Z)' },
] as const;
export type SortId = (typeof SORT_OPTIONS)[number]['id'];

// ─────────────────────────────────────────────────────────────────────────────
// FlatRug
// ─────────────────────────────────────────────────────────────────────────────

export type FlatRug = {
  id: string; // `${collectionSlug}.${rugSlug}` — globally unique
  collectionSlug: string;
  collectionName: string;
  rugSlug: string;
  name: string;
  description?: string;
  image: string;
  priceUSD?: number;
  priceLabel?: string;
  href: string;
  order: number; // curated index (also stands in for "newest")
  // facets
  material?: Material;
  make: Make;
  size: SizeBucket;
  widthFt: number;
  lengthFt: number;
  dimensions: string;
  colors: ColorId[];
};

// ── deterministic helpers ────────────────────────────────────────────────────

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

// Placeholder dimension pool (w × l, ft). The last two are runners.
const DIMENSION_POOL: Array<[number, number]> = [
  [4, 6],
  [5, 8],
  [6, 9],
  [8, 10],
  [9, 12],
  [10, 14],
  [12, 15],
  [3, 5],
  [2.5, 8],
  [3, 10],
];

function bucketForSize(w: number, l: number): SizeBucket {
  const area = w * l;
  const ratio = Math.max(w, l) / Math.min(w, l);
  if (ratio >= 2.4) return 'Runner';
  if (area < 24) return 'Small';
  if (area < 80) return 'Medium';
  if (area < 180) return 'Large';
  return 'Oversized';
}

function materialFor(col: Collection): Material | undefined {
  const raw = (col.meta?.materials || '').toLowerCase();
  const hasWool = raw.includes('wool');
  const hasSilk = raw.includes('silk');
  const hasCotton = raw.includes('cotton');
  if (hasWool && hasSilk) return 'Wool & Silk';
  if (hasWool && hasCotton) return 'Wool & Cotton';
  if (hasSilk) return 'Silk';
  if (hasCotton) return 'Cotton';
  if (hasWool) return 'Wool';
  return undefined;
}

function makeFor(col: Collection): Make {
  if (col.slug === 'flatweave') return 'Flatweave';
  // All other Carpetstory collections are hand-knotted (incl. Moroccan knot).
  return 'Hand-knotted';
}

const COLOR_KEYWORDS: Record<Exclude<ColorId, 'multi'>, string[]> = {
  red: [
    'madder',
    'maroon',
    'red',
    'rose',
    'brick',
    'cochineal',
    'terracotta',
    'rust',
    'pomegranate',
    'crimson',
  ],
  blue: ['indigo', 'blue', 'teal', 'navy', 'midnight', 'lake'],
  green: ['green', 'sage', 'olive'],
  neutral: [
    'ivory',
    'cream',
    'undyed',
    'beige',
    'oatmeal',
    'flax',
    'linen',
    'sand',
    'neutral',
    'white',
    'pearl',
    'fog',
    'ash',
    'stone',
    'sandstone',
    'natural',
    'oat',
    'silver',
  ],
  ink: ['black', 'ink', 'charcoal', 'graphite'],
  gold: [
    'gold',
    'saffron',
    'champagne',
    'copper',
    'ochre',
    'walnut',
    'amber',
    'brass',
  ],
};

function colorsFor(rug: Rug): ColorId[] {
  if (rug.colors && rug.colors.length > 0) {
    return rug.colors.filter((c): c is ColorId =>
      COLOR_OPTIONS.some((o) => o.id === c)
    );
  }
  const text = `${rug.name} ${rug.description ?? ''}`.toLowerCase();
  const found = new Set<ColorId>();
  (Object.keys(COLOR_KEYWORDS) as Array<Exclude<ColorId, 'multi'>>).forEach(
    (id) => {
      if (COLOR_KEYWORDS[id].some((kw) => text.includes(kw))) found.add(id);
    }
  );
  if (found.size === 0) {
    // Deterministic fallback so the swatch filter still partitions the grid.
    const pick =
      COLOR_OPTIONS[hash(rug.slug + rug.name) % (COLOR_OPTIONS.length - 1)];
    found.add(pick.id);
  }
  const list = Array.from(found);
  if (list.length >= 3) list.push('multi');
  return list;
}

function buildFlatRug(col: Collection, rug: Rug, order: number): FlatRug {
  // Prefer real dimension data if present; otherwise synthesize deterministically.
  let widthFt: number;
  let lengthFt: number;
  const parsed = rug.dimensions?.match(/([\d.]+)\s*[×x]\s*([\d.]+)/);
  if (parsed) {
    widthFt = parseFloat(parsed[1]);
    lengthFt = parseFloat(parsed[2]);
  } else {
    const [w, l] =
      DIMENSION_POOL[hash(col.slug + rug.slug) % DIMENSION_POOL.length];
    widthFt = w;
    lengthFt = l;
  }

  return {
    id: `${col.slug}.${rug.slug}`,
    collectionSlug: col.slug,
    collectionName: col.name,
    rugSlug: rug.slug,
    name: rug.name,
    description: rug.description,
    image: rug.image,
    priceUSD: rug.priceUSD,
    priceLabel: rug.price,
    href: `/collection/${col.slug}/${rug.slug}`,
    order,
    material: materialFor(col),
    make: makeFor(col),
    size: bucketForSize(widthFt, lengthFt),
    widthFt,
    lengthFt,
    dimensions: rug.dimensions ?? `${widthFt} × ${lengthFt} ft`,
    colors: colorsFor(rug),
  };
}

// ── module-level memoized flat list ──────────────────────────────────────────

let _all: FlatRug[] | null = null;

export function getAllRugs(): FlatRug[] {
  if (_all) return _all;
  const out: FlatRug[] = [];
  let order = 0;
  for (const col of collections) {
    for (const rug of col.rugs) {
      out.push(buildFlatRug(col, rug, order++));
    }
  }
  _all = out;
  return out;
}

export const COLLECTION_OPTIONS = collections.map((c) => ({
  slug: c.slug,
  name: c.name,
}));

/** Material values actually present in the data (for the chip set). */
export function availableMaterials(): Material[] {
  const present = new Set<string>();
  getAllRugs().forEach((r) => r.material && present.add(r.material));
  return MATERIAL_OPTIONS.filter((m) => present.has(m));
}

/** Make values actually present in the data. */
export function availableMakes(): Make[] {
  const present = new Set<string>();
  getAllRugs().forEach((r) => present.add(r.make));
  return MAKE_OPTIONS.filter((m) => present.has(m));
}

/** Min / max price across rugs that carry a price, snapped to $500. */
export function priceBounds(): { min: number; max: number } {
  const prices = getAllRugs()
    .map((r) => r.priceUSD)
    .filter((p): p is number => typeof p === 'number');
  if (prices.length === 0) return { min: 0, max: 0 };
  const min = Math.floor(Math.min(...prices) / 500) * 500;
  const max = Math.ceil(Math.max(...prices) / 500) * 500;
  return { min, max };
}

export const collectionCount = collections.length;

// ─────────────────────────────────────────────────────────────────────────────
// Filter state + pure filter/sort
// ─────────────────────────────────────────────────────────────────────────────

export type RugFilters = {
  collection: string[];
  material: string[];
  make: string; // single-select ('' = any)
  size: string[];
  color: string[];
  price: [number, number] | null;
  sort: SortId;
};

export function emptyFilters(): RugFilters {
  return {
    collection: [],
    material: [],
    make: '',
    size: [],
    color: [],
    price: null,
    sort: 'curated',
  };
}

export function hasActiveFilters(f: RugFilters): boolean {
  return (
    f.collection.length > 0 ||
    f.material.length > 0 ||
    f.make !== '' ||
    f.size.length > 0 ||
    f.color.length > 0 ||
    f.price !== null
  );
}

export function activeFilterCount(f: RugFilters): number {
  return (
    f.collection.length +
    f.material.length +
    (f.make ? 1 : 0) +
    f.size.length +
    f.color.length +
    (f.price ? 1 : 0)
  );
}

export function filterAndSort(rugs: FlatRug[], f: RugFilters): FlatRug[] {
  const bounds = priceBounds();
  const out = rugs.filter((r) => {
    if (f.collection.length && !f.collection.includes(r.collectionSlug))
      return false;
    if (f.material.length && !(r.material && f.material.includes(r.material)))
      return false;
    if (f.make && r.make !== f.make) return false;
    if (f.size.length && !f.size.includes(r.size)) return false;
    if (f.color.length && !r.colors.some((c) => f.color.includes(c)))
      return false;
    if (f.price) {
      // Rugs without a price stay visible only when the price filter is at full range.
      const [lo, hi] = f.price;
      const full = lo <= bounds.min && hi >= bounds.max;
      if (typeof r.priceUSD !== 'number') {
        if (!full) return false;
      } else if (r.priceUSD < lo || r.priceUSD > hi) {
        return false;
      }
    }
    return true;
  });

  switch (f.sort) {
    case 'newest':
      out.sort((a, b) => b.order - a.order);
      break;
    case 'price-asc':
      out.sort((a, b) => (a.priceUSD ?? Infinity) - (b.priceUSD ?? Infinity));
      break;
    case 'price-desc':
      out.sort((a, b) => (b.priceUSD ?? -Infinity) - (a.priceUSD ?? -Infinity));
      break;
    case 'name-asc':
      out.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'curated':
    default:
      out.sort((a, b) => a.order - b.order);
      break;
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// URL (de)serialization — shareable, restores state exactly
// ─────────────────────────────────────────────────────────────────────────────

const VALID_COLLECTIONS = new Set(COLLECTION_OPTIONS.map((c) => c.slug));
const VALID_MATERIALS = new Set<string>(MATERIAL_OPTIONS);
const VALID_MAKES = new Set<string>(MAKE_OPTIONS);
const VALID_SIZES = new Set<string>(SIZE_OPTIONS);
const VALID_COLORS = new Set<string>(COLOR_OPTIONS.map((c) => c.id));
const VALID_SORTS = new Set<string>(SORT_OPTIONS.map((s) => s.id));

function csv(raw: string | null, valid: Set<string>): string[] {
  if (!raw) return [];
  return Array.from(
    new Set(
      raw
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter((s) => valid.has(s))
    )
  );
}

export function parseFiltersFromParams(params: URLSearchParams): RugFilters {
  const f = emptyFilters();
  f.collection = csv(params.get('collection'), VALID_COLLECTIONS);
  // materials may contain spaces / ampersands → match case-insensitively
  if (params.get('material')) {
    const wanted = params
      .get('material')!
      .split(',')
      .map((s) => s.trim().toLowerCase());
    f.material = MATERIAL_OPTIONS.filter((m) =>
      wanted.includes(m.toLowerCase())
    );
  }
  const make = (params.get('make') || '').trim().toLowerCase();
  f.make = MAKE_OPTIONS.find((m) => m.toLowerCase() === make) ?? '';
  if (params.get('size')) {
    const wanted = params
      .get('size')!
      .split(',')
      .map((s) => s.trim().toLowerCase());
    f.size = SIZE_OPTIONS.filter((s) => wanted.includes(s.toLowerCase()));
  }
  f.color = csv(params.get('color'), VALID_COLORS);
  const price = params.get('price');
  if (price) {
    const m = price.match(/^(\d+)-(\d+)$/);
    if (m) {
      const lo = parseInt(m[1], 10);
      const hi = parseInt(m[2], 10);
      if (!Number.isNaN(lo) && !Number.isNaN(hi) && lo <= hi)
        f.price = [lo, hi];
    }
  }
  const sort = (params.get('sort') || '').trim().toLowerCase();
  f.sort = (VALID_SORTS.has(sort) ? sort : 'curated') as SortId;
  return f;
}

/** Serialize active filters to a query string (no leading '?'). Empty when clean. */
export function serializeFilters(f: RugFilters): string {
  const p = new URLSearchParams();
  if (f.collection.length) p.set('collection', f.collection.join(','));
  if (f.material.length)
    p.set('material', f.material.map((m) => m.toLowerCase()).join(','));
  if (f.make) p.set('make', f.make.toLowerCase());
  if (f.size.length)
    p.set('size', f.size.map((s) => s.toLowerCase()).join(','));
  if (f.color.length) p.set('color', f.color.join(','));
  if (f.price) p.set('price', `${f.price[0]}-${f.price[1]}`);
  if (f.sort && f.sort !== 'curated') p.set('sort', f.sort);
  return p.toString();
}
