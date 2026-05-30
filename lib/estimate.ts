/**
 * lib/estimate.ts — Pricing model for the "Estimate Your Piece" tool.
 *
 * Produces a deliberately wide price RANGE (a qualifier, not a quote). Every
 * result in the UI ends with "begin an inquiry".
 *
 * ⚠️ PLACEHOLDER ECONOMICS — these base rates and multipliers are NOT the real
 * Carpetstory numbers. They exist so the tool behaves correctly. Replace the
 * values in ESTIMATE_CONFIG with figures from the founder before launch.
 */

export type Construction =
  | 'hand-knotted'
  | 'hand-tufted'
  | 'flatweave'
  | 'machine-made';
export type EstMaterial =
  | 'pure-silk'
  | 'wool-silk'
  | 'pure-wool'
  | 'wool-cotton'
  | 'pure-cotton';
export type KnotDensity = 'standard' | 'fine' | 'very-fine';
export type Complexity = 'simple' | 'traditional' | 'intricate';

export const ESTIMATE_CONFIG = {
  // Base rate per square foot (USD), by construction.
  baseRatePerSqft: {
    'hand-knotted': 80,
    'hand-tufted': 35,
    flatweave: 20,
    'machine-made': 8,
  } as Record<Construction, number>,

  materialMultiplier: {
    'pure-silk': 2.5,
    'wool-silk': 1.7,
    'pure-wool': 1.0,
    'wool-cotton': 0.85,
    'pure-cotton': 0.6,
  } as Record<EstMaterial, number>,

  // Applied only when construction === 'hand-knotted'.
  knotDensityMultiplier: {
    standard: 1.0,
    fine: 1.4,
    'very-fine': 1.9,
  } as Record<KnotDensity, number>,

  complexityMultiplier: {
    simple: 0.9,
    traditional: 1.0,
    intricate: 1.4,
  } as Record<Complexity, number>,

  // Range half-width around the midpoint, and rounding granularity.
  rangeSpread: 0.15, // ±15%
  roundTo: 100,
};

export const CONSTRUCTION_OPTIONS: Array<{
  id: Construction;
  label: string;
  descriptor: string;
}> = [
  {
    id: 'hand-knotted',
    label: 'Hand-knotted',
    descriptor: 'Persian knot, 6–10 months on the loom',
  },
  {
    id: 'hand-tufted',
    label: 'Hand-tufted',
    descriptor: 'Hand-punched pile, a few months to make',
  },
  {
    id: 'flatweave',
    label: 'Flatweave / Dhurrie',
    descriptor: 'No pile, reversible, the oldest form',
  },
  {
    id: 'machine-made',
    label: 'Machine-made',
    descriptor: 'Production-quality, fast turnaround',
  },
];

export const MATERIAL_OPTIONS: Array<{ id: EstMaterial; label: string }> = [
  { id: 'pure-silk', label: 'Pure silk' },
  { id: 'wool-silk', label: 'Wool + silk blend' },
  { id: 'pure-wool', label: 'Pure wool' },
  { id: 'wool-cotton', label: 'Wool + cotton' },
  { id: 'pure-cotton', label: 'Pure cotton' },
];

export const KNOT_OPTIONS: Array<{ id: KnotDensity; label: string }> = [
  { id: 'standard', label: 'Standard', descriptor: '10×10 knots/in²' } as any,
  { id: 'fine', label: 'Fine', descriptor: '12×12 knots/in²' } as any,
  { id: 'very-fine', label: 'Very fine', descriptor: '14×14 knots/in²' } as any,
];

export const COMPLEXITY_OPTIONS: Array<{ id: Complexity; label: string }> = [
  { id: 'simple', label: 'Simple / minimal' },
  { id: 'traditional', label: 'Traditional / patterned' },
  { id: 'intricate', label: 'Highly intricate / custom' },
];

export const SIZE_PRESETS: Array<{ label: string; w: number; l: number }> = [
  { label: '3×5', w: 3, l: 5 },
  { label: '4×6', w: 4, l: 6 },
  { label: '5×8', w: 5, l: 8 },
  { label: '6×9', w: 6, l: 9 },
  { label: '8×10', w: 8, l: 10 },
  { label: '9×12', w: 9, l: 12 },
  { label: '10×14', w: 10, l: 14 },
  { label: '12×15', w: 12, l: 15 },
];

export type EstimateInput = {
  construction: Construction | null;
  material: EstMaterial | null;
  widthFt: number | null;
  lengthFt: number | null;
  knot: KnotDensity;
  complexity: Complexity;
};

export type EstimateResult = {
  sqft: number;
  midpoint: number;
  low: number;
  high: number;
};

function roundTo(n: number, to: number): number {
  return Math.round(n / to) * to;
}

/** Returns null until construction + material + a positive size are all set. */
export function computeEstimate(input: EstimateInput): EstimateResult | null {
  const { construction, material, widthFt, lengthFt, knot, complexity } = input;
  if (!construction || !material || !widthFt || !lengthFt) return null;
  if (widthFt <= 0 || lengthFt <= 0) return null;

  const sqft = widthFt * lengthFt;
  const base = ESTIMATE_CONFIG.baseRatePerSqft[construction];
  const mat = ESTIMATE_CONFIG.materialMultiplier[material];
  const knotMult =
    construction === 'hand-knotted'
      ? ESTIMATE_CONFIG.knotDensityMultiplier[knot]
      : 1;
  const cx = ESTIMATE_CONFIG.complexityMultiplier[complexity];

  const midpoint = base * sqft * mat * knotMult * cx;
  const { rangeSpread, roundTo: r } = ESTIMATE_CONFIG;
  return {
    sqft: Math.round(sqft),
    midpoint,
    low: roundTo(midpoint * (1 - rangeSpread), r),
    high: roundTo(midpoint * (1 + rangeSpread), r),
  };
}

export function constructionLabel(id: Construction): string {
  return CONSTRUCTION_OPTIONS.find((o) => o.id === id)?.label ?? id;
}
export function materialLabel(id: EstMaterial): string {
  return MATERIAL_OPTIONS.find((o) => o.id === id)?.label ?? id;
}
