/**
 * lib/collections.ts — Two-level collection taxonomy for Carpetstory.
 *
 * Level 1: Named collections (12 total, 5 featured on home page).
 * Level 2: Rugs within each collection (6 seeded per collection).
 *
 * Image conventions:
 *   Collection hero:  /collections/{slug}/hero.jpg  (swap Unsplash → local when ready)
 *   Rug images:       /collections/{slug}/rugs/01.jpg … 06.jpg
 *
 * Until real photography arrives, all image fields point to Unsplash URLs
 * that match each collection's character. Drop local files in at any time.
 */

export type Rug = {
  slug: string;
  name: string;
  description?: string;
  price?: string;
  priceUSD?: number;
  image: string;
  materials?: string;
  dimensions?: string;
  knotDensity?: string;
  weaveTime?: string;
  /** Optional manual colour tags for the /rugs colour filter. When absent,
   *  lib/rugs.ts derives colours from the description. See COLOR_OPTIONS. */
  colors?: string[];
};

export type Collection = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  featured: boolean;
  /** Optional per-collection meta shown on the detail page */
  meta?: {
    origin?: string;
    materials?: string;
    knotDensity?: string;
    leadTime?: string;
  };
  rugs: Rug[];
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — Unsplash URL builder
// ─────────────────────────────────────────────────────────────────────────────

