/**
 * lib/pieces.ts — Static collection data for Carpetstory
 *
 * Contains the 6 hero pieces shown on the homepage and 18 additional pieces
 * for the full /collection page. Each piece has all the data needed for
 * the PieceCard component, individual piece pages, and structured data.
 *
 * To add a new piece:
 * 1. Add an entry to the `pieces` array below
 * 2. Place a high-res image at /public/images/collection/{slug}.jpg
 * 3. The piece will appear on the collection page automatically
 */

export interface Piece {
  /** URL slug — must be unique */
  slug: string;
  /** Display name (Hindi/Urdu-origin names) */
  name: string;
  /** Short editorial description */
  description: string;
  /** Starting price in USD */
  priceUSD: number;
  /** CSS gradient used as placeholder when image hasn't loaded */
  placeholderGradient: string;
  /** Image path relative to /public */
  image: string;
  /** Grid size on the homepage: 'large' (7-col), 'medium' (6-col), 'small' (5-col) */
  gridSize: 'large' | 'medium' | 'small';
  /** Whether this piece gets the BorderBeam effect on the homepage */
  featured: boolean;
  /** Beam animation delay (for staggered beam effects) */
  beamDelay?: string;
  /** Materials used */
  materials: string[];
  /** Dimensions in feet */
  dimensions: string;
  /** Knot density (knots per square inch) */
  knotDensity: string;
  /** Estimated weave time */
  weaveTime: string;
  /** Origin atelier */
  origin: string;
}

/** The 6 hero pieces displayed on the homepage */
export const heroPieces: Piece[] = [
  {
    slug: 'khwab',
    name: 'Khwab',
    description:
      'A deep madder field with a single ivory medallion, drawn from a 1920s archive.',
    priceUSD: 14_400,
    placeholderGradient:
      'linear-gradient(135deg, #8a3a2a 0%, #4a2018 50%, #2a1410 100%)',
    image: '/images/collection/khwab.jpg',
    gridSize: 'large',
    featured: true,
    beamDelay: '0s',
    materials: ['Wool', 'Silk highlights'],
    dimensions: '8 × 10 ft',
    knotDensity: '12 per inch²',
    weaveTime: '8 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'saanjh',
    name: 'Saanjh',
    description:
      'Undyed wool, dusk tones, the colour of light at the end of the day.',
    priceUSD: 9_800,
    placeholderGradient:
      'linear-gradient(140deg, #c9b89a 0%, #8b7355 50%, #4a3e2e 100%)',
    image: '/images/collection/saanjh.jpg',
    gridSize: 'small',
    featured: false,
    materials: ['Undyed wool'],
    dimensions: '6 × 9 ft',
    knotDensity: '10 per inch²',
    weaveTime: '6 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'mehfil',
    name: 'Mehfil',
    description:
      'Indigo and silk. A geometric meeting of straight lines and curved restraint.',
    priceUSD: 16_200,
    placeholderGradient:
      'linear-gradient(135deg, #2a3a5c 0%, #1a2540 50%, #0e1828 100%)',
    image: '/images/collection/mehfil.jpg',
    gridSize: 'small',
    featured: true,
    beamDelay: '-6s',
    materials: ['Wool', 'Silk accents'],
    dimensions: '8 × 10 ft',
    knotDensity: '14 per inch²',
    weaveTime: '10 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'shubh',
    name: 'Shubh',
    description:
      'The auspicious one. Walnut and madder tones, woven as a wedding piece.',
    priceUSD: 18_600,
    placeholderGradient:
      'linear-gradient(150deg, #d4a574 0%, #8a5a2e 50%, #4a2e14 100%)',
    image: '/images/collection/shubh.jpg',
    gridSize: 'large',
    featured: true,
    beamDelay: '-12s',
    materials: ['Wool', 'Silk'],
    dimensions: '9 × 12 ft',
    knotDensity: '14 per inch²',
    weaveTime: '10 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'naqsh',
    name: 'Naqsh',
    description:
      'An architectural piece. Sharp lines, deep colour, designed for considered rooms.',
    priceUSD: 12_400,
    placeholderGradient:
      'linear-gradient(135deg, #5a4028 0%, #3a2818 50%, #1f140a 100%)',
    image: '/images/collection/naqsh.jpg',
    gridSize: 'medium',
    featured: false,
    materials: ['Wool'],
    dimensions: '8 × 10 ft',
    knotDensity: '12 per inch²',
    weaveTime: '8 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'aaraam',
    name: 'Aaraam',
    description:
      'The quiet one. Cream, ivory, the faintest blush. For rooms that ask for stillness.',
    priceUSD: 11_200,
    placeholderGradient:
      'linear-gradient(135deg, #e8d4b0 0%, #c9b89a 50%, #8b7355 100%)',
    image: '/images/collection/aaraam.jpg',
    gridSize: 'medium',
    featured: false,
    materials: ['Wool', 'Cotton warp'],
    dimensions: '6 × 9 ft',
    knotDensity: '10 per inch²',
    weaveTime: '6 months',
    origin: 'Jaipur, Rajasthan',
  },
];

