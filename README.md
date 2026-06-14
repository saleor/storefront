[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsaleor%2Fstorefront&env=NEXT_PUBLIC_SALEOR_API_URL%2CNEXT_PUBLIC_DEFAULT_CHANNEL%2CNEXT_PUBLIC_DEFAULT_LOCALE%2CNEXT_PUBLIC_STOREFRONT_LOCALES&envDescription=Your%20Saleor%20API%20URL%20is%20the%20GraphQL%20endpoint%20of%20your%20instance%20(e.g.%20https%3A%2F%2Fyour-instance.saleor.cloud%2Fgraphql%2F).%20The%20channel%20slug%20can%20be%20found%20in%20Saleor%20Dashboard%20under%20Configuration%20%3E%20Channels%20(e.g.%20default-channel).%20For%20multi-channel%2C%20set%20STOREFRONT_CHANNELS%20(e.g.%20us%2Cuk)%20and%20optionally%20SALEOR_APP_TOKEN%20for%20the%20footer%20selector.%20For%20locales%2C%20set%20NEXT_PUBLIC_DEFAULT_LOCALE%20(e.g.%20en)%20and%20NEXT_PUBLIC_STOREFRONT_LOCALES%20(e.g.%20en%2Cpl%2Cde%2Cfr%2Cfi%2Cnb).&envLink=https%3A%2F%2Fgithub.com%2Fsaleor%2Fstorefront%23environment-variables&project-name=my-saleor-storefront&repository-name=my-saleor-storefront&demo-title=Saleor%20Next.js%20Storefront&demo-description=Starter%20pack%20for%20building%20performant%20e-commerce%20experiences%20with%20Saleor.&demo-url=https%3A%2F%2Fstorefront.saleor.io%2F&demo-image=https%3A%2F%2Fstorefront-d5h86wzey-saleorcommerce.vercel.app%2Fopengraph-image.png%3F4db0ee8cf66e90af>)

<img width="1920" height="1080" alt="saleor-storefront-paper-fin" src="https://github.com/user-attachments/assets/a8e37c20-35c8-42e0-a9c5-5c0b6097b921" />

<br/>
<br/>
<div align="center">
<img width="180" height="180" alt="apple-touch-icon-dark" src="https://github.com/user-attachments/assets/5327c1d3-86eb-4e5b-811a-81e8a5561d19" />
  <h1>Paper</h1>
  <p>A minimal, production-ready storefront template for <a href="https://github.com/saleor/saleor">Saleor</a>.<br/>Clean as a blank page — built to ship with agents and humans.</p>
</div>

<br/>

<div align="center">
  <a href="https://saleor.io/start">Learn about headless storefronts</a>
  <span> · </span>
  <a href="https://saleor.io/">Website</a>
  <span> · </span>
  <a href="https://docs.saleor.io/docs/3.x">Docs</a>
  <span> · </span>
  <a href="https://saleor.io/discord">Discord</a>
</div>

<br/>