function u(id: string, w = 1200, h = 900): string {
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&auto=format&fit=crop&q=80`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 12 COLLECTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const collections: Collection[] = [
  // ── 1. PERSIAN (featured) ────────────────────────────────────────────────
  {
    slug: 'persian',
    name: 'Persian',
    tagline: 'Knotted patterns drawn from four centuries of tradition.',
    description:
      'The Persian collection is a direct line to the archive. Each piece is drawn from pattern books that predate industrialisation — floral medallions, arabesque borders, field compositions that reward looking at closely. Woven in the Persian knot on high-warp vertical looms. Wool pile on a cotton foundation, hand-spun, vegetable dyed.',
    heroImage: u('photo-1600166898405-da9535204843'),
    featured: true,
    meta: {
      origin: 'Jaipur, Rajasthan',
      materials: 'Wool, Silk highlights',
      knotDensity: '12–16 per inch²',
      leadTime: '8–12 months',
    },
    rugs: [
      {
        slug: 'rug-01',
        name: 'Piece 01',
        description: 'Deep madder field with ivory medallion.',
        price: 'From $14,400',
        priceUSD: 14400,
        image: u('photo-1600166898405-da9535204843', 900, 1200),
      },
      {
        slug: 'rug-02',
        name: 'Piece 02',
        description: 'Indigo corner brackets on a sand field.',
        price: 'From $12,800',
        priceUSD: 12800,
        image: u('photo-1606744888344-493238951221', 900, 1200),
      },
      {
        slug: 'rug-03',
        name: 'Piece 03',
        description: 'Walnut ground, pomegranate border.',
        price: 'From $16,200',
        priceUSD: 16200,
        image: u('photo-1567016376408-0226e4d0c1ea', 900, 1200),
      },
      {
        slug: 'rug-04',
        name: 'Piece 04',
        description: 'Ivory field, madder-detailed border.',
        price: 'From $11,600',
        priceUSD: 11600,
        image: u('photo-1555041469-a586c61ea9bc', 900, 1200),
      },
      {
        slug: 'rug-05',
        name: 'Piece 05',
        description: 'Midnight indigo with silk highlights.',
        price: 'From $18,400',
        priceUSD: 18400,
        image: u('photo-1567016526105-22da7c13161a', 900, 1200),
      },
      {
        slug: 'rug-06',
        name: 'Piece 06',
        description: 'Rose madder on an undyed wool ground.',
        price: 'From $13,200',
        priceUSD: 13200,
        image: u('photo-1581873372796-635b67ca2008', 900, 1200),
      },
    ],
  },

  // ── 2. MODERN (featured) ─────────────────────────────────────────────────
  {
    slug: 'modern',
    name: 'Modern',
    tagline: 'For rooms that argue with the past.',
    description:
      'Geometric, spare, deliberate. The Modern collection takes the hand-knotted format and strips it of ornament, leaving only structure. Flat planes of colour, sharp-edged borders, negative space used as a compositional element. The craft is unchanged. The visual language is entirely now.',
    heroImage: u('photo-1586023492125-27b2c045efd7'),
    featured: true,
    meta: {
      origin: 'Jaipur, Rajasthan',
      materials: 'New Zealand Wool, Cotton warp',
      knotDensity: '10–12 per inch²',
      leadTime: '6–9 months',
    },
    rugs: [
      {
        slug: 'rug-01',
        name: 'Piece 01',
        description: 'Three horizontal bands — ash, ivory, charcoal.',
        price: 'From $9,800',
        priceUSD: 9800,
        image: u('photo-1586023492125-27b2c045efd7', 900, 1200),
      },
      {
        slug: 'rug-02',
        name: 'Piece 02',
        description: 'Single-field deep charcoal. No border.',
        price: 'From $8,600',
        priceUSD: 8600,
        image: u('photo-1505691938895-1758d7feb511', 900, 1200),
      },
      {
        slug: 'rug-03',
        name: 'Piece 03',
        description: 'Offset grid in dusty rose and flax.',
        price: 'From $11,200',
        priceUSD: 11200,
        image: u('photo-1502005229762-cf1b2da7c5d6', 900, 1200),
      },
      {
        slug: 'rug-04',
        name: 'Piece 04',
        description: 'Stepped diamond on an undyed ground.',
        price: 'From $10,400',
        priceUSD: 10400,
        image: u('photo-1581009146145-b5ef050c2e1e', 900, 1200),
      },
      {
        slug: 'rug-05',
        name: 'Piece 05',
        description: 'Two-tone vertical stripe — ink and linen.',
        price: 'From $9,200',
        priceUSD: 9200,
        image: u('photo-1493663284031-b7e3aefcae8e', 900, 1200),
      },
      {
        slug: 'rug-06',
        name: 'Piece 06',
        description: 'Abstract field: fog on a dark ground.',
        price: 'From $12,400',
        priceUSD: 12400,
        image: u('photo-1554995207-c18c203602cb', 900, 1200),
      },
    ],
  },

  // ── 3. TRIBAL (featured) ─────────────────────────────────────────────────
  {
    slug: 'tribal',
    name: 'Tribal',
    tagline: 'Made by hand. Made for use. Made to last a lifetime.',
    description:
      'The Tribal collection is built on the weaving traditions of nomadic cultures — Qashqai, Berber, Baluch. The patterns are geometric because geometry can be woven without a cartoon; the proportions are imperfect because they were measured by eye. Heavy wool pile, tight knot density, the kind of construction that was made to survive a migration.',
    heroImage: u('photo-1606744888344-493238951221'),
    featured: true,
    meta: {
      origin: 'Jaipur, Rajasthan',
      materials: 'Highland Wool',
      knotDensity: '8–12 per inch²',
      leadTime: '5–8 months',
    },
    rugs: [
      {
        slug: 'rug-01',
        name: 'Piece 01',
        description: 'Double medallion on a madder ground.',
        price: 'From $7,400',
        priceUSD: 7400,
        image: u('photo-1555041469-a586c61ea9bc', 900, 1200),
      },
      {
        slug: 'rug-02',
        name: 'Piece 02',
        description: 'Gul motifs on a deep walnut field.',
        price: 'From $8,200',
        priceUSD: 8200,
        image: u('photo-1503602642458-232111445657', 900, 1200),
      },
      {
        slug: 'rug-03',
        name: 'Piece 03',
        description: 'Hooked borders, tribal red.',
        price: 'From $6,800',
        priceUSD: 6800,
        image: u('photo-1581873372796-635b67ca2008', 900, 1200),
      },
      {
        slug: 'rug-04',
        name: 'Piece 04',
        description: 'Diamond lattice in undyed and madder.',
        price: 'From $7,200',
        priceUSD: 7200,
        image: u('photo-1567016376408-0226e4d0c1ea', 900, 1200),
      },
      {
        slug: 'rug-05',
        name: 'Piece 05',
        description: 'Running dog border, ivory field.',
        price: 'From $8,600',
        priceUSD: 8600,
        image: u('photo-1506439773649-6e0eb8cfb237', 900, 1200),
      },
      {
        slug: 'rug-06',
        name: 'Piece 06',
        description: 'Bold lozenge field, walnut ground.',
        price: 'From $9,400',
        priceUSD: 9400,
        image: u('photo-1558618666-fcd25c85cd64', 900, 1200),
      },
    ],
  },

  // ── 4. SILK (featured) ───────────────────────────────────────────────────
  {
    slug: 'silk',
    name: 'Silk',
    tagline: 'One thread catches the light differently at every hour.',
    description:
      'Pure mulberry silk, hand-knotted at the highest density we produce. These pieces change with the day — luminous in morning light, muted at dusk, glowing under evening lamp. They are the most technically demanding pieces in our workshop, woven by a small number of artisans with the patience the material demands. Not made for heavy traffic. Made for rooms that are looked at.',
    heroImage: u('photo-1605296867304-46d5465a13f1'),
    featured: true,
    meta: {
      origin: 'Jaipur, Rajasthan',
      materials: 'Mulberry Silk',
      knotDensity: '16–20 per inch²',
      leadTime: '10–14 months',
    },
    rugs: [
      {
        slug: 'rug-01',
        name: 'Piece 01',
        description: 'Ivory field with silk floral medallion.',
        price: 'From $22,400',
        priceUSD: 22400,
        image: u('photo-1605296867304-46d5465a13f1', 900, 1200),
      },
      {
        slug: 'rug-02',
        name: 'Piece 02',
        description: 'Champagne ground, platinum highlights.',
        price: 'From $24,800',
        priceUSD: 24800,
        image: u('photo-1567016526105-22da7c13161a', 900, 1200),
      },
      {
        slug: 'rug-03',
        name: 'Piece 03',
        description: 'Deep teal field, gold silk accents.',
        price: 'From $26,200',
        priceUSD: 26200,
        image: u('photo-1554995207-c18c203602cb', 900, 1200),
      },
      {
        slug: 'rug-04',
        name: 'Piece 04',
        description: 'Pearl white on white — texture by light only.',
        price: 'From $28,400',
        priceUSD: 28400,
        image: u('photo-1493663284031-b7e3aefcae8e', 900, 1200),
      },
      {
        slug: 'rug-05',
        name: 'Piece 05',
        description: 'Rose and gold arabesque on ivory.',
        price: 'From $21,600',
        priceUSD: 21600,
        image: u('photo-1604147495798-57beb5d6af73', 900, 1200),
      },
      {
        slug: 'rug-06',
        name: 'Piece 06',
        description: 'Midnight blue, copper botanical detail.',
        price: 'From $23,200',
        priceUSD: 23200,
        image: u('photo-1581009146145-b5ef050c2e1e', 900, 1200),
      },
    ],
  },

  // ── 5. CONTEMPORARY ──────────────────────────────────────────────────────
  {
    slug: 'contemporary',
    name: 'Contemporary',
    tagline: 'The hand-knotted format, rethought without nostalgia.',
    description:
      "Contemporary doesn't mean trend-driven. It means the designer started with a blank cartoon and a clear intention. These pieces borrow nothing from the archive — they are made in Jaipur, by the same hands, using the same materials, but the pattern belongs entirely to now. Geometric abstractions, painterly fields, compositions drawn from architecture rather than botany.",
    heroImage: u('photo-1502005229762-cf1b2da7c5d6'),
    featured: true,
    meta: {
      origin: 'Jaipur, Rajasthan',
      materials: 'Wool, Silk',
      knotDensity: '10–14 per inch²',
      leadTime: '7–10 months',
    },
    rugs: [
      {
        slug: 'rug-01',
        name: 'Piece 01',
        description: 'Bold vertical plane division.',
        price: 'From $11,200',
        priceUSD: 11200,
        image: u('photo-1502005229762-cf1b2da7c5d6', 900, 1200),
      },
      {
        slug: 'rug-02',
        name: 'Piece 02',
        description: 'Radiating arc from lower left corner.',
        price: 'From $12,800',
        priceUSD: 12800,
        image: u('photo-1505691938895-1758d7feb511', 900, 1200),
      },
      {
        slug: 'rug-03',
        name: 'Piece 03',
        description: 'Wash of colour, indigo bleeding into sand.',
        price: 'From $13,400',
        priceUSD: 13400,
        image: u('photo-1554995207-c18c203602cb', 900, 1200),
      },
      {
        slug: 'rug-04',
        name: 'Piece 04',
        description: 'Single diagonal band on ivory.',
        price: 'From $10,400',
        priceUSD: 10400,
        image: u('photo-1586023492125-27b2c045efd7', 900, 1200),
      },
      {
        slug: 'rug-05',
        name: 'Piece 05',
        description: 'Terracotta half-circle on linen ground.',
        price: 'From $11,600',
        priceUSD: 11600,
        image: u('photo-1604147495798-57beb5d6af73', 900, 1200),
      },
      {
        slug: 'rug-06',
        name: 'Piece 06',
        description: 'Abstract brushstroke in walnut wool.',
        price: 'From $14,200',
        priceUSD: 14200,
        image: u('photo-1493663284031-b7e3aefcae8e', 900, 1200),
      },
    ],
  },

  // ── 6. CLASSICAL ─────────────────────────────────────────────────────────
  {
    slug: 'classical',
    name: 'Classical',
    tagline: 'The Orient Express still calls at these patterns.',
    description:
      'Classical pieces follow the formal grammar of nineteenth-century carpet design: the central medallion, the repeating field, the multi-border system. Technically the most demanding patterns to execute — the symmetry is unforgiving and so is the client who chooses them. Every piece in this collection is cross-referenced against archival plates before the cartoon is drawn.',
    heroImage: u('photo-1600166898405-da9535204843'),
    featured: false,
    meta: {
      origin: 'Jaipur, Rajasthan',
      materials: 'Wool, Silk accents',
      knotDensity: '14–18 per inch²',
      leadTime: '9–14 months',
    },
    rugs: [
      {
        slug: 'rug-01',
        name: 'Piece 01',
        description: 'Full medallion, ivory on madder.',
        price: 'From $19,800',
        priceUSD: 19800,
        image: u('photo-1600166898405-da9535204843', 900, 1200),
      },
      {
        slug: 'rug-02',
        name: 'Piece 02',
        description: 'Floral field, triple border system.',
        price: 'From $22,400',
        priceUSD: 22400,
        image: u('photo-1581873372796-635b67ca2008', 900, 1200),
      },
      {
        slug: 'rug-03',
        name: 'Piece 03',
        description: 'Vine-scroll border, deep indigo ground.',
        price: 'From $18,200',
        priceUSD: 18200,
        image: u('photo-1555041469-a586c61ea9bc', 900, 1200),
      },
      {
        slug: 'rug-04',
        name: 'Piece 04',
        description: 'Hunting scene in madder and walnut.',
        price: 'From $24,600',
        priceUSD: 24600,
        image: u('photo-1567016376408-0226e4d0c1ea', 900, 1200),
      },
      {
        slug: 'rug-05',
        name: 'Piece 05',
        description: 'Knotted palmette border on ivory.',
        price: 'From $16,800',
        priceUSD: 16800,
        image: u('photo-1567016526105-22da7c13161a', 900, 1200),
      },
      {
        slug: 'rug-06',
        name: 'Piece 06',
        description: 'Herati pattern, saffron-gold field.',
        price: 'From $21,200',
        priceUSD: 21200,
        image: u('photo-1606744888344-493238951221', 900, 1200),
      },
    ],
  },

  // ── 7. TRANSITIONAL ──────────────────────────────────────────────────────
  {
    slug: 'transitional',
    name: 'Transitional',
    tagline: 'Neither modern nor traditional. Exactly right for most rooms.',
    description:
      "The Transitional collection is for the room that doesn't commit to a period. Traditional motifs simplified until the ornament becomes texture. Contemporary restraint softened by warmth. These pieces work with older furniture and newer architecture equally — which is why they are the most consistently specified by interior designers who need something that doesn't demand the room revolve around it.",
    heroImage: u('photo-1581873372796-635b67ca2008'),
    featured: false,
    meta: {
      origin: 'Jaipur, Rajasthan',
      materials: 'Wool',
      knotDensity: '10–12 per inch²',
      leadTime: '6–9 months',
    },
    rugs: [
      {
        slug: 'rug-01',
        name: 'Piece 01',
        description: 'Faded Persian floral on a neutral ground.',
        price: 'From $10,200',
        priceUSD: 10200,
        image: u('photo-1581873372796-635b67ca2008', 900, 1200),
      },
      {
        slug: 'rug-02',
        name: 'Piece 02',
        description: 'Abstracted medallion, dusty palette.',
        price: 'From $11,400',
        priceUSD: 11400,
        image: u('photo-1505691938895-1758d7feb511', 900, 1200),
      },
      {
        slug: 'rug-03',
        name: 'Piece 03',
        description: 'Tonal botanical scatter on oatmeal.',
        price: 'From $9,600',
        priceUSD: 9600,
        image: u('photo-1554995207-c18c203602cb', 900, 1200),
      },
      {
        slug: 'rug-04',
        name: 'Piece 04',
        description: 'Simplified lattice in muted rust.',
        price: 'From $10,800',
        priceUSD: 10800,
        image: u('photo-1606744888344-493238951221', 900, 1200),
      },
      {
        slug: 'rug-05',
        name: 'Piece 05',
        description: 'Vintage-washed field, flax ground.',
        price: 'From $12,200',
        priceUSD: 12200,
        image: u('photo-1493663284031-b7e3aefcae8e', 900, 1200),
      },
      {
        slug: 'rug-06',
        name: 'Piece 06',
        description: 'Pale indigo, botanical border at ease.',
        price: 'From $11,000',
        priceUSD: 11000,
        image: u('photo-1555041469-a586c61ea9bc', 900, 1200),
      },
    ],
  },

  // ── 8. HAND-KNOTTED ──────────────────────────────────────────────────────
  {
    slug: 'hand-knotted',
    name: 'Hand-Knotted',
    tagline: 'The benchmark construction. Everything else is a shortcut.',
    description:
      "Hand-knotted is the production method, not the style — but we give it its own collection because it's worth distinguishing. These pieces are woven on a vertical loom with individual knots tied by hand on every warp thread. At ten knots per inch, a single square metre takes three weeks. At sixteen, it takes eight. There are no shortcuts and no machines involved at any stage.",
    heroImage: u('photo-1567016526105-22da7c13161a'),
    featured: false,
    meta: {
      origin: 'Jaipur, Rajasthan',
      materials: 'Wool, Cotton warp',
      knotDensity: '10–16 per inch²',
      leadTime: '6–12 months',
    },
    rugs: [
      {
        slug: 'rug-01',
        name: 'Piece 01',
        description: 'Deep pile, hand-spun wool, ochre ground.',
        price: 'From $8,800',
        priceUSD: 8800,
        image: u('photo-1567016526105-22da7c13161a', 900, 1200),
      },
      {
        slug: 'rug-02',
        name: 'Piece 02',
        description: 'Brick red, 100% hand-spun highland wool.',
        price: 'From $9,400',
        priceUSD: 9400,
        image: u('photo-1503602642458-232111445657', 900, 1200),
      },
      {
        slug: 'rug-03',
        name: 'Piece 03',
        description: 'Ivory ground, full cut pile at 14mm.',
        price: 'From $10,200',
        priceUSD: 10200,
        image: u('photo-1581009146145-b5ef050c2e1e', 900, 1200),
      },
      {
        slug: 'rug-04',
        name: 'Piece 04',
        description: 'Charcoal with short-cut pile finish.',
        price: 'From $11,600',
        priceUSD: 11600,
        image: u('photo-1558618666-fcd25c85cd64', 900, 1200),
      },
      {
        slug: 'rug-05',
        name: 'Piece 05',
        description: 'Dense knot, walnut vegetable dye.',
        price: 'From $12,400',
        priceUSD: 12400,
        image: u('photo-1555041469-a586c61ea9bc', 900, 1200),
      },
      {
        slug: 'rug-06',
        name: 'Piece 06',
        description: 'Undyed highland wool, raw texture.',
        price: 'From $7,800',
        priceUSD: 7800,
        image: u('photo-1506439773649-6e0eb8cfb237', 900, 1200),
      },
    ],
  },

  // ── 9. FLATWEAVE ─────────────────────────────────────────────────────────
  {
    slug: 'flatweave',
    name: 'Flatweave',
    tagline: 'No pile. No padding. Just the pattern and the floor.',
    description:
      'Flatweave — dhurrie — is the oldest form of rug we make. No knots, no pile: the warp and weft are the surface. These pieces are thin, reversible, and more honest about what they are than a pile rug with a backing. They belong in kitchens, terraces, summer rooms, and anywhere a deep pile would feel excessive. The patterns are crisp because the construction demands precision.',
    heroImage: u('photo-1503602642458-232111445657'),
    featured: false,
    meta: {
      origin: 'Jaipur, Rajasthan',
      materials: 'Wool, Cotton',
      knotDensity: 'Flatweave — not applicable',
      leadTime: '4–6 months',
    },
    rugs: [
      {
        slug: 'rug-01',
        name: 'Piece 01',
        description: 'Fine cotton dhurrie, graphic stripe.',
        price: 'From $2,800',
        priceUSD: 2800,
        image: u('photo-1555041469-a586c61ea9bc', 900, 1200),
      },
      {
        slug: 'rug-02',
        name: 'Piece 02',
        description: 'Wool flatweave, checker in madder.',
        price: 'From $3,400',
        priceUSD: 3400,
        image: u('photo-1554995207-c18c203602cb', 900, 1200),
      },
      {
        slug: 'rug-03',
        name: 'Piece 03',
        description: 'Diamond kilim in walnut and ivory.',
        price: 'From $4,200',
        priceUSD: 4200,
        image: u('photo-1581873372796-635b67ca2008', 900, 1200),
      },
      {
        slug: 'rug-04',
        name: 'Piece 04',
        description: 'Reversible, natural dye, undyed warp.',
        price: 'From $3,800',
        priceUSD: 3800,
        image: u('photo-1505691938895-1758d7feb511', 900, 1200),
      },
      {
        slug: 'rug-05',
        name: 'Piece 05',
        description: 'Cotton slit-weave, indigo on cream.',
        price: 'From $2,600',
        priceUSD: 2600,
        image: u('photo-1493663284031-b7e3aefcae8e', 900, 1200),
      },
      {
        slug: 'rug-06',
        name: 'Piece 06',
        description: 'Wool kelim, bold ochre field.',
        price: 'From $4,600',
        priceUSD: 4600,
        image: u('photo-1558618666-fcd25c85cd64', 900, 1200),
      },
    ],
  },

  // ── 10. MOROCCAN ─────────────────────────────────────────────────────────
  {
    slug: 'moroccan',
    name: 'Moroccan',
    tagline: 'The texture that makes an interior feel like it was lived in.',
    description:
      'The Moroccan collection is built on the Beni Ourain tradition — deep ivory pile, bold lozenge fields, the kind of texture that photographs well and feels better underfoot. Our versions are woven in Jaipur in the Moroccan knot, using undyed wool from highland sheep. The pile is long, the knot density is intentionally loose, and the irregularity is the point.',
    heroImage: u('photo-1558618666-fcd25c85cd64'),
    featured: false,
    meta: {
      origin: 'Jaipur, Rajasthan',
      materials: 'Undyed Wool',
      knotDensity: '6–9 per inch²',
      leadTime: '4–7 months',
    },
    rugs: [
      {
        slug: 'rug-01',
        name: 'Piece 01',
        description: 'Classic Beni lozenge field, ivory on ivory.',
        price: 'From $5,800',
        priceUSD: 5800,
        image: u('photo-1558618666-fcd25c85cd64', 900, 1200),
      },
      {
        slug: 'rug-02',
        name: 'Piece 02',
        description: 'Deep pile diamond lattice, undyed.',
        price: 'From $6,400',
        priceUSD: 6400,
        image: u('photo-1606744888344-493238951221', 900, 1200),
      },
      {
        slug: 'rug-03',
        name: 'Piece 03',
        description: 'Long pile cream, charcoal-washed lozenge.',
        price: 'From $7,200',
        priceUSD: 7200,
        image: u('photo-1493663284031-b7e3aefcae8e', 900, 1200),
      },
      {
        slug: 'rug-04',
        name: 'Piece 04',
        description: 'Undyed wool, loose knot, generous pile.',
        price: 'From $5,400',
        priceUSD: 5400,
        image: u('photo-1581873372796-635b67ca2008', 900, 1200),
      },
      {
        slug: 'rug-05',
        name: 'Piece 05',
        description: 'Ivory ground, thin black grid, minimal.',
        price: 'From $6,800',
        priceUSD: 6800,
        image: u('photo-1503602642458-232111445657', 900, 1200),
      },
      {
        slug: 'rug-06',
        name: 'Piece 06',
        description: 'Natural un-dyed, shaggy long pile.',
        price: 'From $4,800',
        priceUSD: 4800,
        image: u('photo-1555041469-a586c61ea9bc', 900, 1200),
      },
    ],
  },

  // ── 11. ABSTRACT ─────────────────────────────────────────────────────────
  {
    slug: 'abstract',
    name: 'Abstract',
    tagline: 'The rug as painting. Intentional. Unrepeatable.',
    description:
      'These are the hardest pieces to sell and the longest to stay with. Each begins with a painting or a loose drawing — not a technical cartoon — and is interpreted by the weaver as they knot. The imprecision is structural. Two weavers given the same drawing will produce different rugs. That is considered a feature. These pieces are made in editions of one.',
    heroImage: u('photo-1554995207-c18c203602cb'),
    featured: false,
    meta: {
      origin: 'Jaipur, Rajasthan',
      materials: 'Wool, Silk',
      knotDensity: '10–14 per inch²',
      leadTime: '8–12 months',
    },
    rugs: [
      {
        slug: 'rug-01',
        name: 'Piece 01',
        description: 'Two-colour field, brushstroke border.',
        price: 'From $14,800',
        priceUSD: 14800,
        image: u('photo-1493663284031-b7e3aefcae8e', 900, 1200),
      },
      {
        slug: 'rug-02',
        name: 'Piece 02',
        description: 'Madder wash on undyed ground.',
        price: 'From $12,400',
        priceUSD: 12400,
        image: u('photo-1503602642458-232111445657', 900, 1200),
      },
      {
        slug: 'rug-03',
        name: 'Piece 03',
        description: 'Indigo cloud on ivory, edge to edge.',
        price: 'From $16,200',
        priceUSD: 16200,
        image: u('photo-1581009146145-b5ef050c2e1e', 900, 1200),
      },
      {
        slug: 'rug-04',
        name: 'Piece 04',
        description: 'Ochre and walnut, no defined pattern.',
        price: 'From $13,600',
        priceUSD: 13600,
        image: u('photo-1604147495798-57beb5d6af73', 900, 1200),
      },
      {
        slug: 'rug-05',
        name: 'Piece 05',
        description: 'Rose-dyed ground, black incidental mark.',
        price: 'From $15,400',
        priceUSD: 15400,
        image: u('photo-1506439773649-6e0eb8cfb237', 900, 1200),
      },
      {
        slug: 'rug-06',
        name: 'Piece 06',
        description: 'Charcoal and cream, deliberate asymmetry.',
        price: 'From $17,200',
        priceUSD: 17200,
        image: u('photo-1555041469-a586c61ea9bc', 900, 1200),
      },
    ],
  },

  // ── 12. HERITAGE ─────────────────────────────────────────────────────────
  {
    slug: 'heritage',
    name: 'Heritage',
    tagline: 'Archive patterns. Reproduced exactly or not at all.',
    description:
      'The Heritage collection is drawn from pattern books and documented pieces going back to the early twentieth century. These are not interpretations — they are reproductions, as technically faithful to the original as our weavers can make them. For rooms with older furniture, for collectors, for those who want to own a piece of the archive rather than a piece that gestures at it.',
    heroImage: u('photo-1606744888344-493238951221'),
    featured: false,
    meta: {
      origin: 'Jaipur, Rajasthan',
      materials: 'Wool, Silk highlights',
      knotDensity: '12–16 per inch²',
      leadTime: '10–14 months',
    },
    rugs: [
      {
        slug: 'rug-01',
        name: 'Piece 01',
        description: 'Archive medallion, 1920s Tabriz pattern.',
        price: 'From $18,800',
        priceUSD: 18800,
        image: u('photo-1606744888344-493238951221', 900, 1200),
      },
      {
        slug: 'rug-02',
        name: 'Piece 02',
        description: 'Safavid floral field from 1890s plate.',
        price: 'From $22,400',
        priceUSD: 22400,
        image: u('photo-1600166898405-da9535204843', 900, 1200),
      },
      {
        slug: 'rug-03',
        name: 'Piece 03',
        description: 'Tribal archive, Qashqai pattern.',
        price: 'From $14,600',
        priceUSD: 14600,
        image: u('photo-1567016526105-22da7c13161a', 900, 1200),
      },
      {
        slug: 'rug-04',
        name: 'Piece 04',
        description: 'Mughal floral, original 17th-century proportions.',
        price: 'From $26,800',
        priceUSD: 26800,
        image: u('photo-1567016376408-0226e4d0c1ea', 900, 1200),
      },
      {
        slug: 'rug-05',
        name: 'Piece 05',
        description: 'Chinese cloud-band, heritage palette.',
        price: 'From $19,200',
        priceUSD: 19200,
        image: u('photo-1555041469-a586c61ea9bc', 900, 1200),
      },
      {
        slug: 'rug-06',
        name: 'Piece 06',
        description: 'Caucasian village rug, documented 1905.',
        price: 'From $16,400',
        priceUSD: 16400,
        image: u('photo-1581873372796-635b67ca2008', 900, 1200),
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getRugBySlug(
  collectionSlug: string,
  rugSlug: string
): { collection: Collection; rug: Rug } | undefined {
  const collection = getCollectionBySlug(collectionSlug);
  if (!collection) return undefined;
  const rug = collection.rugs.find((r) => r.slug === rugSlug);
  if (!rug) return undefined;
  return { collection, rug };
}

export const featuredCollections = collections.filter((c) => c.featured);
