[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsaleor%2Fstorefront&env=NEXT_PUBLIC_SALEOR_API_URL,NEXT_PUBLIC_DEFAULT_CHANNEL&envDescription=Your%20Saleor%20API%20URL%20is%20the%20GraphQL%20endpoint%20of%20your%20instance%20(e.g.%20https%3A%2F%2Fyour-instance.saleor.cloud%2Fgraphql%2F).%20The%20channel%20slug%20can%20be%20found%20in%20Saleor%20Dashboard%20under%20Configuration%20%3E%20Channels%20(e.g.%20default-channel).%20For%20multi-channel%2C%20set%20STOREFRONT_CHANNELS%20(e.g.%20us%2Cuk)%20and%20optionally%20SALEOR_APP_TOKEN%20for%20the%20footer%20selector.&envLink=https%3A%2F%2Fgithub.com%2Fsaleor%2Fstorefront%23environment-variables&project-name=my-saleor-storefront&repository-name=my-saleor-storefront&demo-title=Saleor%20Next.js%20Storefront&demo-description=Starter%20pack%20for%20building%20performant%20e-commerce%20experiences%20with%20Saleor.&demo-url=https%3A%2F%2Fstorefront.saleor.io%2F&demo-image=https%3A%2F%2Fstorefront-d5h86wzey-saleorcommerce.vercel.app%2Fopengraph-image.png%3F4db0ee8cf66e90af>)

<img width="1920" height="1080" alt="saleor-storefront-paper-fin" src="https://github.com/user-attachments/assets/a8e37c20-35c8-42e0-a9c5-5c0b6097b921" />

<br/>
<br/>
<div align="center">
<img width="180" height="180" alt="apple-touch-icon-dark" src="https://github.com/user-attachments/assets/5327c1d3-86eb-4e5b-811a-81e8a5561d19" />
  <h1>Paper</h1>
  <p>A minimal, production-ready storefront template for <a href="https://github.com/saleor/saleor">Saleor</a>.<br/>Clean as a blank page — built to ship.</p>
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
  <span> · </span>
  <a href="https://saleor.io/roadmap">Roadmap</a>
</div>

<br/>