/**
 * Additional 18 pieces for the full /collection page.
 * These extend the heroPieces to total 24.
 */
export const extendedPieces: Piece[] = [
  {
    slug: 'rangoli',
    name: 'Rangoli',
    description: 'A celebration of geometry. Concentric diamonds in madder and indigo.',
    priceUSD: 15_800,
    placeholderGradient: 'linear-gradient(135deg, #6E1F23 0%, #2a3a5c 100%)',
    image: '/images/collection/rangoli.jpg',
    gridSize: 'medium',
    featured: false,
    materials: ['Wool', 'Silk'],
    dimensions: '8 × 10 ft',
    knotDensity: '12 per inch²',
    weaveTime: '9 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'dharti',
    name: 'Dharti',
    description: 'Earth tones. Walnut brown melting into undyed ivory. Grounded.',
    priceUSD: 10_600,
    placeholderGradient: 'linear-gradient(135deg, #5a4028 0%, #c9b89a 100%)',
    image: '/images/collection/dharti.jpg',
    gridSize: 'small',
    featured: false,
    materials: ['Wool'],
    dimensions: '6 × 9 ft',
    knotDensity: '10 per inch²',
    weaveTime: '6 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'baadal',
    name: 'Baadal',
    description: 'Cloud-grey wool with silver silk drifts. Soft underfoot.',
    priceUSD: 13_200,
    placeholderGradient: 'linear-gradient(135deg, #9a9590 0%, #e0d8c5 100%)',
    image: '/images/collection/baadal.jpg',
    gridSize: 'large',
    featured: false,
    materials: ['Wool', 'Silk'],
    dimensions: '8 × 10 ft',
    knotDensity: '12 per inch²',
    weaveTime: '8 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'neeli',
    name: 'Neeli',
    description: 'Pure indigo. Dark as a Jaipur midnight. An exercise in restraint.',
    priceUSD: 17_400,
    placeholderGradient: 'linear-gradient(135deg, #14202e 0%, #2a3a5c 100%)',
    image: '/images/collection/neeli.jpg',
    gridSize: 'medium',
    featured: false,
    materials: ['Wool', 'Silk accents'],
    dimensions: '9 × 12 ft',
    knotDensity: '14 per inch²',
    weaveTime: '10 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'gulaal',
    name: 'Gulaal',
    description: 'Rose madder blush. The quieter cousin of red, for rooms with morning light.',
    priceUSD: 12_800,
    placeholderGradient: 'linear-gradient(135deg, #c98090 0%, #8a3a4a 100%)',
    image: '/images/collection/gulaal.jpg',
    gridSize: 'small',
    featured: false,
    materials: ['Wool'],
    dimensions: '6 × 9 ft',
    knotDensity: '12 per inch²',
    weaveTime: '7 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'reet',
    name: 'Reet',
    description: 'Tradition, abstracted. Classic motifs rendered in contemporary negative space.',
    priceUSD: 14_600,
    placeholderGradient: 'linear-gradient(135deg, #1A1817 0%, #c9b89a 100%)',
    image: '/images/collection/reet.jpg',
    gridSize: 'large',
    featured: false,
    materials: ['Wool', 'Silk'],
    dimensions: '8 × 10 ft',
    knotDensity: '12 per inch²',
    weaveTime: '8 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'suraj',
    name: 'Suraj',
    description: 'Gold pomegranate dye radiating outward. Warm as the late afternoon.',
    priceUSD: 13_800,
    placeholderGradient: 'linear-gradient(135deg, #e8c478 0%, #6e5018 100%)',
    image: '/images/collection/suraj.jpg',
    gridSize: 'medium',
    featured: false,
    materials: ['Wool'],
    dimensions: '8 × 10 ft',
    knotDensity: '12 per inch²',
    weaveTime: '8 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'taara',
    name: 'Taara',
    description: 'Star motifs scattered across a deep field. Navigation by starlight.',
    priceUSD: 16_800,
    placeholderGradient: 'linear-gradient(135deg, #0e1828 0%, #c9b89a 100%)',
    image: '/images/collection/taara.jpg',
    gridSize: 'small',
    featured: false,
    materials: ['Wool', 'Silk'],
    dimensions: '8 × 10 ft',
    knotDensity: '14 per inch²',
    weaveTime: '9 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'maati',
    name: 'Maati',
    description: 'Raw earth pigments. Ochre and umber. Before colour, there was this.',
    priceUSD: 9_200,
    placeholderGradient: 'linear-gradient(135deg, #8B7355 0%, #4a3e2e 100%)',
    image: '/images/collection/maati.jpg',
    gridSize: 'medium',
    featured: false,
    materials: ['Wool'],
    dimensions: '5 × 8 ft',
    knotDensity: '10 per inch²',
    weaveTime: '5 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'chaand',
    name: 'Chaand',
    description: 'Moonlit ivory with the faintest indigo edge. For bedrooms.',
    priceUSD: 11_600,
    placeholderGradient: 'linear-gradient(135deg, #f5f1ea 0%, #2a3a5c 100%)',
    image: '/images/collection/chaand.jpg',
    gridSize: 'large',
    featured: false,
    materials: ['Wool', 'Silk'],
    dimensions: '8 × 10 ft',
    knotDensity: '12 per inch²',
    weaveTime: '8 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'phool',
    name: 'Phool',
    description: 'Floral abstractions in cochineal rose. Not literal — suggested.',
    priceUSD: 14_200,
    placeholderGradient: 'linear-gradient(135deg, #c98090 0%, #4a1820 100%)',
    image: '/images/collection/phool.jpg',
    gridSize: 'small',
    featured: false,
    materials: ['Wool', 'Silk'],
    dimensions: '6 × 9 ft',
    knotDensity: '14 per inch²',
    weaveTime: '8 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'jheel',
    name: 'Jheel',
    description: 'Lake-still blue. Indigo deepening toward the centre.',
    priceUSD: 15_400,
    placeholderGradient: 'linear-gradient(135deg, #3a4c75 0%, #0c1428 100%)',
    image: '/images/collection/jheel.jpg',
    gridSize: 'medium',
    featured: false,
    materials: ['Wool', 'Silk accents'],
    dimensions: '8 × 10 ft',
    knotDensity: '12 per inch²',
    weaveTime: '9 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'patthar',
    name: 'Patthar',
    description: 'Stone. Ash. Sandstone. The colours of Rajasthan\'s architecture.',
    priceUSD: 10_800,
    placeholderGradient: 'linear-gradient(135deg, #9a9590 0%, #3A3735 100%)',
    image: '/images/collection/patthar.jpg',
    gridSize: 'large',
    featured: false,
    materials: ['Wool'],
    dimensions: '8 × 10 ft',
    knotDensity: '10 per inch²',
    weaveTime: '7 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'resham',
    name: 'Resham',
    description: 'Pure silk. A shimmering plane that shifts with the sun.',
    priceUSD: 22_400,
    placeholderGradient: 'linear-gradient(135deg, #f5e9d8 0%, #c4a878 100%)',
    image: '/images/collection/resham.jpg',
    gridSize: 'small',
    featured: false,
    materials: ['Mulberry silk'],
    dimensions: '6 × 9 ft',
    knotDensity: '16 per inch²',
    weaveTime: '12 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'kinar',
    name: 'Kinar',
    description: 'Border upon border. An exercise in framing. The field is empty.',
    priceUSD: 13_400,
    placeholderGradient: 'linear-gradient(135deg, #c9b89a 0%, #1A1817 100%)',
    image: '/images/collection/kinar.jpg',
    gridSize: 'medium',
    featured: false,
    materials: ['Wool'],
    dimensions: '8 × 10 ft',
    knotDensity: '12 per inch²',
    weaveTime: '8 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'dastaan',
    name: 'Dastaan',
    description: 'A narrative piece. Pictorial motifs tell a story across the field.',
    priceUSD: 19_800,
    placeholderGradient: 'linear-gradient(135deg, #6E1F23 0%, #4a2018 100%)',
    image: '/images/collection/dastaan.jpg',
    gridSize: 'large',
    featured: false,
    materials: ['Wool', 'Silk'],
    dimensions: '9 × 12 ft',
    knotDensity: '14 per inch²',
    weaveTime: '11 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'safed',
    name: 'Safed',
    description: 'White on white. Texture visible only as shadow. For the purist.',
    priceUSD: 12_600,
    placeholderGradient: 'linear-gradient(135deg, #f5f1ea 0%, #ebe5d8 100%)',
    image: '/images/collection/safed.jpg',
    gridSize: 'small',
    featured: false,
    materials: ['Wool', 'Cotton'],
    dimensions: '6 × 9 ft',
    knotDensity: '12 per inch²',
    weaveTime: '7 months',
    origin: 'Jaipur, Rajasthan',
  },
  {
    slug: 'mitti',
    name: 'Mitti',
    description: 'Clay. The first colour. Warm, yielding, honest.',
    priceUSD: 10_200,
    placeholderGradient: 'linear-gradient(135deg, #d4a574 0%, #6e4a2a 100%)',
    image: '/images/collection/mitti.jpg',
    gridSize: 'medium',
    featured: false,
    materials: ['Wool'],
    dimensions: '6 × 9 ft',
    knotDensity: '10 per inch²',
    weaveTime: '6 months',
    origin: 'Jaipur, Rajasthan',
  },
];

/** All 24 pieces combined */
export const allPieces: Piece[] = [...heroPieces, ...extendedPieces];

/** Look up a piece by its slug */
export function getPieceBySlug(slug: string): Piece | undefined {
  return allPieces.find((p) => p.slug === slug);
}
