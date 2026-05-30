# Carpetstory

Carpetstory is a high-performance, meticulously designed marketing site for a luxury handmade rug atelier based in Jaipur, India. It brings tactile experiences to the web through Framer Motion, Lenis smooth scrolling, and bespoke editorial UI components.

## Tech Stack

- **Framework**: Next.js 14+ (App Router, Turbopack)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (Custom Editorial Theme)
- **Components**: `shadcn/ui` (Button, Input, Textarea, Select, Sonner)
- **Motion & Scroll**: Framer Motion, Lenis (`lenis`)
- **Typography**: `next/font` (Fraunces, Inter Tight, Caveat)
- **Internationalization**: `next-intl` (App Router implementation)
- **Content**: MDX (`@next/mdx`, `next-mdx-remote`)
- **Forms**: `react-hook-form`, Zod, Server Actions (Resend API)
- **Carousel**: Embla Carousel (`embla-carousel-react`)
- **SEO**: Native App Router Metadata API, dynamic OG images (`ImageResponse`), automated JSON-LD

## Local Development Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Environment Variables**

   ```bash
   cp .env.example .env.local
   ```

   _Note: Populate `RESEND_API_KEY` to enable email delivery via the contact form._

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Formatting and Linting**

   ```bash
   pnpm lint
   pnpm prettier --write .
   ```

5. **Build for production**
   ```bash
   pnpm build
   pnpm start
   ```

## Project Structure

```text
carpetstory/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx               # Root layout (Lenis, Toast, JSON-LD)
│   │   ├── page.tsx                 # Home — composes all editorial sections
│   │   ├── collection/
│   │   │   ├── page.tsx             # Full 24-piece grid
│   │   │   └── [slug]/page.tsx      # Individual rug detail page
│   │   ├── craft/page.tsx           # Standalone "The Making" + "Materials"
│   │   ├── heritage/page.tsx        # Heritage + Letter
│   │   ├── journal/                 # Blog
│   │   │   ├── page.tsx             # Journal index
│   │   │   └── [slug]/page.tsx      # MDX post renderer
│   │   ├── trade/page.tsx           # For Interior Designers
│   │   ├── inquiry/page.tsx         # Standalone inquiry form
│   │   └── not-found.tsx
│   ├── api/
│   │   └── inquiry/route.ts         # POST handler (Zod + Resend)
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── globals.css                  # Tailwind directives + CSS vars
│   └── opengraph-image.tsx          # Dynamic OG image generator
├── components/
│   ├── ui/                          # shadcn primitives
│   └── editorial/                   # Custom editorial components
├── content/
│   └── journal/                     # MDX blog posts
├── messages/                        # i18n translation files
├── i18n/                            # Routing & config for next-intl
├── lib/                             # Utility functions, Pieces DB, Schemas
├── hooks/                           # Custom React hooks (Lenis, scroll, etc.)
└── public/                          # Static assets (images, videos)
```

## Content Management Guide

### Adding a new piece to the Collection

1. Open `lib/pieces.ts`.
2. Add a new object to either the `heroPieces` or `extendedPieces` array.
3. Ensure the `slug` is unique.
4. Add the corresponding high-res image to `public/images/collection/<slug>.jpg`.

### Adding a new Journal Post

1. Create a new `.mdx` file in the `content/journal/` directory.
2. Ensure the frontmatter includes:
   ```yaml
   ---
   title: 'Post Title'
   excerpt: 'Short summary...'
   date: 'YYYY-MM-DD'
   author: 'Author Name'
   coverImage: 'https://... or /images/...'
   tags: ['tag1', 'tag2']
   ---
   ```
3. The post will automatically appear on the `/journal` index page and generate its own `/[slug]` route.

### Adding a new Locale

1. Create a new JSON file in the `messages/` directory (e.g., `es.json`).
2. Add the locale code (`es`) to the `locales` array in `i18n/config.ts`.
3. Add the localized path configuration to `i18n/routing.ts`.

### Customizing the Immersive Video

1. Drop your new video file into `public/videos/`.
2. Update the `<video>` `src` path in `components/editorial/ImmersiveVideo.tsx`.

## Deployment

### Vercel (Recommended)

This repository is optimized for Vercel.

1. Import the repository in your Vercel dashboard.
2. The Build Command (`next build`) and Output Directory (`.next`) will be auto-detected.
3. Add your `RESEND_API_KEY` and `NEXT_PUBLIC_SITE_URL` in the Environment Variables settings.
4. Deploy.

### Self-Hosting (Node.js)

```bash
pnpm build
pnpm start
```

## Environment Variables

- `RESEND_API_KEY`: Used by `/app/actions/inquiry.ts` to dispatch emails via Resend. If left blank, inquiries will log to the server console instead.
- `NEXT_PUBLIC_SITE_URL`: The canonical URL for the production site, required for generating precise absolute URLs in the Sitemap and Robots.txt.