> [!TIP]
> Questions or issues? Check our [Discord](https://saleor.io/discord) for help.

---

## Why Paper?

**Ship faster, customize everything.** Paper is a new release—expect some rough edges—but every component is built with real-world e-commerce in mind. This is a foundation you can actually build on.

### 🛒 Open Checkout (v2)

The checkout is where most storefronts fall apart or fall short. Paper's doesn't — and **checkout v2** aligns it with the rest of the stack: App Router, Server Components, server actions, and the same BFF session as the storefront (no client-side urql or browser Saleor tokens).

```
Storefront cart                    Checkout surface
─────────────                      ────────────────
src/lib/checkout.ts                src/app/(checkout)/checkout/
  cookie + mutations        →        CheckoutSessionLoader (RSC)
@paper/session-bridge                  CheckoutApp → steps + payment
buildCheckoutPath()                  /checkout/complete?order= (confirmation)
```

- **Server-first cart** — RSC loads checkout + `me` on entry; client context is a cache of server truth (`CheckoutDataProvider`).
- **URL-driven steps** — `?step=contact|shipping|payment` updates shallowly (no full page refetch per click); browser Back walks the funnel.
- **Dedicated confirmation** — `/checkout/complete?order=` is separate from the active cart route.
- **Extensible payments** — Registry (`INTEGRATED_GATEWAYS`) with Stripe + Dummy; add gateways via `checkout-payment-gateways` skill.
- **Shared BFF auth** — Sign-in via `/api/auth/login`; session resolved server-side (`resolveSessionUser` — guest / authenticated / unavailable).
- **Multi-step, mobile-first** — Focused forms, international address fields, composable step components.

**Developer docs:** start at [`skills/saleor-paper-storefront/rules/paper-surfaces.md`](skills/saleor-paper-storefront/rules/paper-surfaces.md), then [`checkout-management.md`](skills/saleor-paper-storefront/rules/checkout-management.md). Forks on the old urql checkout: [`migrations/atomic/2026-06-checkout-v2/`](skills/saleor-paper-storefront/migrations/atomic/2026-06-checkout-v2/MIGRATION.md).

### 🌍 International by Default

One codebase, many markets. Browse URLs are **`/{locale}/{channel}/…`** — e.g. `/en/us/products/hoodie` (English, US market, USD) and `/fr/fr/products/hoodie` (French, France, EUR) — with legacy `/{channel}/…` paths redirecting automatically. Each locale gets its own cached catalog payload, translated product copy from Saleor, per-channel pricing and currency, and hreflang/canonical metadata.

- **Region picker** — header control switches locale and channel together (language + market + currency)
- **Three string systems** — Saleor catalog translations, merchant-editable storefront content (CMS), and code-owned UI via **next-intl** (`messages/{locale}.json`)
- **Six built-in locales** — `en`, `pl`, `de`, `fr`, `fi`, `nb` (extend via `LOCALE_DEFINITIONS` in `src/config/locale.ts`)

**Storefront channels are explicit.** Saleor may have many channels (B2B, wholesale, internal regions); Paper only exposes the slugs you configure via `STOREFRONT_CHANNELS`. Disallowed channel URLs return 404. For a single-channel store, set `NEXT_PUBLIC_DEFAULT_CHANNEL` only—the footer channel selector is hidden automatically.

**Developer docs:** [`docs/international-storefront.md`](docs/international-storefront.md) · ADRs [0001](docs/adr/0001-locale-channel-url-routing.md) / [0002](docs/adr/0002-cms-copy-vs-code-owned-ui-strings.md) · skills [`ui-locale-routing`](skills/saleor-paper-storefront/rules/ui-locale-routing.md) / [`ui-i18n`](skills/saleor-paper-storefront/rules/ui-i18n.md)

### 📱 Product Pages Done Right

The hard parts are solved. Adapt the look, keep the logic.

- **Partial Prerendering (PPR)** — Product name, attributes, and SEO stay in a static cached shell; variant gallery and add-to-cart stream in via Suspense when `searchParams` change.
- **Multi-attribute variant selection** — Color + Size + Material? Handled. Complex variant matrices just work.
- **Dynamic pricing** — Sale prices, variant-specific pricing, channel pricing—all reactive.
- **Image gallery** — Next.js Image optimization, proper aspect ratios, keyboard navigation.

### ♿ Accessibility Built In

Not an afterthought. Focus management on step transitions, keyboard navigation everywhere, semantic HTML, proper ARIA labels. Everyone deserves to shop.

### 🤖 AI-Ready Codebase

Built for front-end developers _and_ AI agents. The codebase includes:

- **`AGENTS.md`** — Architecture overview and quick reference for AI assistants
- **[`skills/saleor-paper-storefront/`](skills/saleor-paper-storefront/)** — 21 task-specific rules covering GraphQL, caching, i18n, variant selection, checkout v2, and more
- **[saleor/agent-skills](https://github.com/saleor/agent-skills)** — Universal Saleor API patterns; install additional skills (React best practices, composition patterns) via `npx skills add`
- **Consistent patterns** — Predictable structure that AI tools can navigate and modify confidently

Whether you're pair-programming with Cursor, Claude, or Copilot—the codebase is designed to help them help you.

### ⚡ Bleeding Edge Stack

- **Next.js 16** with App Router and Server Components
- **React 19** with the latest concurrent features
- **TypeScript** in strict mode—your IDE will thank you
- **Tailwind CSS** with design tokens (OKLCH colors, CSS variables)
- **GraphQL Codegen** for type-safe Saleor API calls

---

## What's in the Box

| Feature                    | Description                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| **Checkout (v2)**          | RSC + server actions, shallow step URLs, payment registry (Stripe/Dummy), `/checkout/complete`      |
| **Cart**                   | Slide-over drawer with real-time updates, quantity editing                                          |
| **Product Pages**          | Multi-attribute variants, image gallery, sticky add-to-cart                                         |
| **Product Listings**       | Category & collection pages with PPR (cached hero + dynamic filters), pagination                    |
| **International**          | `/{locale}/{channel}/` routing, region picker, Saleor translations, next-intl UI, hreflang SEO      |
| **Storefront content**     | Merchant-editable copy layer (code or Saleor Models) — homepage, cart trust, checkout editorial     |
| **Navigation**             | Dynamic menus from Saleor, mobile hamburger, breadcrumbs                                            |
| **SEO**                    | Per-locale metadata, JSON-LD, Open Graph images, hreflang alternates                                |
| **Caching**                | Cache Components (PPR), named cacheLife tiers, per-locale catalog cache, webhooks                   |
| **Saleor Cloud Paper app** | Saleor Cloud only — Dashboard extension for cache invalidation webhooks and _Preview in storefront_ |
| **Customer Profile**       | Account dashboard, address book, order history, password change, account deletion                   |
| **Authentication**         | Login, register, password reset, guest checkout                                                     |
| **API Resilience**         | Automatic retries, rate limiting, timeouts—handles flaky connections gracefully                     |

---

## Caching Architecture

Paper uses **Cache Components** (Partial Prerendering) for optimal performance—static shells load instantly while dynamic content streams in. Learn more in the [Next.js documentation](https://nextjs.org/docs/app/api-reference/directives/use-cache) or see [`skills/saleor-paper-storefront/rules/data-caching.md`](skills/saleor-paper-storefront/rules/data-caching.md) for project-specific implementation details.

The **display-cached, checkout-live** model ensures fast browsing with accurate checkout:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA FRESHNESS                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Product Pages          Cart / Checkout         Payment            │
│   ──────────────         ──────────────          ───────            │
│                                                                     │
│   ┌───────────┐         ┌───────────┐          ┌───────────┐       │
│   │  CACHED   │────────▶│   LIVE    │─────────▶│   LIVE    │       │
│   │  5 min    │  Add    │  Always   │   Pay    │  Always   │       │
│   └───────────┘  to     └───────────┘          └───────────┘       │
│                  Cart                                               │
│   Fast page loads        Real-time prices       Saleor validates    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### How It Works

| Component               | Freshness          | Why                                                                |
| ----------------------- | ------------------ | ------------------------------------------------------------------ |
| **Product pages**       | Cached (`catalog`) | Static shell + dynamic variant islands (PPR)                       |
| **Category/Collection** | Cached (`catalog`) | Cached hero from params; filters/pagination stream in Suspense     |
| **Homepage featured**   | Cached (`catalog`) | Sync page shell; product grid streams in nested Suspense           |
| **Navigation / footer** | Cached (`menus`)   | Per-channel tags; per-locale menu payloads in cache keys           |
| **Storefront content**  | Cached (`menus`)   | Tag `storefront-content:{channel}:{locale}`                        |
| **Cart drawer**         | Always live        | Saleor API with `cache: "no-cache"`                                |
| **Checkout**            | Always live        | RSC entry + server actions (`cache: "no-cache"`), real-time totals |

**cacheLife tiers** (see `src/lib/cache-life-profiles.ts`):

| Profile    | Fallback TTL | Used for                                    |
| ---------- | ------------ | ------------------------------------------- |
| `catalog`  | ~5 min       | Products, categories, collections, homepage |
| `menus`    | ~1 hr        | Header nav, footer menu                     |
| `channels` | ~1 day       | Footer channel metadata                     |

Webhook `revalidateTag(tag, profile)` clears data immediately; TTL is the safety net when webhooks are missing.

### Locale

Browse URLs are `/{locale}/{channel}/…`. Cached catalog fetches pass `localeSlug` — **separate cache entry per language**, same warm-path speed. Invalidation uses slug-scoped tags (`product:{slug}`) and revalidates every locale path via `buildPathsForAllLocales()`. GraphQL uses Saleor base language codes (`PL`, not `PL_PL`). See [`data-caching.md`](skills/saleor-paper-storefront/rules/data-caching.md) § Locale & Caching.

### PPR page patterns

Cached GraphQL lives in **`src/lib/catalog/`**, **`src/lib/menus/`**, and **`src/lib/channels/`** — not in layout or page components. Pages are thin orchestrators with nested `<Suspense>` for dynamic islands.

**PDP** — `params` only in the static shell; gallery and variant selection read `searchParams`:

```
ProductPage (sync)
└── ProductShell → getProductData(slug, channel, locale) "use cache"
    ├── h1, attributes, JSON-LD, LCP preload
    ├── Suspense → VariantGalleryDynamic (searchParams)
    └── Suspense → VariantSectionDynamic (searchParams)
```

**PLP** (category, collection, all products) — cached hero/metadata from params; filter/sort/pagination in a dynamic grid:

```
Page
├── CategoryHero ← getCategoryData "use cache"
└── Suspense → CategoryProducts (searchParams, always fresh fetch)
```

**Homepage** — sync `<section>` shell; featured collection grid in nested Suspense.

**Loading UX** — route-level `loading.tsx` files (products, categories, collections) show skeletons during navigation. The main layout does not wrap `{children}` in `Suspense fallback={null}`.

**Cache tags** (see `src/lib/cache-manifest.ts`):

| Tag pattern                             | Invalidated when                 |
| --------------------------------------- | -------------------------------- |
| `product:{slug}`                        | Product updated (all locales)    |
| `category:{slug}`                       | Category updated (all locales)   |
| `collection:{slug}`                     | Collection updated (all locales) |
| `page:{slug}`                           | CMS page updated (all locales)   |
| `navigation:{channel}`                  | Main menu changed for channel    |
| `footer-menu:{channel}`                 | Footer menu changed for channel  |
| `storefront-content:{channel}:{locale}` | Storefront Models page updated   |
| `channels`                              | Channel list metadata            |

Featured homepage products use tag `collection:featured-products` (same `catalog` profile as collections).

### Instant Updates with Webhooks

**Saleor Cloud (recommended):** Install the [**Saleor Cloud Paper app**](https://github.com/saleor/saleor-paper-app) from Dashboard → Extensions. Available on Saleor Cloud only for now. It registers revalidation webhooks for products, categories, collections, pages, menus, and promotions; discovers cache tags via `/api/cache-info`; and adds _Preview in storefront_ on product pages in Dashboard.

**Self-hosted / manual setup:**

1. Create webhooks in Saleor Dashboard → Configuration → Webhooks
2. Point to `https://your-store.com/api/revalidate`
3. Subscribe to product/category/collection/page events; for menus use `MENU_*` / `MENU_ITEM_*` and include `{ menu: { slug } }` for `navbar` and `footer` menus
4. Set `SALEOR_WEBHOOK_SECRET` env var

**Manual revalidation** (requires `REVALIDATE_SECRET`):

```bash
# Single product (all locale cache entries for slug)
curl "https://your-store.com/api/revalidate?secret=xxx&tag=product:blue-hoodie"

# Single product path (one locale; tag still clears all locales)
curl "https://your-store.com/api/revalidate?secret=xxx&tag=product:blue-hoodie&path=/pl/default-channel/products/blue-hoodie"

# CMS page (tag only — invalidates getPageData across channels)
curl "https://your-store.com/api/revalidate?secret=xxx&tag=page:about-us"

# Navigation for one channel (tag or tag + channel query)
curl "https://your-store.com/api/revalidate?secret=xxx&tag=navigation:us"
curl "https://your-store.com/api/revalidate?secret=xxx&tag=navigation&channel=us"

# All tags for every storefront channel
curl "https://your-store.com/api/revalidate?secret=xxx&all=1"
```

Without webhooks? TTL handles it—cached data expires per the `catalog` / `menus` / `channels` profiles above.

### Why This Is Safe

- **Saleor is the source of truth**: `checkoutLinesAdd` calculates prices server-side
- **Cart always fetches fresh**: Users see current prices before checkout
- **Payment validates**: `checkoutComplete` uses real-time data

> 📚 **Deep dive**: See [`skills/saleor-paper-storefront/rules/data-caching.md`](skills/saleor-paper-storefront/rules/data-caching.md) for the full architecture, Cache Components (PPR), webhook setup, and debugging guide.

---

## Quick Start

> [!NOTE]
> New to Saleor? Check out [saleor.io/start](https://saleor.io/start) to learn how storefronts work underneath.

### 1. Get a Saleor Backend

**Option A:** Free [Saleor Cloud](https://cloud.saleor.io/?utm_source=storefront&utm_medium=github) account (recommended)

**Option B:** [Run locally with Docker](https://docs.saleor.io/docs/3.x/setup/docker-compose)

### 2. Clone & Configure

```bash
# Using Saleor CLI (recommended)
npm i -g @saleor/cli@latest
saleor storefront create --url https://{YOUR_INSTANCE}/graphql/

# Or manually
git clone https://github.com/saleor/storefront.git
cd storefront
cp .env.example .env
pnpm install
```

Edit `.env` with your Saleor instance details:

```bash
NEXT_PUBLIC_SALEOR_API_URL=https://your-instance.saleor.cloud/graphql/
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel  # Your Saleor channel slug
```

**Multi-channel** (recommended — explicit allowlist):

```bash
STOREFRONT_CHANNELS=us,uk,eu
NEXT_PUBLIC_DEFAULT_CHANNEL=us
NEXT_PUBLIC_STOREFRONT_LOCALES=en,pl,de,fr,fi,nb  # URL locale slugs
SALEOR_APP_TOKEN=...  # Server-side only — footer currency selector metadata
```

> **Finding your channel slug:** In Saleor Dashboard → Configuration → Channels → copy the slug

> **Note:** `SALEOR_APP_TOKEN` alone no longer auto-discovers every Saleor channel. Set `STOREFRONT_CHANNELS` or opt in with `STOREFRONT_DISCOVER_CHANNELS=true` (see [Environment Variables](#environment-variables)).

### 3. Run

```bash
pnpm dev
```

Open [localhost:3000](http://localhost:3000). That's it.

---

## Development

### Commands

```bash
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm run generate           # Regenerate GraphQL types (storefront)
pnpm run generate:checkout  # Regenerate GraphQL types (checkout)
```

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (storefront)/[locale]/[channel]/  # Browse, cart, account
│   └── (checkout)/checkout/              # Checkout route (/checkout)
├── messages/               # next-intl UI strings (per locale)
├── session-bridge/         # @paper/session-bridge — storefront ↔ checkout handoff
├── checkout/               # Checkout UI, providers, payment registry (GraphQL via server actions)
├── graphql/                # GraphQL queries
├── gql/                    # Generated types (don't edit)
├── lib/                    # Server utilities & cached data layer
│   ├── catalog/            # getCategoryData, getCollectionData, getFeaturedProducts
│   ├── menus/              # getNavbarMenuItems, getFooterMenuItems
│   ├── channels/           # getCachedChannelsList
│   ├── cache-manifest.ts   # Tag registry + cacheLife mapping
│   └── cache-life-profiles.ts
├── ui/components/          # UI components
│   ├── account/            # Customer profile & address book
│   ├── pdp/                # Product detail page
│   ├── plp/                # Product listing page
│   ├── cart/               # Cart drawer
│   └── ui/                 # Primitives (Button, Badge, etc.)
└── styles/brand.css        # Design tokens
```

### For AI Agents

If you're working with AI coding assistants, point them to:

- **`AGENTS.md`** — Architecture, commands, gotchas
- **`skills/saleor-paper-storefront/`** — 21 project-specific rules (GraphQL, caching, i18n, checkout, etc.)
- **[saleor/agent-skills](https://github.com/saleor/agent-skills)** — Universal Saleor patterns and optional community skills (React best practices, composition patterns, etc.)

To install skills for agent auto-discovery:

```shell
# Project skill (already in this repo)
npx skills add . --skill saleor-paper-storefront

# Universal Saleor API patterns
npx skills add saleor/agent-skills --skill saleor-storefront
```

### Environment Variables

```env
# Required
NEXT_PUBLIC_SALEOR_API_URL=https://your-instance.saleor.cloud/graphql/
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel  # Fallback channel; root "/" redirects here

# Multi-channel (recommended)
STOREFRONT_CHANNELS=us,uk,eu               # Comma-separated allowlist — routes, revalidation, footer

# Optional
NEXT_PUBLIC_STOREFRONT_URL=                  # Canonical URLs and OG images
NEXT_PUBLIC_DEFAULT_LOCALE=en                # Default URL locale slug
NEXT_PUBLIC_STOREFRONT_LOCALES=en,pl,de,fr,fi,nb  # Enabled locale slugs
REVALIDATE_SECRET=                           # Manual cache invalidation (GET /api/revalidate)
SALEOR_WEBHOOK_SECRET=                       # Webhook HMAC verification
SALEOR_APP_TOKEN=                            # Server-side: footer channel metadata (never exposed to client)
STOREFRONT_DISCOVER_CHANNELS=true            # Opt-in: discover ALL active Saleor channels from API
                                             # (not recommended when Saleor has many channels; prefer STOREFRONT_CHANNELS)
```

**Channel resolution order** (`getStorefrontChannelSlugs`):

1. `STOREFRONT_CHANNELS` — explicit allowlist _(recommended)_
2. `STOREFRONT_DISCOVER_CHANNELS=true` + `SALEOR_APP_TOKEN` — all active channels from API
3. `NEXT_PUBLIC_DEFAULT_CHANNEL` only — single-channel storefront

---

## Payments

The checkout architecture supports Saleor payment apps like [Adyen](https://docs.saleor.io/docs/3.x/developer/app-store/apps/adyen) and [Stripe](https://docs.saleor.io/docs/3.x/developer/app-store/apps/stripe). The heavy lifting is done—integrating your gateway requires minimal work compared to building from scratch.

---

## Customization

Paper works as a reference implementation and as a starting point for your own storefront. Start here:

- **Colors & typography** → `src/styles/brand.css`
- **Components** → `src/ui/components/`
- **Checkout flow** → `src/checkout/views/saleor-checkout/`

The design token system uses CSS custom properties—swap the entire color palette by editing a few lines.

---

## Next Steps

Known gaps and planned improvements:

- **Checkout functional i18n** — checkout step labels still live in storefront content (ADR 0002); migrate to next-intl
- **Filtering logic iteration** — fetching attributes from API for dynamic product filters
- **Error / not-found pages** — localized shells for global error boundaries

---

## License

[FSL-1.1-ALv2](./LICENSE) (Functional Source License, Version 1.1, ALv2 Future License) — use it, modify it, ship it. Build your storefront, run your business. The license converts to Apache 2.0 after two years.

Want to offer it as a managed service? [Let's talk](https://saleor.io/contact).

---

<div align="center">
  <br/>
  <p>Built with 🖤 by the <a href="https://saleor.io">Saleor</a> team</p>
</div>
