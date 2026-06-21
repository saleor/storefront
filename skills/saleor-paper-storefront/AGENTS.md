# Saleor Paper Storefront

**Version 1.8.0**  
Saleor Paper  
June 2026

> **Note:** This document is mainly for agents and LLMs to follow when maintaining,
> generating, or refactoring this Saleor storefront codebase. Humans
> may also find it useful, but guidance here is optimized for automation
> and consistency by AI-assisted workflows.
>
> **Source of truth:** Individual rule files in `rules/` are updated first. Regenerate this file with:
> `node skills/saleor-paper-storefront/scripts/compile-agents.mjs`

---

## Abstract

Comprehensive guide for AI agents and LLMs maintaining the Saleor Paper storefront — a Next.js 16 e-commerce application with TypeScript, Tailwind CSS, and the Saleor GraphQL API. Covers 29 rules across 8 categories: architecture (canonical Next.js), data layer (caching, auth, GraphQL), product pages (PDP, variants, filtering), checkout flow (surfaces, management, payments, components), design & composition (token system, design quality, section catalog, page composition, design-from-image, verification), UI & i18n, SEO, and development practices. Each rule includes architecture diagrams, code examples, file locations, and anti-patterns.

---

## Table of Contents

0. [Architecture](#0-architecture) — **CRITICAL**

   - 0.1 [Paper Architecture](#01-paper-architecture)

1. [Data Layer](#1-data-layer) — **CRITICAL**

   - 1.1 [Caching Strategy](#11-caching-strategy)
   - 1.2 [GraphQL Workflow](#12-graphql-workflow)
   - 1.3 [Auth Routes (BFF)](#13-auth-routes-bff)
   - 1.4 [Storefront Content Layer](#14-storefront-content-layer)
   - 1.5 [Storefront Content (Saleor Models)](#15-storefront-content-saleor-models)
   - 1.6 [Storefront Content Attributes](#16-storefront-content-attributes)

2. [Product Pages](#2-product-pages) — **HIGH**

   - 2.1 [Product Detail Page](#21-product-detail-page)
   - 2.2 [Variant Selection](#22-variant-selection)
   - 2.3 [Product Filtering](#23-product-filtering)

3. [Checkout Flow](#3-checkout-flow) — **HIGH**

   - 3.1 [Paper Surfaces](#31-paper-surfaces)
   - 3.2 [Checkout Design Principles](#32-checkout-design-principles)
   - 3.3 [Checkout Management](#33-checkout-management)
   - 3.4 [Payment Gateways](#34-payment-gateways)
   - 3.5 [Checkout Components](#35-checkout-components)

4. [Design & Composition](#4-design-composition) — **HIGH**

   - 4.1 [UI Design System](#41-ui-design-system)
   - 4.2 [Design Quality Rubric](#42-design-quality-rubric)
   - 4.3 [UI Sections (Marketing Blocks)](#43-ui-sections-marketing-blocks)
   - 4.4 [Page Composition (PDP & Homepage)](#44-page-composition-pdp-homepage)
   - 4.5 [Design From Prompt or Image](#45-design-from-prompt-or-image)
   - 4.6 [Design Verification Gates](#46-design-verification-gates)

5. [UI & Channels](#5-ui-channels) — **MEDIUM**

   - 5.1 [UI Components](#51-ui-components)
   - 5.2 [Channels & Multi-Currency](#52-channels-multi-currency)
   - 5.3 [Locale & Channel URL Routing](#53-locale-channel-url-routing)
   - 5.4 [next-intl (Code-Owned UI Strings)](#54-next-intl-code-owned-ui-strings)

6. [SEO](#6-seo) — **MEDIUM**

   - 6.1 [SEO & Metadata](#61-seo-metadata)

7. [Development](#7-development) — **MEDIUM**
   - 7.1 [Local Development & Mobile Testing](#71-local-development-mobile-testing)
   - 7.2 [Saleor API Investigation](#72-saleor-api-investigation)
   - 7.3 [Third-Party Widget Embeds](#73-third-party-widget-embeds)

---

## 0. Architecture

**Impact: CRITICAL**

North-star conventions for canonical Next.js App Router patterns. Read before unfamiliar changes; task rules below cover implementation detail.

### 0.1 Paper Architecture

North-star for how this storefront is built. Read this before unfamiliar changes; use task rules for implementation detail.

> **Not** a fork migration guide — see `migrations/SKILL.md`.  
> **Not** Saleor API reference — see `saleor-storefront` skill.

---

## Stance

Paper follows **canonical Next.js App Router** patterns (Next.js 16):

- **Server Components by default** — `"use client"` only for interactivity, browser APIs, or client hooks.
- **Server Actions** for cart, checkout, and account mutations — not client-side GraphQL.
- **RSC data fetching** on the server via `executePublicGraphQL` / `executeAuthenticatedGraphQL` — not urql, not browser Saleor SDK.
- **Cache Components (PPR)** for browse/catalog — `"use cache"` at the data boundary, `Suspense` for runtime holes.
- **BFF auth** — login/session via `/api/auth/*` and HttpOnly cookies, shared across storefront and checkout.

We align with upstream Next.js docs rather than inventing parallel data layers. When Next.js offers a first-class pattern (metadata API, `loading.tsx`, Server Actions, `use cache`), prefer it.

---

## Architectural pillars

| Pillar              | Decision                                                  | Detail                                                                                                                                                                                                                          |
| ------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Two surfaces**    | One repo, storefront + checkout                           | Route groups, import boundaries, session handoff → [`paper-surfaces.md`](paper-surfaces.md)                                                                                                                                     |
| **Freshness split** | Cached browse, live commerce                              | PDP/PLP cached per locale; cart/checkout/auth always fresh → [`data-caching.md`](data-caching.md)                                                                                                                               |
| **Page boundaries** | Sync page → Suspense → shell → islands                    | Never await `searchParams` in cached shells → [`data-caching.md`](data-caching.md)                                                                                                                                              |
| **Auth**            | BFF + PPR-safe account routes                             | No `cookies()` in async pages without Suspense → [`data-auth-routes.md`](data-auth-routes.md)                                                                                                                                   |
| **GraphQL**         | Codegen + server helpers                                  | Two codegen trees; regenerate after `.graphql` edits → [`data-graphql.md`](data-graphql.md)                                                                                                                                     |
| **URLs**            | `/{locale}/{channel}/…` browse; `/checkout` transactional | Orthogonal locale + channel → [`ui-locale-routing.md`](ui-locale-routing.md), [ADR 0001](../../../docs/adr/0001-locale-channel-url-routing.md)                                                                                  |
| **Copy & i18n**     | Three string systems                                      | Saleor catalog + CMS content + next-intl → [`ui-i18n.md`](ui-i18n.md), [ADR 0002](../../../docs/adr/0002-cms-copy-vs-code-owned-ui-strings.md), [`docs/international-storefront.md`](../../../docs/international-storefront.md) |
| **Channels**        | Explicit storefront allowlist                             | Not every Saleor channel is a route → [`ui-channels.md`](ui-channels.md)                                                                                                                                                        |

---

## Data flow (mental model)

```
Browse (storefront)                    Commerce (cart / checkout / account)
─────────────────                    ─────────────────────────────────────
RSC page (sync export)               RSC loader or Server Action
  └── Suspense                         └── executeAuthenticatedGraphQL
        └── Shell ("use cache" data)         cache: "no-cache"
              └── Suspense islands           mutations → revalidatePath / refresh
                    searchParams, cookies
```

Saleor remains the source of truth for prices at checkout; cached PDP prices may lag until cart refresh.

---

## Deliberate non-goals

Patterns we **do not** use — regressions to avoid:

| Avoid                                                | Use instead                                         |
| ---------------------------------------------------- | --------------------------------------------------- |
| Client-side Saleor GraphQL (urql, Apollo in browser) | Server helpers + Server Actions                     |
| Browser Saleor SDK for login                         | BFF `/api/auth/*`                                   |
| `cache: "no-cache"` on catalog display data          | `"use cache"` + `cache-manifest.ts` + webhooks      |
| `searchParams` / `cookies()` inside `"use cache"`    | Dynamic islands in nested `Suspense`                |
| Async page components that fetch cached data         | Sync page + inner Suspense boundary                 |
| `Suspense fallback={null}` on `<main>`               | Route `loading.tsx` + section skeletons             |
| `router.replace` for checkout step-only changes      | `updateCheckoutQuery()` (shallow history)           |
| Storefront importing `@/checkout/*`                  | `@paper/session-bridge` for cross-surface URLs only |
| Raw `cacheLife` / hand-rolled `cacheTag` strings     | `applyCacheProfile` from `cache-manifest.ts`        |

---

## Known divergences (accepted, deferred)

Real exceptions to the rules above — documented so the code and the convention stay reconciled. Align when you next touch these files; do not treat as new precedent.

| Divergence                                                                                                                                                                                                         | Why it's safe today                                                                                                                                                                                                                                                                                                                                     | Deferred fix                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Homepage** (`(main)/page.tsx`) and **category** (`categories/[slug]/page.tsx`) use an **async page shell** that awaits cached data at the page top, instead of the canonical sync page → Suspense → async shell. | Both await only `params` + `"use cache"` data (`getStorefrontContent` / `getCategoryData`) — never `searchParams`/`cookies` — so the static shell still prerenders and PPR is intact. Dynamic islands (featured collection, product grid) stay in nested `Suspense`. Build passes.                                                                      | Convert to sync page + inner `<Suspense fallback>` shell when touched.                     |
| **Homepage has no `loading.tsx`.**                                                                                                                                                                                 | Content is `"use cache"` and reused from the layout's own `getStorefrontContent` fetch (warm per request); stale-while-revalidate avoids blocking on TTL expiry. Only a truly cold cache renders `<main>` empty briefly — per-key, not traffic-amplified. The layout also awaits the same cached content, so the page is not the main cold-start lever. | Add a homepage `loading.tsx` (or sync-shell skeleton) alongside the sync-shell conversion. |

---

## Where to read next

| If you are…                        | Start with                                                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| New to the codebase                | This file, then [`paper-surfaces.md`](paper-surfaces.md)                                                         |
| Naming files / exports / imports   | [`references/code-conventions.md`](../references/code-conventions.md)                                            |
| Touching PDP / variants            | [`product-pdp.md`](product-pdp.md), [`product-variants.md`](product-variants.md)                                 |
| Touching caching / PPR / webhooks  | [`data-caching.md`](data-caching.md)                                                                             |
| Touching checkout or payments      | [`paper-surfaces.md`](paper-surfaces.md) → [`checkout-management.md`](checkout-management.md)                    |
| Touching auth / account            | [`data-auth-routes.md`](data-auth-routes.md)                                                                     |
| Touching locale or market URLs     | [ADR 0001](../../../docs/adr/0001-locale-channel-url-routing.md), [`ui-locale-routing.md`](ui-locale-routing.md) |
| Touching UI strings / translations | [`ui-i18n.md`](ui-i18n.md), [`docs/international-storefront.md`](../../../docs/international-storefront.md)      |
| Upgrading a fork                   | [`migrations/SKILL.md`](../migrations/SKILL.md)                                                                  |

Formal architecture decisions beyond day-to-day conventions: [`docs/adr/`](../../../docs/adr/).

---

## Anti-patterns

❌ **Don't add a client data-fetching layer** when Server Components or Server Actions suffice  
❌ **Don't bypass the cache manifest** for catalog tags/TTLs  
❌ **Don't fix PPR build errors by wrapping `<main>` in Suspense** — fix the route segment that owns dynamic work  
❌ **Don't duplicate architecture essays in feature PRs** — extend this file or an ADR if the decision is cross-cutting

---

## 1. Data Layer

**Impact: CRITICAL**

The data layer controls caching, GraphQL type generation, and API communication. Getting this wrong causes stale content, type errors, or permission failures.

### 1.1 Caching Strategy

Understanding the caching architecture, Cache Components (PPR), and revalidation mechanisms ensures correct data freshness, avoids stale content, and enables targeted cache invalidation when Saleor data changes.

> **Reference**: [Next.js Cache Components](https://nextjs.org/docs/app/getting-started/cache-components) — the official documentation for `use cache`, `cacheLife`, `cacheTag`, and Partial Prerendering.

---

## Data Freshness Model

### The Key Principle

> **Display pages are cached for performance. Transactional flows are always real-time.**

| Page/Component                | Data Source                                 | Freshness              | Why                         |
| ----------------------------- | ------------------------------------------- | ---------------------- | --------------------------- |
| **PDP (Product Detail)**      | `getProductData()`                          | ⚠️ Cached (5 min TTL)  | Performance - instant loads |
| **Category/Collection pages** | `getCategoryData()` / `getCollectionData()` | ⚠️ Cached (5 min TTL)  | Performance                 |
| **Homepage**                  | `getFeaturedProducts()`                     | ⚠️ Cached (5 min TTL)  | Performance                 |
| **Navigation**                | `NavLinks`                                  | ⚠️ Cached (1 hour TTL) | Rarely changes              |
| **Cart Drawer**               | `Checkout.find()`                           | ✅ Always fresh        | Uses `cache: "no-cache"`    |
| **Checkout Page**             | `syncCheckoutFromServer()` + server actions | ✅ Always fresh        | Server actions + RSC        |
| **Add to Cart action**        | Saleor mutation                             | ✅ Always fresh        | Saleor calculates price     |

### Price Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRICE FLOW                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   PDP Display          Cart/Checkout          Payment               │
│   ────────────         ─────────────          ───────               │
│                                                                     │
│   ┌───────────┐        ┌───────────┐         ┌───────────┐         │
│   │  Cached   │───────▶│  FRESH    │────────▶│  FRESH    │         │
│   │  $29.99   │  Add   │  $35.99   │  Pay    │  $35.99   │         │
│   └───────────┘  to    └───────────┘         └───────────┘         │
│                  Cart                                               │
│   "use cache"          cache:"no-cache"      Saleor validates       │
│   5 min TTL            Always from API       at checkout            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

⚠️ User may see different price in cart than on PDP if price changed.
✅ User CANNOT checkout at stale price - Saleor always uses current price.
```

### Why This Is Safe

1. **Saleor is the source of truth**: When you call `checkoutLinesAdd`, Saleor calculates the price server-side using current data
2. **Cart always fetches fresh**: `Checkout.find()` uses `cache: "no-cache"`
3. **Checkout validates**: `checkoutComplete` will fail if something is wrong
4. **Webhooks enable instant updates**: When configured, price changes trigger immediate cache invalidation

---

## Cache Components Architecture

### What It Is

Cache Components enable **Partial Prerendering (PPR)** - mixing static, cached, and dynamic content in a single route. The static shell is served instantly from CDN, while dynamic parts stream in via Suspense.

### Current Status: ✅ ENABLED (Experimental)

> ⚠️ **Note**: Cache Components are still marked **experimental** in Next.js. The patterns are functional but evolving. See [Disabling Cache Components](#disabling-cache-components) if you need to rollback.

Cache Components are enabled in `next.config.js`:

```javascript
const config = {
	cacheComponents: true,
};
```

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│  STATIC SHELL (Instant from CDN)                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Header skeleton, layout, cached product data            │   │
│  │  Source: "use cache" functions (getProductData, etc.)    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  <Suspense fallback={<Skeleton />}>                     │   │
│  │    Dynamic content (streams in after initial render)     │   │
│  │    - Variant selection (reads searchParams)              │   │
│  │    - Logo, NavLinks (use usePathname)                    │   │
│  │    - Cart count (reads cookies)                          │   │
│  │  </Suspense>                                             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Reference Architecture

Target layout for catalog routes with Cache Components enabled:

```
ProductPage (sync export)
└── Suspense (page skeleton or route loading.tsx)
    └── ProductShell (await params + cached data ONLY — never searchParams)
        ├── breadcrumbs, h1, attributes, JSON-LD, LCP preload
        ├── Suspense → VariantGalleryDynamic (searchParams)
        └── Suspense → VariantSectionDynamic (searchParams)

Layout shell
├── Suspense → Header (cached menu data + dynamic cart/user)
├── <main>{children}</main>          ← no Suspense wrapper on main
├── Suspense → Footer (cached menus + channels)
└── Suspense → CartDrawer (cookies, no-cache)

Invalidation: Saleor webhook → saleor-paper-app → POST /api/revalidate → revalidateTag + revalidatePath
```

**Key files**

| Purpose             | Location                                |
| ------------------- | --------------------------------------- |
| Cache manifest      | `src/lib/cache-manifest.ts`             |
| Catalog fetches     | `src/lib/catalog/*.ts`                  |
| Menu fetches        | `src/lib/menus/get-menu-data.ts`        |
| Channel fetches     | `src/lib/channels/get-channels-data.ts` |
| Revalidation API    | `src/app/api/revalidate/route.ts`       |
| Cache introspection | `src/app/api/cache-info/route.ts`       |

### Cache Manifest — Single Source of Truth

All cache profiles are defined in `src/lib/cache-manifest.ts`. This module is imported by:

- **Cached functions** — for `cacheLife()` / `cacheTag()` calls
- **`/api/cache-info`** — to serve the manifest to the saleor-paper-app (Dashboard)

```typescript
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";

async function getProductData(slug: string, channel: string, localeSlug: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.products, slug);

	return executePublicGraphQL(ProductDetailsDocument, {
		variables: { slug, channel, ...graphqlLanguageCodeVariables(localeSlug) },
	});
}
```

To change a TTL or tag pattern, edit `src/lib/cache-manifest.ts`. Both the actual caching behavior and the dashboard app's view of the cache update automatically.

### Tag Registry

| Tag Pattern                             | Profile ID           | Used By                                        | Invalidated When            |
| --------------------------------------- | -------------------- | ---------------------------------------------- | --------------------------- |
| `product:{slug}`                        | `products`           | PDP `getProductData()`                         | Product updated in Saleor   |
| `category:{slug}`                       | `categories`         | `getCategoryData()`                            | Category updated            |
| `collection:{slug}`                     | `collections`        | `getCollectionData()`, `getFeaturedProducts()` | Collection updated          |
| `page:{slug}`                           | `pages`              | `getPageData()` (CMS)                          | Page updated                |
| `navigation:{channel}`                  | `navigation`         | `getNavbarMenuItems()`                         | Navbar menu changed         |
| `footer-menu:{channel}`                 | `footerMenu`         | `getFooterMenuItems()`                         | Footer menu changed         |
| `storefront-content:{channel}:{locale}` | `storefront-content` | `getStorefrontContent()`                       | `storefront-*` Page updated |
| `channels`                              | `channels`           | `getCachedChannelsList()`                      | Channel list changed        |

**Named `cacheLife` tiers** (via `applyCacheProfile`, configured in `next.config.js`):

| Profile ID                  | Tier name  | Typical TTL | Used for                          |
| --------------------------- | ---------- | ----------- | --------------------------------- |
| `products`                  | `catalog`  | ~5 min      | Products, categories, collections |
| `pages`                     | `catalog`  | ~5 min      | CMS pages                         |
| `navigation` / `footerMenu` | `menus`    | ~1 hour     | Nav + footer menus                |
| `storefront-content`        | `menus`    | ~5 min      | Merchandising copy (Models)       |
| `channels`                  | `channels` | longer      | Channel metadata list             |

Do **not** add fetch-level `revalidate` on GraphQL calls inside `"use cache"` functions — `cacheLife` + webhooks handle freshness.

### Locale & Caching

Browse routes are `/{locale}/{channel}/…` (see `ui-locale-routing.md`, ADR 0001). Locale affects **what** is cached (translated GraphQL payloads), not **how fast** repeat visits are.

#### Cache keys vs cache tags

| Mechanism                                   | Includes locale?            | Role                                                                 |
| ------------------------------------------- | --------------------------- | -------------------------------------------------------------------- |
| **`"use cache"` function arguments**        | ✅ Yes (`localeSlug` param) | Separate cache entry per locale — `/pl/…` and `/en/…` do not collide |
| **`cacheTag` (invalidation)**               | Usually ❌ for catalog      | One tag per slug/channel; webhook busts all locale variants together |
| **`storefront-content:{channel}:{locale}`** | ✅ Yes (BCP 47)             | Homepage/marketing copy from Saleor Models                           |

```typescript
// Separate cache entries — localeSlug is part of the Next.js cache key
getProductData("hoodie", "default-channel", "en"); // → English translation payload
getProductData("hoodie", "default-channel", "pl"); // → Polish translation payload

// Single invalidation tag — product update clears both entries
applyCacheProfile(CACHE_PROFILES.products, slug); // → tag: product:hoodie
```

**Performance:** After the first visitor per locale, that locale’s PDP/PLP is as fast as before locale routing. Adding `pl` and `de` creates ~N additional cache entries (one per locale × page), not extra work on every request.

**Cold start:** Each locale warms independently on first hit after deploy. English may be warm while Polish is still cold — normal, not a cross-locale penalty.

#### GraphQL `languageCode`

Cached fetches pass `graphqlLanguageCodeVariables(localeSlug)` so Saleor returns `translation { … }` fields for the browse locale. Map URL slugs to Saleor **base** language codes in `src/config/locale.ts` (e.g. `pl` → `PL`, not `PL_PL`) — Dashboard stores translations under `/translations/PL/…`.

Merge translated display fields with `withTranslatedProductFields()` / siblings in `src/lib/saleor-translations.ts` after the fetch.

#### Invalidation fan-out

Catalog tags stay slug-scoped (`product:{slug}`, `category:{slug}`, etc.) because Saleor webhooks do not signal “only PL changed.” On product/category/collection/page updates, `buildPathsForAllLocales()` revalidates every configured locale path:

```
/en/default-channel/products/hoodie
/pl/default-channel/products/hoodie
/de/default-channel/products/hoodie
```

Menus use channel-scoped tags (`navigation:{channel}`) while `localeSlug` remains in the cached function args — same pattern: per-locale cache entries, one tag clears all languages for that channel.

Storefront content uses explicit per-locale tags (`storefront-content:{channel}:{locale}`) via `buildStorefrontContentCacheTags()`.

#### Mental model

```
Request: /pl/default-channel/products/foo
         │
         ▼
   getProductData(slug, channel, "pl")     ← locale in cache key
         │
         ├─ HIT  → instant (same speed as pre-locale routing)
         └─ MISS → GraphQL languageCode: PL → cache ~5 min
                   tag: product:foo         ← shared; invalidates all locales
```

**Future refinement (optional):** Locale-scoped catalog tags (`product:{slug}:{locale}`) only if you get translation-only invalidation signals. Current design is simpler and correct for generic `PRODUCT_UPDATED` webhooks.

### Cache Introspection Endpoint

`GET /api/cache-info` returns a machine-readable manifest of all profiles. Protected by `REVALIDATE_SECRET` via `Authorization: Bearer` header (timing-safe comparison). Used by the saleor-paper-app to discover what the storefront caches and build its invalidation UI dynamically.

```bash
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" "https://store.com/api/cache-info"
# Returns: { version: 1, profiles: [{ id, label, ttlSeconds, cacheProfile, tagPattern, pathPattern }, ...] }
```

---

## Key Patterns

### 1. Three-Layer Page Model (CRITICAL)

Every catalog route should follow this boundary stack:

1. **Sync page export** — passes `params` / `searchParams` promises through, no awaits at top level.
2. **Page-level Suspense** — isolates cached data fetch from the layout; use route `loading.tsx` for outer skeletons.
3. **Shell** — awaits `params` + `"use cache"` data only. Static UI (h1, breadcrumbs, JSON-LD) lives here.
4. **Dynamic islands** — nested Suspense per runtime concern (`searchParams`, cookies, client routing hooks).

```tsx
// ✅ CORRECT
export default function Page(props: PageProps) {
	return (
		<Suspense fallback={<PageSkeleton />}>
			<PageShell params={props.params} searchParams={props.searchParams} />
		</Suspense>
	);
}

async function PageShell({ params, searchParams }) {
	const { slug, channel, locale } = await params;
	const product = await getProductData(slug, channel, locale); // "use cache"
	return (
		<>
			<h1>{product.name}</h1>
			<Suspense fallback={<GallerySkeleton />}>
				<VariantGalleryDynamic product={product} searchParams={searchParams} />
			</Suspense>
		</>
	);
}
```

```tsx
// ❌ BAD — awaiting searchParams in shell collapses the whole page into a dynamic hole
async function ProductShell({ searchParams, ... }) {
	const { variant } = await searchParams; // Dynamic!
	const product = await getProductData(...);
}
```

### 2. Data Layer Conventions

Place `"use cache"` GraphQL fetches in dedicated modules — not inline in page files long-term:

| Layer    | Location                         | Examples                                                      |
| -------- | -------------------------------- | ------------------------------------------------------------- |
| Catalog  | `src/lib/catalog/`               | `get-featured-products`, `get-category-data`, `get-page-data` |
| Menus    | `src/lib/menus/get-menu-data.ts` | `getNavbarMenuItems`, `getFooterMenuItems`                    |
| Channels | `src/lib/channels/`              | `getCachedChannelsList`                                       |

Always use `applyCacheProfile(CACHE_PROFILES.*, slugOrChannel)` — never raw `cacheLife("minutes")` or manual `cacheTag` strings that drift from the manifest.

**Do not** re-export server cached helpers from barrels that also export client components (e.g. import `ProductGalleryLcp` directly, not via a mixed `pdp/index.ts` barrel).

### 3. Page Patterns by Route Type

| Route                                  | Shell (cached)                                          | Dynamic islands                                                               |
| -------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Homepage**                           | Sync `<section>` wrapper                                | `FeaturedProducts` in Suspense → `getFeaturedProducts()`                      |
| **PLP** (category/collection/products) | Hero/title from `getCategoryData` / `getCollectionData` | Product grid in nested Suspense (filters/sort via `searchParams`)             |
| **PDP**                                | `ProductShell`: name, attributes, JSON-LD, preload      | `VariantGalleryDynamic` + `VariantSectionDynamic` (separate Suspense)         |
| **CMS page**                           | Sync page export                                        | `PageContent` in Suspense → `getPageData()`                                   |
| **Account** (`/account/*`)             | Layout `AccountShell` + `AccountProvider`               | Per-page Suspense for orders; profile via context (see `data-auth-routes.md`) |

See `product-pdp.md` for PDP specifics. PLP routes use `loading.tsx` at the route segment.  
See `data-auth-routes.md` for migrating other logged-in route trees.

### 4. Suspense Around Dynamic Content

Any component accessing runtime data must be wrapped in Suspense.

**What counts as "dynamic data" (triggers Suspense requirement):**

| Data Access                 | Why It's Dynamic    |
| --------------------------- | ------------------- |
| `cookies()`                 | Per-request         |
| `headers()`                 | Per-request         |
| `searchParams`              | URL-dependent       |
| `usePathname()`             | Client-side routing |
| `useParams()`               | Client-side routing |
| `Date.now()`                | Time-dependent      |
| Server Actions              | Form submissions    |
| `cache: "no-cache"` fetches | Always fresh        |

```tsx
// Layout: Header/Footer/Cart each in their own Suspense — NOT a wrapper on <main>
<main className="flex-1">{props.children}</main>

// Route-level loading UI (preferred for page transitions)
// src/app/(storefront)/[locale]/[channel]/(main)/categories/[slug]/loading.tsx

// Header wraps NavLinks in Suspense (uses usePathname for active state)
<Suspense fallback={<NavLinksSkeleton />}>
  <NavLinks channel={channel} />
</Suspense>
```

**Do not** use `Suspense fallback={null}` on `<main>` — it prevents route `loading.tsx` from participating and hides useful skeletons.

### 5. Sync Page Shell Pattern (CRITICAL)

Page components that use `"use cache"` data must be **synchronous** and wrap async content in a **dedicated Suspense boundary**. This prevents cached async work from flowing through the layout boundary, which can cause hydration/reconciliation issues.

(See [Three-Layer Page Model](#1-three-layer-page-model-critical) above — this is the same rule, repeated here because it is the most common PPR mistake.)

```tsx
// ✅ CORRECT - Page is sync, async content has its own Suspense
export default function Page(props: PageProps) {
	return (
		<Suspense fallback={<PageSkeleton />}>
			<PageContent params={props.params} />
		</Suspense>
	);
}

async function PageContent({ params: paramsPromise }) {
	const params = await paramsPromise;
	const data = await getCachedData(params.slug, params.channel, params.locale);
	return <ProductList products={data} channel={params.channel} />;
}
```

All page routes in this project follow this pattern:

- `src/app/(storefront)/[locale]/[channel]/(main)/page.tsx` (homepage)
- `src/app/(storefront)/[locale]/[channel]/(main)/pages/[slug]/page.tsx` (CMS pages)
- `src/app/(storefront)/[locale]/[channel]/(main)/categories/[slug]/page.tsx`
- `src/app/(storefront)/[locale]/[channel]/(main)/collections/[slug]/page.tsx`
- `src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx`

### 6. Public vs Authenticated Queries

Two explicit GraphQL helpers:

- `executePublicGraphQL` - Safe inside `"use cache"` (no cookies needed)
- `executeAuthenticatedGraphQL` - NOT safe inside `"use cache"` (requires cookies)

```typescript
import { executePublicGraphQL, executeAuthenticatedGraphQL } from "@/lib/graphql";

// ✅ Public data - safe inside "use cache"
async function getProductData(slug: string, channel: string, localeSlug: string) {
	"use cache";
	return executePublicGraphQL(ProductDetailsDocument, {
		variables: { slug, channel, ...graphqlLanguageCodeVariables(localeSlug) },
	});
}

// ✅ User data - NOT inside "use cache" (requires cookies)
const { me } = await executeAuthenticatedGraphQL(CurrentUserDocument, {
	cache: "no-cache",
});
```

### 7. Don't Use `searchParams` Inside `"use cache"`

```typescript
// ❌ BAD - searchParams is runtime data
export async function generateMetadata(props) {
	"use cache";
	const searchParams = await props.searchParams; // Error!
}

// ✅ GOOD - Only access params (becomes cache key)
export async function generateMetadata(props) {
	"use cache";
	const params = await props.params; // OK
}

// ✅ GOOD - Access searchParams outside cache scope
export async function generateMetadata(props) {
	const searchParams = await props.searchParams; // No "use cache"
}
```

### 8. CSS Order Pattern for Mixed Static/Dynamic Layouts

When you need dynamic content to appear **above** static content visually, use CSS `order`:

```tsx
// PDP: Category (dynamic) appears above Product Name (static)
<div className="flex flex-col gap-3">
	{/* Static shell - renders first but order:2 */}
	<h1 className="order-2">{product.name}</h1>

	{/* Dynamic - streams in, order:1 appears above h1 */}
	<Suspense fallback={<Skeleton className="order-1" />}>
		<VariantSection /> {/* Contains order-1 and order-3 elements */}
	</Suspense>

	{/* Static - order:4 appears last */}
	<div className="order-4">
		<ProductAttributes />
	</div>
</div>
```

**Visual result:**

```
1. Category + Sale badge  (dynamic, order-1)
2. Product Name           (static, order-2)
3. Variant selectors      (dynamic, order-3)
4. Product details        (static, order-4)
```

This keeps `<h1>` in the static shell for SEO while allowing dynamic content to appear above it.

---

## Cache Invalidation

### Automatic via Webhooks (Recommended)

**Production path: [saleor-paper-app](https://github.com/saleor/saleor-paper-app)** (`../saleor-paper-app/` when developing both repos locally).

```
Saleor event → paper-app webhook handler → POST /api/revalidate → storefront cache purge
```

On install, the app registers managed webhooks (product, category, collection, promotion, page, menu) and proxies payloads to the storefront URL configured in app settings. Merchants get revalidation logs and manual purge in Dashboard; `REVALIDATE_SECRET` is shared between app and storefront.

| Event family                              | paper-app handler       | Storefront effect                                                                             |
| ----------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------- |
| `PRODUCT_*`, `CATEGORY_*`, `COLLECTION_*` | `product-changed`, etc. | Catalog tags + paths                                                                          |
| `PAGE_*`                                  | `page-changed`          | CMS `page:{slug}` **and** `storefront-content:{channel}:{locale}` when slug is `storefront-*` |
| `MENU_*`, `MENU_ITEM_*`                   | `menu-changed`          | `navigation:{channel}`, `footer-menu:{channel}`                                               |

**Do not** create parallel Saleor webhooks pointing directly at `/api/revalidate` when the Paper app is installed — duplicate deliveries cause redundant work and bypass app logging.

**Direct storefront webhooks** (Saleor Dashboard → `https://your-site.com/api/revalidate`) remain valid for self-hosted setups without the app. Subscribe to the same events and set `SALEOR_WEBHOOK_SECRET` on the storefront.

**What happens on webhook** (via `src/app/api/revalidate/route.ts`):

```typescript
// Product update — tag + paths for every locale × storefront channel
revalidateTag(`product:${slug}`, resolveRevalidateCacheLifeProfile("products"));
for (const path of buildPathsForAllLocales(CACHE_PROFILES.products, { channel, slug })) {
	revalidatePath(path); // e.g. /pl/default-channel/products/hoodie
}

// Menu update — channel-scoped tags (navbar vs footer mapped by menu slug)
revalidateTag(`navigation:${channel}`, resolveRevalidateCacheLifeProfile("navigation"));
revalidateTag(`footer-menu:${channel}`, resolveRevalidateCacheLifeProfile("footerMenu"));
```

Path revalidation uses `getStorefrontChannelSlugs()` and `buildPathsForAllLocales()` so multi-channel, multi-locale deployments invalidate every allowed URL. See `ui-channels.md` for allowlist configuration.

### Manual Invalidation

All manual invalidation requests use the `Authorization: Bearer` header (timing-safe comparison):

```bash
# Invalidate a specific product (both tag and path — use a concrete locale path)
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=product:blue-hoodie&path=/en/default-channel/products/blue-hoodie"

# Invalidate just the cached function data (all locale variants for that slug)
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=product:blue-hoodie"

# Invalidate navigation for a channel (uses "menus" profile)
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=navigation:default-channel"

# Invalidate footer menu for a channel
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=footer-menu:default-channel"
```

### No Webhooks? TTL Takes Over

| Data        | Default TTL |
| ----------- | ----------- |
| Products    | 5 minutes   |
| Categories  | 5 minutes   |
| Collections | 5 minutes   |
| CMS pages   | 5 minutes   |
| Navigation  | 1 hour      |

---

## Environment Variables

```env
# Cache invalidation — use ≥32 character random strings in production
REVALIDATE_SECRET=your-secret       # Bearer token for manual revalidation & cache-info
SALEOR_WEBHOOK_SECRET=webhook-hmac  # Saleor webhook HMAC verification
```

**Security**: Both endpoints use timing-safe comparison and `Authorization: Bearer` header authentication. Query-string `?secret=` still works but logs a deprecation warning — migrate callers to the header.

---

## Debugging Stale Content

### Checklist

1. **Is the webhook configured?**

   - Check Saleor Dashboard → Webhooks → Deliveries

2. **Did the webhook fire?**

   - Check server logs for `[Revalidate]` entries

3. **Is the tag correct?**

   - Product slugs must match exactly: `product:blue-hoodie`

4. **Force manual revalidation:**

   ```bash
   curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
     "https://store.com/api/revalidate?tag=product:my-product"
   ```

5. **Translation updated but still English on `/pl/…`?**

   - Confirm Saleor has a translation for base language `PL` (Dashboard: `/translations/PL/…`)
   - Bust cache: `curl -H "Authorization: Bearer …" "…/api/revalidate?tag=product:my-product"`
   - Restart dev server if you changed `src/config/locale.ts` GraphQL language mapping

6. **Check browser cache:**
   - Hard refresh: Cmd+Shift+R / Ctrl+Shift+R

---

## Anti-patterns

❌ **Don't use `cache: "no-cache"` for display pages** — Destroys performance  
❌ **Don't skip webhook setup in production** — Users see stale prices  
❌ **Don't access cookies/searchParams inside `"use cache"`** — Will error  
❌ **Don't await `searchParams` in shell components** — Collapses the whole page into a dynamic hole  
❌ **Don't use `executeAuthenticatedGraphQL` inside `"use cache"`** — Requires cookies  
❌ **Don't add fetch-level `revalidate` inside `"use cache"` functions** — `cacheLife` + webhooks handle freshness  
❌ **Don't use raw `cacheLife("minutes")` or hand-rolled `cacheTag` strings** — Use `applyCacheProfile(CACHE_PROFILES.*)` from the manifest  
❌ **Don't wrap `<main>` in Suspense with `fallback={null}`** — Blocks route `loading.tsx` skeletons  
❌ **Don't make page components async when using `"use cache"` data** — Use the sync page shell pattern  
❌ **Don't pass `REVALIDATE_SECRET` in query strings** — Use the `Authorization: Bearer` header  
❌ **Don't omit `localeSlug` from cached catalog/menu fetches** — All locales would share one cache entry and show the wrong language  
❌ **Don't use regional Saleor codes (`PL_PL`) in `graphqlLanguageCode`** — Dashboard translations use base codes (`PL`); see `src/config/locale.ts`  
❌ **Don't re-export server cached helpers from client-mixed barrels** — Import catalog/menu modules directly

---

## Disabling Cache Components

If you need to rollback to standard ISR caching:

### Step 1: Disable in Config

```javascript
// next.config.js
const config = {
	cacheComponents: false, // or comment out entirely
};
```

### Step 2: Remove Cache Directives

Remove `"use cache"`, `cacheLife()`, and `cacheTag()` from these files:

| File                                                                         | What to Remove                           |
| ---------------------------------------------------------------------------- | ---------------------------------------- |
| `src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx`    | `getProductData()` cache directives      |
| `src/app/(storefront)/[locale]/[channel]/(main)/categories/[slug]/page.tsx`  | `getCategoryData()` cache directives     |
| `src/app/(storefront)/[locale]/[channel]/(main)/collections/[slug]/page.tsx` | `getCollectionData()` cache directives   |
| `src/app/(storefront)/[locale]/[channel]/(main)/page.tsx`                    | `getFeaturedProducts()` cache directives |
| `src/ui/components/nav/components/nav-links.tsx`                             | Navigation cache directives              |

### Step 3: Update Revalidation

```typescript
// src/app/api/revalidate/route.ts
// Change from:
revalidateTag(`product:${slug}`, "minutes");
// To:
revalidateTag(`product:${slug}`); // Remove second argument
```

### What You Can Keep

- **Suspense boundaries** - Still useful for loading states
- **CSS order layout** - Pure CSS, no impact
- **`executeAuthenticatedGraphQL`** - Good separation regardless
- **ISR via `revalidate` option** - Works as fallback

---

## Files Reference

| File                                                                         | Purpose                                                               |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `src/lib/api-auth.ts`                                                        | Shared auth: timing-safe secret verification, Bearer token extraction |
| `src/lib/cache-manifest.ts`                                                  | Cache profile definitions (single source of truth)                    |
| `src/lib/graphql-locale.ts`                                                  | `languageCode` GraphQL variables from URL locale slug                 |
| `src/lib/saleor-translations.ts`                                             | Merge `translation { … }` fields after cached fetches                 |
| `src/config/locale.ts`                                                       | URL slug → BCP 47, GraphQL language code, `html lang`                 |
| `src/app/api/cache-info/route.ts`                                            | Cache introspection endpoint for dashboard app                        |
| `src/app/api/revalidate/route.ts`                                            | Webhook endpoint and manual revalidation                              |
| `src/lib/catalog/*.ts`                                                       | Catalog `"use cache"` fetches (featured, category, collection, page)  |
| `src/lib/menus/get-menu-data.ts`                                             | Navbar + footer menu cached fetches                                   |
| `src/lib/channels/get-channels-data.ts`                                      | Channel list cache                                                    |
| `src/lib/channel-slugs.ts`                                                   | Storefront channel allowlist resolution                               |
| `src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx`    | PDP with ProductShell + dynamic islands                               |
| `src/app/(storefront)/[locale]/[channel]/(main)/categories/[slug]/page.tsx`  | Category with "use cache"                                             |
| `src/app/(storefront)/[locale]/[channel]/(main)/collections/[slug]/page.tsx` | Collection with "use cache"                                           |
| `src/app/(storefront)/[locale]/[channel]/(main)/page.tsx`                    | Homepage with "use cache"                                             |
| `src/ui/components/nav/components/nav-links.tsx`                             | Navigation with "use cache"                                           |
| `src/ui/components/footer.tsx`                                               | Footer menu + channels with "use cache"                               |
| `src/ui/components/pdp/variant-section-dynamic.tsx`                          | Dynamic variant section                                               |
| `src/ui/components/header.tsx`                                               | Header with Suspense boundaries                                       |
| `src/lib/checkout.ts`                                                        | Cart operations (always fresh)                                        |
| `next.config.js`                                                             | `cacheComponents: true`                                               |

---

### 1.2 GraphQL Workflow

Modifying GraphQL queries and regenerating types correctly ensures type safety, avoids permission errors, and keeps storefront and checkout data in sync with the Saleor schema.

> **Sources**:
>
> - [Saleor API Reference](https://docs.saleor.io/api-reference) - GraphQL schema and field permissions
> - [graphql-codegen](https://the-guild.dev/graphql/codegen) - Type generation

---

## File Locations

| Purpose                           | Location                         | Generated Types                   | Regenerate With          |
| --------------------------------- | -------------------------------- | --------------------------------- | ------------------------ |
| Storefront (products, cart, etc.) | `src/graphql/*.graphql`          | `src/gql/`                        | `pnpm generate`          |
| Checkout flow                     | `src/checkout/graphql/*.graphql` | `src/checkout/graphql/generated/` | `pnpm generate:checkout` |

> **Note**: Storefront and checkout have **separate codegen setups** (`src/gql/` vs `src/checkout/graphql/generated/`). Both surfaces fetch at runtime via server helpers (`executePublicGraphQL` / `executeAuthenticatedGraphQL`) and checkout server actions — not browser GraphQL. Auth mutations use BFF routes (`/api/auth/*`), not the GraphQL documents directly from the client.

---

## Making Changes

Edit the `.graphql` file. Example - adding a field:

```graphql
query ProductDetails($slug: String!, $channel: String!) {
	product(slug: $slug, channel: $channel) {
		id
		name
		newField # Add your field here
	}
}
```

---

## Regenerating Types (CRITICAL)

```bash
# For storefront queries (src/graphql/*.graphql)
pnpm run generate

# For checkout queries (src/checkout/graphql/*.graphql)
pnpm run generate:checkout
```

This regenerates TypeScript types. **Always run the appropriate command after any GraphQL change.**

- `src/gql/` - Storefront types (DO NOT EDIT)
- `src/checkout/graphql/generated/` - Checkout types (DO NOT EDIT)

---

## Using the Types

```typescript
import { ProductDetailsDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";

const { product } = await executePublicGraphQL(ProductDetailsDocument, {
	variables: { slug, channel },
	revalidate: 60,
});
// TypeScript now recognizes product.newField
```

---

## Checking the Saleor Schema

To confirm field names, types, nullability, or enum values, search the generated types file:

```bash
# Full schema types, generated from your running Saleor instance
grep -A 20 "^export type Product " src/gql/graphql.ts

# Check an enum
grep -A 10 "^export enum StockAvailability" src/gql/graphql.ts

# Check an input type
grep -A 30 "^export type ProductFilterInput" src/gql/graphql.ts
```

This file is generated by `pnpm generate` via API introspection, so it always matches your exact Saleor version. It contains the **full schema** (all types, enums, inputs), not just the ones used in declared queries.

## Attribute API: `assignedAttribute(s)` (new) vs `attributes` (deprecated)

Saleor deprecated the old attribute fields in favor of a typed API:

| Old (deprecated)                              | New                                                       |
| --------------------------------------------- | --------------------------------------------------------- |
| `Product.attributes: [SelectedAttribute]`     | `Product.assignedAttributes(limit:): [AssignedAttribute]` |
| `Product.attribute(slug:): SelectedAttribute` | `Product.assignedAttribute(slug:): AssignedAttribute`     |

`AssignedAttribute` is an **interface** with one implementation per input type (`AssignedBooleanAttribute { value: Boolean }`, `AssignedPlainTextAttribute { value: String }`, `AssignedSingleChoiceAttribute { value { … } }`, references, etc.), so you read values via inline fragments instead of a generic `values[]` bag.

**Read a single attribute by slug** (cheapest — fetches only what you need, no array scan):

```graphql
bestseller: assignedAttribute(slug: "bestseller") {
	... on AssignedBooleanAttribute {
		value
	}
}
```

The generated field is a union; only the matching member carries `value`, so narrow before reading (the optional `value?: boolean | null` shape accepts the whole union). See `src/lib/catalog/product-flags.ts` for the boolean pattern.

> **Migration status (mixed — finish in a dedicated sweep).** The bestseller merchandising flag uses the new `assignedAttribute(slug:)`. The PDP spec accordion / care copy (`product.attributes`) and PLP variant selection (`selectionAttributes` via `attributes(variantSelection:)`) **still use the deprecated fields**. They work (the deprecated fields remain in the schema), but new attribute reads should use `assignedAttribute(s)`, and the remaining call sites should be migrated together to avoid drift.

---

## Common Issues

### Permission Errors

If you see:

```
"To access this path, you need one of the following permissions: MANAGE_..."
```

The field requires admin permissions and isn't available to anonymous/customer tokens. Either remove it from the storefront query, or fetch it server-side with `SALEOR_APP_TOKEN` and the required permission.

### Nullable Fields

Saleor's schema has many nullable fields. Handle nulls intentionally -- use optional chaining with a fallback for display values, but guard or throw when null signals a real problem:

```typescript
// Display value with fallback
const name = product.category?.name ?? "Uncategorized";

// Guard when null means something is wrong
if (!product.defaultVariant) {
	throw new Error(`Product ${product.slug} has no default variant`);
}
```

---

## Anti-patterns

❌ **Don't edit generated files** (`src/gql/` or `src/checkout/graphql/generated/`)  
❌ **Don't forget to regenerate types** - Run the appropriate `generate` command  
❌ **Don't assume fields are non-null** - Check generated types and handle nulls explicitly  
❌ **Don't mix up the two codegen setups** - Storefront ≠ Checkout

---

### 1.3 Auth Routes (BFF)

**Impact: CRITICAL** when `cacheComponents: true` and routes read session cookies.

Reference implementation: `src/app/[channel]/(main)/account/`.

> **Fork upgrades:** Apply atomic migration `2026-06-account-ppr-auth` in [`../migrations/manifest.json`](../migrations/manifest.json) when catching up from pre–June 2026 Paper (especially after #1201-style layout changes).

## Problem

With Cache Components enabled, any server component that calls `cookies()`, `headers()`, or authenticated GraphQL (`cache: "no-cache"` with session) is **dynamic**. If that runs in an async **page** without a Suspense boundary, production builds fail:

```
Uncached data was accessed outside of <Suspense>
```

Do **not** fix this by wrapping `<main>{children}</main>` in Suspense — that hides the issue and blocks route `loading.tsx`. Fix at the **route segment** that owns the dynamic work.

## BFF auth (session lifecycle)

Login, logout, and password reset go through **Next.js API routes** — not the browser Saleor SDK. Tokens are stored as **HttpOnly** cookies via `getServerAuthClient()` on the server.

| Route                           | Purpose                         |
| ------------------------------- | ------------------------------- |
| `POST /api/auth/login`          | `tokenCreate` → Set-Cookie      |
| `POST /api/auth/register`       | Account registration            |
| `POST /api/auth/reset-password` | Request reset email             |
| `POST /api/auth/set-password`   | Reset token → session           |
| `logout()` server action        | Clear cookies + detach checkout |

Client forms call `loginWithBff()` / `setPasswordWithBff()` from `src/lib/auth/bff-client.ts`. Commerce (cart, checkout lines) stays on **server actions** — do not proxy all GraphQL.

**Header user menu:** `UserMenuServer` calls `getHeaderUser()` inside Suspense — same server session as account pages. No client `me` fetch.

## Keeping header chrome fresh (Router Cache)

HttpOnly cookies are the source of truth, but the **client Router Cache** can reuse a stale RSC payload for the header after session changes. Paper uses three explicit triggers — no client-side retry loops:

| Trigger                           | When                                           | Mechanism                                                                                         |
| --------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Initial load / hard refresh**   | Land on storefront with existing session       | `HeaderAuthRefresh` → `revalidateStorefrontChrome` + `router.refresh()` once on mount             |
| **In-store soft nav**             | User follows a `<Link>` within `/${channel}`   | `HeaderAuthRefresh` → `router.refresh()` on pathname change                                       |
| **Cross-tab**                     | User returns after login/logout in another tab | `visibilitychange` → `revalidateStorefrontChromeAction` + `router.refresh()`                      |
| **Cross-surface / auth boundary** | Login, logout, checkout → storefront           | `revalidateStorefrontChrome` + **hard navigation** (`window.location.assign` or plain `<a href>`) |

**Hard navigation** is required when leaving `/checkout` or after login/logout — soft `router.push` / `<Link>` can restore a cached anonymous `UserMenuServer`. Use `syncAuthSurfacesAfterSignIn({ redirectTo })`, `useLogout({ channel })`, `navigateToStorefrontHome()`, or `StorefrontHomeLink` (plain anchor).

**`revalidateStorefrontChrome(channel)`** invalidates `/${channel}` layout (user menu + cart badge) and `/checkout`. Call from server actions after cart mutations, checkout complete, or before client refresh — not during RSC render.

## Migration Checklist

Use this when moving a logged-in area (account, wishlist, etc.) to PPR-safe patterns:

1. **Layout owns auth gate** — one `Suspense` + async shell; call `hasAuthSession()` / `getCurrentUser()` only inside the shell.
2. **Sync page exports** — `export default function Page()` returns `<Suspense><AsyncContent /></Suspense>` for pages that fetch orders, etc.
3. **Profile data from layout** — fetch user once; expose via client `AccountProvider` + `useAccountUser()` for settings/addresses (avoids `cookies()` in every page).
4. **Nested Suspense for secondary fetches** — e.g. recent orders, order list, order detail (authenticated GraphQL in child async components).
5. **Login fallback** — use `AccountLogin` (`LoginForm` in Suspense); sign-in posts to `/api/auth/login`.
6. **Mutations + client context** — if UI reads user from layout context, use `revalidatePath("/account", "layout")` and `router.refresh()` on success (page-only revalidation leaves stale context).
7. **Verify build** — `STOREFRONT_CHANNELS=aud,default-channel pnpm run build` (CI may not run full build).

## Architecture

```
account/layout.tsx
└── Suspense fallback={<AccountSkeleton />}
    └── AccountShell (async)
        ├── no session / invalid user → <AccountLogin />  (LoginForm → BFF)
        └── user → AccountProvider
            ├── AccountNav (static client)
            └── {children}  (sync pages + nested Suspense islands)

header.tsx
└── Suspense
    └── HeaderAuthRefresh (client) → router.refresh() on pathname change
        └── UserMenuServer (async) → cookies() + getHeaderUser() or sign-in link
```

| Concern            | Location                                  | Notes                                                           |
| ------------------ | ----------------------------------------- | --------------------------------------------------------------- |
| Auth cookies check | `has-auth-session.ts`                     | Same lookup as auth SDK (`readAuthCookieValue`)                 |
| User profile       | `get-current-user.ts`                     | `React.cache()` — deduped per request                           |
| Header user        | `get-header-user.ts`                      | `getHeaderAuthState()` — guest / authenticated / unavailable    |
| Session resolution | `resolve-session-user.ts`                 | Classifies `me` fetch; one server retry on transient errors     |
| Auth failure codes | `session-auth-state.ts`                   | `isDefinitiveAuthFailure` — Saleor JWT codes + message fallback |
| BFF sign-in        | `bff-server.ts`, `/api/auth/login`        | HttpOnly cookies, rate limited                                  |
| Client forms       | `bff-client.ts`                           | `loginWithBff`, `setPasswordWithBff`                            |
| Client profile     | `account-context.tsx`                     | `useAccountUser()` for settings/addresses/overview              |
| Sign-in UI         | `account-login.tsx`                       | `LoginForm` in Suspense (no SDK provider)                       |
| Order fetches      | `recent-orders-section.tsx`, orders pages | Inside page-level Suspense                                      |

## Code Patterns

### Layout shell

```tsx
export default function AccountLayout({ children }: { children: ReactNode }) {
	return (
		<Suspense fallback={<AccountSkeleton />}>
			<AccountShell>{children}</AccountShell>
		</Suspense>
	);
}

async function AccountShell({ children }: { children: ReactNode }) {
	if (!(await hasAuthSession())) return <AccountLogin />;
	const user = await getCurrentUser();
	if (!user) return <AccountLogin />;
	return <AccountProvider user={user}>{/* nav + children */}</AccountProvider>;
}
```

### Sync page + dynamic island

```tsx
export default function AccountOverviewPage() {
	return (
		<div>
			<AccountOverviewWelcome /> {/* useAccountUser() */}
			<Suspense fallback={<RecentOrdersSectionSkeleton />}>
				<RecentOrdersSection />
			</Suspense>
		</div>
	);
}
```

### Server actions with layout context

```typescript
function revalidateAccountLayout() {
	revalidatePath("/account", "layout");
}
```

```tsx
// Client form after successful BFF login — prefer hard nav over soft push + refresh
await syncAuthSurfacesAfterSignIn(channel, router, {
	redirectTo: `/${channel}`,
});
```

## Anti-patterns

❌ **`cookies()` or `getCurrentUser()` in async page components** without a page/layout Suspense boundary  
❌ **Browser → Saleor for login or `me`** — use BFF routes and server `getHeaderUser()`  
❌ **`connection()` in account layout** — can break PPR with `CartProvider` in parent tree  
❌ **Blanket `<Suspense>{children}</Suspense>` on main layout** — workaround, not architecture  
❌ **`revalidatePath("/account/addresses", "page")` only** when addresses read `useAccountUser()` from layout  
❌ **`fallback={null}`** on account order Suspense — use section skeletons  
❌ **`key={pathname}` without `router.refresh()`** on header auth — remounting RSC children does not bust the Router Cache; stale anonymous menus persist until `revalidateStorefrontChrome`  
❌ **Client-side sessionStorage retry / recover gates** on header auth — fix cache boundaries server-side; never loop `router.refresh()` from effects  
❌ **Treating all `me === null` as signed out** — use `resolveSessionUser` (`guest` / `authenticated` / `unavailable`); only show login link on `guest`  
❌ **`<Link>` from checkout → storefront** when session may have changed — use plain `<a href>` or `navigateToStorefrontHome()`

## Related Rules

- `data-caching.md` — three-layer page model, no main Suspense, sync page shell
- `checkout-management.md` — checkout session via RSC + BFF sign-in + `router.refresh()`

## Files

| File                                                                 | Purpose                                  |
| -------------------------------------------------------------------- | ---------------------------------------- |
| `src/app/[channel]/(main)/account/layout.tsx`                        | Suspense + auth gate                     |
| `src/app/[channel]/(main)/account/get-current-user.ts`               | Cached profile fetch                     |
| `src/lib/auth/has-auth-session.ts`                                   | Cookie presence check                    |
| `src/lib/auth/session-auth-state.ts`                                 | JWT failure classification + retry logic |
| `src/lib/auth/resolve-session-user.ts`                               | `resolveSessionUser()` wrapper           |
| `src/lib/auth/bff-server.ts`                                         | Server sign-in / sign-out                |
| `src/lib/auth/get-header-user.ts`                                    | Header `me` fetch                        |
| `src/app/api/auth/login/route.ts`                                    | BFF login endpoint                       |
| `src/ui/components/account/account-login.tsx`                        | Signed-out account login                 |
| `src/ui/components/account/account-context.tsx`                      | Client profile context                   |
| `src/ui/components/nav/components/user-menu/user-menu-server.tsx`    | Header auth chrome                       |
| `src/ui/components/nav/components/user-menu/header-auth-refresh.tsx` | Router Cache sync (soft nav + cross-tab) |
| `src/lib/auth/revalidate-storefront-chrome.ts`                       | Layout + checkout cache bust             |
| `src/lib/auth/sync-auth-surfaces-after-sign-in.ts`                   | Post-login cache bust + hard nav         |
| `src/app/[channel]/(main)/account/actions.ts`                        | Layout revalidation helper               |

---

### 1.4 Storefront Content Layer

Marketing and merchandising copy (announcement bar, homepage sections, cart trust labels, checkout empty states) lives in a **provider-agnostic content layer** — separate from catalog data, menus, and transactional checkout state.

> **Companion rules**: Saleor Models → `data-storefront-content-saleor.md` · Attribute types & catalog refs → `data-storefront-content-attributes.md`  
> **Operational docs**: `config/saleor/README.md`

---

## Mental Model

```
┌─────────────────────────────────────────────────────────────────┐
│  UI (layout, homepage, cart drawer, checkout)                   │
│       ↓ reads StorefrontContent                                 │
├─────────────────────────────────────────────────────────────────┤
│  getStorefrontContent(channel, locale)   ← "use cache" (server) │
│       ↓                                                         │
│  loadStorefrontContent → ContentProvider (code | saleor)        │
│       ↓                                                         │
│  code: defaults.ts          saleor: fetch Pages → mappers       │
│       ↓                              ↓                          │
│       └──────── mergeStorefrontContent(defaults, partial) ─────┘
└─────────────────────────────────────────────────────────────────┘
```

**Code defaults always win as the base.** Saleor (or a future CMS provider) supplies **partials** that overlay defaults. The app never ships with blank copy when Saleor is down or a field is unset.

### Scope: editorial copy vs functional UI strings (ADR 0002)

This layer holds **editorial / merchant-editable copy only** — text a merchandiser would reword per shop (announcement bar, homepage sections, listing title/description, cart empty-state & trust signals, checkout). **Functional UI strings** (cart totals/buttons, the `{count} items` counter, `Qty:`/`Variant:` labels, breadcrumbs, `sr-only` a11y labels, PDP/PLP/search/nav/account chrome) are **code-owned via next-intl** in `messages/{locale}.json` — type-safe, reviewed in code, with ICU plurals. See `ui-i18n.md` for namespaces.

Rule of thumb: _"Would a merchant reword this per shop?"_ → content layer (CMS); otherwise → `messages/*.json`.

next-intl owns **messages, not routing** — the `[locale]` URL segment (ADR 0001) stays authoritative and is passed explicitly (`getTranslations({ locale })` in RSC; `<NextIntlClientProvider locale={…}>` in `(storefront)/[locale]/layout.tsx`). See `docs/adr/0002-cms-copy-vs-code-owned-ui-strings.md`.

### Policy vs copy

`StorefrontContent` has a top-level **`policies`** branch (sibling to `chrome` / `surfaces`) for channel-wide _facts_ — `shipping.freeShippingThreshold`, `returns.windowDays`, etc. These are structured values (not strings): channel-scoped, locale-independent, and consumed by **logic** (cart progress math) as well as **copy**. Copy never hardcodes the number — it references it with `{freeShippingThreshold}` / `{returnsWindowDays}` tokens resolved via `buildPolicyLabelValues()` + `formatContentLabel()`. This is the single source of truth: the cart math, announcement bar, and cart trust signal can never disagree. Modeled in Saleor as the `storefront-policies` PageType (`NUMERIC`/`BOOLEAN`) — see `data-storefront-content-saleor.md`.

### Announcement bar dismissal identity

When `announcementBar.dismissible` is true, the bar stores dismissal in the visitor's `localStorage`. The key is resolved by `resolveAnnouncementDismissKey()` in `announcement-dismiss-key.ts` (client-safe export from `@/lib/content`):

| `announcementBar.id`                                         | Dismissal key                                                                                       | When to use                                                                                                                                                 |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Empty** (code default)                                     | `paper:announcement-dismissed:content:{hash}` — hash of **rendered** `message`, `href`, `linkLabel` | Default. Merchants edit copy in Dashboard; any message/link change re-shows the bar for visitors who dismissed the old version. No extra field to maintain. |
| **Non-empty** (`announcement-id` in Saleor or `defaults.ts`) | `paper:announcement-dismissed:id:{id}`                                                              | Campaign slug. Dismissal survives message tweaks until you change `id` (e.g. `summer-sale-2026` → `fall-sale-2026`).                                        |

**Important:** Pass the **interpolated** message into the resolver (after `{freeShippingThreshold}` etc.) — `(main)/layout.tsx` does this before `MainChrome`. Policy threshold changes therefore change the content hash and re-show the bar, which is usually correct.

Saleor: leave `announcement-id` unset for content-hash behavior; set it only when you need a stable campaign id across copy edits. Configurator seed may include an example id — remove it to opt into content-hash dismissal.

---

## Key Files

| Purpose                     | Location                                                              |
| --------------------------- | --------------------------------------------------------------------- |
| Typed contract              | `src/lib/content/types.ts` (incl. `StorefrontPolicies`)               |
| Code fallback copy          | `src/lib/content/defaults.ts`                                         |
| Policy token formatting     | `src/lib/content/policy-format.ts` (`buildPolicyLabelValues`)         |
| Announcement dismiss keys   | `src/lib/content/announcement-dismiss-key.ts`                         |
| Channel currency (chrome)   | `src/lib/channels/resolve-channel-currency.ts`                        |
| Provider switch             | `src/lib/content/provider.ts` (`CONTENT_PROVIDER` env)                |
| Deep merge                  | `src/lib/content/merge.ts`                                            |
| Cached entry point (server) | `src/lib/content/get-storefront-content.ts`                           |
| Client-safe exports         | `src/lib/content/index.ts`                                            |
| Server-only export          | `src/lib/content/server.ts`                                           |
| Saleor fetch + mappers      | `src/lib/content/saleor/`                                             |
| Cache profile + tags        | `src/lib/cache-manifest.ts` (`storefront-content:{channel}:{locale}`) |

**Do not** import `getStorefrontContent` from the client barrel — `"use cache"` must stay server-only.

---

## Providers

| `CONTENT_PROVIDER` | Behavior                                                                  |
| ------------------ | ------------------------------------------------------------------------- |
| `code` (default)   | Returns `defaults.ts` only — no Saleor call                               |
| `saleor`           | Fetches storefront Pages, maps attributes → partial, merges over defaults |
| `url`              | Reserved; falls back to `code`                                            |

Restart `next dev` after changing `CONTENT_PROVIDER`.

---

## Merge Semantics (important)

When extending mappers or adding fields:

1. **`omitEmpty`** — skip empty strings so Saleor does not overwrite a default with `""`.
2. **`coalesceArray`** — empty arrays from Saleor do not wipe default list content (e.g. homepage paragraphs).
3. **Saleor provider** folds surface mappers with `reduce(mergeStorefrontContent, defaults)`.
4. On GraphQL failure, Saleor provider returns **full defaults** (warn in dev, error log in prod).

Exact field list lives in `types.ts` / `defaults.ts` — those evolve; merge rules stay stable.

---

## Where Content Is Consumed

| Surface                                        | Loader                                                         |
| ---------------------------------------------- | -------------------------------------------------------------- |
| Announcement bar, shared chrome                | `(main)/layout.tsx` → `MainChrome`                             |
| Homepage sections                              | `(main)/page.tsx`                                              |
| Cart trust / empty copy                        | Cart drawer (client reads props or context from server parent) |
| Checkout empty states, trust, marketing opt-in | `checkout-session-loader.tsx` → `CheckoutContentProvider`      |

Checkout resolves **channel from cart cookies** when loading content so copy can match the cart's channel.

---

## Caching & Freshness

- Profile: `storefront-content` (~menus tier, ~5 min stale).
- Tag: `storefront-content:{channel}:{locale}` (BCP 47 from `getLocaleBcp47List()`).
- **Locale** keys both the cache tag and the `"use cache"` function args. Catalog/menus/CMS use `localeSlug` in function args with slug-scoped tags — see `data-caching.md` § Locale & Caching.
- **Catalog translations** (products, categories, menus, CMS pages) are wired: GraphQL `languageCode` + `withTranslated*Fields`.
- **Storefront Models content** uses `StorefrontContentPages.graphql` `translation` on plain-text attributes via `buildAttributeMap`.
- **Invalidation goes through [saleor-paper-app](https://github.com/saleor/saleor-paper-app)** — do not point Saleor webhooks directly at the storefront for production. The app subscribes to Saleor events, then `POST`s to Paper's `/api/revalidate` with the same payload shape the storefront handler expects.
- **Storefront content:** `PAGE_*` on Pages whose slug matches `storefront-*` (e.g. `storefront-homepage`, `storefront-homepage-{channel}`) → `planStorefrontContentRevalidation()` in `cache-manifest.ts` → `revalidateTag(storefront-content:{channel}:{locale})` + homepage paths per channel.
- **Menus** (nav/footer): `MENU_*` / `MENU_ITEM_*` → separate profiles (`navigation`, `footerMenu`) — same paper-app → storefront path.
- The `storefront-content` profile is listed in `GET /api/cache-info` so the Dashboard app can offer manual purge alongside catalog entities.
- Manual (dev / emergency): `GET /api/revalidate?tag=storefront-content:{channel}:{locale}` with `REVALIDATE_SECRET`.

```
Saleor (PAGE_UPDATED on storefront-homepage)
    → saleor-paper-app (page-changed webhook)
    → POST /api/revalidate { page: { slug } }
    → planStorefrontContentRevalidation → revalidateTag + revalidatePath
```

Marketing copy is cached like navigation — cart/checkout **transactional** data stays fresh via `cache: "no-cache"`.

---

## Changing Copy (agent checklist)

**Code-only (no Saleor):**

1. Edit `defaults.ts` and/or `types.ts` if shape changes.
2. Wire new fields through the relevant page/component.

**Saleor-backed — copy only (no schema change):**

1. Edit values in Dashboard → Models.
2. Revalidate cache or wait for TTL.

**Saleor-backed — new field or PageType (commerce-as-code):**

1. Add attribute + model field in Configurator YAML (see `data-storefront-content-saleor.md`).
2. Extend `StorefrontContentPages.graphql` if new attribute types are needed → `pnpm run generate`.
3. Add slug to `attribute-slugs.ts` and a mapper in `src/lib/content/saleor/mappers/`.
4. Run `pnpm content:verify-attribute-slugs`.
5. Configurator deploy to sync schema/seed to Saleor; then set copy in Dashboard for ongoing editorial work.
6. Revalidate cache or wait for TTL.

---

## Anti-Patterns

- Importing `@/lib/content/server` from `"use client"` components.
- Putting merchandising copy in `src/config/*.ts` — use the content layer.
- Hardcoding announcement/homepage strings in UI components when `getStorefrontContent` is available upstream.
- Assuming empty Saleor attribute means "clear this field" — empty means **keep default** unless you intentionally change merge rules.
- Listing every attribute slug in this rule — read `attribute-slugs.ts` and mappers for the current contract.

---

### 1.5 Storefront Content (Saleor Models)

Paper models merchandising copy in **Saleor Models** (PageTypes + Pages + page-type attributes). The storefront maps those Pages into the normalized `StorefrontContent` shape defined in code.

> **Runtime behavior** (providers, merge, cache): `data-storefront-content.md`  
> **Deploy & tokens**: `config/saleor/README.md`  
> **Exact attributes** change over time — treat `src/lib/content/attribute-slugs.ts` and `config/saleor/storefront-content.config.yml` as the live contract, not this doc.

---

## Models as the content surface

**Saleor Models** (PageTypes + Pages) are the dedicated place for merchandising and editorial copy in Paper. Each **PageType** defines a purpose — chrome, homepage, cart, checkout — and the **attributes** on that type give structure to otherwise unstructured text (headings, labels, paragraphs, flags).

| Model (PageType)                                                          | Purpose                                                                                                  |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `storefront-policies` (PageType) / `storefront-policy` (global Page slug) | Channel-wide **policy values** (free-shipping threshold, returns window) — `NUMERIC`/`BOOLEAN`, not copy |
| `storefront-chrome`                                                       | Site-wide chrome (e.g. announcement bar)                                                                 |
| `storefront-homepage`                                                     | Homepage sections                                                                                        |
| `storefront-cart`                                                         | Cart drawer **editorial** copy (title, free-shipping nudges, empty state, trust)                         |
| `storefront-checkout`                                                     | Checkout surface copy                                                                                    |

**Editorial only (ADR 0002):** these models hold merchant-editable copy. **Functional UI strings** — cart totals/buttons, item count, `Qty:`/`Variant:` labels, breadcrumbs, `sr-only` a11y labels, PDP/PLP/search/nav/account chrome — are **not** modeled here; they are code-owned via next-intl (`messages/{locale}.json`). When adding an attribute, ask _"would a merchant reword this per shop?"_ — if not, it belongs in `messages/*.json`, not a PageType. See `docs/adr/0002-cms-copy-vs-code-owned-ui-strings.md` and `ui-i18n.md`.

**Policy vs copy:** `storefront-policy` holds the _facts_ (a number/boolean); the other models hold _copy_ that only describes those facts via `{freeShippingThreshold}` / `{returnsWindowDays}` placeholders. One threshold feeds the cart progress math, the announcement bar, and the cart trust signal — change it in one place, everything stays consistent. Override per channel with `storefront-policy-{channelSlug}` (numbers are in the channel currency).

That is what modeling is for: keep flexible marketing content **structured and editable** through typed attributes, and mappable into a stable `StorefrontContent` contract in code. **Day-to-day copy changes** happen in Dashboard → Models; Configurator is for **commerce-as-code** when the Saleor schema itself needs updating (see below).

**Models are translatable in Saleor** — attribute values on a Page can be translated per language in Dashboard today. Merchandisers can enter translations now; Paper will serve them once the storefront fetch is wired (no Saleor schema change required).

Pages are **not** channel-scoped in Saleor. Per-channel copy is a **convention** — separate Page instances distinguished by slug (see below), resolved in the storefront provider.

---

## Conceptual Schema

```
PageType (e.g. storefront-homepage)
  └── assigned PAGE_TYPE attributes  (hero heading, CTA label, …)
  └── Page instances (Models in Dashboard)
        └── attribute values per page
```

**One PageType per storefront surface** (chrome, homepage, cart, checkout). Constants in `src/lib/content/constants.ts` (`STOREFRONT_PAGE_TYPES`).

Dashboard tabs are typically named **Storefront — Chrome**, **Storefront — Homepage**, etc. PageType slugs use the `storefront-` prefix.

---

## Slug Stack (global vs per-channel copy)

Saleor enforces **globally unique page slugs** — there is no native “this page belongs to channel X”. Paper simulates per-channel copy with slug naming:

| Tier                 | Page slug pattern                                                       | Purpose                       |
| -------------------- | ----------------------------------------------------------------------- | ----------------------------- |
| **Global**           | Same as PageType slug (e.g. `storefront-homepage`)                      | Default copy for all channels |
| **Channel override** | `{pageTypeSlug}-{channelSlug}` (e.g. `storefront-homepage-channel-pln`) | Per-channel copy              |

**Resolution order** (in `resolve-page.ts`):

```
1. storefront-{surface}-{channel}   ← channel override wins
2. storefront-{surface}           ← global fallback
3. defaults.ts                    ← code fallback (always present)
```

Fetch collects **both** candidate slugs per surface, then picks the best match.

**Revalidation scope:** editing the global page invalidates all channels; editing a channel-specific page invalidates that channel only (`resolveStorefrontContentChannelsForPageSlug`).

---

## Attributes: Names vs Slugs

| Layer                  | Uses                                                                       |
| ---------------------- | -------------------------------------------------------------------------- |
| **Configurator YAML**  | Human **display names** on `contentAttributes` and model `attributes` keys |
| **Saleor**             | Assigns **slugs** from names (slugify)                                     |
| **Storefront mappers** | Read by **slug** via `attribute-slugs.ts`                                  |

Configurator resolves attributes by **name** when deploying; the app reads **slugs** at runtime. Keep YAML names and `attribute-slugs.ts` in sync — run `pnpm content:verify-attribute-slugs`.

**Greenfield bootstrap:** with no storefront models yet, `pnpm configurator:storefront-content:deploy` creates PageTypes, attributes, and seed models from `storefront-content.config.yml`. Copy fields that reference channel policies use `{freeShippingThreshold}` / `{returnsWindowDays}` in seed values — keep those tokens in Dashboard translations too (see YAML comments on those attributes).

**Attribute types:** see `data-storefront-content-attributes.md` — scalar types, catalog **references** (`SINGLE_REFERENCE` / `REFERENCE`), and what Paper wires today.

---

## Configurator (commerce-as-code, not editorial)

**Saleor Configurator** syncs YAML to Saleor when the **structure** of storefront content changes — new PageTypes, new attributes, seed models, baseline values for new environments. It is **not** the day-to-day editor for merchandisers.

| Who / when                                                        | Tool                                                        |
| ----------------------------------------------------------------- | ----------------------------------------------------------- |
| Merchandiser updating hero text, trust labels, translations       | **Dashboard → Models**                                      |
| Developer adding a new content field or bootstrapping dev/staging | **Configurator** (`storefront-content.config.yml` + deploy) |

Seed file: `config/saleor/storefront-content.config.yml`

```bash
pnpm configurator:storefront-content:validate   # offline schema check
pnpm configurator:storefront-content:plan       # dry-run remote diff
pnpm configurator:storefront-content:deploy     # apply (additive for omitted sections)
```

**Token split (dev safety):**

| Variable                    | File                      | Used by                           |
| --------------------------- | ------------------------- | --------------------------------- |
| `SALEOR_APP_TOKEN`          | `.env.local`              | Next.js runtime (narrow)          |
| `SALEOR_CONFIGURATOR_TOKEN` | `.env.configurator.local` | Configurator scripts only (broad) |

Never expose configurator token as `NEXT_PUBLIC_*` or import it in app code.

**Plan vs deploy:** `plan` may show spurious DELETE drift for entities not in the partial YAML. `deploy` only creates/updates what's listed — it does not wipe the catalog when sections are omitted. See `config/saleor/README.md` for details.

**After deploy:** set `CONTENT_PROVIDER=saleor`, restart dev server. Ongoing copy work stays in Dashboard — only return to Configurator when the attribute schema or seed models need to change in code.

---

## Mapper Pipeline (saleor provider)

```
collectStorefrontContentPageSlugs(channel)
  → GraphQL StorefrontContentPages (by slug list)
  → indexStorefrontPagesBySlug (skip unpublished)
  → resolveStorefrontPageForType per surface
  → mapChromePage | mapHomepagePage | mapCartPage | mapCheckoutPage
  → reduce(mergeStorefrontContent, defaults)
```

Each mapper returns a **partial** `StorefrontContent`. Mappers live under `src/lib/content/saleor/mappers/`.

When adding a new editable field:

1. Add `contentAttribute` + model default in YAML.
2. Add slug constant in `attribute-slugs.ts`.
3. Map in the appropriate surface mapper using `buildAttributeMap` / `attrText`.
4. Add to `types.ts`, `defaults.ts`, and the UI consumer.

---

## Channel Override Recipe

To override homepage copy for channel `channel-pln`:

1. Create (or deploy) a Page with slug `storefront-homepage-channel-pln` under PageType `storefront-homepage`.
2. Set attribute values on that page.
3. Request `getStorefrontContent("channel-pln", locale)` — provider resolves the channel page first.

Global page `storefront-homepage` remains the fallback for other channels.

---

## i18n

**Saleor (ready now):** Models support translations — editors can translate attribute values per language on each Page in Dashboard. The content is there when Paper asks for it.

**Paper (fetch wired):**

- `getStorefrontContent(channel, localeSlug)` and cache tags (`storefront-content:{channel}:{locale}`) key by locale.
- `StorefrontContentPages.graphql` passes `languageCode`; plain-text attributes use `translation(languageCode: …)` in `buildAttributeMap`.

**Policy placeholders in translations:** localized strings must keep the same `{freeShippingThreshold}` / `{returnsWindowDays}` tokens as the default language — never bake channel-specific amounts or currencies into Dashboard translations (e.g. avoid `"$75"` or `"30 dni"` literals). Paper formats money from `policies` + channel currency at render time. Missing placeholders are warned in development via `formatPolicyAwareLabel`.

---

## Cache & Revalidation (saleor-paper-app)

Storefront content is cached (`storefront-content:{channel}:{locale}`). **Freshness is owned by the Paper Saleor app**, not ad-hoc Saleor → storefront webhooks.

| Layer                | Responsibility                                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Storefront**       | Define profile + tags in `cache-manifest.ts`; implement `planStorefrontContentRevalidation()`; expose `/api/revalidate` + `/api/cache-info`. |
| **saleor-paper-app** | Register Saleor webhooks on install; forward `PAGE_*` (and `MENU_*` for nav) to the configured storefront URL with `REVALIDATE_SECRET`.      |
| **Merchant**         | Edit Models in Dashboard; app receives `PAGE_UPDATED` and triggers revalidation automatically.                                               |

When a merchant saves a `storefront-*` Page, Saleor emits `PAGE_UPDATED` → paper-app `page-changed` handler → `POST /api/revalidate` with `{ page: { slug } }` → storefront resolves slug to channel(s) and purges `storefront-content` tags.

**Agent checklist when adding content fields:**

1. Storefront only — no paper-app change if slug conventions and cache profile stay the same.
2. New cache profile or tag shape — update `cache-manifest.ts` **and** ensure paper-app still forwards the right events (or add a webhook definition in `../saleor-paper-app/src/modules/revalidation/webhook-events.ts`).
3. After paper-app webhook changes — reinstall or sync webhooks from the app configuration UI.

See `data-caching.md` for the full invalidation architecture and `migrations/atomic/2026-06-menu-webhooks/` for the menu analogue.

---

## Anti-Patterns

- Mixing surfaces on one PageType — keep chrome, homepage, cart, and checkout as separate types with their own attribute sets.
- Reusing slug `default` for pages — Saleor needs unique slugs; use the PageType slug for global singletons.
- Putting **slugs** in Configurator model `attributes` keys — use **display names** (Configurator resolves to attributes).
- Duplicating attribute lists in skills/docs — grep `attribute-slugs.ts` instead.
- Expecting `plan` delete noise to match `deploy` behavior — trust the README, not the scary diff.
- Running Configurator deploy to change live copy — edit Models in Dashboard instead; Configurator is for schema and environment bootstrap.
- Pointing Saleor webhooks straight at `/api/revalidate` while the Paper app is installed — use the app's managed webhooks so merchants get logs, manual purge, and a single revalidation path.

---

### 1.6 Storefront Content Attributes

How to choose Saleor attribute `inputType`s on storefront Models, and what Paper reads today.

> **Models setup**: `data-storefront-content-saleor.md`  
> **Runtime layer**: `data-storefront-content.md`  
> **Slug contract**: `src/lib/content/attribute-slugs.ts`

---

## Catalog vs copy (don't duplicate entities)

Collections and categories already have **name**, **description** (rich text), and **image** in Saleor.

| Store in Models                                                 | Store in catalog API                           |
| --------------------------------------------------------------- | ---------------------------------------------- |
| Section heading when editorial (e.g. "Staff picks")             | Collection/category **name**                   |
| **Reference** to which collection/category (slug via attribute) | **Description**, **image**, product membership |
| Hero copy, trust labels, booleans                               | Product fields                                 |

Use **reference attributes** for pointers; fetch display fields from `src/lib/catalog/` when rendering.

---

## Reference attributes (Saleor 3.22+)

| Configurator `inputType` | Cardinality | `entityType` examples                       | Paper use                                  |
| ------------------------ | ----------- | ------------------------------------------- | ------------------------------------------ |
| `SINGLE_REFERENCE`       | One         | `COLLECTION`, `CATEGORY`, `PRODUCT`, `PAGE` | Featured collection slug on homepage       |
| `REFERENCE`              | Many        | Same                                        | Future: collection list (multi-collection) |

Configurator seed values use the **target entity slug** (e.g. `featured-products`).

GraphQL: `AssignedSingleCollectionReferenceAttribute`, `AssignedMultiCollectionReferenceAttribute`, and siblings for category/product/page — extend `StorefrontContentPages.graphql` per type.

---

## Scalar & media types (roadmap)

| `inputType`                       | Typical storefront use                        | Wired in Paper                                                           |
| --------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| `PLAIN_TEXT`                      | Headings, labels, short copy                  | Yes                                                                      |
| `BOOLEAN`                         | Dismissible flags, toggles                    | Yes                                                                      |
| `SINGLE_REFERENCE` + `COLLECTION` | Featured collection override                  | Yes (`featured-collection`)                                              |
| `SINGLE_REFERENCE` + `CATEGORY`   | Category spotlight                            | No                                                                       |
| `REFERENCE` + `COLLECTION`        | Collection list ordering                      | No                                                                       |
| `RICH_TEXT`                       | Long copy, collection description on homepage | No — prefer catalog `description` for entities                           |
| `FILE`                            | Hero / editorial images                       | No                                                                       |
| `DROPDOWN` / `SWATCH`             | Layout variants (e.g. image left/right)       | No — code enum today for editorial position                              |
| `NUMERIC`                         | Policy values, limits, counts                 | Yes — `free-shipping-threshold`, `returns-window-days`, `featured-limit` |

`NUMERIC` is read via `attrNumber()` (`buildAttributeMap` stores the `Float` directly); `attrInt()` truncates it. Use `NUMERIC` for any value consumed by logic or formatted as money/count — not `PLAIN_TEXT`. Policy money values are stored in the channel currency; format with the live cart currency (cart drawer) or `resolveChannelCurrency()` (chrome/homepage), then interpolate via `buildPolicyLabelValues()` + `formatContentLabel()`.

Add types in this order when a section needs them: extend GraphQL fragment → mapper helper in `attributes.ts` → `attribute-slugs.ts` → Configurator (commerce-as-code) → Dashboard for merchandisers.

---

## Adding a reference attribute (checklist)

1. `contentAttributes` in `storefront-content.config.yml` with `inputType` + `entityType`.
2. Assign on the relevant `modelTypes` entry.
3. Slug constant in `attribute-slugs.ts` (verify script matches display name).
4. Fragment inline on `AssignedSingle*ReferenceAttribute` / `AssignedMulti*ReferenceAttribute`.
5. `pnpm run generate` → mapper reads slug(s) → `types.ts` + `defaults.ts` fallback.
6. Section/catalog code consumes slug; **metadata** from catalog queries.

---

## Anti-patterns

- Storing collection **title** or **description** on `storefront-homepage` when the section showcases that collection.
- Using `PLAIN_TEXT` for a collection slug — no Dashboard picker, no validation.
- Extending GraphQL for a type before you have a section that needs it (YAGNI) — except document roadmap here.

---

## 2. Product Pages

**Impact: HIGH**

Product pages are the core shopping experience. PDP layout, variant selection, and filtering directly affect conversion and usability.

### 2.1 Product Detail Page

Product Detail Page architecture, image gallery/carousel, caching, and add-to-cart flow. Ensures correct PDP layout, variant-aware gallery, LCP optimization, and resilient error handling.

> **Sources**: [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching) · [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) · [Suspense](https://react.dev/reference/react/Suspense)

For variant selection logic specifically, see `product-variants.md`.

> **Start here:** Read the [Data Flow](#data-flow) section first - it explains how everything connects.

## Architecture Overview

```
ProductPage (sync export)
└── Suspense → ProductShell (params + getProductData only — never await searchParams)
    ├── breadcrumbs, h1, attributes, JSON-LD
    ├── Suspense → VariantGalleryDynamic (searchParams → variant images; LCP fallback image)
    └── ErrorBoundary + Suspense → VariantSectionDynamic (searchParams → price, selectors, add-to-cart)

Layout + skeletons: PDP_GALLERY_LAYOUT in gallery-layout.ts (immersive | standard | mosaic)
Route loading: products/[slug]/loading.tsx → ProductRouteSkeleton (same layout constant)

Data: getProductData() with applyCacheProfile(CACHE_PROFILES.products)  ← catalog tier (~5 min)
```

### Key Principles

1. **Product data is cached** — `getProductData()` uses `"use cache"` + cache manifest profile
2. **Shell stays static** — `ProductShell` awaits `params` only; passes `searchParams` promise through
3. **Gallery and variant section are separate dynamic islands** — each in its own Suspense boundary
4. **Gallery shows variant images** — `VariantGalleryDynamic` reads `?variant=` from URL
5. **Errors are contained** — ErrorBoundary around variant section prevents full page crash

### Data Flow

**Read this first** - understanding how data flows makes everything else click:

```
URL: /pl/default-channel/products/blue-shirt?variant=abc123
                │
                ▼
┌───────────────────────────────────────────────────────────────────┐
│ ProductPage (sync) → Suspense → ProductShell                      │
│                                                                   │
│   1. await params → getProductData("blue-shirt", "default-channel", "pl") │
│      └──► "use cache" + CACHE_PROFILES.products ──► translated product    │
│                                                                   │
│   2. Static shell: h1, breadcrumbs, attributes, JSON-LD, preload  │
│                                                                   │
│   3. Nested Suspense islands (each awaits searchParams):          │
│      • VariantGalleryDynamic ──► variant.media for gallery        │
│      • VariantSectionDynamic ──► price, selectors, add-to-cart      │
└───────────────────────────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────────┐
│ User selects different variant (e.g., "Red")                      │
│                                                                   │
│   router.push("?variant=xyz789")                                  │
│      └──► URL changes                                             │
│      └──► Page re-renders with new searchParams                   │
│      └──► Gallery shows red variant images                        │
│      └──► VariantSection shows red variant selected               │
└───────────────────────────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────────┐
│ User clicks "Add to bag"                                          │
│                                                                   │
│   <form action={addToCart}>                                       │
│      └──► Server Action executes                                  │
│      └──► Creates/updates checkout                                │
│      └──► revalidatePath("/cart")                                 │
│      └──► Cart drawer updates                                     │
└───────────────────────────────────────────────────────────────────┘
```

**Why this matters:**

- Product data is **cached** (fast loads)
- URL is the **source of truth** for variant selection
- Gallery reacts to URL changes **without client state**
- Server Actions handle mutations **without API routes**

## File Structure

```
src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/
└── page.tsx                          # Main PDP page

src/ui/components/pdp/
├── index.ts                          # Public exports (no gallery renderers — see registry)
├── gallery-layout.ts                 # PDP_GALLERY_LAYOUT + shell class bundles
├── gallery-registry.tsx              # Canonical layout→renderer/fallback/skeleton map (lazy)
├── gallery-utils.ts                  # getGalleryImages, resolveSelectedVariantId
├── product-route-skeleton.tsx          # Shared route loading + page Suspense skeleton
├── variant-gallery-dynamic.tsx       # Server: searchParams → active registry renderer
├── product-gallery.tsx               # Client: standard Embla carousel wrapper
├── product-gallery-fallback.tsx      # Server: standard LCP fallback image
├── immersive-gallery.tsx             # Client: immersive filmstrip gallery
├── immersive-gallery-fallback.tsx    # Server: immersive LCP fallback + skeleton
├── mosaic-gallery.tsx                # Server: editorial image grid (all images)
├── mosaic-gallery-fallback.tsx       # Server: mosaic LCP fallback + skeleton
├── variant-section-dynamic.tsx       # Variant selection + add to cart
├── variant-section-error.tsx         # Error fallback (Client Component)
├── add-to-cart.tsx                   # Add to cart button
├── sticky-bar.tsx                    # Mobile sticky add-to-cart
├── product-attributes.tsx            # Description/details accordion
└── variant-selection/                # Variant selection system
    └── ...                           # See product-variants rule

src/ui/components/ui/
├── carousel.tsx                      # Embla carousel primitives
└── image-carousel.tsx                # Reusable image carousel (standard gallery)
```

## Image Gallery

### Layout modes (`PDP_GALLERY_LAYOUT`)

The whole shop uses **one** PDP gallery style — a build-time constant in `gallery-layout.ts`, not per-product CMS config. Set it to `"immersive"`, `"standard"`, or `"mosaic"`; shell classes, the dynamic island renderer, Suspense fallbacks, and route skeletons all read the same value.

| Layout                    | Container           | Grid                                 | Gallery                                                        | Attributes accordion           |
| ------------------------- | ------------------- | ------------------------------------ | -------------------------------------------------------------- | ------------------------------ |
| **`immersive`** (default) | `container-full`    | Wide gallery + narrow sticky buy box | `ImmersiveGallery` — square filmstrip, viewport-height frames  | Below images in gallery column |
| **`mosaic`**              | `container-wide`    | Wide gallery + narrow sticky buy box | `MosaicGallery` — all images in a 2-col 4:5 grid (no carousel) | Under buy box in info column   |
| **`standard`**            | `container-content` | `lg:grid-cols-2`                     | `ProductGallery` — 4:5 hero + thumbnail strip                  | Under buy box in info column   |

All three surfaces (renderer, LCP fallback, skeleton) for each layout live in **`gallery-registry.tsx`** — see [Gallery registry](#gallery-registry-canonical-pattern). `VariantGalleryDynamic`, `ProductShell`, and `ProductRouteSkeleton` read the active layout's surfaces from `activeGalleryVariant()`, so route `loading.tsx` never disagrees with the live page.

### Gallery registry (canonical pattern)

A Paper shop ships exactly **one** gallery layout, picked at build time, but we keep a growing _library_ of layouts in the repo. The registry guarantees the unused ones never reach the browser — and that nobody has to think about it per-layout:

```tsx
// gallery-registry.tsx — the ONLY file that imports gallery renderers
const StandardGallery = dynamic(() => import("./product-gallery").then((m) => m.ProductGallery), { loading });
const ImmersiveGallery = dynamic(() => import("./immersive-gallery").then((m) => m.ImmersiveGallery), {
	loading,
});

export const GALLERY_REGISTRY: Record<PdpGalleryLayout, GalleryVariant> = {
	standard: { Gallery: StandardGallery, Fallback: ProductGalleryFallback, Skeleton: StandardGallerySkeleton },
	immersive: {
		Gallery: ImmersiveGallery,
		Fallback: ImmersiveGalleryFallback,
		Skeleton: ImmersiveGallerySkeleton,
	},
	mosaic: { Gallery: MosaicGallery, Fallback: MosaicGalleryFallback, Skeleton: MosaicGallerySkeleton }, // Server Component
};

export const activeGalleryVariant = () => GALLERY_REGISTRY[PDP_GALLERY_LAYOUT];
```

Three things make "only the active layout ships" the default behavior:

1. **Interactive renderers load via `next/dynamic`** → each gets its own chunk; only the active layout's JS (incl. Embla) is requested. Server-Component renderers (mosaic) cost zero client JS and are imported directly.
2. **The registry is the only importer of renderers.** They are NOT re-exported from `index.ts`.
3. **`Record<PdpGalleryLayout, GalleryVariant>` is exhaustive.** Add a key to the union and the compiler forces you to register all three surfaces.

**Add a layout** (the only files you touch): create `my-gallery.tsx` (+ fallback) → add the key to `PdpGalleryLayout` and classes to `PDP_LAYOUT_CLASSES` in `gallery-layout.ts` → add one entry to `GALLERY_REGISTRY`.

> This is the project-wide model for build-time-selected variants of a component — see [Swappable variants of a component](ui-components.md#swappable-variants-of-a-component) for when to use it vs. `cva` prop variants.

#### Molding it your own way

The registry is a convenient default, **not a cage**. Want to hardcode one gallery and delete the rest? Go ahead — import your renderer straight into `VariantGalleryDynamic` and render it. Importing one renderer and using it ships exactly that renderer; nothing unused, no penalty. There is no lint rule policing this.

The **one** thing that silently bloats the bundle (vs. harmless dead code): re-exporting _multiple_ `"use client"` gallery renderers through a barrel (e.g. `index.ts`) that a Server Component imports. A re-export counts as "used," so it defeats tree-shaking across the client boundary and pulls every re-exported renderer into the bundle even though one renders. That's the sole reason renderers stay out of `index.ts`. A plain unused `import` (no re-export) is tree-shaken normally and costs nothing.

### Features (by layout)

**Mosaic (`MosaicGallery`)** — editorial grid

- Every image rendered at once in a 2-column `aspect-[4/5]` grid — no carousel, the page scrolls through the imagery
- Narrow sticky buy box (with the description/details accordion) sits beside the grid on desktop; mobile sticky bar keeps add-to-cart reachable while scanning
- Pure Server Component (no client JS) — first tile eager, rest lazy-loaded

**Immersive (`ImmersiveGallery`)**

- Horizontal Embla filmstrip — square images sized to `100svh - chrome` on desktop
- Controls **below** the strip: prev/next buttons, pill dots, `n / total` counter
- Mobile: swipe the filmstrip; same controls below

**Standard (`ProductGallery` / `ImageCarousel`)**

- **Mobile**: Horizontal swipe + dot indicators under the hero
- **Desktop**: Arrow navigation (hover) + thumbnail strip

**Both**

- **LCP**: server-rendered first image in the gallery Suspense fallback (`ImmersiveGalleryFallback` or `ProductGalleryFallback`) with `priority`, plus eager load on the first streamed carousel frame
- **Variant-aware**: `VariantGalleryDynamic` resolves images from `searchParams.variant`

### How Variant Images Work

```tsx
// variant-gallery-dynamic.tsx — searchParams read here, NOT in ProductShell
export async function VariantGalleryDynamic({ product, searchParams }) {
	const { variant: variantParam } = await searchParams;
	const selectedVariantId = resolveSelectedVariantId(product, variantParam);
	const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
	const images = getGalleryImages(product, selectedVariant);

	// No per-layout branching — the registry resolves the active renderer.
	const { Gallery } = activeGalleryVariant();
	return <Gallery images={images} productName={product.name} />;
}
// Priority: variant.media → product.media → thumbnail
```

### LCP Strategy

Keep LCP in the **gallery Suspense fallback**, not a separate hero above the fold:

1. **`ProductShell`** passes the default hero URL into the active layout's `Fallback` (from `activeGalleryVariant()`) as the nested Suspense fallback (real `<Image priority>` at the layout's size — no layout shift when the island streams)
2. **`ImmersiveGallery`** / **`ProductGallery`** sets eager/`priority` on the first visible carousel image when the island hydrates
3. Variant-specific images load when the user selects a variant (acceptable trade-off)

### Customizing Gallery

**Switch layout for the whole storefront** — edit `PDP_GALLERY_LAYOUT` in `gallery-layout.ts`.

**Standard gallery chrome** — `image-carousel.tsx` props:

```tsx
<ImageCarousel
	images={images}
	productName="..."
	showArrows={true} // Desktop arrow buttons
	showDots={true} // Mobile dot indicators
	showThumbnails={true} // Desktop thumbnail strip
	onImageClick={(i) => {}} // For future lightbox
/>
```

**Immersive frame height** — `PDP_IMMERSIVE_IMAGE_HEIGHT` in `gallery-layout.ts` (uses `--chrome-offset` + `--pdp-immersive-reserved` from `brand.css`).

### Adding Zoom/Lightbox (Future)

Use the `onImageClick` callback:

```tsx
<ImageCarousel images={images} onImageClick={(index) => openLightbox(index)} />
```

## Caching Strategy

### Data Fetching

```tsx
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { withTranslatedProductFields } from "@/lib/saleor-translations";

async function getProductData(slug: string, channel: string, localeSlug: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.products, slug);

	const result = await executePublicGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(slug),
			channel,
			...graphqlLanguageCodeVariables(localeSlug),
		},
	});
	return result.data.product ? withTranslatedProductFields(result.data.product) : null;
}
```

**Note:** `localeSlug` is part of the Next.js cache key (separate entry per language). Tag stays `product:{slug}` — webhooks invalidate all locales. Do not add fetch-level `revalidate` here. See `data-caching.md`.

### What's Cached vs Dynamic

| Part                     | Cached? | Why                                         |
| ------------------------ | ------- | ------------------------------------------- |
| Product data             | ✅ Yes  | `"use cache"` in `getProductData()`         |
| h1, breadcrumbs, JSON-LD | ✅ Yes  | Rendered in `ProductShell` from cached data |
| Default LCP preload URL  | ✅ Yes  | Derived from cached product media           |
| Gallery (variant images) | ❌ No   | `VariantGalleryDynamic` reads searchParams  |
| Variant section (price)  | ❌ No   | `VariantSectionDynamic` reads searchParams  |

### On-Demand Revalidation

```bash
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=product:my-product-slug"
```

## Error Handling

### ErrorBoundary Pattern

```tsx
<ErrorBoundary FallbackComponent={VariantSectionError}>
  <Suspense fallback={<VariantSectionSkeleton />}>
    <VariantSectionDynamic ... />
  </Suspense>
</ErrorBoundary>
```

**Why**: If variant section throws, user still sees:

- Product images ✅
- Product name ✅
- Description ✅
- "Unable to load options. Try again." message

### Server Action Error Handling

```tsx
async function addToCart() {
	"use server";
	try {
		// ... checkout logic
	} catch (error) {
		console.error("Add to cart failed:", error);
		// Graceful failure - no crash
	}
}
```

## Add to Cart Flow

```
User clicks "Add to bag"
        │
        ▼
┌─────────────────────┐
│ form action={...}   │ ← HTML form submission
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ addToCart()         │ ← Server Action
│ "use server"        │
│                     │
│ • Find/create cart  │
│ • Add line item     │
│ • revalidatePath()  │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ useFormStatus()     │ ← Shows "Adding..." state
│ pending: true       │
└─────────────────────┘
        │
        ▼
   Cart drawer updates (via revalidation)
```

## Common Tasks

### Add new product attribute display

1. Check `ProductDetails.graphql` for field
2. If missing, add and run `pnpm run generate`
3. Extract in `page.tsx` helper function
4. Pass to `ProductAttributes` component

### Change gallery thumbnail size (standard layout only)

Edit `image-carousel.tsx`:

```tsx
<button className="relative h-20 w-20 ...">  {/* Change h-20 w-20 */}
```

### Switch PDP layout (mosaic ↔ immersive ↔ standard)

Edit `gallery-layout.ts`:

```tsx
export const PDP_GALLERY_LAYOUT: PdpGalleryLayout = "immersive"; // or "mosaic" | "standard"
```

Shell, island, Suspense fallbacks, and `ProductRouteSkeleton` / `loading.tsx` follow automatically.

### Change sticky bar scroll threshold

Edit `sticky-bar.tsx`:

```tsx
const SCROLL_THRESHOLD = 500; // Change this value
```

### Add product badges (New, Sale, etc.)

Badges are in `VariantSectionDynamic`:

```tsx
{
	isOnSale && <Badge variant="destructive">Sale</Badge>;
}
```

## GraphQL

### Key Queries

- `ProductDetails.graphql` - Main product query
- `VariantDetailsFragment.graphql` - Variant data including media

### After GraphQL Changes

```bash
pnpm run generate  # Regenerate types
```

## Testing

```bash
pnpm test src/ui/components/pdp  # Run PDP tests
```

### Manual Testing Checklist

- [ ] Route `loading.tsx` skeleton matches live layout (no 2-col flash on immersive)
- [ ] Gallery swipe works on mobile (filmstrip or carousel)
- [ ] Immersive: arrows + counter below strip; standard: arrows on desktop hover + thumbnails
- [ ] Variant selection updates URL
- [ ] Variant images change when variant selected
- [ ] Add to cart shows pending state
- [ ] Sticky bar appears after scroll
- [ ] Error boundary catches failures
- [ ] Attributes accordion sits in the correct column for the active layout

## Anti-patterns

❌ **Don't pass Server Component functions to Client Components**

```tsx
// ❌ Bad - VariantSectionError defined in Server Component file
<ErrorBoundary FallbackComponent={VariantSectionError}>

// ✅ Good - VariantSectionError in separate file with "use client"
// See variant-section-error.tsx
```

❌ **Don't read searchParams in ProductShell or cached functions**

```tsx
// ❌ Bad — collapses entire PDP into dynamic hole
async function ProductShell({ searchParams, ... }) {
	const { variant } = await searchParams;
	const product = await getProductData(...);
}

// ✅ Good — pass searchParams promise to dynamic islands only
<Suspense fallback={<ImmersiveGalleryFallback src={...} alt={...} />}>
  <VariantGalleryDynamic product={product} searchParams={searchParams} />
</Suspense>

// Route + page skeletons share ProductRouteSkeleton (reads PDP_GALLERY_LAYOUT)
<Suspense fallback={<ProductRouteSkeleton />}>
  <ProductShell ... />
</Suspense>
```

```tsx
// ❌ Bad — breaks caching
async function getProductData(slug: string, searchParams: SearchParams) {
	"use cache";
	const variant = searchParams.variant;
}
```

❌ **Don't use useState for variant selection**

```tsx
// ❌ Bad - client state, not shareable, lost on refresh
const [selectedVariant, setSelectedVariant] = useState(null);

// ✅ Good - URL is source of truth
router.push(`?variant=${variantId}`);
// Read from searchParams on server
```

❌ **Don't skip ErrorBoundary around Suspense**

```tsx
// ❌ Bad - error crashes entire page
<Suspense fallback={<Skeleton />}>
  <DynamicComponent />
</Suspense>

// ✅ Good - error contained, rest of page visible
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <Suspense fallback={<Skeleton />}>
    <DynamicComponent />
  </Suspense>
</ErrorBoundary>
```

❌ **Don't use index as key for images**

```tsx
// ❌ Bad - breaks React reconciliation when images change
{images.map((img, index) => <Image key={index} ... />)}

// ✅ Good - stable key
{images.map((img) => <Image key={img.url} ... />)}
```

---

### 2.2 Variant Selection

Variant and attribute selection on product detail pages. Ensures correct "Add to Cart" button state, option availability, discount badges, and URL-driven selection.

> **Source**: [Saleor Docs - Attributes](https://docs.saleor.io/developer/attributes/overview) - How product/variant attributes work

> **UI & renderers:** For border states, swatch pills, sizing, and renderer routing, see
> [../references/variant-selector-ui.md](../references/variant-selector-ui.md).

## Core Concept: Variants, Not Products

**You add VARIANTS to cart, not products.** Each variant is a specific attribute combination:

| Product | Attributes     | Variant ID |
| ------- | -------------- | ---------- |
| T-Shirt | Black + Medium | `abc123`   |
| T-Shirt | Black + Large  | `def456`   |
| T-Shirt | White + Medium | `ghi789`   |

The `checkoutLinesAdd` mutation requires a specific `variantId`. Without selecting ALL attributes, there's no variant to add.

## Two Types of Variant Attributes

Saleor distinguishes between two types of variant attributes:

| Type              | `variantSelection`      | Purpose                                | UI                  | Passed to Cart?           |
| ----------------- | ----------------------- | -------------------------------------- | ------------------- | ------------------------- |
| **Selection**     | `VARIANT_SELECTION`     | Identify which variant (color, size)   | Interactive picker  | No - just the `variantId` |
| **Non-Selection** | `NOT_VARIANT_SELECTION` | Describe the variant (material, brand) | Display-only badges | No - already on variant   |

**Key insight:** Neither type is "passed" to checkout. You only pass the `variantId`. All attributes are already stored on the variant in Saleor.

```graphql
# GraphQL queries use the variantSelection filter:
selectionAttributes: attributes(variantSelection: VARIANT_SELECTION) { ... }
nonSelectionAttributes: attributes(variantSelection: NOT_VARIANT_SELECTION) { ... }
```

Non-selection attributes are **display-only** - shown as informational badges, not interactive selectors.

## Saleor Swatch Attributes

Saleor `inputType: SWATCH` attributes may provide a **hex color** (`value`), an **image** (`file.url`), or both. Common on demo catalog for Color and Audio quality.

Required GraphQL on `VariantDetailsFragment.graphql`:

```graphql
values {
  name
  value
  file { url }
}
attribute {
  slug
  name
  inputType
}
```

After changes: `pnpm run generate`.

| Swatch data    | Renderer                | UI                                |
| -------------- | ----------------------- | --------------------------------- |
| `file.url`     | `ImageSwatchPillOption` | `h-12` labeled pill (icon + name) |
| hex in `value` | `ColorSwatchOption`     | `h-12` circle                     |

See [variant-selector-ui.md](../references/variant-selector-ui.md) for border/state classes.

## File Structure

```
src/ui/components/pdp/variant-selection/
├── index.ts
├── types.ts
├── utils.ts
├── variant-selector.tsx
├── variant-selection-section.tsx
├── optional-attributes.tsx
└── renderers/
    ├── color-swatch-option.tsx      # Hex swatch circles
    ├── image-swatch-pill-option.tsx # Image swatch pills
    ├── button-option.tsx            # Size/text buttons
    └── index.ts                     # defaultRenderers registry
```

## Key Functions in `utils.ts`

| Function                        | Purpose                                        |
| ------------------------------- | ---------------------------------------------- |
| `groupVariantsByAttributes()`   | Extract unique attribute values from variants  |
| `findMatchingVariant()`         | Find variant matching ALL selected attributes  |
| `hasCompatibleVariant()`        | Any variant matches partial selections         |
| `getOptionsForAttribute()`      | Options with availability + compatibility info |
| `getAdjustedSelections()`       | Partial accumulation + conflict auto-clear     |
| `getUnavailableAttributeInfo()` | Detect dead-end selections                     |
| `normalizeAttributeValueId()`   | Value name → URL option id                     |

For detailed function signatures, see [../references/variant-utils-reference.md](../references/variant-utils-reference.md).

## Option States

| State            | Meaning                                 | Visual (buttons/pills)      | Clickable?        |
| ---------------- | --------------------------------------- | --------------------------- | ----------------- |
| **Compatible**   | Works with current other selections     | `border-gray-400`           | ✓                 |
| **Selected**     | Currently chosen                        | `border-foreground`, fill   | ✓                 |
| **Incompatible** | No variant with this + other selections | `border-gray-200`, muted    | ✓ (clears others) |
| **Out of stock** | Variant exists but quantity = 0         | strikethrough, `opacity-60` | ✗                 |

Compatibility flag: `existsWithCurrentSelection` from `getOptionsForAttribute()`.

**Do not** use `border-border` for default compatible buttons — too light (see variant-selector-ui.md).

## Partial vs Complete Selection

| Phase                                   | `findMatchingVariant` | `getAdjustedSelections` behavior                            |
| --------------------------------------- | --------------------- | ----------------------------------------------------------- |
| **Partial** (some groups empty)         | `undefined`           | **Keep** new + prior selections if `hasCompatibleVariant()` |
| **Complete** (all groups filled, match) | variant id            | Keep all; set `?variant=`                                   |
| **Complete** (all filled, no match)     | `undefined`           | AUTO_ADJUST: clear to `{ [clickedAttr]: value }` only       |

**Bug to avoid:** Calling `findMatchingVariant()` alone to decide whether to keep partial selections — it always returns `undefined` until every attribute group is filled.

Multi-attribute example (demo audiobooks): Medium + Audio quality + Instant Delivery — user must select all three before add to cart enables.

## URL Parameter Pattern

```
?medium=mp3&audio-quality=standard&instant-delivery=instant-delivery:-yes&variant=abc123
```

The `variant` param is only set when ALL attributes are selected and a match exists.

## Discount Badges

Options can show discount percentages on any renderer (`discountPercent` on `VariantOption`). Badge: small red pill at bottom-right of the option control.

## Examples

### Smart Selection Adjustment (complete selection only)

```
State: ?color=red&size=s (all attrs filled, but user clicks Size L)
Red/L doesn't exist → AUTO_ADJUST → ?size=l (color cleared)
```

### Building partial selection (multi-attribute)

```
1. Click Medium → MP3     → ?medium=mp3
2. Click Standard         → ?medium=mp3&audio-quality=standard  (medium kept!)
3. Click Instant Delivery → complete → ?variant=... added
```

### Custom Renderers

```tsx
<VariantSelectionSection
	variants={variants}
	renderers={{
		color: MyCustomColorPicker,
		size: MySizeChart,
	}}
/>
```

## State Machine

For the full state diagram and transition rules, see [../references/variant-state-machine.md](../references/variant-state-machine.md).

| State        | Add to Cart | Description                    |
| ------------ | ----------- | ------------------------------ |
| **Empty**    | ❌          | No selections                  |
| **Partial**  | ❌          | Some attributes selected       |
| **Complete** | ✅          | All selected, variant found    |
| **Conflict** | —           | All filled, impossible → clear |
| **DeadEnd**  | ❌          | Selection blocks other groups  |

## Testing

```bash
pnpm test src/ui/components/pdp/variant-selection/utils.test.ts
```

Fixture `audiobookVariants` in `__fixtures__/variants.ts` covers 3-attribute partial selection.

## Anti-patterns

❌ **Don't enable "Add to Cart" without full selection** - Needs variant ID  
❌ **Don't block incompatible options** - Let users click, clear others when complete  
❌ **Don't clear partial selections** when `findMatchingVariant` is undefined — use `hasCompatibleVariant`  
❌ **Don't assume single attribute** - Products can have multiple (incl. BOOLEAN selection attrs)  
❌ **Don't use `0` in boolean checks for prices** - Use `typeof === "number"`  
❌ **Don't make non-selection attributes interactive** - They're display-only (badges, not toggles)  
❌ **Don't use `border-border` on compatible button/pill options** - Use `border-gray-400`

---

### 2.3 Product Filtering

Product list filtering and sorting architecture. Ensures correct server-side vs client-side filtering, category resolution, static price ranges, and filter UI behavior.

> **Source**: [Saleor API - ProductFilterInput](https://docs.saleor.io/api-reference/products/inputs/product-filter-input) - Available server-side filter options

## Filter Architecture

| Filter         | Processing     | Why                                           |
| -------------- | -------------- | --------------------------------------------- |
| **Categories** | ✅ Server-side | Uses Saleor's `ProductFilterInput.categories` |
| **Price**      | ✅ Server-side | Uses Saleor's `ProductFilterInput.price`      |
| **Sort**       | ✅ Server-side | Uses Saleor's `ProductOrder`                  |
| **Colors**     | ❌ Client-side | Saleor needs attribute IDs                    |
| **Sizes**      | ❌ Client-side | Same as colors                                |

## Key Files

| File                                           | Purpose                                |
| ---------------------------------------------- | -------------------------------------- |
| `src/ui/components/plp/filter-utils.ts`        | All filter utilities (server + client) |
| `src/ui/components/plp/filter-bar.tsx`         | Filter UI (dropdowns, mobile sheet)    |
| `src/ui/components/plp/use-product-filters.ts` | Hook consolidating filter logic        |

## Server-Side Filtering

Category slugs in URL are resolved to IDs:

```typescript
// In page.tsx (server component)
import { resolveCategorySlugsToIds, buildFilterVariables } from "@/ui/components/plp/filter-utils";

const categorySlugs = searchParams.categories?.split(",") || [];
const categoryMap = await resolveCategorySlugsToIds(categorySlugs);
const categoryIds = Array.from(categoryMap.values()).map((c) => c.id);

const filter = buildFilterVariables({
	priceRange: searchParams.price,
	categoryIds,
});

// Pass to GraphQL query
const { products } = await executePublicGraphQL(ProductListDocument, {
	variables: { channel, filter },
});
```

## Client-Side Filtering

Colors and sizes are filtered after fetch:

```typescript
import { filterProducts, extractColorOptions } from "@/ui/components/plp/filter-utils";

// Extract available options
const colorOptions = extractColorOptions(products, selectedColors);

// Apply filters
const filtered = filterProducts(products, {
	colors: selectedColors,
	sizes: selectedSizes,
});
```

## Using the Hook

The `useProductFilters` hook consolidates all filter logic:

```tsx
"use client";
import { useProductFilters } from "@/ui/components/plp/use-product-filters";

function ProductsClient({ products, resolvedCategories }) {
	const {
		filteredProducts,
		colorOptions,
		sizeOptions,
		selectedColors,
		handleColorToggle,
		handleSortChange,
		activeFilters,
	} = useProductFilters({
		products,
		resolvedCategories,
		enableCategoryFilter: true,
	});

	return (
		<FilterBar
			colorOptions={colorOptions}
			selectedColors={selectedColors}
			onColorToggle={handleColorToggle}
			// ...
		/>
	);
}
```

## Static Price Ranges

Price ranges are static to avoid UI flicker when filtering:

```typescript
import { STATIC_PRICE_RANGES_WITH_COUNT } from "@/ui/components/plp/filter-utils";

// Returns: [
//   { label: "Under $50", value: "0-50", count: 0 },
//   { label: "$50 - $100", value: "50-100", count: 0 },
//   ...
// ]
```

## Examples

### Adding a New Server-Side Filter

1. Update `buildFilterVariables` in `filter-utils.ts`:

```typescript
export function buildFilterVariables(params: {
	priceRange?: string | null;
	categoryIds?: string[];
	inStock?: boolean; // New filter
}): ProductFilterInput | undefined {
	// ... existing code ...

	if (params.inStock) {
		filter.stockAvailability = "IN_STOCK";
		hasFilter = true;
	}
}
```

2. Parse from URL in page.tsx and pass to the function.

## Anti-patterns

❌ **Don't filter categories client-side** - Use server-side with IDs  
❌ **Don't generate dynamic price ranges** - Use static ranges  
❌ **Don't hide selected filters** - Always show so users can deselect

---

## 3. Checkout Flow

**Impact: HIGH**

Checkout handles payment and order completion. Bugs here directly cause lost revenue and poor user experience.

### 3.1 Paper Surfaces

One Next.js project, two product surfaces, one shared handoff package.

> **North star:** [`paper-architecture.md`](paper-architecture.md) — canonical Next.js stance and pillar index.

## Documentation map (checkout v2)

| Read first                                                                                        | When                                                        |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **This file**                                                                                     | Where code lives, import boundaries, routes                 |
| [`checkout-design-principles.md`](checkout-design-principles.md)                                  | UX principles for checkout UI and flow decisions            |
| [`checkout-management.md`](checkout-management.md)                                                | Cart sync, step URLs, payment → order transition, debugging |
| [`checkout-payment-gateways.md`](checkout-payment-gateways.md)                                    | Adding or changing payment apps                             |
| [`checkout-components.md`](checkout-components.md)                                                | Reusable step UI (contact, address, billing)                |
| [`data-auth-routes.md`](data-auth-routes.md)                                                      | BFF login, `resolveSessionUser`, header chrome refresh      |
| [`migrations/atomic/2026-06-checkout-v2/`](../migrations/atomic/2026-06-checkout-v2/MIGRATION.md) | Fork upgrade from urql checkout                             |

## Layout

```text
src/app/
  (storefront)/[channel]/...   # Browse, cart, account — URL: /{channel}/...
  (checkout)/checkout/...      # Checkout — /checkout?checkout=…, confirmation — /checkout/complete?order=…

src/session-bridge/            # @paper/session-bridge — only cross-surface import
src/checkout/                  # Checkout UI + GraphQL (not imported by storefront)
src/lib/auth/                  # BFF session (shared); server actions for commerce
```

Route groups `(storefront)` and `(checkout)` do not appear in URLs; they separate root layouts and ownership.

## Checkout v2 data flow

```
/checkout?checkout=Q2hlY2…
        │
        ▼
CheckoutSessionLoader (RSC)     ← reads ?checkout= only (not ?step=)
        │  fetch checkout, me, countries
        ▼
CheckoutApp (client)
        │  CheckoutDataProvider ← initialCheckout hydrate
        │  CheckoutUserProvider ← initialUser
        ▼
SaleorCheckout (steps)          ← ?step= via shallow updateCheckoutQuery()
        │
        ▼
actions.ts (server)             ← mutations, payment transactions, checkoutComplete
        │
        ▼
/checkout/complete?order=       ← hard navigation after payment (separate route)
```

## Data and caching

| Surface    | GraphQL                                                         | Freshness                          |
| ---------- | --------------------------------------------------------------- | ---------------------------------- |
| Storefront | `executePublicGraphQL` / `executeAuthenticatedGraphQL`          | Display cached (`"use cache"`)     |
| Checkout   | RSC page + server actions (`execute*GraphQL`)                   | Always fresh (`cache: "no-cache"`) |
| Auth       | `POST /api/auth/*` + `getServerAuthClient()` (HttpOnly cookies) | Always fresh                       |

`CheckoutSessionLoader` passes `initialCheckout` when `loadState === "ready"`. Order confirmation is a separate route (`checkout/complete/page.tsx` + `OrderConfirmationApp` — no cart context). Client `syncCheckoutFromServer` is a narrow fallback; normal path is RSC hydrate + `adoptCheckoutSnapshot` on refresh.

## Session (shared BFF)

Login, logout, and password reset use **Next.js API routes** — not browser Saleor SDK. Checkout and storefront share the same HttpOnly cookies.

| Concern                    | Location                                                                          |
| -------------------------- | --------------------------------------------------------------------------------- |
| Sign-in                    | `POST /api/auth/login` via `loginWithBff()`                                       |
| Classify `me` fetch        | `resolveSessionUser()` → `guest` / `authenticated` / `unavailable`                |
| JWT expiry detection       | `session-auth-state.ts` — structured Saleor codes (`ExpiredSignatureError`, etc.) |
| After sign-in in checkout  | `router.refresh()` or `useRefreshCheckoutRsc()`                                   |
| After sign-in → storefront | `syncAuthSurfacesAfterSignIn()` — hard nav + `revalidateStorefrontChrome`         |
| Cart/checkout cache bust   | `revalidateAuthSurfaces` after cart mutations                                     |

See `data-auth-routes.md` for Router Cache pitfalls (stale header menu) and when hard navigation is required.

## Handoff

1. Storefront creates/updates cart via `src/lib/checkout.ts` (cookie via `checkoutIdCookieName`).
2. Cart links use `buildCheckoutPath` / `buildCheckoutUrl`; post-payment navigation uses `buildOrderConfirmationPath` from `@paper/session-bridge`.
3. Checkout reads session from URL (`?checkout=`) via `getQueryParams` / `extractCheckoutIdFromParams`.

## Checkout entry

- Route: `src/app/(checkout)/checkout/page.tsx` → `CheckoutSessionLoader`
- Client root: `CheckoutApp` in `src/checkout/checkout-app.tsx` (providers only — no urql/SDK)
- Mutations: `src/app/(checkout)/actions.ts`
- Do not wrap the whole checkout tree in `dynamic(..., { ssr: false })`

## Hosted checkout-only deploy (optional)

- **Middleware + env**: block non-`/checkout` routes on the same build.
- **Fork**: omit `app/(storefront)/` for a smaller artifact.
- Set `NEXT_PUBLIC_CHECKOUT_URL` so `buildCheckoutUrl` returns absolute links from storefront.

## Anti-patterns

❌ Storefront importing `@/checkout/views` or checkout hooks  
❌ Duplicated `/checkout?checkout=` string literals — use `@paper/session-bridge`  
❌ Browser → Saleor for login or header `me` — use BFF + `getHeaderUser()`  
❌ `searchParams` inside `"use cache"` functions on the storefront  
❌ `router.replace` for checkout step-only changes — use `updateCheckoutQuery()`  
❌ Treating all `me === null` as signed out — use `resolveSessionUser` states

---

### 3.2 Checkout Design Principles

Evidence-based UX principles for Paper Checkout. Grounded in Baymard, Stripe, and conversion research; mapped to Paper's checkout v2 architecture.

> **Related:** `paper-surfaces`, `checkout-management`, `checkout-components`, `checkout-payment-gateways`

---

## Why these exist

Checkout is the last-mile commitment ritual — not a form. ~70% of carts are abandoned (Baymard). The top drivers are **surprise costs**, **forced accounts**, **complexity**, and **mobile friction** — all design-elastic (small changes move conversion measurably).

Paper Checkout defaults should optimize **first-time buyers, mobile, and international shipping**. Forks with mostly returning customers may adopt one-page or accordion variants — but only after measuring step drop-off.

---

## Principles

### 1. Minimize commitment before value

Show total cost, delivery expectation, and return policy **before** pay. Never introduce mandatory new costs at payment.

- Order summary on every step: subtotal → shipping → tax → discount → total.
- Shipping method and cost on the shipping step, not first revealed at payment.
- Prefer shipping estimates on cart/PDP (storefront) to reduce checkout shock.

**Elasticity:** Extra costs are the #1 cited abandonment reason (39–48% of US shoppers).

### 2. Guest is the default path

First-time buyers complete as guests. Account creation is an **upgrade**, not a gate.

- `GuestContact` and "Continue as guest" must be visually primary over sign-in.
- Optional "create account" on the information step — de-emphasized, never required.
- Prefer post-order account invite on `/checkout/complete` (3–5× higher capture than pre-checkout gates).

**Elasticity:** Forced account creation drives ~19–26% of abandonments.

### 3. Optimize for mobile thumbs

Mobile abandonment is ~12pp worse than desktop. Design mobile-first; desktop inherits.

- Sticky primary CTA (`MobileStickyAction`) with specific labels: "Continue to shipping", `Pay {total}`.
- Collapsed order summary with **visible total** at top of mobile checkout.
- 44×44px minimum tap targets; correct `inputmode` and `autocomplete` on every field.
- **Address entry:** Paper uses **browser autofill** (`input-attributes.ts`) — not paid address APIs (Google Places, Loqate, etc.). Returning shoppers and mobile OS profiles get one-tap fill; that is the default tradeoff vs per-session API cost.
- Trust copy **above** the pay CTA on mobile, not buried in footer. Accepted methods come from the payment UI (Stripe Element, express wallets) — do not hardcode card-brand lists.

**Elasticity:** Sticky mobile CTA alone often yields +5–12% checkout completion.

### 4. Steps serve cognition, not ceremony

Multi-step is correct for first-time, mobile, and high-AOV flows. Each step must be short, validatable, and skippable for returning users.

- Paper flow: Contact → Shipping (if required) → Payment.
- Shallow `?step=` URLs via `updateCheckoutQuery()` — not full RSC navigations.
- Completed steps should collapse to **summaries** (address, method), not bare headers.
- Returning users with saved addresses: prefer review/skip over re-entry.

**Note:** One-page checkout wins for returning/low-AOV segments — document fork patterns, don't assume universal one-page.

### 5. The order summary is a confidence instrument

Users must always see **what they're buying** and **what they're paying** without memory or detours.

- Desktop: sticky right-hand summary with line items, thumbnails, running totals.
- Mobile: collapsed bar (item count + total), tap to expand — never fully hidden.
- Inline edit/remove where possible; explain total changes when shipping or promo updates.

### 6. Express pay is a first-class path

Wallets (Apple Pay, Google Pay, Link) skip the highest-friction fields. Treat them as primary, not decorative.

- Surface express checkout on the payment step (Stripe Express Checkout Element).
- Extend upstream (cart/PDP) when cart is complete enough to charge.
- Never show wallet buttons in a disabled state — prompt for missing selections instead (Stripe Apple Pay guidance).
- Collect mandatory order details (variant, qty, address) before wallet confirmation.

### 7. Validate late, recover gracefully

Use reward-early-punish-late validation: clear errors on `input`, validate on `blur`, batch on submit.

- Preserve entered data on errors — never wipe the form.
- Specific, plain-language error copy next to the field; error summary on submit for multiple failures.
- `aria-live` for dynamic errors (accessibility = conversion).

### 8. Trust is contextual

Security reassurance matters **at payment**, not on step 1.

- Lock icon and "Secure checkout" adjacent to the pay CTA; processor attribution when relevant (e.g. Stripe).
- Focused checkout surface: no full storefront nav, no distracting pop-ups.
- Merchant branding in header (`CheckoutHeader`) — user knows who they're paying.

### 9. Never lie about price

Display pages may cache prices for performance; checkout must always charge the live total.

- RSC + server actions use `cache: "no-cache"` for checkout data.
- Refresh checkout before `transactionInitialize`; block pay on `hasMaterialCheckoutTotalChange`.
- Saleor validates at `checkoutComplete` — but blocking early avoids wrong authorization and trust loss.

### 10. Checkout ends cleanly

A broken ending erodes repeat purchase more than a slow form.

- `PaymentCompletingScreen` while `checkoutComplete` runs — no flash of "session expired".
- Hard navigation to `/checkout/complete?order=` via `navigateToOrderConfirmation()`.
- Clear cookie in `after()` — not before leaving `?checkout=`.
- Confirmation page: receipt, next steps, soft account invite.

### 11. Design for merchant mix, not one platform's median

Paper is a **reference implementation** for Saleor headless. Defaults favor broad DTC; forks customize.

- Multi-step default is research-aligned for Paper's likely audience.
- Payment registry (`INTEGRATED_GATEWAYS`) lets merchants add Stripe, Adyen, etc. without forking step UI.
- Document layout variants (one-page, accordion) as fork decisions — not Paper core unless measured.

### 12. Measure step elasticity

Layout debates are resolved with data, not opinions.

- Instrument drop-off per `?step=`, device, new vs returning, AOV.
- Shallow step URLs keep analytics clean.
- If checkout CVR is within ~3pp of category median, fix upstream (PDP, cart, traffic) first.

---

## Paper alignment checklist

When reviewing checkout UI changes, verify:

| Principle          | Paper mechanism                                                    |
| ------------------ | ------------------------------------------------------------------ |
| Fresh totals       | `CheckoutDataProvider`, `refreshCheckout()`, `checkout-pay-amount` |
| Guest-first        | `GuestContact`, orphaned-cart recovery                             |
| Mobile CTA         | `MobileStickyAction`                                               |
| Address autofill   | `input-attributes.ts`, `AddressFields` `autocompleteSection`       |
| Step URLs          | `updateCheckoutQuery()`, `useLiveCheckoutSearchParams()`           |
| Express pay        | `StripeExpressCheckout`, `executeStripeCheckoutPayment`            |
| Trust at pay       | `PaymentTrustSignals`                                              |
| Payment transition | `PaymentCompletingScreen`, `finalizeCheckoutOrder`                 |
| Focused surface    | `(checkout)` layout, `CheckoutPageShell`                           |

---

## Known gaps (prioritized)

| Priority  | Gap                                                                                     | Principle |
| --------- | --------------------------------------------------------------------------------------- | --------- |
| Done (P0) | Autofill/`inputmode` on checkout fields — `src/checkout/lib/consts/input-attributes.ts` | #3        |
| Done (P0) | Trust signals above pay CTA — `PaymentTrustSignals`                                     | #8        |
| P1        | Post-order account invite on confirmation                                               | #2        |
| P1        | Auto-apply promo (avoid "Apply" button)                                                 | #1, #5    |
| P2        | Express checkout on cart                                                                | #6        |
| P2        | Returning-user fast path                                                                | #4        |
| P2        | Storefront shipping estimate before checkout                                            | #1        |

### Deferred / fork-only (not Paper core)

| Item                                                   | When to consider                                                                                                                                                                | Principle |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Address API autocomplete (Google Places, Loqate, etc.) | High guest first-order share, measurable address-step drop-off, or weak browser autofill in target markets — not for returning-shopper-heavy stores where P0 autofill is enough | #3        |

Do **not** add Places/Loqate to Paper by default: per-session cost, vendor keys, and intl edge cases. Forks own the integration.

---

## Anti-patterns

❌ Forced account creation before pay  
❌ Hidden totals or shipping revealed only at payment  
❌ Full RSC navigation for step-only changes (`router.replace` for `?step=`)  
❌ Caching checkout totals at payment time  
❌ Clearing checkout cookie before order confirmation navigation  
❌ Accordion checkout without collapsed step summaries or correct back-button behavior  
❌ Premature inline validation while user is still typing  
❌ One-page checkout as dogma without segment data  
❌ Upsells or cross-sell that compete with the primary pay CTA  
❌ Shipping Google Places / Loqate into Paper core without fork-specific ROI data

---

## References

- [Baymard Checkout Usability](https://baymard.com/research/checkout-usability)
- [Baymard 2024 Checkout Findings](https://baymard.com/blog/checkout-2024-launch)
- [Stripe Mobile Checkout UI](https://stripe.com/resources/more/mobile-checkout-ui)
- [Stripe Express Checkout Element](https://docs.stripe.com/elements/express-checkout-element)
- [Statista: US checkout abandonment reasons 2025](https://www.statista.com/statistics/1228452/reasons-for-abandonments-during-checkout-united-states/)

---

### 3.3 Checkout Management

Understanding checkout session lifecycle, storage, and debugging prevents payment failures, hydration mismatches, and "CHECKOUT_NOT_FULLY_PAID" errors. Use live checkout data for payment amounts and handle stale checkouts gracefully.

---

## Overview

This skill covers how checkout sessions are created, stored, and managed in the Saleor storefront.

## Checkout ID Storage

Checkout IDs are stored in **two places**:

### 1. Cookie (Primary Storage)

```
Cookie name: checkoutId-{channel}
Example: checkoutId-default-channel
```

The cookie is set in `src/lib/checkout.ts`:

```typescript
export async function saveIdToCookie(channel: string, checkoutId: string) {
	const cookieName = `checkoutId-${channel}`;
	(await cookies()).set(cookieName, checkoutId, {
		sameSite: "lax",
		secure: shouldUseHttps,
	});
}
```

### 2. URL Query Parameter

```
URL: /checkout?checkout=Q2hlY2tvdXQ6YThjN2Y4YjgtZmU0NS00ZTRkLThhZmItZDdjYWI2YTM5MTdm
```

The checkout ID is a base64-encoded Saleor global ID.

## Checkout Lifecycle

### Creation

A new checkout is created when:

- User adds first item to an empty cart
- No valid checkout ID exists in cookie
- Existing checkout is not found in Saleor

```typescript
// src/lib/checkout.ts
export async function findOrCreate({ channel, checkoutId }) {
	if (!checkoutId) {
		return (await create({ channel })).checkoutCreate?.checkout;
	}
	const checkout = await find(checkoutId);
	return checkout || (await create({ channel })).checkoutCreate?.checkout;
}
```

### Persistence

The checkout persists across:

- Page refreshes
- Browser sessions (cookie-based)
- Cart modifications

### Completion

When `checkoutComplete` mutation succeeds:

- Checkout is converted to an Order
- The checkout ID becomes invalid
- A new checkout should be created for future purchases

## Checkout auth (BFF)

Sign-in during checkout uses the same BFF as storefront (`POST /api/auth/login` via `loginWithBff()`). `CheckoutUserProvider` hydrates `me` from the RSC page; after sign-in, call `refetchUser()` → `router.refresh()` so the server re-fetches the session. Sign-out uses the `logout()` server action + `detachCheckoutCustomer` when needed.

See `data-auth-routes.md` for HttpOnly cookies, header `getHeaderUser()`, and rate limits.

## Data loading (RSC + client sync)

1. **RSC page** (`checkout/page.tsx`) — full checkout (`fetchCheckoutOnServer`), `me`, order, channel countries. Passes `initialCheckout` when `loadState === "ready"`.
2. **Client** — `CheckoutDataProvider` hydrates from `initialCheckout` (`CheckoutSessionLoader` always pairs `ready` with a snapshot). RSC updates merge via `adoptCheckoutSnapshot`; explicit `refreshCheckout()` replaces state. Cart mutations revalidate `/checkout` via `revalidateStorefrontChrome`. Use `useRefreshCheckoutRsc()` after auth or address-book changes.
3. **Mutations** — `src/app/(checkout)/actions.ts` server actions; `refreshCheckout` / `adoptCheckoutSnapshot` in `checkout-sync.ts`.

`useCheckout()` reads from `CheckoutDataProvider` context (not urql).

## Payment completion and transition UX

Gateway-agnostic infrastructure shared by Dummy, Stripe, and future payment apps. Provider-specific SDK steps live in `checkout-payment-gateways.md`; this section covers what happens **after** the PSP authorizes payment through Saleor.

### Flow

```
User clicks Pay (or returns from 3DS redirect)
        │
        ▼
markPaymentCompleting(checkoutId)     ← sessionStorage: checkout:payment-completing
        │
        ▼
transactionInitialize / process       ← provider-specific (may already be done)
        │
        ▼
finalizeCheckoutOrder()               ← runCheckoutComplete mutation
        │
        ├── failure → clearPaymentCompleting(), show error
        │
        └── success → navigateToOrderConfirmation(orderId)
                      window.location.replace(/checkout/complete?order=…)
        │
        ▼
Order confirmation page (`/checkout/complete`) ← clearPaymentCompleting()
                                               checkout cookie cleared in runCheckoutComplete
```

### Routes and transition storage

| Mechanism                          | Purpose                                                                                                                                              |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/checkout?checkout=`              | Active cart flow — `CheckoutApp` + step UI                                                                                                           |
| `/checkout/complete?order=`        | Order confirmation — separate RSC page + `OrderConfirmationApp`                                                                                      |
| `checkout:payment-completing`      | Keeps checkout on `PaymentCompletingScreen` while `checkoutComplete` runs — avoids flashing back to step 1                                           |
| `?processingPayment=true`          | Stripe 3DS return URL flag; works with `isCheckoutPaymentActive()` when payment step is unmounted                                                    |
| `window.location.replace`          | Navigates to `/checkout/complete` — hard navigation required; `router.replace` from async post-mutation callbacks does not reliably unmount checkout |
| `?step=contact\|shipping\|payment` | Checkout step deep link; URL is the source of truth via `useLiveCheckoutSearchParams()`                                                              |
| `updateCheckoutQuery()`            | Shallow step URL updates (`pushState` on Continue, `replaceState` on stepper) — avoids re-running checkout RSC; merges into the live URL bar         |

**Do not** clear the checkout cookie synchronously on `/checkout?checkout=…` after payment succeeds — Next.js re-renders the checkout RSC tree when the cookie changes, which briefly shows `not_found` ("session expired") before navigation lands. `runCheckoutComplete` clears the cookie in `after()`; the client calls `navigateToOrderConfirmation()`. `RootViews` keeps `PaymentCompletingScreen` up while `checkout:payment-completing` is set. Do **not** call `redirect()` from `runCheckoutComplete` — it throws `NEXT_REDIRECT`, which Stripe payment catch blocks surface as a false "Payment failed" banner.

### Checkout step URL (shallow navigation)

Step changes inside `/checkout` use **`updateCheckoutQuery({ step })`** (`src/checkout/lib/checkout-search-params.ts`), not `router.replace`. App Router treats `searchParams` as dynamic page input — a router navigation would re-fetch checkout on every step click. Shallow history updates the URL for back/refresh/deep links without a server round-trip.

- **Continue (step complete)** — `history: "push"` so browser Back walks Contact → Shipping → Payment.
- **Header stepper / inline Back** — default `replace` so jumping steps does not stack fake history entries.
- **Stripe URL cleanup** — default `replace` when clearing `processingPayment` params.

`useLiveCheckoutSearchParams()` (`useSyncExternalStore`) keeps step UI, payment transition guards, and Stripe return detection in sync with shallow updates and `popstate`. Ephemeral Stripe return params are preserved by merging from `window.location.search`, never from stale React `searchParams` alone.

**RSC session boundary:** `CheckoutSessionLoader` (`checkout-session-loader.tsx`) reads only `?checkout=` / `?order=` — never `?step=`. Fetches use `get-checkout-session-data.ts` (`React.cache` per checkout id) so an accidental page re-run dedupes within the request.

Use `router.replace` for **in-checkout** navigations (orphaned checkout recovery changing `?checkout=`). Order confirmation uses `window.location.replace` via `navigateToOrderConfirmation()`.

### Transition guard

`useCheckoutTransition()` (used in `saleor-checkout.tsx`) returns:

| Value          | When                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------ |
| `"completing"` | `isCheckoutPaymentActive()` — storage key matches checkout id or `processingPayment` param |
| `null`         | Normal checkout UI                                                                         |

When `transition === "completing"`, render `PaymentCompletingScreen` instead of the step flow.

### Stripe 3DS / redirect return

`StripeCheckoutReturnHandler` mounts at the **checkout shell** (`stripe-checkout-completion-host.tsx`), not inside the payment step. After redirect, the payment step may be unmounted — shell-level completion avoids losing the return handler. Real failures clear Stripe return URL params, exit the processing screen, and show `PaymentError` **inline on the payment step** (not as a banner above the processing overlay).

Return URL includes `processingPayment`, `paymentIntent`, and `paymentIntentClientSecret` query params (see `build-stripe-return-url.ts`).

### Live total before charge

Before any `transactionInitialize`, payment flows:

1. Call `updateCheckoutBilling()`
2. `refreshCheckout()` for a live gross total
3. If `hasMaterialCheckoutTotalChange(displayed, live)` → show price-change notice and **block** pay

Saleor validates amounts at `checkoutComplete`, but blocking early avoids authorizing the wrong amount. See `checkout-pay-amount.ts`.

### Key files

| File                                                                        | Purpose                                            |
| --------------------------------------------------------------------------- | -------------------------------------------------- |
| `src/app/(checkout)/checkout/checkout-session-loader.tsx`                   | Active checkout RSC entry (`?checkout=` only)      |
| `src/checkout/lib/server/get-checkout-session-data.ts`                      | Per-request cached session fetches                 |
| `src/app/(checkout)/checkout/complete/page.tsx`                             | Order confirmation RSC entry                       |
| `src/checkout/order-confirmation-app.tsx`                                   | Confirmation client shell                          |
| `src/checkout/lib/payment/checkout-payment-completion.ts`                   | `markPaymentCompleting`, `isCheckoutPaymentActive` |
| `src/checkout/lib/payment/finalize-checkout-order.ts`                       | Deduped `checkoutComplete` + navigation            |
| `src/checkout/lib/payment/navigate-to-order.ts`                             | Nav to `/checkout/complete?order=`                 |
| `src/checkout/hooks/use-checkout-transition.ts`                             | `completing` guard                                 |
| `src/checkout/views/saleor-checkout/payment-completing-screen.tsx`          | Full-page "Processing your order" UI               |
| `src/checkout/components/payment/stripe/stripe-checkout-return-handler.tsx` | Post-redirect completion                           |
| `src/checkout/views/order-confirmation/order-confirmation.tsx`              | Clears completion storage on mount                 |

### Anti-patterns

❌ **Don't call `router.push`/`replace` directly for order confirmation** — use `navigateToOrderConfirmation()`  
❌ **Don't clear checkout cookie before leaving `?checkout=`** — wait for order confirmation  
❌ **Don't mount redirect completion only inside payment step** — shell survives step unmount  
❌ **Don't skip `clearPaymentCompleting()` on payment failure** — user must be able to retry

## Common Issues

### Stale cart after editing from storefront

**Problem**: User changes cart on `/{channel}/cart`, returns to checkout — old lines or totals.

**Fix**: Cart server actions call `revalidateStorefrontChrome`, which includes `revalidatePath("/checkout")`, so the next checkout navigation gets a fresh RSC `initialCheckout`. In-flow updates use `refreshCheckout` (full replace).

### Stale Checkout with Failed Transactions

**Problem**: If payment fails multiple times, the checkout accumulates partial transactions. Subsequent payment attempts may fail with:

```
CHECKOUT_NOT_FULLY_PAID: The authorized amount doesn't cover the checkout's total amount.
```

**Solutions**:

1. **Clear cookies** - Delete `checkoutId-{channel}` cookie
2. **Use incognito** - Test in a private browser window
3. **Remove URL param** - Navigate to checkout without `?checkout=XXX`

### Checkout Amount Mismatch

**Problem**: Checkout total changes after transactions are initialized (e.g., shipping added).

**Solution**: Always use live checkout from `useCheckout()` / `CheckoutDataProvider` before payment — never cached PDP prices.

## Key Files

| File                                                  | Purpose                              |
| ----------------------------------------------------- | ------------------------------------ |
| `src/lib/checkout.ts`                                 | Checkout creation, cookie management |
| `src/app/(checkout)/checkout/page.tsx`                | RSC entry, routing + `me`            |
| `src/app/(checkout)/actions.ts`                       | Checkout server actions              |
| `src/checkout/providers/checkout-data.tsx`            | Client cart state + sync             |
| `src/checkout/lib/checkout-sync.ts`                   | adopt vs refresh semantics           |
| `src/checkout/hooks/use-checkout.ts`                  | Context hook for steps               |
| `src/checkout/hooks/use-checkout-transition.ts`       | Payment → order transition guard     |
| `src/checkout/lib/payment/finalize-checkout-order.ts` | `checkoutComplete` + navigation      |
| `src/checkout/lib/utils/url.ts`                       | URL query param extraction           |

## Debugging Checkout Issues

### 1. Check Current Checkout ID

```javascript
// In browser console
document.cookie.split(";").find((c) => c.includes("checkoutId"));
```

### 2. Decode Checkout ID

```javascript
// Base64 decode the checkout ID from URL
atob("Q2hlY2tvdXQ6YThjN2Y4YjgtZmU0NS00ZTRkLThhZmItZDdjYWI2YTM5MTdm");
// Returns: "Checkout:a8c7f8b8-fe45-4e4d-8afb-d7cab6a3917f"
```

### 3. Query Checkout in Saleor

Use GraphQL playground to inspect checkout state:

```graphql
query {
	checkout(id: "Q2hlY2tvdXQ6...") {
		id
		totalPrice {
			gross {
				amount
				currency
			}
		}
		transactions {
			id
			chargedAmount {
				amount
			}
			authorizedAmount {
				amount
			}
		}
	}
}
```

## Payment App Issues

### Transaction Fails with "AUTHORIZATION_FAILURE"

**Symptom**: Transaction is created but fails immediately:

```json
{
	"transaction": { "id": "...", "actions": [] },
	"transactionEvent": {
		"message": "Failed to delivery request.",
		"type": "AUTHORIZATION_FAILURE"
	}
}
```

**Cause**: The payment app (e.g., Dummy Gateway, Stripe, Adyen) is not responding.

**Solutions**:

1. Check **Saleor Dashboard → Apps** - is the payment app active/healthy?
2. Check if the payment app URL is accessible
3. Restart the payment app if self-hosted
4. Check Saleor Cloud status if using cloud-hosted apps

### "CHECKOUT_NOT_FULLY_PAID" Error

**Symptom**: `checkoutComplete` fails with:

```
The authorized amount doesn't cover the checkout's total amount.
```

**Causes**:

1. **Payment app is down** - transaction was created but authorization failed
2. **Stale checkout** - previous partial transactions exist
3. **Amount mismatch** - checkout total changed after transaction init

**Debug steps**:

1. Check `[Payment] Transaction init result:` logs for `transactionEvent.type`
2. If `AUTHORIZATION_FAILURE` → payment app is down/unreachable
3. If transaction succeeded but amount is wrong → checkout data is stale

## Best Practices

1. **Always use live checkout data** for payment amounts
2. **Handle checkout not found** gracefully (create new checkout)
3. **Clear checkout after completion** to avoid stale data
4. **Test with fresh checkouts** when debugging payment issues
5. **Check payment app health** when transactions fail with `AUTHORIZATION_FAILURE`

---

## Appendix: Checkout v2 cheat sheet

Quick reference for common tasks. Full surface layout: [`paper-surfaces.md`](paper-surfaces.md).

### When to use which refresh

| Goal                                                   | Mechanism                                                                                            |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Re-fetch cart after promo / line change in checkout    | `refreshCheckout()` — always replaces client state                                                   |
| Pick up RSC snapshot after cart edit on storefront     | Automatic via `revalidateAuthSurfaces` + next navigation; or `useRefreshCheckoutRsc()`               |
| Merge server snapshot without clobbering in-flow edits | `adoptCheckoutSnapshot` (on `initialCheckout` change only)                                           |
| Update `me` after BFF sign-in                          | `router.refresh()` in checkout; hard nav + `revalidateStorefrontChrome` when returning to storefront |
| Change checkout step                                   | `updateCheckoutQuery({ step })` — shallow, not `router.replace`                                      |
| Change `?checkout=` id (orphaned recovery)             | `router.replace` with new checkout id                                                                |
| After successful payment                               | `navigateToOrderConfirmation()` — `window.location.replace` to `/checkout/complete`                  |

### URL params

| Param                                     | RSC reads?       | Purpose                                                        |
| ----------------------------------------- | ---------------- | -------------------------------------------------------------- |
| `checkout`                                | Yes              | Saleor checkout global id (required for active flow)           |
| `order` on `/checkout`                    | Yes → redirect   | Legacy; canonical confirmation is `/checkout/complete?order=`  |
| `step`                                    | No (client only) | `contact`, `shipping`, `payment` — shallow history             |
| `processingPayment`, Stripe return params | Client           | 3DS return; preserved by merging live `window.location.search` |

### Hooks (v2)

| Hook                            | Reads from                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------- |
| `useCheckout()`                 | `CheckoutDataProvider` + session id (compat API; `refetch` → `refreshCheckout`) |
| `useCheckoutData()`             | Full context including `loadState`, `setCheckout`                               |
| `useLiveCheckoutSearchParams()` | Live URL including shallow step updates                                         |
| `useCheckoutTransition()`       | `"completing"` during payment → order navigation                                |
| `useRefreshCheckoutRsc()`       | Triggers `router.refresh()` for RSC `initialCheckout` / `me`                    |

### Session states (`resolveSessionUser`)

| Status          | UI meaning                                                         |
| --------------- | ------------------------------------------------------------------ |
| `guest`         | No valid session — show sign-in                                    |
| `authenticated` | `me` present                                                       |
| `unavailable`   | Transient failure — do not flash login; optional retry server-side |

Expired JWT maps to **`guest`** via `isDefinitiveAuthFailure` (structured Saleor error codes first, message fallback).

---

### 3.4 Payment Gateways

How to integrate Saleor payment apps in the Paper checkout. Covers the registry architecture, the two payment submit patterns, shared Saleor transaction primitives, and a checklist for wiring a new gateway (e.g. Adyen).

> **Related**: `checkout-management` (checkout lifecycle, **payment completion / transition UX**, debugging failed transactions) · Saleor transaction API in `saleor-storefront` skill

---

## Architecture

Saleor exposes payment apps on `checkout.availablePaymentGateways`. The storefront picks **one** integrated app via `INTEGRATED_GATEWAYS` (priority order), renders its UI, and drives Saleor's transaction mutations.

```
checkout.availablePaymentGateways
        │
        ▼
resolvePaymentProvider()          ← INTEGRATED_GATEWAYS registry (priority)
        │
        ├── submitMode: "server"  → useCheckoutPayment().submit → executePayment()
        └── submitMode: "client"  → provider UI owns Pay button (Stripe pattern)
        │
        ▼
Shared server actions (src/app/(checkout)/actions.ts)
  • paymentGatewayInitialize
  • transactionInitialize
  • transactionProcess
  • checkoutComplete
        │
        ▼
finalizeCheckoutOrder() / navigateToOrderConfirmation()
```

### Key files

| File                                                        | Purpose                                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| `src/checkout/lib/payment/integrated-gateways.ts`           | **Registry** — priority, env flags, supported-gateway detection         |
| `src/checkout/lib/payment/resolve-provider.ts`              | Picks provider + `submitMode`                                           |
| `src/checkout/lib/payment/execute-payment.ts`               | Server-submit flow only (`submitMode: "server"`)                        |
| `src/checkout/lib/payment/providers/*.ts`                   | Per-app helpers (gateway ID, config parsing, errors)                    |
| `src/checkout/components/payment/integrated-payment-ui.tsx` | **UI registry** — maps provider type → component                        |
| `src/checkout/views/saleor-checkout/payment-step.tsx`       | Layout; uses `usesClientPaymentSubmit()` not provider-specific branches |
| `src/app/(checkout)/actions.ts`                             | Saleor mutations + optional server guards                               |
| `src/checkout/graphql/payment.graphql`                      | Transaction mutations                                                   |

---

## Two submit patterns

Pick the pattern that matches how the Saleor payment app expects to be driven.

| Pattern           | `submitMode` | Current example | Who clicks Pay?                | Typical flow                                                                                               |
| ----------------- | ------------ | --------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Server-submit** | `"server"`   | Dummy Payment   | Payment step form / sticky bar | `transactionInitialize` → `checkoutComplete`                                                               |
| **Client-submit** | `"client"`   | Stripe          | Provider component's button    | `paymentGatewayInitialize` → `transactionInitialize` → PSP SDK → `transactionProcess` → `checkoutComplete` |

**Shared by both patterns** (reuse — do not reimplement):

- `updateCheckoutBilling()` before charging
- Live total validation (`getCheckoutPayAmount`, `hasMaterialCheckoutTotalChange`)
- `initializeCheckoutTransaction` / `processCheckoutTransaction` server actions
- `finalizeCheckoutOrder()` + `markPaymentCompleting()` session storage
- Zero-amount orders: `completeCheckoutOrder()` without a transaction

### Server-submit template

See `src/checkout/lib/payment/providers/dummy-pay.ts` + `executePayment()` switch case.

### Client-submit template

See `src/checkout/components/payment/stripe/` — especially `stripe-payment-form.tsx` for the full initialize → confirm → process → complete sequence.

`payment-step.tsx` automatically uses client-submit layout when `usesClientPaymentSubmit(provider)` is true (no outer `<form>`, billing above payment UI, no shared Pay button).

---

## Stripe Express Checkout (wallets)

The payment step mounts **two Stripe Elements** inside one shared `<Elements>` provider. Both paths call the same pipeline (`executeStripeCheckoutPayment`) and the same Saleor mutations afterward.

```
Payment step (Stripe enabled)
│
├── ExpressCheckoutElement          ← wallet shortcuts (top)
│     Apple Pay · Google Pay · Link
│     onConfirm → expressPaymentType → transactionInitialize
│
├── "Or pay with card" divider      ← hidden when no wallets available
│
└── PaymentElement + Pay button     ← card / saved Link in form
      onChange (value.type) + elements.submit() → transactionInitialize
```

### What Express Checkout does here

- **Payment shortcut only** — faster pay with saved wallet / card credentials.
- **No Saleor address flow** — Express options set `billingAddressRequired: false`, `shippingAddressRequired: false`, `emailRequired: false`. Shipping, contact, and billing still come from checkout steps; `updateCheckoutBilling()` runs before charge; `confirmPayment` passes **Saleor checkout** billing into Stripe.
- **Link in two places** — green Express Link button (wallet) vs saved Link inside Payment Element (Pay button). Different Stripe surfaces; only the path the shopper uses drives `paymentIntent.paymentMethod`.

Wallets are enabled when Stripe is on. Opt out with `NEXT_PUBLIC_ENABLE_STRIPE_EXPRESS_CHECKOUT=false` (see `.env.example`).

### Payment method → `transactionInitialize`

Saleor's Stripe app expects `paymentGateway.data.paymentIntent.paymentMethod`. Stripe exposes the type differently per surface — encode that in `StripeInitializePaymentMethodContext` (`src/checkout/lib/payment/providers/stripe.ts`):

| Surface           | Stripe signal                                                                              | When                |
| ----------------- | ------------------------------------------------------------------------------------------ | ------------------- |
| `expressCheckout` | `onConfirm.expressPaymentType` (`apple_pay`, `google_pay`, `link`, …)                      | Wallet button click |
| `paymentElement`  | `PaymentElement` `onChange` → `value.type`, then `elements.submit().selectedPaymentMethod` | Pay button          |

`resolveStripePaymentMethodForInitialize()` prefers Payment Element `onChange` over submit, and **never sends `"unknown"`** (saved Link in Payment Element reports `"unknown"` on submit but `"link"` on change).

### Shared pay pipeline

All Stripe pay paths:

1. `updateCheckoutBilling()` — persist billing from checkout form
2. Refresh checkout — live total before `transactionInitialize`
3. `transactionInitialize` — with resolved `paymentMethod`
4. `stripe.confirmPayment()` — Elements stay mounted until confirm succeeds
5. `transactionProcess` → `finalizeCheckoutOrder()`

Processing UX: local overlay during confirm → `PaymentCompletingScreen` after success. Payment step hides pay UI when `authorizeStatus === FULL` (recovery banner). See `checkout-management` for transition guards, 3DS return, and session storage.

### Stripe file map

| File                                    | Purpose                                                       |
| --------------------------------------- | ------------------------------------------------------------- |
| `stripe-payment.tsx`                    | Loads publishable key, wraps `<Elements>`                     |
| `stripe-payment-form.tsx`               | Express + Payment Element + Pay button                        |
| `stripe-express-checkout.tsx`           | `ExpressCheckoutElement`, wallet availability                 |
| `execute-stripe-checkout-payment.ts`    | Shared initialize → confirm → process → complete              |
| `providers/stripe.ts`                   | Gateway ID, env flags, payment-method resolver, error parsing |
| `stripe-checkout-completion-host.tsx`   | Shell-level 3DS return handler                                |
| `stripe-payment-processing-overlay.tsx` | In-form processing state                                      |

### Stripe environment variables

| Variable                                     | Purpose                                                                |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS`         | Master Stripe toggle (required in production)                          |
| `ENABLE_STRIPE_PAYMENTS`                     | Server-side mirror for `transactionInitialize` guard                   |
| `NEXT_PUBLIC_ENABLE_STRIPE_EXPRESS_CHECKOUT` | Wallet buttons; default on when Stripe enabled; set `false` to disable |

Publishable keys come from Saleor `paymentGatewayInitialize`, not env.

### Stripe manual QA (add to gateway checklist)

- [ ] Express wallets appear when device/browser supports them; section hidden when none available
- [ ] Apple Pay / Google Pay / Express Link complete an order
- [ ] Payment Element card pay works
- [ ] Saved Link in Payment Element + **Pay** (not Express button) sends `link`, not `unknown`
- [ ] Billing from checkout steps is used — Express does not replace shipping/contact
- [ ] Price change notice when total shifts after billing refresh
- [ ] 3DS redirect return completes via shell return handler
- [ ] Browser Back during payment aborts in-flight flow without stuck processing UI

---

## Adding a new gateway

Example: wiring **Adyen** after Stripe and Dummy are already integrated.

### 1. Provider module

Create `src/checkout/lib/payment/providers/adyen.ts`:

- Export gateway ID constant (match Saleor app manifest ID exactly)
- `isAdyenGateway(gatewayId)` / `findAdyenGateway(gateways)`
- `isAdyenPaymentEnabled()` — env flag (mirror Stripe: `NEXT_PUBLIC_ENABLE_ADYEN_PAYMENTS`)
- `getAdyenPaymentGuardError(gatewayId)` — block `transactionInitialize` when flag is off
- Parse `paymentGatewayInitialize` / `transactionInitialize` / `transactionProcess` `data` payloads
- User-facing error helpers for failed transaction events

### 2. Registry entry

Add to `INTEGRATED_GATEWAYS` in `integrated-gateways.ts` **at the desired priority** (first match wins):

```typescript
{
  type: "adyen",
  submitMode: "client", // or "server" for simple apps
  findGateway: (gateways) => findAdyenGateway(gateways),
  isEnabled: isAdyenPaymentEnabled,
  matchesGateway: (gateway) => isAdyenGateway(gateway.id),
},
```

### 3. Types

Extend in `src/checkout/lib/payment/types.ts`:

- Add `"adyen"` to the integrated provider union (alongside `"stripe"` | `"dummy"`)
- Update `isIntegratedPaymentProvider()` if needed

Extend `IntegratedGatewayType` in `integrated-gateways.ts`.

### 4. Server-submit only: `execute-payment.ts`

If `submitMode: "server"`, add a case that calls `executeAdyenPayment()` (same shape as `dummy-pay.ts`).

If `submitMode: "client"`, add a case that returns a clear error — same as Stripe today — so nobody accidentally routes client flows through the form submit handler.

### 5. UI component

Create `src/checkout/components/payment/adyen/` (Drop-in, redirect handler, return URL builder, etc.).

Register in `integrated-payment-ui.tsx`:

```typescript
case "adyen":
  return <AdyenPayment checkout={checkout} gatewayName={provider.gateway.name} ... />;
```

### 6. Server action guard (recommended)

In `initializeCheckoutTransaction()` inside `src/app/(checkout)/actions.ts`:

```typescript
const adyenGuardError = getAdyenPaymentGuardError(variables.paymentGateway?.id);
if (adyenGuardError) return { ok: false, error: adyenGuardError };
```

Prevents bypassing disabled gateways via direct server action calls.

### 7. Tests

| File                                                 | What to test                                                   |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `providers/adyen.test.ts`                            | ID matching, env flag, config/error parsing                    |
| `resolve-provider.test.ts`                           | Priority vs other gateways, `submitMode` on resolved provider  |
| `integrated-gateways` via `payment-gateways.test.ts` | `hasUnsupportedPaymentGateway` when Adyen present but disabled |
| `execute-payment.test.ts`                            | Server-submit path only (if applicable)                        |

Run: `pnpm exec vitest run src/checkout/lib/payment`

### 8. Environment variables

Document in `.env.example` / deployment config:

```env
NEXT_PUBLIC_ENABLE_ADYEN_PAYMENTS=true
# Server-only mirror if needed:
ENABLE_ADYEN_PAYMENTS=true
```

Publishable keys and PSP config come from Saleor's `paymentGatewayInitialize` response — not from env (see Stripe).

### 9. Manual QA checklist

- [ ] Gateway appears on checkout when app is active in Saleor Dashboard
- [ ] `PaymentGatewayAlerts` hidden when integrated + enabled
- [ ] Billing address saved before charge
- [ ] Price change notice when total shifts after billing refresh
- [ ] Successful payment → order confirmation + checkout cookie cleared
- [ ] Failed payment → user sees error, can retry (fresh transaction)
- [ ] Zero-total checkout completes without PSP
- [ ] Redirect-return flows (if any) recover authorized transactions

---

## What you usually do **not** need to change

- `payment-step.tsx` layout — works for any `submitMode: "client"` gateway via `usesClientPaymentSubmit()`
- GraphQL mutations in `payment.graphql` — same for all Saleor payment apps
- `updateCheckoutBilling`, `checkout-pay-amount`, `finalizeCheckoutOrder`
- Cart / checkout cookie logic (`src/lib/checkout.ts`)

Only touch `payment-step.tsx` for **provider-specific** extras (e.g. Stripe's `AuthorizedPaymentRecovery`).

---

## Current integrated gateways

| App           | Gateway ID                                     | Env flag                             | Submit mode |
| ------------- | ---------------------------------------------- | ------------------------------------ | ----------- |
| Stripe        | `saleor.app.payment.stripe`                    | `NEXT_PUBLIC_ENABLE_STRIPE_PAYMENTS` | `client`    |
| Dummy Payment | `saleor.io.dummy-payment-app` (and legacy IDs) | `ALLOW_DUMMY_PAYMENT` / dev only     | `server`    |

Gift card gateway (`saleor.io.gift-card-payment-gateway`) is **ignorable** — it does not block resolution.

---

## Anti-patterns

❌ **Don't add a mock card form fallback** for unsupported gateways — `PaymentGatewayAlerts` explains the problem  
❌ **Don't route client-submit PSPs through `useCheckoutPayment().submit`** — they need their own Pay button and SDK lifecycle  
❌ **Don't hardcode `provider.type === "stripe"` in payment-step** — use `usesClientPaymentSubmit()`  
❌ **Don't skip server guards** for env-gated test gateways (Dummy pattern)  
❌ **Don't cache checkout totals at payment time** — always refresh before `transactionInitialize`  
❌ **Don't build a generic PSP abstraction interface** — each app has different SDK steps; reuse Saleor actions + per-provider modules instead

---

### 3.5 Checkout Components

Reusable checkout UI components for contact, address, and payment flows. Composing these components in checkout steps keeps the flow consistent and maintainable.

---

## Component Locations

```
src/checkout/components/
├── contact/              # Authentication & user display
├── shipping-address/     # Address selection & display
├── payment/              # Payment method & billing
└── address-form/         # Form utilities (existing)
```

## Contact Components

```tsx
import {
	SignInForm, // Email + password + forgot password
	SignedInUser, // Logged-in user display with sign out
	ResetPasswordForm, // New password form (reset callback)
	GuestContact, // Email input + create account checkbox
} from "@/checkout/components/contact";
```

| Component           | Props                                                          | Use Case                     |
| ------------------- | -------------------------------------------------------------- | ---------------------------- |
| `SignInForm`        | `initialEmail?`, `channelSlug`, `onSuccess`, `onGuestCheckout` | BFF sign-in (`loginWithBff`) |
| `SignedInUser`      | `user`, `onSignOut`                                            | Show logged-in user info     |
| `ResetPasswordForm` | `onSuccess`, `onBackToSignIn`                                  | Password reset callback      |
| `GuestContact`      | `email`, `onEmailChange`, `emailError?`, `onSignInClick`       | Guest email entry            |

## Address Components

```tsx
import {
	AddressSelector, // Radio list for saved addresses
	AddressDisplay, // Read-only address card
} from "@/checkout/components/shipping-address";

// Also re-exported from AddressFormFields:
import { AddressFields, FormInput, FormSelect, FieldError } from "@/checkout/components/shipping-address";
```

| Component         | Props                                                                                | Use Case                     |
| ----------------- | ------------------------------------------------------------------------------------ | ---------------------------- |
| `AddressSelector` | `addresses`, `selectedAddressId`, `onSelectAddress`, `defaultAddressId?`, `name?`    | Pick from saved addresses    |
| `AddressDisplay`  | `address`, `title?`, `onEdit?`                                                       | Show address read-only       |
| `AddressFields`   | `orderedFields`, `formData`, `errors`, `onFieldChange`, `autocompleteSection?`, etc. | Dynamic country-aware fields |

## Form field autofill (`input-attributes`)

Checkout text inputs must expose `name`, `autoComplete`, and `inputMode` so mobile keyboards and browser autofill work, and validation can focus the first error (`querySelector('[name="…"]')`).

**Source of truth:** `src/checkout/lib/consts/input-attributes.ts`

| Export                                      | Use                                                  |
| ------------------------------------------- | ---------------------------------------------------- |
| `formatAddressAutocomplete(field, section)` | `shipping given-name`, `billing address-line1`, etc. |
| `inputModeTags`                             | `tel` for phone, `text` for postal code              |
| `contactFieldAttributes`                    | Email, password, promo code metadata                 |

`AddressFields` accepts `autocompleteSection="shipping" | "billing"` (default `shipping`). Billing passes `"billing"`. Country `<select>` elements use `shipping country` / `billing country` and `name="countryCode"`.

When adding a new checkout input:

1. Add metadata to `input-attributes.ts` (or reuse `contactFieldAttributes`).
2. Set `name` to match validation error keys.
3. Pair `autoComplete` with the correct section token for address fields.
4. See `checkout-design-principles.md` §3 (mobile thumbs).

## Payment Components

Integrated Saleor payment apps render via `IntegratedPaymentUi` (see `checkout-payment-gateways` rule). Steps compose billing + provider UI — there is no generic card-form fallback.

```tsx
import {
	PaymentMethodArea, // Resolves provider → IntegratedPaymentUi
	IntegratedPaymentUi,
	PaymentGatewayAlerts,
	BillingAddressSection,
	type BillingAddressData,
} from "@/checkout/components/payment";
```

| Component               | Props                                                                                                 | Use Case                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `PaymentMethodArea`     | `provider`, `checkout`, `billing`, error/notice callbacks                                             | Payment step wrapper                           |
| `IntegratedPaymentUi`   | Same — maps `provider.type` to Stripe, Dummy, or future gateway components                            | Add new gateway UI in one switch               |
| `PaymentGatewayAlerts`  | `gateways`                                                                                            | Warn when no / unsupported gateway on checkout |
| `BillingAddressSection` | `billingAddress?`, `shippingAddress?`, `userAddresses?`, `isShippingRequired?`, `errors?`, `onChange` | Billing with same-as-shipping                  |

## Usage Pattern

Steps import and compose these components:

```tsx
// In InformationStep.tsx
import { SignInForm, SignedInUser, GuestContact } from "@/checkout/components/contact";
import { AddressSelector } from "@/checkout/components/shipping-address";

// Orchestrate based on auth state
{
	authenticated ? (
		<SignedInUser user={user} onSignOut={handleSignOut} />
	) : contactSection === "signIn" ? (
		<SignInForm onSuccess={handleSignInSuccess} />
	) : (
		<GuestContact email={email} onEmailChange={setEmail} />
	);
}
```

## When to Create New Components

Extract into `components/` when:

- Used in **2+ places**
- **Self-contained** with clear props interface
- **100+ lines** that can be isolated

Keep inline when:

- **One-off** UI specific to that step
- Tightly coupled to step's state machine

---

## 4. Design & Composition

**Impact: HIGH**

How agents (and hand-coders) mold PDP and homepage at world-class quality without breaking PPR, caching, or mobile: the token design system, a design-quality bar, the marketing-section catalog, page composition within the PPR rails, designing from a prompt or image, and verification gates.

### 4.1 UI Design System

The token vocabulary an agent must use to build on-brand UI: color, typography, spacing/rhythm, page width, radius, elevation, motion, and the primitive variant matrix. This is the machine-readable grounding for any design work — read it before molding PDP, homepage, or any section.

> **Canonical human doc:** [`src/styles/README.md`](../../../src/styles/README.md) (rebrand workflow, full token table)
> **Tokens source of truth:** [`src/styles/brand.css`](../../../src/styles/brand.css) → mapped in [`tailwind.config.cjs`](../../../tailwind.config.cjs) > **Creating components / file locations:** [`ui-components.md`](ui-components.md) > **Design judgment (hierarchy, whitespace, mobile):** [`design-quality-rubric.md`](design-quality-rubric.md)

## First principle: design with tokens, not values

Realize a visual direction by **choosing tokens**, never by hardcoding hex, px, or one-off spacing. A rebrand edits `brand.css` once and the whole storefront follows. Hardcoded values silently break that contract and grow fork divergence.

```tsx
// ✅ token-backed
<section className="bg-muted py-section-md">
  <div className="container-content">…</div>
</section>

// ❌ hardcoded — invisible to rebrand, fails the hex-ban lint
<section style={{ background: "#f5f5f3", padding: "96px 0" }}>
```

## Color (semantic, OKLCH)

Use semantic Tailwind classes mapped to `brand.css` — never raw palette values.

| Intent                          | Classes                                                                       |
| ------------------------------- | ----------------------------------------------------------------------------- |
| Page bg / text                  | `bg-background` / `text-foreground`                                           |
| Secondary text                  | `text-muted-foreground`                                                       |
| Cards, menus                    | `bg-card`                                                                     |
| Subtle panels                   | `bg-muted`, `bg-secondary`                                                    |
| Hover / active row              | `bg-accent`                                                                   |
| CTAs                            | `bg-primary text-primary-foreground`                                          |
| Sale / error                    | `text-destructive`, `bg-destructive` (use sale-label.tsx for sale UI)         |
| Borders                         | `border-border`                                                               |
| On dark bands (`bg-foreground`) | `text-inverse`, `text-inverse-subtle`, `text-inverse-muted`, `border-inverse` |

Light-only UI (no `.dark`). Optional editorial display font via `NEXT_PUBLIC_TYPOGRAPHY_THEME=editorial`.

## Typography (semantic, fluid)

Headings/marketing copy use **role tokens** sized with `clamp()` — no `md:text-4xl` breakpoint stacks. Always merge through `cn()` (size + color share the `text-*` prefix; the merge config registers these).

| Class          | Role                  | Mobile → desktop |
| -------------- | --------------------- | ---------------- |
| `text-display` | Homepage hero only    | 44 → 72px        |
| `text-h1`      | Page titles, PDP name | 32 → 48px        |
| `text-h2`      | Section headings      | 24 → 36px        |
| `text-h3`      | Card / column titles  | 18 → 24px        |
| `text-lead`    | Hero subheads, intros | 17 → 20px        |
| `text-eyebrow` | Overlines (uppercase) | 12px fixed       |

Default Tailwind sizes (`text-sm`, `text-lg`) remain for misc UI (price, breadcrumbs). Use role tokens for **roles**, not every node. Pair with `text-balance` (headings) / `text-pretty` (paragraphs).

## Page width (flexible — not a fixed desktop assumption)

Page width is a **design decision**. Paper does not assume a centered fixed-width desktop; full-bleed is first-class. Use the canonical container classes instead of bare `max-w-7xl`.

| Class               | Width | Use for                                                                      |
| ------------------- | ----- | ---------------------------------------------------------------------------- |
| `container-prose`   | 48rem | Long-form copy, legal, FAQ (readable measure)                                |
| `container-content` | 80rem | Default storefront body                                                      |
| `container-wide`    | 96rem | Immersive / editorial layouts                                                |
| `container-full`    | 100%  | Full-bleed, edge-to-edge                                                     |
| `container-nav`     | token | Header bar + mega-menu column (`--container-nav`, defaults to content width) |

Each bundles `mx-auto w-full px-4 sm:px-6 lg:px-8`. Width-only utilities: `max-w-content`, `max-w-wide`. **Full-width ≠ full-measure text** — nest a `container-prose` inside `container-full`/`container-wide` so line length stays ~60–80ch.

**Nav width is a brand knob.** The header and its mega-menu both use `container-nav`, whose width comes from the `--container-nav` token in `brand.css` (default `var(--container-content)` = the current look). To take the nav edge-to-edge for a brand, set `--container-nav: var(--container-full)` (or `--container-wide`) — bar and dropdown follow, no component edits, fully reversible.

**The body column is one token, too.** Every page body — PDP, PLP, search, cart, CMS pages, collections/categories, the footer, even loading skeletons — uses `container-content` (no more stray `max-w-7xl`). So the default body width is the single `--container-content` token: change it once and every page follows in lockstep. Two ways to go full-bleed:

- **One page, rare case:** swap that page's wrapper to `container-full` (or `container-wide`). Edge-to-edge is first-class, so no escape hatch needed — e.g. a landing page that wants an immersive grid.
- **Globally:** widen `--container-content` itself (affects bodies _and_ section defaults, which is usually what you want for a consistent frame).

(The checkout surface keeps its own `max-w-7xl` frame by design — it's a separate surface and must not share storefront layout tokens.)

```tsx
<section className="bg-foreground py-section-lg">
	<div className="container-full">
		<div className="container-prose text-inverse">…readable copy on a full-bleed band…</div>
	</div>
</section>
```

## Spacing & section rhythm

Layout spacing is normal Tailwind (`gap-4`, `grid-cols-2`). For **vertical rhythm between full-bleed bands**, use the fluid section tokens so cadence is consistent:

| Class           | Mobile → desktop | Use for                     |
| --------------- | ---------------- | --------------------------- |
| `py-section-sm` | 40 → 64px        | Compact bands               |
| `py-section-md` | 64 → 112px       | Standard marketing sections |
| `py-section-lg` | 80 → 144px       | Hero-adjacent feature bands |

Also available as `gap-section-*`, `mt-section-*`, etc.

## Radius, elevation, motion

| Concern   | Tokens                                                                                                                                                                                                                                                                                                                                                         |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Radius    | `rounded-button` (buttons/CTAs ← `--radius-button`), `rounded-card` (cards/tiles/media ← `--radius-card`), plus the base `--radius` scale (`rounded-sm/md/lg/xl`). `rounded-full` stays for genuinely circular UI (avatars, dots). Re-shape the whole UI (e.g. pill buttons, hard-edged cards) by editing the shape tokens in `brand.css` — no component edits |
| Elevation | `shadow-card` (resting), `shadow-elevated` (popovers/hover), `shadow-overlay` (sheets/modals)                                                                                                                                                                                                                                                                  |
| Motion    | `duration-fast` (150ms), `duration-base` (250ms), `duration-slow` (400ms); `ease-standard`, `ease-emphasized`                                                                                                                                                                                                                                                  |

Guard non-trivial motion with `motion-reduce:` / `prefers-reduced-motion`.

## Primitive variant matrix (cva)

Primitives in `src/ui/components/ui/` use [`class-variance-authority`](https://cva.style). Extend a variant by adding to the `cva` map — do not hand-roll new `cn()` conditionals or fork a primitive.

| Primitive    | Export                                        | Variants                                                        | Sizes                         |
| ------------ | --------------------------------------------- | --------------------------------------------------------------- | ----------------------------- |
| `button.tsx` | `Button`, `buttonClassName`, `buttonVariants` | `default`, `secondary`, `outline-solid`, `ghost`, `destructive` | `default`, `sm`, `lg`, `icon` |
| `badge.tsx`  | `Badge`, `badgeVariants`                      | `default`, `secondary`, `destructive`, `outline-solid`          | —                             |
| `sheet.tsx`  | `SheetContent`, `sheetVariants`               | side: `top`, `bottom`, `left`, `right`                          | —                             |

```tsx
import { Button } from "@/ui/components/ui/button";
<Button variant="secondary" size="lg">
	Shop now
</Button>;

// Token-backed link CTA (aria-disabled, not native disabled):
import { buttonClassName } from "@/ui/components/ui/button";
<Link className={buttonClassName({ asLink: true, size: "lg" })} href="/products">
	Browse
</Link>;
```

Adding a variant: edit the `cva` `variants` map in the primitive → it flows to `VariantProps` types automatically. For a brand-new size/intent shared across the app, prefer extending the existing primitive over a new component.

## Adding or changing a token (three files)

1. `src/styles/brand.css` — the `--token`.
2. `tailwind.config.cjs` — map it to a utility (`theme.extend`).
3. `src/lib/utils.ts` — register custom `text-*` size groups in `extendTailwindMerge` so `cn()` doesn't drop them.

Restart `next dev` after editing `tailwind.config.cjs`; `rm -rf .next` if JIT serves stale CSS.

## Anti-patterns

❌ Hardcoding hex/rgb/px or one-off spacing when a token exists — edit `brand.css` / use a token class
❌ Bare `max-w-7xl` for new page bodies — use `container-content` (or another width token)
❌ Full-bleed text with no inner `container-prose` — unreadable line length
❌ `md:text-4xl`-style breakpoint stacks on headings — use the fluid role tokens
❌ Hand-rolling a new primitive variant with `cn()` conditionals — extend the `cva` map
❌ Forgetting to register a new `text-*` size in `cn()` merge — the size class silently drops

---

### 4.2 Design Quality Rubric

The bar for "world-class" when molding storefront surfaces (PDP, homepage, marketing sections). Use this to make design decisions and to self-review before finishing. Pairs with [`ui-design-system`](ui-design-system.md) (the token vocabulary) and [`page-composition`](page-composition.md) (the architecture rails).

> Aspire to the craft of top commerce design (Aesop, SSENSE, Apple, Glossier, Hermès): confident typography, generous and intentional whitespace, restrained palette, photography-led hierarchy. Restraint reads as premium. When in doubt, remove.
> For an external accessibility/UX audit pass, invoke the `web-design-guidelines` skill.

## The principles

### 1. Hierarchy — one clear focal point per view

Every screen has a single most-important element (hero headline, product image, price + CTA). Establish hierarchy with **size, weight, space, and color** — in that order. Don't compete: one display size per page (`text-display` is homepage-hero-only), one primary CTA per view.

### 2. Typography — disciplined, not decorative

- Use the role tokens (`text-display/h1/h2/h3/lead`). Don't invent sizes.
- One typeface family for headings, one for body (Paper ships Geist; editorial theme adds Fraunces display). Never introduce a third.
- Body/measure: keep line length ~60–80ch (`container-prose` / `max-w-prose`) even inside full-bleed bands.
- Limit weights (regular + medium/semibold + the token-baked heading weights). Avoid faux-bold stacks.
- `text-balance` for headlines, `text-pretty` for paragraphs.

### 3. Whitespace & rhythm — let it breathe

- Whitespace is a feature, not waste. Prefer more space around focal elements.
- Use the section rhythm tokens (`py-section-sm/md/lg`) for vertical cadence — consistent spacing between bands is the strongest signal of polish.
- Align to a consistent grid; keep gutters consistent (the container classes own them).

### 4. Color & contrast — restrained, semantic, accessible

- Lean on neutrals; use `--primary`/`--destructive` sparingly for action and emphasis.
- Token-only (see `ui-design-system`). Body text ≥ 4.5:1, large text / UI ≥ 3:1. On `bg-foreground` bands use `text-inverse*`.

### 5. Imagery — the product is the hero

- Commerce is photography-led. Give images room; use consistent aspect ratios within a view (`aspect-square` / `aspect-[4/5]` for product media).
- Always `next/image` with correct `sizes`; `priority` only on the LCP image. Provide meaningful `alt` (empty `alt=""` only for purely decorative).
- Never let layout shift on image load (reserve space via aspect ratio).

### 6. Motion — subtle, purposeful, optional

- Micro-interactions only (hover, focus, reveal). Use `duration-fast/base` + `ease-standard`.
- Always honor `motion-reduce:`. Motion must never gate content or be required to understand the page.

### 7. Layout width is a deliberate choice — full-width is allowed

Paper does **not** assume a fixed centered desktop width. Choose width per intent and state it:

- Editorial / immersive PDP or homepage → `container-wide` or `container-full` bands are encouraged.
- Reading-heavy content → `container-prose`.
- Standard catalog body → `container-content`.

A full-bleed desktop layout is a valid, premium choice — but **constrain text measure** within it and never let full-width leak into broken mobile (see below).

## Mobile non-negotiables (NEVER compromise)

Mobile is the majority of commerce traffic. A design is not done until mobile is excellent. These are hard requirements, not preferences:

- **No horizontal scroll / overflow** at 320–430px width. Test the narrowest case.
- **Tap targets ≥ 44×44px**; adequate spacing between interactive elements (no fat-finger ambiguity).
- **No hover-only affordances** — anything reachable on hover must be reachable on tap/focus.
- **Fluid type** via the `clamp()` role tokens — no tiny fixed text, no breakpoint jumps.
- **Mobile-first composition**: design the single-column mobile view first; desktop _adds_ columns/width. Don't design desktop then cram it down.
- **Primary action stays reachable**: PDP uses the sticky add-to-cart bar (`sticky-bar.tsx`) — preserve that pattern; don't bury the CTA.
- **Correct input ergonomics**: `inputmode`, `autocomplete`, real `<label>`s on any form field.
- **Performance is UX on mobile**: keep client JS minimal (Server Components by default), reserve image space, lazy-load below-the-fold media.

Going full-width on desktop must not remove mobile gutters or rhythm — the container/section tokens own the mobile contract; use them rather than ad-hoc widths.

## Self-check before finishing

Run this checklist (and fix what fails) before considering a design done:

- [ ] One clear focal point; one primary CTA per view.
- [ ] Only role typography tokens; one display element; readable measure (~60–80ch) everywhere, including full-bleed.
- [ ] Vertical rhythm uses `py-section-*`; spacing feels consistent and generous.
- [ ] Color/spacing/radius/shadow are token-backed — zero hardcoded hex/px.
- [ ] Images: `next/image`, correct `sizes`, `priority` only on LCP, consistent aspect ratios, no CLS, meaningful `alt`.
- [ ] **Mobile (320–430px): no horizontal scroll; tap targets ≥44px; no hover-only; CTA reachable; single-column reads well.**
- [ ] Width choice is intentional (`prose`/`content`/`wide`/`full`) and stated.
- [ ] Motion is subtle and `motion-reduce`-guarded.
- [ ] Server Component by default; `"use client"` only where interactivity demands it (see `page-composition`).
- [ ] Reused existing primitives/sections where they fit; new components follow the section pattern and tokens.
- [ ] Accessibility: focus-visible states, heading order (one `h1`), contrast — consider a `web-design-guidelines` pass.

## Anti-patterns

❌ Multiple competing focal points / multiple `text-display` per page
❌ More than two type families, or faux-bold weight stacks
❌ Cramped vertical rhythm or inconsistent section spacing
❌ Designing desktop-first then shrinking — always mobile-first
❌ Full-width layouts with unconstrained text measure
❌ Hover-only menus/actions, tap targets < 44px, horizontal overflow on mobile
❌ Decorative motion that blocks content or ignores `prefers-reduced-motion`
❌ Reaching for hardcoded values or new primitives instead of tokens/existing components

---

### 4.3 UI Sections (Marketing Blocks)

The catalog of reusable full-bleed marketing sections in [`src/ui/sections/`](../../../src/ui/sections/) and how to compose, select, and author them. **Reuse these before building anything new** — a hand-rolled hero is a code smell when `HeroBanner` exists.

> **Tokens & width:** [`ui-design-system`](ui-design-system.md) · **Design bar:** [`design-quality-rubric`](design-quality-rubric.md) > **Page assembly & PPR rules:** [`page-composition`](page-composition.md) · **Copy source:** [`data-storefront-content`](data-storefront-content.md)
> Exact prop types live in each component file — treat the source as the contract; this rule is the map and the selection guide.

## Catalog

| Section                     | File                                        | Purpose                                                                                                       | Key props / variants                                                                                                                                                                                                         |
| --------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MediaHero`                 | `media-hero/media-hero.tsx`                 | Full-viewport photographic / **video** hero with overlaid copy (the immersive, photography-led hero)          | `eyebrow`, `heading`, `subheading`, `primaryCta`, `secondaryCta`, `image`, `videoSrc`, `poster`, `align`, `height` (`medium`/`tall`/`full`), `overlay`, `copySurface` (`none`/`panel` — light frosted panel for busy photos) |
| `HeroBanner`                | `hero-banner/hero-banner.tsx`               | Top-of-page hero with optional full-bleed background image + CTAs                                             | `heading`, `subheading`, `primaryCta`, `secondaryCta`, `backgroundImage`, `height` (`compact`/`default`/`large`)                                                                                                             |
| `EditorialHero`             | `editorial-hero/editorial-hero.tsx`         | Split hero: confident type on a clean canvas + a large product image on a soft panel (suits studio packshots) | `eyebrow`, `heading`, `subheading`, `primaryCta`, `secondaryCta`, `image`, `imageAlt`, `placeholder`                                                                                                                         |
| `CategoryTileGrid`          | `category-tile-grid/category-tile-grid.tsx` | Large image tiles linking to categories/collections (label overlay for lifestyle, label-below for packshots)  | `heading`, `eyebrow`, `intro`, `cta`, `tiles[]`, `columns` (`2`/`3`/`4`), `imageFit` (`cover`/`contain`), `aspect`, `tone`, `width`                                                                                          |
| `FeaturedCollectionSection` | `featured-collection-section/`              | Product grid from a Saleor collection                                                                         | `heading`, `collectionSlug`, `limit`, `desktopColumns`; server data (`"use cache"`) — wrap in Suspense with `FeaturedCollectionSkeleton`                                                                                     |
| `ImageWithText`             | `image-with-text/`                          | Editorial split: image one side, copy + CTA the other                                                         | `heading`, `paragraphs`, `image` (or `placeholder`), `imagePosition` (`left`/`right`), `cta`                                                                                                                                 |
| `MulticolumnSection`        | `multicolumn-section/`                      | 2–3 column value props / icons                                                                                | `heading`, `columns[]`, `columnsDesktop` (`2`/`3`)                                                                                                                                                                           |
| `RichTextBlock`             | `rich-text-block/`                          | Centered/left prose band (brand story, intro)                                                                 | `heading`, `paragraphs`, `align` (`left`/`center`), `width` (`narrow`/`default`/`wide`)                                                                                                                                      |
| `TestimonialSection`        | `testimonial/`                              | Social proof — one centered quote or 2–3 column quote cards                                                   | `heading`, `testimonials[]` (`quote`, `author`, `detail`)                                                                                                                                                                    |
| `FaqSection`                | `faq/`                                      | FAQ accordion via native `<details>` (zero client JS)                                                         | `heading`, `items[]` (`question`, `answer`)                                                                                                                                                                                  |
| `SpecTable`                 | `spec-table/`                               | Specs / details table (label → value rows), semantic `<table>`                                                | `heading`, `rows[]` (`label`, `value`)                                                                                                                                                                                       |
| `LogoStrip`                 | `logo-strip/`                               | Press / partner / trust logo row                                                                              | `heading`, `logos[]` (`src`, `alt`, `href?`)                                                                                                                                                                                 |
| `AnnouncementBar`           | `announcement-bar/`                         | Chrome strip (layout, not page body); dismissible via content-hash or optional `id`                           | from `content.chrome.announcementBar`; dismissal keys → `data-storefront-content` § Announcement bar dismissal identity                                                                                                      |

> **Editorial with a real image:** use `ImageWithText` with its `image`/`imageAlt` props. The homepage editorial content model exposes `editorial.image` / `editorial.imageAlt` (`HomepageEditorialContent`); unset falls back to the brand placeholder.
>
> **Shared primitives:** band sections compose two primitives — [`Section`](../../../src/ui/sections/section.tsx) (owns `tone` `default`/`muted`/`inverse`, `width`, `spacing`, `bleed`, `aria-labelledby`) and [`SectionHeader`](../../../src/ui/sections/section-header.tsx) (`eyebrow` + `heading` + `intro` + optional arrow `cta`, with a unique heading `id`). Most catalog sections therefore also accept `tone`, `width`, `eyebrow`, `intro`, and `cta` (see each source for the exact set). Use `tone` to alternate band backgrounds for rhythm; pass a distinct heading `id` when the same section repeats on a page. Arrow text links use [`ArrowLink`](../../../src/ui/components/ui/arrow-link.tsx). Button and card corners are token-driven (`rounded-button` / `rounded-card` ← `--radius-button` / `--radius-card` in `brand.css`) — re-shape the whole UI (e.g. pill buttons) from one place, never per-CTA.

## Selection guide ("use X when…")

- **Lead the page / set the mood** → `MediaHero` for an immersive full-viewport image/**video** hero (`overlay="gradient"` by default → inverse `text-inverse*` on scrim; optional `copySurface="panel"` for solid tone on a frosted card); `HeroBanner` for a simpler photographic hero; or `EditorialHero` for a split layout with packshots. One hero per page.
- **Show products** → `FeaturedCollectionSection` (collection-backed). Never hand-roll a product grid for the homepage.
- **Navigate to categories/collections** → `CategoryTileGrid` (large image tiles; `imageFit="cover"` for lifestyle photos, `"contain"` for packshots).
- **Tell a story with a visual** → `ImageWithText`. Alternate `imagePosition` between stacked instances for rhythm.
- **List benefits / values / steps** → `MulticolumnSection`.
- **Pure copy band (no media)** → `RichTextBlock` with `width="narrow"` for readable measure.
- **Customer quotes / reviews** → `TestimonialSection`.
- **Answer common questions** → `FaqSection` (native disclosure; great for SEO, no client JS).
- **Specs / materials / dimensions** → `SpecTable`.
- **Press / partner / "as seen in"** → `LogoStrip`.
- **Nothing fits** → author a new section (below) and add it to this catalog. Don't overload an existing section with unrelated props.

## The section pattern (for new sections)

Every section is a **full-bleed `<section>` band with an inner width container**, token-driven, Server Component by default. **Compose the shared primitives** rather than re-implementing the band/heading — `Section` owns tone + rhythm + width container, `SectionHeader` owns eyebrow/heading/intro/CTA + the unique `id`:

```tsx
import { Section, type SectionTone, type SectionWidth } from "@/ui/sections/section";
import { SectionHeader, type SectionHeaderCta } from "@/ui/sections/section-header";

export interface FeatureBandProps {
	heading?: string;
	eyebrow?: string;
	intro?: string;
	cta?: SectionHeaderCta;
	children?: React.ReactNode;
	tone?: SectionTone; // default | muted | inverse
	width?: SectionWidth; // prose | content | wide | full
	className?: string;
}

export function FeatureBand({
	heading,
	eyebrow,
	intro,
	cta,
	children,
	tone,
	width,
	className,
}: FeatureBandProps) {
	const headingId = "feature-band-heading";
	return (
		<Section
			tone={tone}
			width={width}
			className={className}
			aria-labelledby={heading ? headingId : undefined}
		>
			<SectionHeader
				id={headingId}
				eyebrow={eyebrow}
				heading={heading}
				intro={intro}
				cta={cta}
				className="mb-10"
			/>
			{children}
		</Section>
	);
}
```

> Sections with a bespoke flush layout (e.g. `ImageWithText`, heroes) may render their own `<section>` instead of `Section`, but should still expose `tone`/`width` and a unique heading `id`.

Rules for new sections:

- **Compose `Section` + `SectionHeader`** — don't re-implement the band, tone map, rhythm, or `aria-labelledby` wiring by hand. `Section` defaults to `container-content`; use `width="wide"`/`"full"` for immersive, `"prose"` for copy, or `bleed` to own the full width.
- **Tokens only** — colors, spacing, radius, shadow, motion from `ui-design-system`. No hardcoded values.
- **Server Component** unless it needs interactivity; if it fetches catalog data, use `"use cache"` + `applyCacheProfile` and expose a matching skeleton for Suspense (see `page-composition`, `data-caching`).
- **Content via props** — copy comes from `getStorefrontContent()` upstream (the page passes it down), not fetched inside the section. Functional labels use next-intl (`ui-i18n`). Don't hardcode marketing strings.
- **Accessible** — one `h2` per section linked via `aria-labelledby`; meaningful image `alt`; mobile-first per `design-quality-rubric`.
- **Variants via props** (`tone`, `width`, `align`, `imagePosition`) using small `Record` maps or `cva` — keep the surface small and composable.
- **Folder convention** — `src/ui/sections/<section-name>/<section-name>.tsx` (+ `-skeleton.tsx` if it streams). kebab-case files, PascalCase export (see `references/code-conventions.md`).

## Images in sections

Section imagery (hero, editorial) comes from the content layer where wired (e.g. hero `backgroundImage` is a Saleor `FILE` attribute). Some sections accept a `placeholder` node when no image is set. When adding an image field to a section, add the attribute to the content model too — see [`data-storefront-content-attributes`](data-storefront-content-attributes.md).

## Anti-patterns

❌ Hand-rolling a hero / product grid / value-columns layout when a catalog section exists
❌ Fetching `getStorefrontContent` or catalog data _inside_ a presentational section — pass props from the page
❌ Hardcoding marketing copy in a section component (use the content layer / next-intl)
❌ A section that sets its own fixed `max-w-7xl` instead of a width container the page can vary
❌ Adding a new section without a skeleton (if it streams) or without cataloging it here
❌ Overloading one section with many unrelated boolean props instead of composing or adding a new section

---

### 4.4 Page Composition (PDP & Homepage)

How to mold PDP and homepage layouts by editing the page files — adding, removing, reordering, and re-widthing sections — **without breaking PPR, caching, or LCP**. This is the bridge between "design freely" ([`design-quality-rubric`](design-quality-rubric.md)) and "respect the architecture" ([`paper-architecture`](paper-architecture.md), [`data-caching`](data-caching.md)).

> Molding in Paper is **code-level composition**: edit the page's section list and props. There is no runtime page-builder — and that is deliberate (keeps PPR, performance, and fork divergence under control).
> Sections: [`ui-sections`](ui-sections.md) · Tokens/width: [`ui-design-system`](ui-design-system.md) · PDP mechanics: [`product-pdp`](product-pdp.md)

## The one rule that governs everything: the layer model

Every browse page is **sync page → Suspense → cached shell → dynamic islands** (full detail in `data-caching`). Design changes must stay inside the right layer:

```
Page (sync export)                  ← no top-level await of runtime data
└── Suspense (skeleton)
    └── Shell (await params + "use cache" data ONLY)   ← STATIC design lives here
          ├── sections built from cached content (hero, story, value columns…)
          └── Suspense island(s)                       ← DYNAMIC design lives here
                searchParams / cookies / client hooks  (variant gallery, featured grid, cart)
```

| Put it in the STATIC shell                        | Put it in a DYNAMIC island (nested Suspense)              |
| ------------------------------------------------- | --------------------------------------------------------- |
| Marketing sections from `getStorefrontContent()`  | Anything reading `searchParams` (variant gallery/section) |
| `h1`, breadcrumbs, JSON-LD, copy, value props     | Anything reading `cookies()` (cart, auth chrome)          |
| LCP image preload                                 | `cache: "no-cache"` fetches; client routing hooks         |
| Cached collection grids via `"use cache"` helpers | Featured grid streams behind its skeleton                 |

Hard constraints (never violate when redesigning):

- Never `await searchParams`/`cookies()` in the shell or inside `"use cache"` — it collapses the whole page into a dynamic hole.
- Catalog/content fetches use `applyCacheProfile(CACHE_PROFILES.*)` — never raw `cacheLife`/`cacheTag`.
- Server Components by default; add `"use client"` only for genuine interactivity.
- Don't fix a PPR build error by wrapping `<main>` in Suspense — fix the segment that owns the dynamic work.

## Homepage molding

File: [`src/app/(storefront)/[locale]/[channel]/(main)/page.tsx`](<../../../src/app/(storefront)/[locale]/[channel]/(main)/page.tsx>)

The homepage composes typed content (`getStorefrontContent`) into an ordered list of sections. To mold it:

1. **Reorder / add / remove sections** by editing the JSX section list. Pull copy from `content.surfaces.homepage` (extend the content model for new fields — see `data-storefront-content`).
2. **Keep product data streaming**: `FeaturedCollectionSection` stays inside its `<Suspense fallback={<FeaturedCollectionSkeleton/>}>`. Static editorial sections render directly in the shell.
3. **Vary width per section** with the container tokens (a full-bleed `HeroBanner` + a `container-content` story + a `container-wide` editorial band is fine).
4. **Width is intentional** — a full-width homepage is supported; don't default to centered-narrow.

```tsx
// Sketch: reordered homepage with a new full-bleed editorial band
return (
  <>
    <HeroBanner heading={hero.heading} backgroundImage={hero.backgroundImage} height="large" primaryCta={…} />

    <Suspense fallback={<FeaturedCollectionSkeleton heading={featured.heading} limit={featured.limit} />}>
      <FeaturedCollectionLoader params={props.params} {...featured} />
    </Suspense>

    <ImageWithText heading={editorial.heading} paragraphs={editorial.paragraphs} imagePosition="right" cta={…} />
    <MulticolumnSection heading={values.heading} columns={valueColumns} columnsDesktop={values.columnsDesktop} />
    <RichTextBlock heading={brandStory.heading} paragraphs={brandStory.paragraphs} align="center" width="narrow" />
  </>
);
```

> Known divergence: the homepage uses an async page shell that awaits only `params` + cached content (no `searchParams`/`cookies`), so PPR is intact. Keep that constraint when editing; if you convert it to a sync-page shell, add a `loading.tsx` (see `paper-architecture` divergences).

## PDP molding

File: [`src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx`](<../../../src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx>)

PDP is `ProductShell` (cached product) + two dynamic islands (`VariantGalleryDynamic`, `VariantSectionDynamic`). **Layout width, grid ratio, and gallery style** are centralized in [`gallery-layout.ts`](../../../src/ui/components/pdp/gallery-layout.ts) (`PDP_GALLERY_LAYOUT`). To mold the PDP:

1. **Static design** (gallery column shell, name, breadcrumbs, new editorial/spec/related bands) lives in `ProductShell` from cached `product` data.
2. **Variant-dependent UI** stays in the dynamic islands (they read `searchParams.variant`) — don't lift variant state into the shell.
3. **Layout width / columns**: flip `PDP_GALLERY_LAYOUT` for shop-wide immersive vs standard, or extend `PDP_LAYOUT_CLASSES` for a new ratio. `container-full` + wide gallery column is the default immersive path.
4. **Add a new PDP section** (related products, reviews, story, spec table): render it in `ProductShell` from cached data, or as its own nested `<Suspense>` island if it needs runtime/searchParams data. Keep the buy box (`VariantSectionDynamic`) and its add-to-cart Server Action intact.
5. **Preserve LCP**: keep the gallery Suspense fallback (`ImmersiveGalleryFallback` / `ProductGalleryFallback`) with `priority` on the default hero — don't add a heavier hero above the gallery.
6. **Preserve mobile commerce UX**: keep the sticky add-to-cart bar (`sticky-bar.tsx`); use CSS `order-*` (see `data-caching` §CSS order) when dynamic content must appear above static `h1` while keeping `h1` in the static shell for SEO.
7. **Route skeletons**: use `ProductRouteSkeleton` in `loading.tsx` — never hand-roll a 2-column skeleton that disagrees with `PDP_GALLERY_LAYOUT`.

```tsx
// Sketch: immersive PDP (default) — attributes below gallery, buy box sticky right
const layout = PDP_LAYOUT_CLASSES[PDP_GALLERY_LAYOUT];

<main className={layout.main}>
	<div className={layout.grid}>
		<div className={layout.galleryColumn}>
			<Suspense fallback={<ImmersiveGalleryFallback src={lcpUrl} alt={product.name} />}>
				<VariantGalleryDynamic product={product} searchParams={searchParams} />
			</Suspense>
		</div>
		<div className={layout.infoColumn}>
			<h1 className="order-2 text-balance text-h1">{product.name}</h1>
			<ErrorBoundary FallbackComponent={VariantSectionError}>
				<Suspense fallback={<VariantSectionSkeleton />}>
					<VariantSectionDynamic product={product} searchParams={searchParams} />
				</Suspense>
			</ErrorBoundary>
		</div>
		{layout.attributesPlacement === "gallery" && (
			<div className={layout.attributesGalleryBlock}>
				<ProductAttributes ... />
			</div>
		)}
	</div>
</main>
```

## Workflow for a layout change

1. Decide static vs dynamic for each new/changed element (use the table above).
2. Pick width per section (`container-*`) and rhythm (`py-section-*`).
3. Build from existing sections/primitives; author new sections per `ui-sections` only when needed.
4. Pull copy from the content layer / next-intl — don't hardcode.
5. Run the `design-quality-rubric` self-check (especially mobile).
6. Verify PPR/perf (see [`design-verification`](design-verification.md)): `pnpm exec tsc --noEmit`, then a build for PPR-sensitive changes.

## Anti-patterns

❌ Awaiting `searchParams`/`cookies()` in the shell or `"use cache"` to make a section "dynamic" — use a nested Suspense island
❌ Lifting variant selection into the shell or into React state (URL is the source of truth — see `product-variants`)
❌ Adding a marketing hero above the PDP gallery that displaces the LCP image
❌ Making a whole section a Client Component for one interactive child — isolate the client part
❌ Hardcoding section copy in the page instead of `getStorefrontContent()` / next-intl
❌ Turning the page into a runtime block renderer to "reorder" — reorder in code; that is the supported mold surface
❌ Fixing PPR build errors by wrapping `<main>` in Suspense

---

### 4.5 Design From Prompt or Image

How to turn a user's prompt, reference screenshot, mockup, or "make it look like X" into Paper UI — by reconfiguring the design system, not bypassing it. This is the generative workflow that ties the design rules together.

> Read together with [`ui-design-system`](ui-design-system.md) (tokens), [`ui-sections`](ui-sections.md) (blocks), [`page-composition`](page-composition.md) (PPR rails), [`design-quality-rubric`](design-quality-rubric.md) (the bar).
> Core stance: **reproduce the design's spirit by adjusting tokens and composing existing blocks** — not by hardcoding values or cloning markup pixel-for-pixel. This keeps output on-brand, performant, accessible, and low-divergence.

## Workflow

### 0. Audit & confirm scope (redesign-from-reference only)

When the task is to **redesign an existing surface to match a reference** (screenshot, URL, or "make X look like Y") — not building net-new and not a small, well-specified edit — do this before writing any code:

1. **Read both sides.** Read the reference for intent (Step 1 signals) and read the current implementation of the target surface (its page file + section/component tree).
2. **Produce a categorized gap analysis**, grouping differences into:
   - **Information architecture** — hierarchy, ordering, density, what leads the page.
   - **Missing elements** — present in the reference, absent in ours (impact band, reviews summary, size guide, etc.).
   - **Media / gallery** — how imagery is presented.
   - **Third-party** — external widgets/integrations implied (reviews, etc.).
3. **Confirm scope with the developer.** Present the gaps and ask which to build (a short multiple-choice is ideal). Do not start editing until scope is confirmed.

Skip this gate for small, well-specified changes ("switch to the editorial theme", "reorder the buy box") — proceed directly to Step 1.

> Why: keeps large redesigns intentional and developer-driven, and avoids over-building sections the merchant did not ask for.

### 1. Brief — extract intent before writing code

From the prompt/image, write a short internal design brief (and ask 1–3 questions only if genuinely blocked):

- **Surface & scope**: homepage? PDP? a single section? full redesign?
- **Layout structure**: section stack, columns, and **width intent per band** (centered `content`, immersive `wide`, or `full`-bleed). Note that full-width is allowed.
- **Type personality**: geometric/neutral (Geist) vs editorial/serif (Fraunces editorial theme); display scale usage.
- **Palette direction**: neutral/warm/cool, accent usage, light (Paper is light-only).
- **Density & rhythm**: airy vs compact (maps to `py-section-sm/md/lg`).
- **Imagery role**: photography-led? product-forward? editorial?
- **Mobile intent**: how the structure collapses to one column (it must — see rubric).

If the user supplied an image, read it for these signals; don't transcribe its exact pixels.

### 2. Map to the design system (not to raw values)

Translate the brief into **token and component decisions**:

| From the reference                            | Map to                                                                                                    |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Colors / mood                                 | Adjust `--background`, `--foreground`, `--primary`, etc. in `brand.css` (OKLCH) — never per-component hex |
| Type personality                              | Choose default vs editorial typography theme; use role tokens (`text-display/h1/h2…`)                     |
| Corner softness                               | `--radius`                                                                                                |
| Spacing density                               | `py-section-*` choice + spacing tokens                                                                    |
| Layout width                                  | `container-prose/content/wide/full` per band                                                              |
| Elevation / depth                             | `shadow-card/elevated/overlay`                                                                            |
| Sections (hero, split, columns, grid, quote…) | Pick from the `ui-sections` catalog                                                                       |

A whole-store restyle is mostly a `brand.css` edit + section selection — that is the point.

### 3. Select & compose existing blocks first

- Match each region of the reference to a catalog section (`HeroBanner`, `ImageWithText`, `MulticolumnSection`, `FeaturedCollectionSection`, `RichTextBlock`).
- Use section variant props (`height`, `imagePosition`, `columnsDesktop`, `align`, `width`) to approximate the reference.
- Only author a **new** section when nothing fits — follow the section pattern in `ui-sections` (full-bleed band + width container, tokens, Server Component, skeleton if it streams). Add it to the catalog.

### 4. Compose the page within the PPR rails

- Assemble in the page file per [`page-composition`](page-composition.md): static design in the cached shell, runtime/searchParams/cookie UI in nested Suspense islands.
- Pull copy from `getStorefrontContent()` / next-intl — placeholder copy only as a temporary stand-in, then wire the content model.
- Keep LCP and the mobile sticky CTA intact on PDP.

### 5. Verify (the autofixer loop)

Run the [`design-quality-rubric`](design-quality-rubric.md) self-check, then the [`design-verification`](design-verification.md) gates:

- `pnpm exec tsc --noEmit`; build for PPR-sensitive changes.
- Hex-ban lint (token-only), unnecessary-`"use client"` check, mobile/overflow/tap-target review.
- Optionally invoke the `web-design-guidelines` skill for an accessibility/UX audit pass.
- Compare against the brief (not the pixels): same hierarchy, mood, density, width intent — and excellent on mobile.

## Worked example (prompt → plan)

> "Make the homepage feel like a high-end editorial fashion store — big imagery, lots of whitespace, full-width hero, serif headlines."

1. **Brief**: homepage; full-bleed hero, generous rhythm; editorial/serif type; neutral palette, photography-led; airy density.
2. **Tokens**: enable editorial typography theme (Fraunces display); keep neutral OKLCH palette, maybe warm `--background`; `py-section-lg` rhythm.
3. **Blocks**: `HeroBanner height="large"` with `backgroundImage` (full-bleed) → `FeaturedCollectionSection` → `ImageWithText` (alternating) → `RichTextBlock width="narrow"` for the brand note.
4. **Compose**: hero/editorial in the shell, featured grid streaming in Suspense; widths: hero `full`, story `content`, an editorial band `wide` with inner `prose`.
5. **Verify**: rubric self-check (one display element, readable measure inside full-bleed, mobile single-column, tap targets), then gates.

## Anti-patterns

❌ Hardcoding the reference's exact hex/px/fonts into components instead of adjusting tokens
❌ Cloning a screenshot's markup pixel-for-pixel (brittle, off-brand, unmaintainable) — reproduce intent via the system
❌ Inventing new primitives/sections when a catalog block + variant would do
❌ Ignoring the PPR layer model to get a layout "looking right" (breaks caching/LCP)
❌ Shipping a desktop-accurate clone that breaks on mobile — mobile excellence is non-negotiable
❌ Leaving placeholder copy hardcoded instead of wiring the content layer
❌ Skipping the rubric self-check and gates before declaring done

---

### 4.6 Design Verification Gates

The checks to run after molding UI — the "autofixer loop" that keeps generated/edited design Paper-correct, fast, and accessible. **Advisory-first by design**: one unambiguous hard gate, everything else is a guided review you fix before finishing. This protects hand-coder DX (no brittle CI walls) while still catching the common mistakes.

> Run after the [`design-quality-rubric`](design-quality-rubric.md) self-check. Pairs with [`page-composition`](page-composition.md) (PPR rules) and [`ui-design-system`](ui-design-system.md) (tokens).

## Hard gate (must pass)

| Gate          | Command                       | Catches                                                                                    |
| ------------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| Design tokens | `pnpm run lint:design-tokens` | Raw hex / `rgb()` / `hsl()` in `src/ui/**/*.tsx` styling — use a `brand.css` token instead |
| Types         | `pnpm exec tsc --noEmit`      | Type errors (incl. cva `VariantProps`)                                                     |
| Lint          | `pnpm run lint`               | ESLint / Next rules                                                                        |

The design-token gate (`scripts/check-design-tokens.mjs`) scans component styling only — color _data_ in `.ts` (swatch maps, fixtures) is excluded. Rare legitimate literal? Add a `design-tokens-allow` comment on that line.

## Advisory checks (review, don't block)

Fix these when molding; they are judgment calls, so they stay manual rather than failing CI:

- **Unnecessary `"use client"`** — did a section/component become a Client Component without needing state, effects, event handlers, or browser APIs? Default to Server Components (`paper-architecture`, `page-composition`). Grep new `"use client"` directives and justify each.
- **PPR / cache boundaries** — no `await searchParams` / `cookies()` in the shell or inside `"use cache"`; runtime UI lives in nested `<Suspense>` islands; catalog/content fetches use `applyCacheProfile` (`data-caching`). Verify with a build for PPR-sensitive routes: `pnpm run build`.
- **LCP** — PDP keeps the default-image `<link rel="preload">` + `priority` on the first gallery image; no heavier hero displacing it (`product-pdp`).
- **Client JS budget** — prefer composition over shipping large client components; isolate the interactive part.
- **Content boundary** — marketing copy comes from `getStorefrontContent()`; functional strings from next-intl — not hardcoded (`data-storefront-content`, `ui-i18n`).

## Accessibility / UX pass

For anything user-facing, run the external **`web-design-guidelines`** skill (Web Interface Guidelines audit): focus-visible states, heading order (one `h1`), contrast, tap targets, reduced motion, form semantics. Treat its findings as part of "done", especially the mobile non-negotiables in `design-quality-rubric`.

## When to run what

| Change                                        | Gates                                             |
| --------------------------------------------- | ------------------------------------------------- |
| Token / styling tweak                         | `lint:design-tokens` + `tsc` + rubric self-check  |
| New / moved section                           | above + advisory review + `web-design-guidelines` |
| Page layout / Suspense change (PDP, homepage) | above + `pnpm run build` (PPR)                    |
| Anything shipped to users                     | full self-check + all gates + a11y pass           |

## Anti-patterns

❌ Declaring a design done without the rubric self-check or these gates
❌ Hardcoding a color to dodge `lint:design-tokens` instead of adding/using a token
❌ Sprinkling `design-tokens-allow` to silence real violations
❌ Turning advisory checks into hard CI walls that block prototyping (keep them guided)
❌ Skipping a build on PPR-sensitive layout changes and shipping a dynamic-hole regression

---

## 5. UI & Channels

**Impact: MEDIUM**

UI components and channel configuration control the visual layer and multi-currency support.

### 5.1 UI Components

Create and style UI components with design tokens and shadcn/ui primitives.

> **Design system (tokens, type scale, width, rhythm, cva variant matrix):** [`ui-design-system.md`](ui-design-system.md) — read it before non-trivial design work.  
> **Marketing sections / page molding:** [`ui-sections.md`](ui-sections.md), [`page-composition.md`](page-composition.md) · **Design bar:** [`design-quality-rubric.md`](design-quality-rubric.md)  
> **File naming & imports:** [`references/code-conventions.md`](../references/code-conventions.md)  
> **Source**: [shadcn/ui](https://ui.shadcn.com/) - Component patterns and primitives used in this project

## Component Location

| Type                          | Location                  |
| ----------------------------- | ------------------------- |
| Shared components             | `src/ui/components/`      |
| Homepage & marketing sections | `src/ui/sections/`        |
| Product page components       | `src/ui/components/pdp/`  |
| Product listing components    | `src/ui/components/plp/`  |
| Base primitives               | `src/ui/components/ui/`   |
| Navigation                    | `src/ui/components/nav/`  |
| Cart                          | `src/ui/components/cart/` |

## Design Tokens

**Single source of truth:** `src/styles/brand.css`. See `src/styles/README.md` for the full workflow.

Use semantic Tailwind classes (mapped in `tailwind.config.cjs`):

```tsx
// Resolves to brand.css via tailwind.config.cjs
<div className="bg-background text-foreground border-border">
<button className="bg-primary text-primary-foreground">
<span className="text-muted-foreground">

// Inverse footer (bg-foreground)
<p className="text-inverse-subtle">
```

Available tokens:

- `background`, `foreground` - Main bg/text
- `primary`, `primary-foreground` - Primary actions
- `secondary`, `secondary-foreground` - Secondary elements
- `muted`, `muted-foreground` - Subdued elements
- `inverse`, `inverse-subtle`, `inverse-muted` - Text on inverse surfaces (`bg-foreground`)
- `border`, `border-inverse` - Borders
- `destructive` - Error/danger states

## Using shadcn/ui Primitives

Import from `@/ui/components/ui/`:

```tsx
import { Button } from "@/ui/components/ui/button";
import { Badge } from "@/ui/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/ui/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/ui/components/ui/dropdown-menu";
```

## Export Pattern

If component is in a subdirectory, export from index:

```typescript
// src/ui/components/pdp/index.ts
export { NewComponent } from "./NewComponent";
```

## Swappable variants of a component

Three mechanisms — pick by **when the choice is made** and **whether the unused variants are heavy**:

| You need…                                                                                          | Use                                                 | Do the unused variants ship? |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ---------------------------- |
| Visual variations of one component (size, tone, emphasis)                                          | **`cva` prop variants** — see `ui-design-system.md` | n/a (one component)          |
| One of several **distinct, heavy** implementations, chosen at **build time**, others must not ship | **Variant registry** (below)                        | No — only the active one     |
| Different implementation per request/product at **runtime**                                        | Plain conditional render (all candidates ship)      | Yes (can't tree-shake)       |

### Variant registry (build-time choice)

When a shop picks **one** of several mutually-exclusive, non-trivial implementations at build time (different PDP galleries, homepage hero styles, etc.) and you don't want the unused ones in the bundle, use a registry keyed by a build-time constant. Reference implementation: `src/ui/components/pdp/gallery-registry.tsx` (see `product-pdp.md`).

```tsx
// foo-registry.tsx — the ONLY module that imports the renderers
const Fancy = dynamic(() => import("./foo-fancy").then((m) => m.FooFancy)); // "use client"
export const FOO_REGISTRY: Record<FooVariant, ComponentType<FooProps>> = {
	plain: FooPlain, // Server Component → imported directly (0 client JS)
	fancy: Fancy, // client → lazy, ships only when active
};
export const activeFoo = () => FOO_REGISTRY[FOO_VARIANT];
```

Why it stays concise:

- **`next/dynamic`** gives each client variant its own chunk → only the active one is requested.
- **`Record<FooVariant, …>`** is exhaustive → the compiler forces an entry per variant.
- **Renderers stay out of barrels (`index.ts`).** This is the only real footgun: re-exporting multiple `"use client"` variants through a barrel a Server Component imports defeats tree-shaking and pulls them all in. A plain unused `import` (no re-export) is tree-shaken normally.

**Don't over-reach:** for lightweight visual differences reach for `cva`, not a registry. The registry is a convenient default, not a cage — a fork is free to delete the others and hardcode its chosen variant (one import, one render, ships one).

## Examples

### Basic Component

```tsx
import { cn } from "@/lib/utils";

interface CardProps {
	title: string;
	children: React.ReactNode;
	className?: string;
}

export function Card({ title, children, className }: CardProps) {
	return (
		<div className={cn("rounded-lg border border-border bg-card p-4", className)}>
			<h3 className="font-medium text-foreground">{title}</h3>
			<div className="mt-2 text-muted-foreground">{children}</div>
		</div>
	);
}
```

## Anti-patterns

❌ **Don't hardcode brand colors** (hex/rgb in components) when a token exists — edit `brand.css` instead  
❌ **Don't add `"use client"` unless needed** - Prefer Server Components  
❌ **Don't create new primitives** - Use existing shadcn/ui components  
❌ **Don't use inline styles** for brand colors - Use Tailwind classes backed by tokens

---

### 5.2 Channels & Multi-Currency

Configure multi-channel and multi-currency support. This storefront supports multiple Saleor channels, each with its own currency. Understanding the underlying fulfillment model helps debug "product not purchasable" issues.

> **Source**: [Saleor Docs - Stock Overview](https://docs.saleor.io/developer/stock/overview) - Fulfillment triangle and stock allocation

## How Channels Work

```
URL: /uk/products/...  →  Channel "uk" (GBP)
URL: /us/products/...  →  Channel "us" (USD)
```

- Currency comes from the channel settings in Saleor
- Channel selector appears in the footer (shows currency codes)
- Checkout inherits the channel from where the cart was created

## Saleor Commerce Model

Channels don't exist in isolation. Product purchasability depends on three connected entities:

```
        CHANNEL                 SHIPPING ZONE              WAREHOUSE
     (sales storefront)       (delivery region)         (inventory location)
            │                        │                        │
            ├────── assigned to ─────┤                        │
            │                        ├──── fulfills from ─────┤
            ├──────────── assigned to ────────────────────────┤
```

**All three connections must exist for a product to be purchasable.**

### Purchasability Checklist

When debugging why a product can't be purchased in a channel, verify all 7 conditions:

1. Product is **published** in the channel
2. Product is **available for purchase** in the channel
3. At least one variant has a **price** in the channel
4. Channel has at least one active **shipping zone**
5. That shipping zone has at least one **warehouse**
6. That warehouse has **stock** for the variant
7. That warehouse is also **assigned to the channel**

### Unreachable Stock

A warehouse assigned to a channel but **not** to any shipping zone for that channel results in "unreachable" stock -- it exists in the system but customers cannot buy it. This is the most common cause of confusing `isAvailable: false` on products that appear to have inventory.

### Why Products Differ Across Channels

The same product can be purchasable in one channel and not another because:

- **Different warehouses** are assigned to each channel
- **Different shipping zones** cover different countries per channel
- **Stock levels** vary per warehouse
- **Pricing** may only be set in certain channels

## Environment Setup

### Required for Channel Selector

The channel selector requires `SALEOR_APP_TOKEN` to fetch the channels list.

```env
# .env.local (keep secret, never commit)
SALEOR_APP_TOKEN=your-app-token
```

**Security:** This token is used server-side only. Keep it in `.env.local` for development and set it as a secret environment variable in production (e.g., Vercel environment variables).

**Without this token:** The channel list cannot be fetched. Channels would need to be hardcoded in `src/config/static-pages.ts` or the selector won't appear.

### Creating the App Token

The `channels` query requires an authenticated app token. No specific permission is needed just to list channels.

1. Open **Saleor Dashboard**
2. Go to **Extensions → Add extension → "Provide details manually"**
3. Fill in:
   - Name: `Storefront` (or any name)
   - Permissions: none required for channel listing
4. Save and copy the generated token
5. Add to `.env.local` as `SALEOR_APP_TOKEN`

## Storefront Channel Allowlist

Not every Saleor channel should become a storefront route. Use an explicit allowlist in production:

```env
# Recommended — only these channels get /{channel}/... routes
STOREFRONT_CHANNELS=us,uk

# Default channel (must be in allowlist when allowlist is set)
NEXT_PUBLIC_DEFAULT_CHANNEL=us

# Optional — discover additional channels from Saleor API at build time
# Requires SALEOR_APP_TOKEN; merged with allowlist, not a replacement
STOREFRONT_DISCOVER_CHANNELS=true
```

**Resolution order** (`src/lib/channel-slugs.ts` → `getStorefrontChannelSlugs()`):

1. `STOREFRONT_CHANNELS` — comma-separated allowlist (recommended)
2. If `STOREFRONT_DISCOVER_CHANNELS=true` — slugs from `getCachedChannelsList()` (`"use cache"`; required for PPR builds)
3. Fallback — `NEXT_PUBLIC_DEFAULT_CHANNEL` only

### Where the allowlist is enforced

| Location                          | Behavior                                                |
| --------------------------------- | ------------------------------------------------------- |
| `src/app/[channel]/layout.tsx`    | `generateStaticParams` + `notFound()` for unknown slugs |
| `src/app/api/revalidate/route.ts` | Path revalidation loops over allowed channels only      |
| `src/ui/components/footer.tsx`    | Channel selector lists allowed channels                 |

See `data-caching.md` for how webhooks use `getStorefrontChannelSlugs()` during invalidation.

## Architecture

### Storefront (channel in URL)

```
src/app/[channel]/          # All routes are channel-scoped
src/app/[channel]/(main)/   # Main store pages
```

Channel is read from URL params and passed to GraphQL queries.

### Checkout (channel from checkout object)

```
src/app/checkout/           # NOT under [channel]
```

Checkout gets channel from `checkout.channel.slug` (set when cart was created).

### Channel Selector

```
src/ui/components/channel-select.tsx  # The <select> component
src/ui/components/footer.tsx          # Where it's rendered
```

Requires `SALEOR_APP_TOKEN` to fetch channel list via `ChannelsListDocument` query.

## Key Files

| File                                   | Purpose                                     |
| -------------------------------------- | ------------------------------------------- |
| `src/config/channels.ts`               | Allowlist env parsing + validation          |
| `src/lib/channel-slugs.ts`             | `getStorefrontChannelSlugs()` (React.cache) |
| `src/app/[channel]/layout.tsx`         | Route guard + `generateStaticParams`        |
| `src/ui/components/channel-select.tsx` | Channel switcher dropdown                   |
| `src/ui/components/footer.tsx`         | Renders channel selector                    |
| `src/graphql/ChannelsList.graphql`     | Query for fetching channels                 |
| `src/app/config.ts`                    | `DefaultChannelSlug` fallback               |

## Locale & routing

**Browse URLs:** `/{locale}/{channel}/…` — see `docs/adr/0001-locale-channel-url-routing.md`, `ui-locale-routing.md`, and `docs/international-storefront.md`. Legacy `/{channel}/…` redirects via middleware.

Default locale slug: `en` (`NEXT_PUBLIC_DEFAULT_LOCALE`). Configure `NEXT_PUBLIC_STOREFRONT_LOCALES` for additional languages (built-in slugs: `en`, `pl`, `de`, `fr`, `fi`, `nb` — see `src/config/locale.ts`).

## Anti-patterns

❌ **Don't expose every Saleor channel as a route** — Use `STOREFRONT_CHANNELS` allowlist in production  
❌ **Don't assume stock means purchasable** — Warehouse must be in both the channel AND a shipping zone for that channel
❌ **Don't debug availability client-side only** - Check the 7-point purchasability checklist in Saleor Dashboard first
❌ **Don't hardcode channel slugs without fallback** - Use `DefaultChannelSlug` from config

---

### 5.3 Locale & Channel URL Routing

Browse routes use **two URL prefixes**: locale (language) then channel (market). Checkout is unchanged.

> **ADR:** `docs/adr/0001-locale-channel-url-routing.md`  
> **Status:** Implemented — browse routes (`/[locale]/[channel]/…`), middleware 308 from legacy `/{channel}/…`, GraphQL `languageCode` on catalog/menus/search/CMS, region picker, per-locale cache keys. Checkout locale from cookie is a follow-up.  
> **Channels (markets):** `ui-channels.md` · **Caching:** `data-caching.md` · **SEO:** `seo-metadata.md`

---

## URL shape (target)

```
/{locale}/{channel}/{path}
```

| Segment   | Role                                                  | Examples                           |
| --------- | ----------------------------------------------------- | ---------------------------------- |
| `locale`  | Language, `html lang`, `Intl`, GraphQL `languageCode` | `en`, `pl`, `de`, `en-gb`, `en-us` |
| `channel` | Saleor channel — currency, pricing, stock, shipping   | `uk`, `us`, `pl`                   |

```
/en/uk/products/hoodie     English UI, UK market (GBP)
/en/us/products/hoodie     English UI, US market (USD)
/pl/pl/products/hoodie     Polish UI, Poland market (PLN)
```

**Checkout** (no locale/channel in path):

```
/checkout?checkout=…       channel + locale from cookies set in browse layout
```

---

## Saleor: two independent axes

| Axis     | Saleor concept                    | URL segment |
| -------- | --------------------------------- | ----------- |
| Market   | Channel                           | `{channel}` |
| Language | `LanguageCodeEnum` / translations | `{locale}`  |

Do not collapse channel into locale unless the merchant uses a fixed 1:1 market–locale map (Shopify-style) — that is a separate routing mode, not the Paper default.

When **the same language spans multiple channels** (English on `us` and `uk`), either:

- Keep channel in the path: `/en/us/…` vs `/en/uk/…`, or
- Use region in the locale slug: `/en-us/…` vs `/en-gb/…` (channel may still be present or derived from config)

Bare `/en/…` without channel is ambiguous for pricing and stock.

---

## Conventions (lock when implementing)

1. **Canonical** — always `/{locale}/{channel}/…`; 301 legacy `/{channel}/…` during migration.
2. **Locale slugs** — lowercase BCP 47; map to Saleor in `src/config/locale.ts` (`graphqlLanguageCode`, `htmlLang`, `Intl` locale).
3. **Root `/`** → `/{defaultLocale}/{defaultChannel}/`.
4. **Allowlist** — valid `(locale, channel)` pairs from config; invalid → `notFound()` or redirect.
5. **Picker behavior** — swap one segment, preserve path suffix; confirm if cart channel changes (market switch warns when cart cookie exists).
6. **Cache keys** — pass `localeSlug` into every `"use cache"` catalog/menu fetch; Next.js caches each locale separately (same TTL/speed per language).
7. **Cache tags** — catalog tags stay slug-scoped (`product:{slug}`); webhooks fan out paths via `buildPathsForAllLocales()`. Storefront content uses `storefront-content:{channel}:{locale}` (BCP 47). See `data-caching.md`.
8. **Locale×channel pairs** — optional `NEXT_PUBLIC_STOREFRONT_LOCALE_CHANNELS=en:uk,pl:pl`; when unset, any allowed locale × any allowed channel is valid. Must be `NEXT_PUBLIC_` — both the server (404 guard, hreflang) and the client picker/nav read it. See `src/config/locale-channel.ts`.

---

## Caching with locale

Browse performance is unchanged after locale routing — locale is part of the **cache key** (function arguments), not an extra runtime cost on warm pages.

| Layer              | Locale in key?      | Notes                                                       |
| ------------------ | ------------------- | ----------------------------------------------------------- |
| PDP / PLP / CMS    | ✅ `localeSlug` arg | Separate cached GraphQL payload per language                |
| Nav / footer menus | ✅ `localeSlug` arg | Tag `navigation:{channel}` clears all languages for channel |
| Storefront content | ✅ tag + arg        | `storefront-content:{channel}:{locale}`                     |
| Cart / checkout    | N/A                 | Always `cache: "no-cache"`                                  |

**GraphQL:** Map URL slugs to Saleor **base** language codes in `src/config/locale.ts` (`pl` → `PL`, not `PL_PL`). Merge `translation { … }` fields after fetch (`src/lib/saleor-translations.ts`).

**Invalidation:** Product update → `revalidateTag("product:{slug}")` → busts EN/PL/DE cached entries → `revalidatePath` for every `/{locale}/{channel}/products/{slug}`.

Full detail: `data-caching.md` § Locale & Caching.

## Implementation map (when migration starts)

| Concern         | Location (planned)                                                                        |
| --------------- | ----------------------------------------------------------------------------------------- |
| Route tree      | `src/app/(storefront)/[locale]/[channel]/…`                                               |
| Locale config   | `src/config/locale.ts` — extend `available`, maps to `LanguageCodeEnum`                   |
| Channel guard   | move/extend current `[channel]/layout.tsx`                                                |
| Links           | replace `LinkWithChannel` → locale-aware helper                                           |
| Pathname helper | `useSelectedPathname` — strip `/{locale}/{channel}`                                       |
| Middleware      | root redirect, optional `Accept-Language`, preference cookie                              |
| GraphQL         | pass `languageCode` on public queries                                                     |
| Content         | `getStorefrontContent(channel, localeSlug)` — Saleor Models plain-text translations wired |
| Picker          | header market + language UI (footer channel select retired or secondary)                  |
| SEO             | `hreflang`, canonical, sitemap per locale×channel                                         |

---

## Migration from `/{channel}/…`

| Today                              | Target                                |
| ---------------------------------- | ------------------------------------- |
| `/uk/products/foo`                 | `/en/uk/products/foo`                 |
| `LinkWithChannel` href `/products` | `/{locale}/{channel}/products`        |
| `ChannelSelect` → `/${channel}`    | swap channel segment in full pathname |
| `app/page.tsx` redirect            | `/${defaultLocale}/${defaultChannel}` |

Run **301** from old URLs for at least one release.

---

## Anti-patterns

❌ **Cookie-only locale** for browse — hurts SEO and sharing  
❌ **`?lang=pl` on channel URLs** as the primary mechanism  
❌ **Dropping channel** when multiple markets share a language  
❌ **Putting locale after channel** (`/uk/en/…`) — conflicts with this ADR  
❌ **Implementing `[locale]` routes** before ADR helpers and redirect plan exist  
❌ **Hardcoding `EN_US` / `PL_PL` in `graphqlLanguageCode`** — Dashboard translations use base codes (`EN`, `PL`); see `src/config/locale.ts`  
❌ **Omitting `localeSlug` from cached fetches** — All locales would share one cache entry and wrong language

---

## Related

- `ui-channels.md` — channel allowlist, fulfillment, channel selector (today)
- `data-storefront-content` — locale-keyed content cache
- `data-caching.md` — locale cache keys, tags, invalidation fan-out
- `ui-i18n` — next-intl namespaces and patterns
- `docs/international-storefront.md` — human overview (three string systems)

---

### 5.4 next-intl (Code-Owned UI Strings)

Functional storefront strings — buttons, labels, validation, a11y, order status — live in **`messages/{locale}.json`**, not Saleor Models.

> **ADR:** `docs/adr/0002-cms-copy-vs-code-owned-ui-strings.md`  
> **Overview:** `docs/international-storefront.md`  
> **Routing / locale segment:** `ui-locale-routing.md` (next-intl does **not** own routing)

---

## Boundary (ADR 0002)

| Bucket                       | Mechanism              | Examples                                                                     |
| ---------------------------- | ---------------------- | ---------------------------------------------------------------------------- |
| **Code** (`messages/*.json`) | next-intl              | `Add to bag`, `Subtotal`, `Sign in`, filter labels, `sr-only` remove buttons |
| **CMS** (content layer)      | `getStorefrontContent` | Homepage hero, announcement message, cart empty state, checkout steps        |
| **Saleor catalog**           | GraphQL `languageCode` | Product names, menu labels from API                                          |

Rule of thumb: _Would a merchant reword this per shop?_ → CMS. Otherwise → messages.

---

## Locales

- **Definitions:** `src/config/locale.ts` (`LOCALE_DEFINITIONS`) — slug, BCP 47, Saleor `graphqlLanguageCode`, `htmlLang`.
- **Allowlist:** `NEXT_PUBLIC_STOREFRONT_LOCALES` (must be `NEXT_PUBLIC_*` — server and client read it).
- **Files:** one JSON per slug: `messages/en.json`, `messages/pl.json`, …
- **Types:** `src/i18n/types.d.ts` augments next-intl from `en.json` (source of truth).
- **Loader:** `src/i18n/request.ts` — dynamic import by locale filename; keep aligned with `LOCALE_DEFINITIONS`.

Built-in slugs today: `en`, `pl`, `de`, `fr`, `fi`, `nb`.

---

## Namespaces

| Namespace         | Used for                                                       |
| ----------------- | -------------------------------------------------------------- |
| `cart`            | Drawer + page functional chrome                                |
| `productsListing` | PLP breadcrumbs (`breadcrumbHome`, `breadcrumbProducts`)       |
| `common`          | Shared (`pagination`)                                          |
| `pdp`             | PDP actions, variant a11y, badges                              |
| `plp`             | Filters, sort, quick add                                       |
| `search`          | Search page, bar (`search.bar`), sort, empty state             |
| `nav`             | Header, cart button, user menu, region picker, breadcrumb aria |
| `account`         | Auth, account nav, orders, settings, addresses                 |
| `checkout`        | Steps, summary, shipping/payment CTAs, errors, confirmation    |

Prefer **sub-namespaces** in JSON (`nav.userMenu`, `account.orderDetail`, `checkout.summary`) and narrow `useTranslations("nav.userMenu")` calls.

---

## Server Components

Pass URL locale explicitly — never rely on cookies for browse UI:

```typescript
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "search" });
	return { title: t("title"), description: t("description") };
}
```

List pages: call `getTranslations` **once** per page, pass pre-built label objects into child components (see `buildOrderRowLabels` in `order-row-labels.ts`) — avoid per-row `getTranslations` in a loop.

---

## Client Components

`"use client"` + `useTranslations`:

```typescript
import { useTranslations } from "next-intl";

export function AddToCart() {
	const t = useTranslations("pdp");
	return <button>{t("addToBag")}</button>;
}
```

Provider: `(storefront)/[locale]/layout.tsx` wraps browse with `<NextIntlClientProvider locale={localeSlug} messages={…}>`.

---

## ICU & rich text

- Plurals: `{count, plural, one {# item} other {# items}}` — use `few`/`many` for Polish.
- Interpolation: `{name}`, `{email}` — same token style as CMS `{freeShippingThreshold}`.
- Rich legal copy: `t.rich("signup.terms", { terms: (chunks) => <Link>…</Link> })`.

---

## Server actions + errors

Account mutations return `AccountActionResult` (`account-action-result.ts`):

- `{ success: false; errorKey: "passwordMinLength" }` → client translates via `resolveAccountActionError(t, result)`
- `{ success: false; error: string }` → pass-through Saleor/API message when present

Client-side validation should use the same `account.errors.*` keys before calling the action.

---

## Import boundaries

❌ Client components must **not** import barrels that pull `server-only` modules (e.g. search sort importing `@/lib/search` instead of `@/lib/search/sort-options`).

❌ Do not use next-intl middleware or `next-intl` navigation — ADR 0001 URL segment is authoritative.

---

## Adding strings

1. Add key to `messages/en.json` (correct namespace).
2. Mirror in all locale files (`pl`, `de`, `fr`, `fi`, `nb`, …).
3. Wire component with `getTranslations` / `useTranslations`.
4. Run `pnpm exec tsc --noEmit` — missing keys fail typecheck.

---

## Checkout

Checkout uses the **`checkout` namespace** for functional chrome (same ADR 0002 split as cart). Locale is passed from RSC (`loadMessagesForLocale` + `CheckoutIntlProvider`), not from a `[locale]` URL segment.

**Still CMS (`useCheckoutContent`):** `emptyCart`, `emptySession`, `marketingOptInLabel`, `trust.*`.

**Still to migrate:** server-action error fallbacks in `src/app/(checkout)/actions.ts`, `PaymentGatewayAlerts`, trust footer copy (CMS).

---

## Related

- `data-storefront-content.md` — CMS copy, policies, `{token}` formatting
- `ui-locale-routing.md` — `/{locale}/{channel}/`, region picker, cache keys
- `docs/international-storefront.md` — end-to-end guide

---

## 6. SEO

**Impact: MEDIUM**

Search engine optimization, structured data, and social sharing metadata help drive organic traffic and improve click-through rates.

### 6.1 SEO & Metadata

Add page metadata, JSON-LD structured data, and OG images.

> **Sources**:
>
> - [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) - Metadata API
> - [Schema.org Product](https://schema.org/Product) - JSON-LD structured data format

## Configuration

All SEO settings are in `src/lib/seo/config.ts`:

```typescript
export const seoConfig = {
	siteName: "Saleor Store",
	description: "...",
	twitterHandle: null, // Set to enable Twitter cards
	enableJsonLd: true,
	enableOpenGraph: true,
	enableTwitterCards: true,
	noIndexPaths: ["/checkout"], // Excluded from crawlers
};
```

## File Structure

```
src/lib/seo/
├── index.ts      # Public exports
├── config.ts     # Configuration
├── metadata.ts   # Page metadata helpers
└── json-ld.ts    # Structured data helpers
```

## Root Layout Metadata

```typescript
// src/app/layout.tsx
import { rootMetadata } from "@/lib/seo";
export const metadata = rootMetadata;
```

## Page Metadata

```typescript
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
	return buildPageMetadata({
		title: "Page Title",
		description: "Page description",
		image: "/og-image.jpg",
		url: "/page-path",
	});
}
```

## Product JSON-LD

```typescript
import { buildProductJsonLd } from "@/lib/seo";

const jsonLd = buildProductJsonLd({
  name: product.name,
  description: product.description,
  price: { amount: 29.99, currency: "USD" },
  inStock: true,
  images: [product.thumbnail?.url],
});

// In JSX:
{jsonLd && (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
  />
)}
```

## Dynamic OG Images

The `/api/og` route generates branded images:

```
/api/og?title=Product%20Name&price=€29.99
```

Use in metadata:

```typescript
buildPageMetadata({
	title: product.name,
	image: `/api/og?title=${encodeURIComponent(product.name)}`,
});
```

## Examples

### Complete Product Page SEO

```typescript
// src/app/[channel]/(main)/products/[slug]/page.tsx

export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.slug);

  return buildPageMetadata({
    title: product.name,
    description: product.seoDescription || product.description,
    image: product.thumbnail?.url,
    url: `/${params.channel}/products/${params.slug}`,
  });
}

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.slug);

  const jsonLd = buildProductJsonLd({
    name: product.name,
    price: product.pricing?.priceRange?.start?.gross,
    inStock: product.isAvailable,
  });

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductContent product={product} />
    </>
  );
}
```

## International URLs

Browse canonical URLs include locale and channel: `/{locale}/{channel}/…` (see `docs/adr/0001-locale-channel-url-routing.md`, `ui-locale-routing.md`).

- Use `buildBrowsePageMetadata()` for catalog/CMS pages — sets canonical + `hreflang` alternates (same channel, each configured locale).
- `generateMetadata` `pathSuffix` is the path after locale/channel, e.g. `/products/${slug}`.
- `<html lang>` is rendered server-side by the storefront root layout (`(storefront)/[locale]/layout.tsx`), derived from the URL locale segment — no client patching.

```typescript
import { buildBrowsePageMetadata } from "@/lib/seo";

return buildBrowsePageMetadata({
	title: category.name,
	description: category.seoDescription,
	locale: params.locale,
	channel: params.channel,
	pathSuffix: `/categories/${params.slug}`,
});
```

Optional `NEXT_PUBLIC_STOREFRONT_LOCALE_CHANNELS=en:uk,pl:pl` restricts valid locale×channel pairs (see `src/config/locale-channel.ts`).

## Disabling SEO

To remove SEO features entirely:

1. Delete `src/lib/seo/` folder
2. Remove `rootMetadata` import from layout
3. Remove `buildPageMetadata`/`buildProductJsonLd` from pages
4. Delete `src/app/api/og/`

## Anti-patterns

❌ **Don't hardcode metadata** - Use the helpers  
❌ **Don't skip JSON-LD on product pages** - Important for search  
❌ **Don't forget `noIndexPaths`** - Exclude checkout, cart

---

## 7. Development

**Impact: MEDIUM**

Local dev environment gotchas and Saleor API investigation when documentation is unclear.

### 7.1 Local Development & Mobile Testing

Patterns for running `pnpm dev` on a real phone (ngrok, LAN IP, tunnel) without mistaking Next.js dev restrictions for product bugs.

---

## Cross-origin dev resources (ngrok / tunnels)

### Symptom

Testing on a **real device** via ngrok (or similar) while the dev server runs on your laptop:

- Client components behave broken (carousels won't swipe, buttons feel dead, hydration oddities)
- Browser console shows Next.js blocking `/_next/*` (HMR, chunks, dev middleware)
- **Chrome DevTools responsive mode on localhost still works** — the page origin matches the dev server

This is **not** a production bug and often **not** a component/touch bug. The HTML loads from the tunnel host, but dev assets are rejected when the browser treats the request as cross-origin.

### Fix

Allow the tunnel hostname in `allowedDevOrigins` and **restart** `pnpm dev`.

Paper reads hostnames from `.env.local`:

```env
# Hostname only — no https://, comma-separated for multiple tunnels
ALLOWED_DEV_ORIGINS=servilely-quare-polly.ngrok-free.dev
```

`next.config.js` maps that to Next.js:

```javascript
allowedDevOrigins: ["servilely-quare-polly.ngrok-free.dev"];
```

After changing `ALLOWED_DEV_ORIGINS` or `next.config.js`, restart the dev server.

### LAN testing (`--hostname 0.0.0.0`)

Same rule applies when you open `http://192.168.x.x:3000` from your phone. Add the IP (or a stable local hostname) to `ALLOWED_DEV_ORIGINS` if dev chunks are blocked.

### When to use production build instead

For final QA of touch/gesture behavior without dev middleware:

```bash
pnpm build && pnpm start
```

Tunnel or LAN to the production server — no `allowedDevOrigins` needed.

---

## Chrome on iOS: `__gcruniqueid` hydration warnings

### Symptom

After ngrok/LAN dev works, the console shows a hydration mismatch on `<form>` / `<input>` (often `SearchBar` in the header):

```diff
  <form ...>
-   __gcruniqueid="1"
  <input ...>
-   __gcruniqueid="2"
```

Paper does **not** render these attributes — grep the repo finds nothing.

### Cause

**Chrome (and Chromium-based Edge) on iOS** inject `__gcruniqueid` / `__gchrome_uniqueid` on form fields for autofill **after** the server HTML is sent but **before** React hydrates. React then warns because client DOM ≠ server HTML.

This is a [known Chromium + React limitation](https://github.com/vercel/next.js/issues/77710). Safari on iOS typically does not inject these attributes.

### What to do

| Goal                | Action                                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| Confirm it's benign | Reproduce in **Safari** on the same phone — warning usually disappears                                     |
| Ignore in dev       | Safe — **no user-visible breakage** in production per Next.js/React guidance                               |
| Quieter dev console | Avoid Chrome on iOS for day-to-day mobile QA; use Safari                                                   |
| Last resort         | `suppressHydrationWarning` on affected inputs — silences real mismatches too; not recommended project-wide |

Do **not** refactor `SearchBar` or disable SSR on the header to silence this.

---

## Debugging checklist (mobile-only issues)

1. **Console on the phone** — Safari Web Inspector (Mac) or Eruda; look for Next.js "Cross-origin access to Next.js dev resources" first.
2. **`ALLOWED_DEV_ORIGINS`** — tunnel hostname listed? Dev server restarted?
3. **Origin mismatch** — ngrok URL in the address bar must match the hostname in `ALLOWED_DEV_ORIGINS` (subdomain changes when ngrok restarts free tunnels).
4. **Component layer** — only after dev origins are clean; e.g. Embla carousels need `touch-pan-y` on the viewport for real iOS touch (see `src/ui/components/ui/carousel.tsx`).
5. **Hydration on `__gcruniqueid`** — Chrome on iOS autofill injection; not a storefront bug (see above).

---

## Anti-patterns

❌ **Don't debug carousel swipe on ngrok** before fixing `allowedDevOrigins` — client JS may not load  
❌ **Don't commit personal ngrok hostnames** — use `ALLOWED_DEV_ORIGINS` in `.env.local`  
❌ **Don't assume Chrome device toolbar = real phone** — it uses localhost + mouse events, not tunnel + touch

---

### 7.2 Saleor API Investigation

Investigate Saleor API behavior by checking source code when documentation is unclear or you need to understand exact data models.

## Step 1: Check the Generated Types (Schema)

The fastest way to confirm any type, field, enum, or input is the generated types file in this repo:

```bash
# src/gql/graphql.ts — full schema generated from your running Saleor instance
grep -A 20 "^export type Product " src/gql/graphql.ts
grep -A 10 "^export enum StockAvailability" src/gql/graphql.ts
grep -A 30 "^export type ProductFilterInput" src/gql/graphql.ts
```

This file contains the **full Saleor schema** as TypeScript types (all types, enums, inputs -- not just the ones used in declared queries). Generated by `pnpm generate` via API introspection, so it always matches your exact Saleor version.

If the types confirm what you need, stop here.

## Step 2: Check Saleor Source for Behavior

Types tell you _what_ fields exist. For _how_ they behave (permission checks, filtering logic, side effects), check the Saleor core source:

- [Saleor API Reference](https://docs.saleor.io/api-reference) - Online docs
- [Saleor Developer Docs](https://docs.saleor.io/developer) - Guides and concepts

If the Saleor core repo is available locally (e.g. `../saleor/`), or clone it:

```bash
cd /tmp && git clone --depth 1 https://github.com/saleor/saleor.git saleor-core
```

For directory structure and grep patterns, see [saleor-key-directories.md](../references/saleor-key-directories.md).

| Path                       | Purpose                     |
| -------------------------- | --------------------------- |
| `saleor/graphql/product/`  | Resolvers, permission logic |
| `saleor/product/models.py` | Django models               |

## Examples

### Example: Does `product.attributes` filter by `visibleInStorefront`?

**Investigation** in `saleor/graphql/product/resolvers.py`:

```python
def resolve_product_attributes(root, info, *, limit):
    if requestor_has_access_to_all_attributes(info.context):
        dataloader = AttributesByProductIdAndLimitLoader        # Admin: ALL
    else:
        dataloader = AttributesVisibleToCustomerByProductIdAndLimitLoader  # Customer: FILTERED
```

**Conclusion**: Yes, storefront users only see `visibleInStorefront=True` attributes. No client-side filtering needed.

### Example: Token-Based Data Filtering

Saleor filters data based on authentication:

| Token                      | `product.attributes` returns    |
| -------------------------- | ------------------------------- |
| None (anonymous)           | Only `visibleInStorefront=True` |
| Customer JWT               | Only `visibleInStorefront=True` |
| App with `MANAGE_PRODUCTS` | ALL attributes                  |

This applies to many "visible in storefront" flags across Saleor.

## Key Insights

### Storefront Auto-Filtering

When building storefront features, you typically don't need to:

- Fetch `visibleInStorefront` field
- Filter data client-side

The API already returns only what's meant to be shown based on your token.

### Product Types Control Variant Attributes

Which attributes appear on variants is configured at the **ProductType** level:

Dashboard → Configuration → Product Types → [Type] → Variant Attributes

If an attribute doesn't appear in `variant.attributes`, check the ProductType configuration.

## Anti-patterns

❌ **Don't guess API behavior** - Check the source  
❌ **Don't filter `visibleInStorefront` client-side** - API does it  
❌ **Don't assume attribute presence** - Check ProductType config

---

### 7.3 Third-Party Widget Embeds

How to add external marketing widgets (reviews, ratings, social proof loaders) without breaking Paper's Server Component / PPR architecture or performance budget.

> Read together with [`page-composition`](page-composition.md) (where embeds live on PDP), [`product-pdp`](product-pdp.md) (shell vs islands), [`design-verification`](design-verification.md) (gates).

---

## When to use

- Reviews/ratings providers (Yotpo, Judge.me, etc.)
- Social proof or UGC widgets loaded from a vendor script
- Any `next/script` third-party loader on browse surfaces

For **static** social proof without a live vendor API, prefer [`ui-sections`](ui-sections.md) (`TestimonialSection`) with content-layer copy.

---

## Architecture

```
ProductShell (Server — cached, no scripts)
├── static sections (h1, breadcrumbs, …)
├── YotpoStarSummary (client leaf — optional, near title)
└── …
└── Suspense islands (gallery, buy box)

Below buy box / accordion (still in shell, static placement):
└── YotpoReviewsWidget (client leaf — loads script + widget div)
```

| Layer               | Rule                                                                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Script loader**   | `"use client"` leaf component only — never in `ProductShell` as inline `<script>`                                                       |
| **Env keys**        | `NEXT_PUBLIC_*` for app/widget keys; never commit real keys; document in `.env.example`                                                 |
| **Load strategy**   | `next/script` with `strategy="lazyOnload"` (below-the-fold widgets) or `afterInteractive` when above-the-fold summary needs early paint |
| **Product mapping** | Pass Saleor `product.id` or a stable external SKU the vendor expects — confirm with the developer                                       |
| **PPR**             | Embed components are static nodes in the shell; they must not read `searchParams` or `cookies()`                                        |

---

## Yotpo pattern (reference)

```tsx
"use client";

import Script from "next/script";

const APP_KEY = process.env.NEXT_PUBLIC_YOTPO_APP_KEY;

export function YotpoReviewsWidget({
	productId,
	productName,
	productUrl,
	productImageUrl,
}: {
	productId: string;
	productName: string;
	productUrl: string;
	productImageUrl?: string | null;
}) {
	if (!APP_KEY) return null;

	return (
		<>
			<Script src={`https://staticw2.yotpo.com/${APP_KEY}/widget.js`} strategy="lazyOnload" />
			<div
				className="yotpo yotpo-main-widget"
				data-product-id={productId}
				data-name={productName}
				data-url={productUrl}
				data-image-url={productImageUrl ?? undefined}
			/>
		</>
	);
}
```

Star summary near the title: separate small client component or the vendor's star-rating widget div — same `APP_KEY`, anchor link down to the full widget.

**Agent checklist before implementing:**

1. Ask for `NEXT_PUBLIC_YOTPO_APP_KEY` and which widget (Reviews vs Star Ratings).
2. Confirm product-id mapping (Saleor global id vs external SKU).
3. Add placeholder to `.env.example`; developer adds real key to `.env.local` (do not echo the key in chat logs).
4. Compose in `ProductShell` below the buy box or accordion — not inside `VariantSectionDynamic`.

---

## Anti-patterns

❌ **Inline `<script>` tags in Server Components** — use `next/script` in a client leaf  
❌ **Blocking `beforeInteractive` scripts** for below-the-fold reviews — hurts LCP  
❌ **Hardcoding API keys** in components — env vars only  
❌ **Putting embeds inside Suspense islands** that read `searchParams` — keep placement in the static shell  
❌ **Skipping the developer question** on keys and product-id mapping — vendor widgets fail silently without them

---

---

## Project-Specific Gotchas

### React Anti-patterns Seen in This Codebase

**State-to-state sync in effects:**

```tsx
// BAD - derived state in effect
useEffect(() => {
	setDerivedValue(computeFrom(sourceValue));
}, [sourceValue]);

// GOOD - compute inline or in the handler
const derivedValue = computeFrom(sourceValue);
```

**Child updating parent state via effect:**

```tsx
// BAD - child uses effect to update parent
useEffect(() => {
	onLayoutChange(true); // parent setState
}, []);

// GOOD - parent derives state from what it knows, or callback on user action
```

These patterns cause extra renders and make data flow hard to trace.

---

## References

1. [Saleor API Reference](https://docs.saleor.io/api-reference)
2. [Next.js Documentation](https://nextjs.org/docs)
3. [React Documentation](https://react.dev)
4. [Agent Skills Specification](https://agentskills.io)
