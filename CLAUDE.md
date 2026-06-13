# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for Carpetstory, a luxury handmade rug atelier in Jaipur. Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4, managed with pnpm, deployed via Netlify (`netlify.toml` + `@netlify/plugin-nextjs`). No database or CMS — all catalog and content data is static TypeScript/MDX in the repo. There are no tests.

## Commands

```bash
pnpm dev            # dev server
pnpm build          # production build (also the main correctness check)
pnpm lint           # eslint (flat config, eslint-config-next)
pnpm format         # prettier --write . (has tailwindcss plugin)
pnpm format:check
```

Env vars (`.env.local`): `RESEND_API_KEY` (contact form email; without it, submissions log to console with a simulated delay), `NEXT_PUBLIC_SITE_URL` (canonical URL for sitemap/OG/JSON-LD).

## Architecture

### i18n wraps everything

All pages live under `app/[locale]/` (locales: `en`, `fr`, `de`; default `en`). `proxy.ts` (Next 16's middleware file) runs the next-intl middleware and forwards a `x-user-country` geo header used by `GeoBanner` to suggest a locale (automatic `localeDetection` is off). `i18n/routing.ts` defines locales and exports the locale-aware `Link`, `redirect`, `usePathname`, `useRouter` — import navigation from `@/i18n/routing`, not `next/link`/`next/navigation`, or locale prefixes break. Translations are in `messages/{en,fr,de}.json`; new locales must be added to `i18n/routing.ts` and `proxy.ts`'s matcher.

### Two parallel catalog data systems

- `lib/collections.ts` — the **current** model: 12 collections × 6 rugs each. Drives `/collection`, `/collection/[slug]`, `/collection/[slug]/[rugSlug]`, `/rugs`, and the shortlist. `lib/rugs.ts` flattens it into a faceted index for `/rugs` and **synthesizes placeholder facets** (size, colour) when rugs lack real `dimensions`/`colors` fields — add the real fields in `collections.ts` and `buildFlatRug` prefers them automatically.
- `lib/pieces.ts` — the **legacy** flat 24-piece model, still used by the homepage `Collection.tsx` section, `PieceCard`, and `/collection`'s `ArchiveContent`. Retired piece slugs get 301 redirects in `next.config.mjs`.

When adding or editing rugs, work in `lib/collections.ts` unless the change targets the homepage hero grid.

Other placeholder data flagged in-source: `lib/estimate.ts` pricing numbers (`ESTIMATE_CONFIG`) are not real economics; most imagery is Unsplash URLs pending real photography (image path conventions are documented at the top of `lib/collections.ts`).

### Styling: editorial.css is the design system

`app/editorial.css` (~6,000 lines, imported by `app/globals.css`) holds the entire design language: CSS custom properties (`--canvas`, `--ink`, `--accent`, `--wool`…), a documented z-index scale, a fluid spacing scale, and hand-written component classes.

Spacing is tokenized: `--gutter` (page-edge x padding, 20→48px fluid), `--section-y` (section band y padding, 80→100px), `--page-top` / `--page-top-flush` (standalone-page top offsets), `--pad-frame`, `--stack-xl/lg`, `--container-max` — all defined in the `:root` of editorial.css and bridged into Tailwind via `@theme` in globals.css as `px-gutter`, `pb-section`, `pt-page-top`, `pt-page-flush`, `space-y-section`, `max-w-site`. Never hardcode section paddings, page gutters, or page top offsets — use the tokens (as `var(--…)` in CSS/inline styles, or the bridged utilities in JSX). `app/globals.css` contains only Tailwind v4 directives plus an `@theme` block that maps Tailwind tokens (`text-accent`, `text-ink-soft`, `font-display`…) onto the editorial.css variables — without those mappings, Tailwind v4 silently generates no utility. Components mix Tailwind utilities with editorial.css classes; match whichever the surrounding component uses.

### Two animation systems coexist

1. `components/editorial/GlobalAnimations.tsx` (mounted once in the root layout) runs a vanilla-JS engine: the Lenis smooth-scroll rAF loop, intersection observers, counters, thread canvases. Because the layout never unmounts, it exposes `window.__carpetstory_rebind?.()` and re-invokes it after every client-side navigation so newly mounted DOM gets bound — new components relying on it must register through that rebind path.
2. Framer Motion (`motion/react`) per-component, governed by `<MotionConfig reducedMotion="user">` in the layout.

### Shallow URL state (filters + shortlist)

`lib/url.ts` updates query params via `window.history.replaceState` **instead of** `router.replace()`, which would re-run server components on every keystroke. The `/rugs` filters and the shortlist both write through it; each helper merges into the existing search string and only touches its own key so the params never clobber each other.

The shortlist (`lib/shortlist.ts` + `components/shortlist/`) treats the URL (`?shortlist=collectionSlug.rugSlug,…`) as the shareable source of truth, mirrored to localStorage, and validates every entry against `lib/collections.ts` data so stale/tampered links can't surface non-existent rugs.

### Forms, content, SEO

- Contact/inquiry uses a **server action** (`app/actions/inquiry.ts`) with Zod validation (`lib/schemas/inquiry.ts`) and Resend — there is no API route.
- Journal posts are `.mdx` files in `content/journal/` with frontmatter (`title`, `excerpt`, `date`, `author`, `coverImage`, `tags`), read by `lib/mdx.ts` (gray-matter + reading-time) and rendered with `next-mdx-remote` via `mdx-components.tsx`. New posts appear automatically.
- `lib/seo.ts` provides `generatePageMetadata()` and the schema.org JSON-LD builders injected in the root layout; use it for new pages rather than hand-rolling `Metadata`.

### Dead/reference files — do not extend

`carpetstory.html`, `extracted_styles.css` (repo root), `app/animations.js`, `app/herosvg.txt`, and `styles/editorial.css` are artifacts of the original static design that nothing imports. The live styles are `app/editorial.css`; the live animation code is in `GlobalAnimations.tsx`.