> [!TIP]
> Questions or issues? Check our [Discord](https://saleor.io/discord) for help.

---

## Why Paper?

**Ship faster, customize everything.** Paper is a new release—expect some rough edges—but every component is built with real-world e-commerce in mind. This is a foundation you can actually build on.

### 🛒 Open Checkout

The checkout is where most storefronts fall apart or fall short. Paper's doesn't. We aim to provide open UI components and full wiring around the whole process.

- **Multi-step, mobile-first** — Each step is a focused form. No infinite scrolling on phones.
- **Guest & authenticated** — Seamless flow for everyone. Logged-in users get address book and saved preferences.
- **International address forms** — Country-aware fields that adapt (US states, UK postcodes, German formats).
- **Connection resilience** — Automatic retries with exponential backoff. Flaky networks? Handled.
- **Componentized architecture** — Swap steps, add steps, remove steps. It's your checkout.
- **Multi-channel ready** — Different currencies and shipping zones per channel.

### 🌍 Multi-Channel, Multi-Currency

One codebase, many storefronts. Channel-scoped routing means `/us/products` and `/eu/products` can serve different catalogs, prices, and shipping options—all from the same deployment.

**Storefront channels are explicit.** Saleor may have many channels (B2B, wholesale, internal regions); Paper only exposes the slugs you configure via `STOREFRONT_CHANNELS`. Disallowed channel URLs return 404. For a single-channel store, set `NEXT_PUBLIC_DEFAULT_CHANNEL` only—the footer channel selector is hidden automatically.

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
- **[`skills/saleor-paper-storefront/`](skills/saleor-paper-storefront/)** — 13 task-specific rules covering GraphQL, caching, variant selection, checkout, and more
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

| Feature              | Description                                                                       |
| -------------------- | --------------------------------------------------------------------------------- |
| **Checkout**         | Multi-step flow with guest/auth support, address selector, international forms    |
| **Cart**             | Slide-over drawer with real-time updates, quantity editing                        |
| **Product Pages**    | Multi-attribute variants, image gallery, sticky add-to-cart                       |
| **Product Listings** | Category & collection pages with PPR (cached hero + dynamic filters), pagination  |
| **Navigation**       | Dynamic menus from Saleor, mobile hamburger                                       |
| **SEO**              | Metadata, JSON-LD, Open Graph images                                              |
| **Caching**          | Cache Components (PPR), named cacheLife tiers, channel-scoped tags, webhooks      |
| **Customer Profile** | Account dashboard, address book, order history, password change, account deletion |
| **Authentication**   | Login, register, password reset, guest checkout                                   |
| **API Resilience**   | Automatic retries, rate limiting, timeouts—handles flaky connections gracefully   |

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

| Component               | Freshness          | Why                                                               |
| ----------------------- | ------------------ | ----------------------------------------------------------------- |
| **Product pages**       | Cached (`catalog`) | Static shell + dynamic variant islands (PPR)                      |
| **Category/Collection** | Cached (`catalog`) | Cached hero from params; filters/pagination stream in Suspense    |
| **Homepage featured**   | Cached (`catalog`) | Sync page shell; product grid streams in nested Suspense          |
| **Navigation / footer** | Cached (`menus`)   | Per-channel tags: `navigation:{channel}`, `footer-menu:{channel}` |
| **Cart drawer**         | Always live        | Saleor API with `cache: "no-cache"`                               |
| **Checkout**            | Always live        | Direct API calls, real-time totals                                |

**cacheLife tiers** (see `src/lib/cache-life-profiles.ts`):

| Profile    | Fallback TTL | Used for                                    |
| ---------- | ------------ | ------------------------------------------- |
| `catalog`  | ~5 min       | Products, categories, collections, homepage |
| `menus`    | ~1 hr        | Header nav, footer menu                     |
| `channels` | ~1 day       | Footer channel metadata                     |

Webhook `revalidateTag(tag, profile)` clears data immediately; TTL is the safety net when webhooks are missing.

### PPR page patterns

Cached GraphQL lives in **`src/lib/catalog/`**, **`src/lib/menus/`**, and **`src/lib/channels/`** — not in layout or page components. Pages are thin orchestrators with nested `<Suspense>` for dynamic islands.

**PDP** — `params` only in the static shell; gallery and variant selection read `searchParams`:

```
ProductPage (sync)
└── ProductShell → getProductData "use cache"
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

| Tag pattern             | Invalidated when                |
| ----------------------- | ------------------------------- |
| `product:{slug}`        | Product updated                 |
| `category:{slug}`       | Category updated                |
| `collection:{slug}`     | Collection updated              |
| `navigation:{channel}`  | Main menu changed for channel   |
| `footer-menu:{channel}` | Footer menu changed for channel |
| `channels`              | Channel list metadata           |

Featured homepage products use tag `collection:featured-products` (same `catalog` profile as collections).

### Instant Updates with Webhooks

Configure Saleor webhooks to invalidate cache immediately when data changes:

1. Create webhook in Saleor Dashboard → Configuration → Webhooks, **or** install the **Paper Storefront** app (registers product, category, collection, page, menu, and promotion webhooks automatically)
2. Point to `https://your-store.com/api/revalidate`
3. Subscribe to product/category/collection/page events; for menus use `MENU_*` / `MENU_ITEM_*` (Paper app forwards `{ menu: { slug } }` for `navbar` and `footer` menus)
4. Set `SALEOR_WEBHOOK_SECRET` env var

**Manual revalidation** (requires `REVALIDATE_SECRET`):

```bash
# Single product
curl "https://your-store.com/api/revalidate?secret=xxx&tag=product:blue-hoodie"

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
│   ├── [channel]/          # Channel-scoped routes
│   └── checkout/           # Checkout pages
├── checkout/               # Checkout components & logic
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
- **`skills/saleor-paper-storefront/`** — 13 project-specific rules (GraphQL, caching, checkout, etc.)
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
REVALIDATE_SECRET=                           # Manual cache invalidation (GET /api/revalidate)
SALEOR_WEBHOOK_SECRET=                       # Webhook HMAC verification
SALEOR_APP_TOKEN=                            # Server-side: footer channel metadata (never exposed to client)
STOREFRONT_DISCOVER_CHANNELS=true            # Opt-in: discover ALL active Saleor channels from API
                                             # (not recommended for large catalogs; prefer STOREFRONT_CHANNELS)
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
- **Checkout flow** → `src/checkout/views/SaleorCheckout/`

The design token system uses CSS custom properties—swap the entire color palette by editing a few lines.

---

## Next Steps

Features planned for future development:

- **Filtering logic iteration.** Fetching attributes from API for dynamic product filters.
- **Paper App.** Revalidation webhooks (products, categories, collections, menus) and _Preview in storefront_ in Dashboard.
- **Opinionated model for standard content.** Moving currently hardcoded stuff like Credibility or Free checkout information to API models.

---

## License

[FSL-1.1-ALv2](./LICENSE) (Functional Source License, Version 1.1, ALv2 Future License) — use it, modify it, ship it. Build your storefront, run your business. The license converts to Apache 2.0 after two years.

Want to offer it as a managed service? [Let's talk](https://saleor.io/contact).

---

<div align="center">
  <br/>
  <p>Built with 🖤 by the <a href="https://saleor.io">Saleor</a> team</p>
</div>
