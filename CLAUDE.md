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

## Infrastructure & Deployment

### Architecture

All services run on a single Hetzner VPS (`46.224.112.183`):

| Service       | Image                                             | Port | Repo                               |
| ------------- | ------------------------------------------------- | ---- | ---------------------------------- |
| Storefront    | `infinitybio-storefront:latest` (built on server) | 3000 | `d4lvl13n/storefront`              |
| Dashboard     | `infinitybio-dashboard:latest` (built on server)  | 9000 | `d4lvl13n/saleor-dashboard` (fork) |
| Saleor API    | `ghcr.io/saleor/saleor:3.22`                      | 8000 | Official image                     |
| Celery Worker | `ghcr.io/saleor/saleor:3.22`                      | —    | Official image                     |
| Postgres      | `postgres:15-alpine`                              | —    | Official image                     |
| Valkey/Redis  | `valkey:8.1-alpine`                               | —    | Official image                     |

### Repos

| Repo                        | Purpose                                           | CI/CD                                                  |
| --------------------------- | ------------------------------------------------- | ------------------------------------------------------ |
| `d4lvl13n/storefront`       | Next.js storefront (this repo)                    | Push → SSH to Hetzner → build Docker image → restart   |
| `d4lvl13n/saleor-platform`  | Infra: docker-compose, nginx, scripts, env config | Push → SSH to Hetzner → pull images → restart services |
| `d4lvl13n/saleor-dashboard` | Saleor Dashboard fork (admin UI)                  | Push → SSH to Hetzner → build Docker image → restart   |

### Infra Repo (`saleor-platform`) Key Files

```
docker-compose.yml          # Local dev (all services, Jaeger, Mailpit)
docker-compose.prod.yml     # Production (API, worker, DB, cache + profiles for frontend)
backend.prod.env            # Prod secrets (gitignored, written from GitHub Secrets)
common.prod.env             # Prod common config (gitignored)
.env.prod                   # Prod env vars for compose (gitignored)
nginx/                      # Reverse proxy config (for when domains are added)
scripts/backup-db.sh        # Postgres backup (14-day retention)
scripts/deploy.sh           # Manual deploy helper
scripts/init-ssl.sh         # First-time Let's Encrypt cert setup
.github/workflows/deploy.yml  # Auto-deploy on push
```

### CI/CD Flow

**Storefront push:**

1. GitHub Actions SSHs into Hetzner
2. Pulls latest code to `/opt/storefront`
3. Builds Docker image on server (`--network=host` so `next build` can reach the Saleor API on localhost:8000)
4. Restarts storefront container via `docker compose --profile frontend up -d`

**Infra push:**

1. GitHub Actions SSHs into Hetzner
2. Pulls latest code to `/opt/saleor`
3. Writes env files from GitHub Secrets
4. Pulls remote images (Saleor API, Postgres, etc.) and restarts

### Docker Compose Profiles

Backend services (api, worker, db, cache) run by default. Storefront and dashboard use the `frontend` profile since their images are built locally:

```bash
# Backend only (default deploy)
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Include frontend services
docker compose -f docker-compose.prod.yml --profile frontend --env-file .env.prod up -d
```

### Build Gotchas

- **Generated GraphQL types must be committed** — `src/gql/` and `src/checkout/graphql/generated/` are checked in because codegen can't run during Docker build (needs live Saleor API)
- **Storefront Docker build uses `--network=host`** — so `next build` prerender can reach the Saleor API at `localhost:8000`
- **`NEXT_OUTPUT=standalone`** env var in Dockerfile enables standalone output mode
- **Dockerfile runs `npx next build` directly** (not `pnpm build`) to skip the `prebuild` codegen step

### GitHub Secrets

**`d4lvl13n/saleor-platform`**: `HETZNER_HOST`, `HETZNER_USER`, `HETZNER_SSH_KEY`, `GH_PAT`, `BACKEND_PROD_ENV`, `COMMON_PROD_ENV`, `DOT_ENV_PROD`

**`d4lvl13n/storefront`**: `HETZNER_HOST`, `HETZNER_USER`, `HETZNER_SSH_KEY`, `GH_PAT`

**`d4lvl13n/storefront` vars**: `NEXT_PUBLIC_SALEOR_API_URL`, `NEXT_PUBLIC_STOREFRONT_URL`, `NEXT_PUBLIC_DEFAULT_CHANNEL`

### Pending

- Domain names + nginx SSL (run `scripts/init-ssl.sh` after DNS is pointed)
- DB migration from local to production
- Postgres backup cron job on server
