# Storefront — InfinityBio Labs

## Project Overview

E-commerce storefront for InfinityBio Labs, a biotech/peptide research supplier. Built on Saleor (headless commerce) with a Next.js frontend.

**Brand**: InfinityBio Labs — pharmaceutical-grade research peptides
**Theme**: Full dark design (emerald/teal accents on near-black backgrounds)

## Tech Stack

- **Framework**: Next.js 16 (App Router) with Turbopack
- **Backend**: Saleor GraphQL (headless commerce)
- **Styling**: Tailwind CSS with OKLCH CSS variables (`src/styles/brand.css`)
- **Fonts**: Geist Sans / Geist Mono (via Next.js font system)
- **Language**: TypeScript
- **Package manager**: pnpm
- **GraphQL codegen**: auto-runs via `predev`/`prebuild` scripts

## Commands

```bash
pnpm dev              # Start dev server (webpack mode, runs codegen first)
pnpm dev:turbopack    # Start dev server (turbopack mode)
pnpm build            # Production build
pnpm lint             # ESLint
pnpm test             # Vitest
pnpm generate:all     # Regenerate GraphQL types
```

To start dev server directly (skip codegen): `npx next dev --turbopack`

## Key Directories

```
src/
  app/[channel]/(main)/     # Main storefront pages (layout, page, homepage-faq)
  app/globals.css            # Global CSS (header transparency rules, utilities)
  styles/brand.css           # Design tokens (OKLCH colors, light/dark themes)
  ui/components/             # Shared components (header, footer, cart, nav)
  ui/atoms/                  # Atomic components (links, image wrappers)
  lib/                       # Utilities, GraphQL client
  gql/                       # Auto-generated GraphQL types (DO NOT EDIT)
```

## Critical Gotchas

### OKLCH + Tailwind opacity modifiers DO NOT WORK

`bg-background/95` generates invalid CSS when `--background` is an OKLCH value. Use inline `style={{ backgroundColor: "var(--background)" }}` or explicit colors instead.

### Turbopack cache causes hydration mismatches

If server and client render different HTML after code changes, clear `.next` and restart:

```bash
rm -rf .next && npx next dev --turbopack
```

### Header transparency system

- `ScrollHeader` (`src/ui/components/scroll-header.tsx`): Client component that makes the header transparent on the homepage at scroll top, solid when scrolled
- Uses `data-transparent` HTML attribute to trigger CSS color inversion rules in `globals.css`
- Hero section has `-mt-16 pt-16` to extend behind the sticky header
- `suppressHydrationWarning` is intentional (client-only state difference)

### Next.js 16 caching

Uses `"use cache"` directive with `cacheLife()` and `cacheTag()` — NOT the old `revalidate` export pattern.

## Design System

- **All homepage sections are dark** (`bg-foreground text-white`)
- Dark cards: `bg-neutral-900/60 border-neutral-800`
- Text hierarchy: `text-white` > `text-neutral-200` > `text-neutral-400` > `text-neutral-500`
- Accent: `text-emerald-400`, `bg-emerald-500`
- Section labels: `text-sm font-medium uppercase tracking-[0.25em] text-emerald-400`
- Section padding: `py-24 sm:py-32`
- Headings: `text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl`
- Custom utilities in globals.css: `.noise-overlay`, `.glow-emerald`, `.card-lift`
- Logo size: `h-9` in header

## Homepage Sections (in order)

1. Hero (dark, gradient orbs, hero image, `-mt-16` overlap)
2. Trust Bar (dark marquee)
3. Stats Banner (dark, 4-col grid)
4. Shop by Goal (dark, collection grid with glow-emerald hover)
5. Featured Products (dark, product cards)
6. Science & Quality (dark, COA card + quality pillars)
7. Best Sellers (dark, product cards)
8. Testimonials (dark, 3-col cards)
9. FAQ (dark, accordion — `homepage-faq.tsx`)
10. Newsletter (dark, gradient border card)
