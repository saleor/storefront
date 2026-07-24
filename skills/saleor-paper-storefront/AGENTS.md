# Saleor Paper Storefront

**Version 1.8.0**  
Saleor Paper  
June 2026

> ⚠️ **Generated artifact — do not load this file in an agent session.** It concatenates
> all 30 rules (~75k tokens) and exists only for humans reading offline and for
> single-file skill export. **Agents:** read `SKILL.md`, then the **one** `rules/<task>.md`
> whose frontmatter `description` matches the task. Never read this compiled file to "get oriented".
>
> **Source of truth:** Individual rule files in `rules/` are updated first. Regenerate this file with:
> `node skills/saleor-paper-storefront/scripts/compile-agents.mjs`

---

## Abstract

Comprehensive guide for AI agents and LLMs maintaining the Saleor Paper storefront — a Next.js 16 e-commerce application with TypeScript, Tailwind CSS, and the Saleor GraphQL API. Covers 30 rules across 8 categories: architecture (canonical Next.js), data layer (caching, auth, GraphQL), product pages (PDP, variants, high-cardinality, filtering), checkout flow (surfaces, management, payments, components), design & composition (token system, design quality, section catalog, page composition, design-from-image, verification), UI & i18n, SEO, and development practices. Each rule includes architecture diagrams, code examples, file locations, and anti-patterns.

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
   - 2.3 [High-Cardinality Attributes](#23-high-cardinality-attributes)
   - 2.4 [Product Filtering](#24-product-filtering)

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

| Pillar              | Decision                                                             | Detail                                                                                                                                                                                                                          |
| ------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Two surfaces**    | One repo, storefront + checkout                                      | Route groups, import boundaries, session handoff → [`paper-surfaces.md`](paper-surfaces.md)                                                                                                                                     |
| **Freshness split** | Cached browse, live commerce                                         | PDP/PLP cached per locale; cart/checkout/auth always fresh → [`data-caching.md`](data-caching.md)                                                                                                                               |
| **Page boundaries** | Static page renders cached shell directly; hybrid wraps only islands | Never await `searchParams` in cached shells → [`data-caching.md`](data-caching.md)                                                                                                                                              |
| **Layout shells**   | Sync layout → per-chrome Suspense islands (browse)                   | `(main)/layout.tsx` + `browse-chrome-slots.tsx` — [`data-caching.md`](data-caching.md) (page-boundary model); account uses layout-shell gate for auth                                                                           |
| **Auth**            | BFF + PPR-safe account routes                                        | No `cookies()` in async pages without Suspense → [`data-auth-routes.md`](data-auth-routes.md)                                                                                                                                   |
| **GraphQL**         | Codegen + server helpers                                             | Two codegen trees; regenerate after `.graphql` edits → [`data-graphql.md`](data-graphql.md)                                                                                                                                     |
| **URLs**            | `/{locale}/{channel}/…` browse; `/checkout` transactional            | Orthogonal locale + channel → [`ui-locale-routing.md`](ui-locale-routing.md), [ADR 0001](../../../docs/adr/0001-locale-channel-url-routing.md)                                                                                  |
| **Copy & i18n**     | Three string systems                                                 | Saleor catalog + CMS content + next-intl → [`ui-i18n.md`](ui-i18n.md), [ADR 0002](../../../docs/adr/0002-cms-copy-vs-code-owned-ui-strings.md), [`docs/international-storefront.md`](../../../docs/international-storefront.md) |
| **Channels**        | Explicit storefront allowlist                                        | Not every Saleor channel is a route → [`ui-channels.md`](ui-channels.md)                                                                                                                                                        |

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

| Avoid                                                | Use instead                                          |
| ---------------------------------------------------- | ---------------------------------------------------- |
| Client-side Saleor GraphQL (urql, Apollo in browser) | Server helpers + Server Actions                      |
| Browser Saleor SDK for login                         | BFF `/api/auth/*`                                    |
| `cache: "no-cache"` on catalog display data          | `"use cache"` + `cache-manifest.ts` + webhooks       |
| `searchParams` / `cookies()` inside `"use cache"`    | Dynamic islands in nested `Suspense`                 |
| Page-level skeleton on a non-dynamic route           | Render the cached shell directly; no page `Suspense` |
| `Suspense fallback={null}` on `<main>`               | Route `loading.tsx` + section skeletons              |
| `router.replace` for checkout step-only changes      | `updateCheckoutQuery()` (shallow history)            |
| Storefront importing `@/checkout/*`                  | `@paper/session-bridge` for cross-surface URLs only  |
| Raw `cacheLife` / hand-rolled `cacheTag` strings     | `applyCacheProfile` from `cache-manifest.ts`         |

---

## Known divergences (accepted, deferred)

Real exceptions to the rules above — documented so the code and the convention stay reconciled. Align when you next touch these files; do not treat as new precedent.

_All browse pages aligned._ The homepage (`(main)/page.tsx`) is **fully static** — an `async` page that awaits only `params` + `"use cache"` data and renders every section (incl. the featured collection) directly into the PPR static shell, with **no page-level `Suspense` and no skeleton**. The **category** (`categories/[slug]/page.tsx`) and **products** (`products/page.tsx`) pages are **hybrid** — `async` pages that render the cached hero eagerly into the static shell and suspend **only** the `searchParams`-driven grid behind `ProductsGridSkeleton`. No browse page wraps its cached shell in a page-level `Suspense`. Route `loading.tsx` files (`PlpPageLoading` for categories/collections, `ProductsLoading` for products) remain as height-matched **instant-navigation** fallbacks — the documented "meaningful partial frame" use, not page-render skeletons. There is intentionally **no shared `(main)/loading.tsx`**. Add a row here only when a new, intentional exception is introduced.

---

## Browse layout (canonical chrome islands)

Browse chrome follows the **sync layout + per-slot Suspense** pattern — the layout never `await`s; each chrome region owns its async work in a dedicated island. `<main>{children}</main>` sits **outside** every chrome Suspense boundary so page content streams independently.

1. **Sync `(main)/layout.tsx`** — `StorefrontProviders`, sync `MainChrome`, `CartDrawerSlot` in Suspense.
2. **Sync `MainChrome`** — composes announcement, header, footer slots; `{children}` in `<main>` with no wrapping Suspense.
3. **Async slots** (`browse-chrome-slots.tsx`) — each `await params` + `"use cache"` fetch inside its own parent Suspense:
   - `AnnouncementBarSlot` → `getAnnouncementBarProps` (+ nested Suspense for dismiss cookie)
   - `HeaderSlot` → `Header` (fetches `getStorefrontContent` for nav labels + menus)
   - `FooterSlot` → `Footer` (already fetches content + menus)
   - `CartDrawerSlot` → `getStorefrontContent` + `CartDrawerWrapper` (cookies)

`getStorefrontContent` / `getAnnouncementBarProps` dedupe per request via `"use cache"` — multiple slots do not multiply Saleor traffic.

```
Sync (main)/layout.tsx
├── MainChrome (sync)
│   ├── Suspense → AnnouncementBarSlot
│   ├── Suspense → HeaderSlot
│   ├── <main>{children}</main>     ← never inside layout/chrome Suspense
│   └── Suspense → FooterSlot
└── Suspense → CartDrawerSlot
```

**Account layout** uses layout-shell Suspense when the whole segment must await an auth gate before children (`data-auth-routes.md`). That is the auth variant, not the browse default.

---

## Where to read next

| If you are…                        | Start with                                                                                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| New to the codebase                | This file, then [`paper-surfaces.md`](paper-surfaces.md)                                                                                       |
| Naming files / exports / imports   | [`references/code-conventions.md`](../references/code-conventions.md)                                                                          |
| Touching PDP / variants            | [`product-pdp.md`](product-pdp.md), [`product-variants.md`](product-variants.md), [`product-high-cardinality.md`](product-high-cardinality.md) |
| Touching PLP filters / facets      | [`product-filtering.md`](product-filtering.md), [`product-high-cardinality.md`](product-high-cardinality.md)                                   |
| Touching caching / PPR / webhooks  | [`data-caching.md`](data-caching.md)                                                                                                           |
| Touching checkout or payments      | [`paper-surfaces.md`](paper-surfaces.md) → [`checkout-management.md`](checkout-management.md)                                                  |
| Touching auth / account            | [`data-auth-routes.md`](data-auth-routes.md)                                                                                                   |
| Touching locale or market URLs     | [ADR 0001](../../../docs/adr/0001-locale-channel-url-routing.md), [`ui-locale-routing.md`](ui-locale-routing.md)                               |
| Touching UI strings / translations | [`ui-i18n.md`](ui-i18n.md), [`docs/international-storefront.md`](../../../docs/international-storefront.md)                                    |
| Upgrading a fork                   | [`migrations/SKILL.md`](../migrations/SKILL.md)                                                                                                |

Formal architecture decisions beyond day-to-day conventions: [`docs/adr/`](../../../docs/adr/).

---

## Anti-patterns

❌ **Don't add a client data-fetching layer** when Server Components or Server Actions suffice  
❌ **Don't bypass the cache manifest** for catalog tags/TTLs  
❌ **Don't fix PPR build errors by wrapping only `<main>{children}</main>` in Suspense** — add a layout/page shell that owns the async fetch, with a real skeleton (see § Layout shell Suspense)  
❌ **Don't duplicate architecture essays in feature PRs** — extend this file or an ADR if the decision is cross-cutting

---

## 1. Data Layer

**Impact: CRITICAL**

The data layer controls caching, GraphQL type generation, and API communication. Getting this wrong causes stale content, type errors, or permission failures.

### 1.1 Caching Strategy

This rule holds **Paper's caching decisions** — what we cache, the contracts that keep it consistent, and how we invalidate. It is **not** a Next.js tutorial.

> **Next.js mechanics live in bundled docs — read them, don't restate them.**
>
> - `use cache`, `cacheLife`, `cacheTag`, PPR: `node_modules/next/dist/docs/` (version-matched).
> - PPR build/prerender errors (the “uncached data outside Suspense” family) come with an actionable **Stream / Cache / Block** fix menu in the dev overlay, terminal, and `next build`. The canonical fixes are at `nextjs.org/docs/messages/blocking-prerender-dynamic`.
>
> When the framework already explains a mechanic or emits a fix, link it — don't duplicate it here.

---

## The one decision: cached browse, live commerce

> **Display pages are cached for performance. Transactional flows are always real-time.**

| Surface                                | Data source                                                         | Freshness                              |
| -------------------------------------- | ------------------------------------------------------------------- | -------------------------------------- |
| PDP / category / collection / homepage | `getProductData()`, `getCategoryData()`, `getFeaturedProducts()`, … | Cached (~5 min)                        |
| Navigation / footer menus              | `getNavbarMenuItems()` / `getFooterMenuItems()`                     | Cached (~1 hr)                         |
| Cart drawer, checkout, add-to-cart     | `Checkout.find()`, server actions, Saleor mutations                 | **Always fresh** (`cache: "no-cache"`) |

**Why a stale PDP price is safe:** Saleor is the source of truth. Cart fetches fresh (`cache: "no-cache"`), `checkoutLinesAdd`/`checkoutComplete` recalculate server-side, and webhooks bust the cache on change. A shopper may see a stale price on the PDP but **cannot check out at it**.

Paper runs Next.js 16 with [`cacheComponents: true`](../../../next.config.js) (stable — not the Next 15 `experimental.ppr`/`dynamicIO` flags). **Nothing is cached by default**; catalog speed is opt-in via `"use cache"` at the data boundary (`src/lib/catalog/`, `src/lib/menus/`, `src/lib/channels/`, `src/lib/content/`). Paper does **not** use `"use cache: private"` — locale/channel are passed as function args instead.

---

## Cache manifest — single source of truth

All TTLs and tags are defined in **`src/lib/cache-manifest.ts`**. Cached functions read it via `applyCacheProfile()`; `/api/cache-info` serves it to the saleor-paper-app. Change a TTL or tag pattern in **one** place and both behavior and the Dashboard view update.

```typescript
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";

async function getProductData(slug: string, channel: string, localeSlug: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.products, slug); // sets cacheLife tier + cacheTag

	return executePublicGraphQL(ProductDetailsDocument, {
		variables: { slug, channel, ...graphqlLanguageCodeVariables(localeSlug) },
	});
}
```

Always use `applyCacheProfile(CACHE_PROFILES.*, slugOrChannel)` — **never** raw `cacheLife("minutes")` or hand-rolled `cacheTag` strings that drift from the manifest. Do **not** add fetch-level `revalidate` inside `"use cache"` — `cacheLife` + webhooks own freshness.

### Tag registry

| Tag pattern                             | Profile              | Used by                                        | Invalidated when            |
| --------------------------------------- | -------------------- | ---------------------------------------------- | --------------------------- |
| `product:{slug}`                        | `products`           | `getProductData()`                             | Product updated             |
| `category:{slug}`                       | `categories`         | `getCategoryData()`                            | Category updated            |
| `collection:{slug}`                     | `collections`        | `getCollectionData()`, `getFeaturedProducts()` | Collection updated          |
| `page:{slug}`                           | `pages`              | `getPageData()` (CMS)                          | Page updated                |
| `navigation:{channel}`                  | `navigation`         | `getNavbarMenuItems()`                         | Navbar changed              |
| `footer-menu:{channel}`                 | `footerMenu`         | `getFooterMenuItems()`                         | Footer changed              |
| `storefront-content:{channel}:{locale}` | `storefront-content` | `getStorefrontContent()`                       | `storefront-*` Page updated |
| `channels`                              | `channels`           | `getCachedChannelsList()`                      | Channel list changed        |

Named `cacheLife` tiers (configured in `next.config.js`): `catalog` ~5 min (products/categories/collections/CMS pages), `menus` ~1 hr (nav/footer) and ~5 min (storefront-content), `channels` longer.

`GET /api/cache-info` returns the machine-readable manifest (Bearer `REVALIDATE_SECRET`, timing-safe) so the saleor-paper-app can build its invalidation UI dynamically.

---

## The page-boundary model (Paper convention)

The PPR layer stack — pick the page shape by **whether the route reads runtime data** (`searchParams`/`cookies`/uncached fetch): a **static page** (no runtime data) is an `async` page that awaits `params` + `"use cache"` data and renders the shell **directly** (no page-level `Suspense`, no skeleton — e.g. homepage); a **hybrid page** renders the cached shell **eagerly** and wraps **only** the dynamic island (`searchParams`/cookies) in `Suspense` (e.g. PLP grid, PDP variant section). A skeleton is a **per-hole** affordance, never a **per-page** default. It is documented once in [`paper-architecture.md`](paper-architecture.md) and [`page-composition.md`](page-composition.md); PDP specifics are in [`product-pdp.md`](product-pdp.md); auth routes in [`data-auth-routes.md`](data-auth-routes.md). The essentials here:

- **Catalog fetches live in modules**, not inline in pages long-term: `src/lib/catalog/`, `src/lib/menus/get-menu-data.ts`, `src/lib/channels/`.
- **`executePublicGraphQL`** is safe inside `"use cache"`; **`executeAuthenticatedGraphQL`** is **not** (needs cookies) — keep it out of cached functions.
- **Don't re-export server cached helpers from client-mixed barrels** (import catalog/menu modules directly; e.g. `ProductGalleryLcp` directly, not via a mixed `pdp/index.ts`).
- **CSS `order`** lets dynamic content appear above static `<h1>` while keeping the `h1` in the cached shell for SEO (PDP uses `order-1..4`).

### Browse chrome boundaries

The `(main)` layout is **sync**; each chrome region is an async **slot** in its own Suspense boundary. `<main>{children}</main>` is **never** wrapped in layout or chrome Suspense.

| Slot         | File                                              | Awaits                                                                     |
| ------------ | ------------------------------------------------- | -------------------------------------------------------------------------- |
| Announcement | `browse-chrome-slots.tsx` → `AnnouncementBarSlot` | `params`, `getAnnouncementBarProps` (+ nested Suspense for dismiss cookie) |
| Header       | `HeaderSlot` → `Header`                           | `params`, menus + `getStorefrontContent`                                   |
| Footer       | `FooterSlot` → `Footer`                           | `params`, menus + `getStorefrontContent`                                   |
| Cart drawer  | `CartDrawerSlot`                                  | `params`, `getStorefrontContent`, checkout cookies                         |

Account routes use the **auth-gate** variant (sync layout → Suspense → async `AccountShell`, children inside the shell) — see `data-auth-routes.md`. Key files: `(main)/layout.tsx`, `main-chrome.tsx`, `browse-chrome-slots.tsx`.

### PPR pitfalls → let the framework guide the fix

When you hit an “uncached data accessed outside `<Suspense>`” error, the overlay/terminal gives you **Stream / Cache / Block** with per-rule docs. Paper's defaults for that choice:

| Situation                                                                   | Paper choice                                                                     |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Catalog display data (product, category, menus)                             | **Cache** — `"use cache"` + `applyCacheProfile`                                  |
| `searchParams`/cookies UI (variant gallery, cart badge, user menu)          | **Stream** — nested `<Suspense>` island                                          |
| Awaiting `searchParams`/`cookies()` in a page shell or inside `"use cache"` | Don't — it collapses the route into a dynamic hole; move the read into an island |

Never silence a PPR error by wrapping only `<main>{children}</main>` in Suspense (especially `fallback={null}`) — fix the segment that owns the dynamic work.

---

## Locale & caching

Browse routes are `/{locale}/{channel}/…` (see `ui-locale-routing.md`). Locale affects **what** is cached, not **how fast** repeat visits are.

| Mechanism                                  | Includes locale? | Role                                                                  |
| ------------------------------------------ | ---------------- | --------------------------------------------------------------------- |
| `"use cache"` function args (`localeSlug`) | ✅               | Separate cache entry per language — `/pl/…` and `/en/…` never collide |
| `cacheTag` (catalog)                       | ❌               | One tag per slug/channel; one webhook busts all locale variants       |
| `storefront-content:{channel}:{locale}`    | ✅ (BCP 47)      | Marketing copy from Saleor Models                                     |

```typescript
getProductData("hoodie", "default-channel", "en"); // English entry
getProductData("hoodie", "default-channel", "pl"); // Polish entry
applyCacheProfile(CACHE_PROFILES.products, slug); // single tag product:hoodie clears both
```

- Cached fetches pass `graphqlLanguageCodeVariables(localeSlug)`; map URL slugs to Saleor **base** codes in `src/config/locale.ts` (`pl` → `PL`, not `PL_PL`). Merge translations with `withTranslatedProductFields()` (`src/lib/saleor-translations.ts`) after the fetch.
- **Invalidation fan-out:** catalog tags stay slug-scoped; `buildPathsForAllLocales()` revalidates every configured locale path on a generic `PRODUCT_UPDATED`.
- Adding locales adds ~N cache entries (one per locale × page), not per-request work. Each locale warms independently after deploy.

---

## Invalidation

**Production path: [saleor-paper-app](https://github.com/saleor/saleor-paper-app).** On install it registers managed webhooks and proxies them to the storefront:

```
Saleor event → saleor-paper-app → POST /api/revalidate → revalidateTag + revalidatePath
```

| Event family                              | Storefront effect                                                                      |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| `PRODUCT_*`, `CATEGORY_*`, `COLLECTION_*` | Catalog tags + paths (all locales via `buildPathsForAllLocales`)                       |
| `PAGE_*`                                  | `page:{slug}`, and `storefront-content:{channel}:{locale}` when slug is `storefront-*` |
| `MENU_*`, `MENU_ITEM_*`                   | `navigation:{channel}`, `footer-menu:{channel}`                                        |

`revalidateTag` takes the manifest profile (`resolveRevalidateCacheLifeProfile("products")`); paths use `getStorefrontChannelSlugs()` × `buildPathsForAllLocales()`. **Don't** point Saleor webhooks directly at `/api/revalidate` while the app is installed (duplicate deliveries, no logging). Direct webhooks remain valid for self-hosted setups without the app (set `SALEOR_WEBHOOK_SECRET`).

**Manual / emergency** (Bearer header, timing-safe; `?secret=` is deprecated):

```bash
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=product:blue-hoodie&path=/en/default-channel/products/blue-hoodie"
```

Without webhooks, TTL takes over (catalog ~5 min, menus ~1 hr).

### Debugging stale content

1. Webhook configured + firing? (Dashboard → Webhooks → Deliveries; server logs for `[Revalidate]`).
2. Tag exact? (`product:blue-hoodie` — slug must match).
3. Force: `curl … "?tag=product:my-product"`.
4. Translation still wrong language on `/pl/…`? Confirm a `PL` base translation exists; bust the tag; restart dev if you changed `src/config/locale.ts`.

---

## Anti-patterns

❌ `cache: "no-cache"` on display pages — destroys performance
❌ Skipping webhook setup in production — users see stale prices
❌ `executeAuthenticatedGraphQL` (or `cookies()`/`searchParams`) inside `"use cache"` — needs runtime data
❌ Awaiting `searchParams` in a shell — collapses the route into a dynamic hole (move to an island)
❌ Raw `cacheLife("minutes")` / hand-rolled `cacheTag` — use `applyCacheProfile(CACHE_PROFILES.*)`
❌ Fetch-level `revalidate` inside `"use cache"` — `cacheLife` + webhooks own freshness
❌ Wrapping only `<main>` in Suspense to silence a PPR error — fix the segment that owns the work
❌ Omitting `localeSlug` from cached fetches — all locales share one entry, wrong language
❌ Regional Saleor codes (`PL_PL`) in `graphqlLanguageCode` — Dashboard uses base codes (`PL`)
❌ Re-exporting server cached helpers from client-mixed barrels

---

## Key files

| File                                                                                              | Purpose                                               |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `src/lib/cache-manifest.ts`                                                                       | Cache profiles — **single source of truth**           |
| `src/app/api/revalidate/route.ts`                                                                 | Webhook endpoint + manual revalidation                |
| `src/app/api/cache-info/route.ts`                                                                 | Manifest introspection for the Dashboard app          |
| `src/lib/catalog/*.ts`, `src/lib/menus/get-menu-data.ts`, `src/lib/channels/get-channels-data.ts` | `"use cache"` data boundaries                         |
| `src/lib/graphql-locale.ts`, `src/lib/saleor-translations.ts`, `src/config/locale.ts`             | Locale → GraphQL `languageCode` + translation merge   |
| `src/lib/channel-slugs.ts`                                                                        | Storefront channel allowlist for invalidation fan-out |

**Rolling back to plain ISR** (rarely needed): set `cacheComponents: false`, remove `"use cache"` + `applyCacheProfile` from the data modules above, and drop the profile argument from `revalidateTag` calls. Suspense boundaries, CSS-order layout, and the public/authenticated GraphQL split stay useful regardless.

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

**CRITICAL** when `cacheComponents: true` and routes read session cookies. Reference implementation: `src/app/[channel]/(main)/account/`. The PPR boundary model and the generic "uncached data outside `<Suspense>`" fix menu live in [`data-caching.md`](data-caching.md); this rule covers what's auth-specific.

> **Fork upgrades:** apply migration `2026-06-account-ppr-auth` in [`../migrations/manifest.json`](../migrations/manifest.json) when catching up from pre–June 2026 Paper.

Anything that calls `cookies()`, `headers()`, or authenticated GraphQL is **dynamic**. In an async **page** without a Suspense boundary it fails the build (`Uncached data was accessed outside of <Suspense>`). Fix at the **route segment that owns the dynamic work** — never by wrapping `<main>{children}</main>` (hides the issue and blocks route `loading.tsx`).

## BFF auth (session lifecycle)

Login, logout, and password reset go through **Next.js API routes**, not the browser Saleor SDK. Tokens are **HttpOnly** cookies set server-side via `getServerAuthClient()`.

| Route                                            | Purpose                                     |
| ------------------------------------------------ | ------------------------------------------- |
| `POST /api/auth/login`                           | `tokenCreate` → Set-Cookie                  |
| `POST /api/auth/register`                        | Account registration                        |
| `POST /api/auth/reset-password` / `set-password` | Request reset email / reset token → session |
| `logout()` server action                         | Clear cookies + detach checkout             |

Client forms call `loginWithBff()` / `setPasswordWithBff()` (`src/lib/auth/bff-client.ts`). Commerce (cart, checkout lines) stays on **server actions** — do not proxy all GraphQL. The header user menu (`UserMenuServer`) calls `getHeaderUser()` inside Suspense — same server session as account pages, no client `me` fetch.

## Keeping header chrome fresh (Router Cache)

HttpOnly cookies are the source of truth, but the **client Router Cache** can reuse a stale RSC payload for the header after a session change. Paper uses explicit triggers — never client-side retry loops:

| Trigger                       | When                                 | Mechanism                                                                             |
| ----------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------- |
| Initial load / hard refresh   | Land with an existing session        | `HeaderAuthRefresh` → `revalidateStorefrontChrome` + `router.refresh()` once on mount |
| Cross-tab                     | Return after login/logout elsewhere  | `visibilitychange` → `revalidateStorefrontChromeAction` + `router.refresh()`          |
| Cross-surface / auth boundary | Login, logout, checkout → storefront | `revalidateStorefrontChrome` + **hard navigation**                                    |

**Do NOT `router.refresh()` on in-store soft navigation.** The header lives in the shared layout (preserved across sibling navigations), and every session/cart mutation already busts chrome via `revalidateStorefrontChrome` (add-to-cart, cart line edits, login/logout, checkout). A per-pathname refresh forces a server round-trip on every soft nav and defeats instant navigation to prerendered shells — most visibly returning to the homepage, which has no loading skeleton to mask the wait. The one-time initial-mount sync covers the PPR-anonymous-shell case; cross-tab and auth boundaries are covered by their own triggers above.

**Hard navigation is required** when leaving `/checkout` or after login/logout — soft `router.push`/`<Link>` can restore a cached anonymous `UserMenuServer`. Use `syncAuthSurfacesAfterSignIn({ redirectTo })`, `useLogout({ channel })`, `navigateToStorefrontHome()`, or `StorefrontHomeLink` (plain anchor). `revalidateStorefrontChrome(channel)` invalidates the `/${channel}` layout (user menu + cart badge) and `/checkout` — call it from server actions (after cart mutations / checkout complete / before a client refresh), not during RSC render.

## Account architecture

Browse layouts use per-chrome slots; account uses a **layout-shell auth gate** (one Suspense + async shell; session checks only inside the shell):

```
account/layout.tsx
└── Suspense fallback={<AccountSkeleton />}
    └── AccountShell (async)
        ├── no session / invalid user → <AccountLogin />   (LoginForm → BFF)
        └── user → AccountProvider
            ├── AccountNav (static client)
            └── {children}   (sync pages + nested Suspense islands)

header.tsx → Suspense → HeaderAuthRefresh (client; one-time mount sync + cross-tab, NOT per-nav)
                          └── UserMenuServer (async; cookies() + getHeaderUser() or sign-in link)
```

```tsx
// Layout shell — gate inside the async shell, not the page
async function AccountShell({ children }: { children: ReactNode }) {
	if (!(await hasAuthSession())) return <AccountLogin />;
	const user = await getCurrentUser(); // React.cache — deduped per request
	if (!user) return <AccountLogin />;
	return <AccountProvider user={user}>{/* nav + children */}</AccountProvider>;
}

// Sync page → fetch user once via context, secondary fetches in nested Suspense
export default function AccountOverviewPage() {
	return (
		<div>
			<AccountOverviewWelcome /> {/* useAccountUser() — from layout context */}
			<Suspense fallback={<RecentOrdersSectionSkeleton />}>
				<RecentOrdersSection />
			</Suspense>
		</div>
	);
}
```

**Moving a logged-in area to PPR-safe patterns:** layout owns the auth gate; pages stay sync (`<Suspense><AsyncContent/></Suspense>`); fetch the profile once in the layout and expose via `AccountProvider`/`useAccountUser()` (avoids `cookies()` per page); secondary fetches in nested Suspense; sign-in via `AccountLogin`. When UI reads user from layout context, mutations must `revalidatePath("/account", "layout")` **+** `router.refresh()` (page-only revalidation leaves stale context). Verify with `STOREFRONT_CHANNELS=aud,default-channel pnpm run build`.

## Anti-patterns

❌ `cookies()` / `getCurrentUser()` in an async page without a page/layout Suspense boundary
❌ Browser → Saleor for login or `me` — use BFF routes + server `getHeaderUser()`
❌ `connection()` in the account layout — can break PPR with `CartProvider` in the parent tree
❌ Wrapping only `<main>` in Suspense as a workaround — use the layout shell that owns the fetch
❌ `key={pathname}` without `router.refresh()` on header auth — remounting RSC children doesn't bust the Router Cache
❌ Client-side sessionStorage retry/recover gates or looping `router.refresh()` from effects — fix cache boundaries server-side
❌ Treating all `me === null` as signed out — use `resolveSessionUser` (`guest`/`authenticated`/`unavailable`); show the login link only on `guest`
❌ `<Link>` from checkout → storefront when the session may have changed — use a plain `<a href>` / `navigateToStorefrontHome()`

## Key files

| Concern                | File                                                                                                                        | Note                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Cookie presence        | `src/lib/auth/has-auth-session.ts`                                                                                          | Same lookup as auth SDK (`readAuthCookieValue`)                 |
| User profile           | `account/get-current-user.ts`                                                                                               | `React.cache()` — deduped per request                           |
| Header user            | `src/lib/auth/get-header-user.ts`                                                                                           | guest / authenticated / unavailable                             |
| Session resolution     | `src/lib/auth/resolve-session-user.ts`                                                                                      | Classifies the `me` fetch; one server retry on transient errors |
| Auth failure codes     | `src/lib/auth/session-auth-state.ts`                                                                                        | `isDefinitiveAuthFailure` — Saleor JWT codes + message fallback |
| BFF sign-in            | `src/lib/auth/bff-server.ts`, `/api/auth/login/route.ts`                                                                    | HttpOnly cookies, rate limited                                  |
| Client forms / profile | `bff-client.ts`, `account-context.tsx`                                                                                      | `loginWithBff`; `useAccountUser()`                              |
| Sign-in UI             | `account-login.tsx`                                                                                                         | `LoginForm` in Suspense (no SDK provider)                       |
| Chrome refresh         | `user-menu-server.tsx`, `header-auth-refresh.tsx`, `revalidate-storefront-chrome.ts`, `sync-auth-surfaces-after-sign-in.ts` | Header auth chrome + Router Cache sync + post-login hard nav    |
| Layouts                | `(main)/layout.tsx`, `account/layout.tsx`, `account/actions.ts`                                                             | Browse chrome vs account auth gate; layout revalidation         |

Related: [`data-caching.md`](data-caching.md) (page-boundary model), [`checkout-management.md`](checkout-management.md) (checkout BFF sign-in + `router.refresh()`).

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

When `announcementBar.dismissible` is true, dismissal is stored in the `paper_announcement_dismissed` cookie (value = dismiss key from `resolveAnnouncementDismissKey()`). The server reads it in `DismissibleAnnouncementBar` to omit the bar from HTML; a no-flash inline script covers the Suspense fallback path. Keys are resolved in `announcement-dismiss-key.ts` (client-safe export from `@/lib/content`):

| `announcementBar.id`                                         | Dismissal key                                                                                       | When to use                                                                                                                                                 |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Empty** (code default)                                     | `paper:announcement-dismissed:content:{hash}` — hash of **rendered** `message`, `href`, `linkLabel` | Default. Merchants edit copy in Dashboard; any message/link change re-shows the bar for visitors who dismissed the old version. No extra field to maintain. |
| **Non-empty** (`announcement-id` in Saleor or `defaults.ts`) | `paper:announcement-dismissed:id:{id}`                                                              | Campaign slug. Dismissal survives message tweaks until you change `id` (e.g. `summer-sale-2026` → `fall-sale-2026`).                                        |

**Important:** Pass the **interpolated** message into the dismiss resolver (after `{freeShippingThreshold}` etc.) — `getAnnouncementBarProps()` does this in `AnnouncementBarSlot`. Policy threshold changes therefore change the content hash and re-show the bar, which is usually correct.

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
| Announcement policy copy    | `src/lib/content/get-announcement-bar-props.ts`                       |
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

| Surface                                        | Loader                                                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Announcement bar, shared chrome                | `browse-chrome-slots.tsx` (`getAnnouncementBarProps`, `Header`, `Footer`, `CartDrawerSlot`) |
| Homepage sections                              | `(main)/page.tsx`                                                                           |
| Cart trust / empty copy                        | Cart drawer (client reads props or context from server parent)                              |
| Checkout empty states, trust, marketing opt-in | `checkout-session-loader.tsx` → `CheckoutContentProvider`                                   |

Checkout resolves **channel from cart cookies** when loading content so copy can match the cart's channel.

---

## Caching & Freshness

- Profile `storefront-content` (~menus tier, ~5 min stale); tag `storefront-content:{channel}:{locale}` (BCP 47 from `getLocaleBcp47List()`). **Locale** keys both the cache tag and the `"use cache"` function args — see `data-caching.md` (Locale & Caching).
- Catalog translations are wired (`GraphQL languageCode` + `withTranslated*Fields`); storefront Models use `StorefrontContentPages.graphql` `translation` on plain-text attributes via `buildAttributeMap`.
- **Invalidation goes through [saleor-paper-app](https://github.com/saleor/saleor-paper-app)** — don't point Saleor webhooks directly at the storefront. `PAGE_*` on `storefront-*` pages → `planStorefrontContentRevalidation()` → `revalidateTag` + homepage paths per channel; `MENU_*` → the separate `navigation`/`footerMenu` profiles, same app→storefront path. The profile is listed in `GET /api/cache-info` for manual purge; emergency bust via `GET /api/revalidate?tag=storefront-content:{channel}:{locale}` + `REVALIDATE_SECRET`. Full architecture: `data-caching.md`.

```
Saleor (PAGE_UPDATED on storefront-homepage)
  → saleor-paper-app (page-changed webhook) → POST /api/revalidate { page: { slug } }
  → planStorefrontContentRevalidation → revalidateTag + revalidatePath
```

Marketing copy is cached like navigation; cart/checkout **transactional** data stays fresh via `cache: "no-cache"`. Saleor-side cache/revalidation detail: `data-storefront-content-saleor.md`.

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

Paper models merchandising copy in **Saleor Models** (PageTypes + Pages + page-type attributes) and the storefront maps those Pages into the normalized `StorefrontContent` shape. This rule is the Saleor side — provider behavior, merge, and the code/Saleor scope split are in [`data-storefront-content.md`](data-storefront-content.md); attribute types in [`data-storefront-content-attributes.md`](data-storefront-content-attributes.md).

> **Live contract:** treat `src/lib/content/attribute-slugs.ts` and `config/saleor/storefront-content.config.yml` as source of truth — exact attributes change over time, this doc doesn't list them.

## Models as the content surface

Each **PageType** defines a purpose (chrome, homepage, cart, checkout); the **attributes** on that type structure otherwise-unstructured text (headings, labels, paragraphs, flags).

| Model (PageType)                                                          | Purpose                                                                                                  |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `storefront-policies` (PageType) / `storefront-policy` (global Page slug) | Channel-wide **policy values** (free-shipping threshold, returns window) — `NUMERIC`/`BOOLEAN`, not copy |
| `storefront-chrome`                                                       | Site-wide chrome (announcement bar)                                                                      |
| `storefront-homepage`                                                     | Homepage sections                                                                                        |
| `storefront-cart`                                                         | Cart drawer **editorial** copy (title, free-shipping nudges, empty state, trust)                         |
| `storefront-checkout`                                                     | Checkout surface copy                                                                                    |

One PageType per storefront surface; constants in `src/lib/content/constants.ts` (`STOREFRONT_PAGE_TYPES`). Dashboard tabs are typically **Storefront — Chrome / Homepage / …**; slugs use the `storefront-` prefix.

**Editorial-only (ADR 0002):** these models hold merchant-editable copy. Functional UI strings are code-owned via next-intl — see the scope rule in `data-storefront-content.md` and `ui-i18n.md`. When adding an attribute, ask _"would a merchant reword this per shop?"_ — if not, it belongs in `messages/*.json`.

**Policy vs copy:** `storefront-policy` holds the _facts_ (number/boolean); the other models hold _copy_ that references those facts via `{freeShippingThreshold}` / `{returnsWindowDays}` placeholders. One threshold feeds the cart math, the announcement bar, and the cart trust signal — change it once. Override per channel with `storefront-policy-{channelSlug}` (numbers in the channel currency).

**Day-to-day copy changes** happen in Dashboard → Models; **Configurator** is commerce-as-code for when the Saleor schema itself needs updating (below). Models are translatable in Saleor — editors can translate attribute values per language today; Paper serves them once the storefront fetch is wired (no schema change). Pages are **not** channel-scoped in Saleor — per-channel copy is a **convention** via slug (below), resolved in the storefront provider.

```
PageType (storefront-homepage)
  └── assigned PAGE_TYPE attributes  (hero heading, CTA label, …)
  └── Page instances (Models in Dashboard)
        └── attribute values per page
```

## Slug stack (global vs per-channel copy)

Saleor enforces **globally unique page slugs** — there's no native "this page belongs to channel X." Paper simulates per-channel copy with slug naming:

| Tier                 | Page slug pattern                                                  | Purpose                       |
| -------------------- | ------------------------------------------------------------------ | ----------------------------- |
| **Global**           | Same as PageType slug (`storefront-homepage`)                      | Default copy for all channels |
| **Channel override** | `{pageTypeSlug}-{channelSlug}` (`storefront-homepage-channel-pln`) | Per-channel copy              |

Resolution (`resolve-page.ts`): `storefront-{surface}-{channel}` (override wins) → `storefront-{surface}` (global) → `defaults.ts` (code fallback). The fetch collects **both** candidate slugs per surface, then picks the best match. Editing the global page invalidates all channels; a channel-specific page invalidates that channel only (`resolveStorefrontContentChannelsForPageSlug`).

## Attributes: names vs slugs

| Layer                  | Uses                                                                       |
| ---------------------- | -------------------------------------------------------------------------- |
| **Configurator YAML**  | Human **display names** on `contentAttributes` and model `attributes` keys |
| **Saleor**             | Assigns **slugs** from names (slugify)                                     |
| **Storefront mappers** | Read by **slug** via `attribute-slugs.ts`                                  |

Configurator resolves by **name** when deploying; the app reads **slugs** at runtime. Keep YAML names and `attribute-slugs.ts` in sync — `pnpm content:verify-attribute-slugs`. Types and catalog references (`SINGLE_REFERENCE`/`REFERENCE`) are in `data-storefront-content-attributes.md`.

**Greenfield bootstrap:** with no storefront models yet, `pnpm configurator:storefront-content:deploy` creates PageTypes, attributes, and seed models from `storefront-content.config.yml`. Copy fields that reference channel policies use `{freeShippingThreshold}` / `{returnsWindowDays}` in seed values — keep those tokens in Dashboard translations too.

## Configurator (commerce-as-code, not editorial)

Saleor Configurator syncs YAML to Saleor when the **structure** of storefront content changes — new PageTypes, attributes, seed models, baseline values for new environments. It is **not** the day-to-day editor.

| Who / when                                                    | Tool                                                        |
| ------------------------------------------------------------- | ----------------------------------------------------------- |
| Merchandiser updating hero text, trust labels, translations   | **Dashboard → Models**                                      |
| Developer adding a content field or bootstrapping dev/staging | **Configurator** (`storefront-content.config.yml` + deploy) |

Seed file: `config/saleor/storefront-content.config.yml`.

```bash
pnpm configurator:storefront-content:validate   # offline schema check
pnpm configurator:storefront-content:plan       # dry-run remote diff (may show spurious DELETE noise)
pnpm configurator:storefront-content:deploy     # apply — additive for omitted sections, never wipes
```

**Token split (dev safety):** `SALEOR_APP_TOKEN` (`.env.local`, narrow — Next.js runtime) vs `SALEOR_CONFIGURATOR_TOKEN` (`.env.configurator.local`, broad — Configurator scripts only). Never expose the configurator token as `NEXT_PUBLIC_*` or import it in app code. After deploy, set `CONTENT_PROVIDER=saleor` and restart dev; ongoing copy work stays in Dashboard. See `config/saleor/README.md`.

## Mapper pipeline (saleor provider)

```
collectStorefrontContentPageSlugs(channel)
  → GraphQL StorefrontContentPages (by slug list) → indexStorefrontPagesBySlug (skip unpublished)
  → resolveStorefrontPageForType per surface → mapChromePage | mapHomepagePage | mapCartPage | mapCheckoutPage
  → reduce(mergeStorefrontContent, defaults)
```

Each mapper returns a **partial** `StorefrontContent` (under `src/lib/content/saleor/mappers/`). Adding an editable field: (1) `contentAttribute` + model default in YAML → (2) slug constant in `attribute-slugs.ts` → (3) map in the surface mapper via `buildAttributeMap` / `attrText` → (4) add to `types.ts`, `defaults.ts`, and the UI consumer.

**Channel override recipe:** create (or deploy) a Page with slug `storefront-homepage-channel-pln` under PageType `storefront-homepage`, set its attribute values, and `getStorefrontContent("channel-pln", locale)` resolves it first; `storefront-homepage` stays the fallback for other channels.

## i18n

- `getStorefrontContent(channel, localeSlug)` and the `storefront-content:{channel}:{locale}` cache tag key by locale; `StorefrontContentPages.graphql` passes `languageCode`, and plain-text attributes use `translation(languageCode: …)` in `buildAttributeMap`.
- **Policy placeholders in translations:** localized strings must keep the same `{freeShippingThreshold}` / `{returnsWindowDays}` tokens as the default language — never bake channel-specific amounts/currencies into Dashboard translations (e.g. `"$75"`, `"30 dni"`). Paper formats money from `policies` + channel currency at render; missing placeholders warn in dev via `formatPolicyAwareLabel`.

## Cache & revalidation

Storefront content is cached under `storefront-content:{channel}:{locale}` and freshness is owned by the **saleor-paper-app**, not ad-hoc Saleor → storefront webhooks. When a merchant saves a `storefront-*` Page, Saleor emits `PAGE_UPDATED` → the app's `page-changed` handler → `POST /api/revalidate` → `planStorefrontContentRevalidation()` resolves the slug to channel(s) and purges the tags. Full invalidation architecture: `data-caching.md`.

**Agent checklist when adding content fields:** storefront-only if slug conventions and the cache profile stay the same; a new cache profile or tag shape means update `cache-manifest.ts` **and** ensure the app still forwards the right events (or add a webhook definition in `../saleor-paper-app/…/webhook-events.ts`); after app webhook changes, reinstall/sync from the app config UI. Don't point Saleor webhooks straight at `/api/revalidate` while the app is installed — use its managed webhooks so merchants get logs and a single revalidation path.

## Anti-patterns

- Mixing surfaces on one PageType — keep chrome/homepage/cart/checkout as separate types with their own attribute sets.
- Reusing the slug `default` for pages — Saleor needs unique slugs; use the PageType slug for global singletons.
- Putting **slugs** in Configurator model `attributes` keys — use **display names** (Configurator resolves to attributes).
- Duplicating attribute lists in docs — grep `attribute-slugs.ts` instead.
- Running Configurator `deploy` to change live copy — edit Models in Dashboard; Configurator is for schema/bootstrap.

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

PDP architecture, the variant-aware image gallery, and the add-to-cart flow. Variant _selection_ logic is in [`product-variants.md`](product-variants.md); caps, buy-box strategies, and over-budget deep links are in [`product-high-cardinality.md`](product-high-cardinality.md); the PPR boundary model and `getProductData` caching are in [`paper-architecture.md`](paper-architecture.md) / [`data-caching.md`](data-caching.md) — this rule covers what's PDP-specific.

## Architecture

```
ProductPage (sync export)
└── Suspense (ProductRouteSkeleton) → ProductShell (awaits params + getProductData only)
    ├── breadcrumbs, h1, attributes, JSON-LD          ← static, cached
    ├── Suspense → VariantGalleryDynamic (searchParams → variant images; LCP fallback)
    └── ErrorBoundary + Suspense → VariantSectionDynamic (searchParams → price, selectors, add-to-cart)
```

Paper-specific invariants:

1. **Shell stays static** — `ProductShell` awaits `params` only and passes the `searchParams` promise through. Reading `searchParams` in the shell or inside `getProductData` collapses the whole PDP into a dynamic hole (see `data-caching.md`).
2. **Gallery and variant section are separate dynamic islands**, each in its own Suspense boundary, so a slow/failed buy box never blocks imagery.
3. **The URL (`?variant=`) is the source of truth** for selection — no `useState`. The gallery and buy box re-render from `searchParams`; selection is shareable and refresh-safe.
4. **Add-to-cart is a Server Action** (`<form action={addToCart}>`) that mutates the checkout and `revalidatePath`s the cart — no API route, no client fetch.
5. **Errors are contained** — an `ErrorBoundary` (with the client `VariantSectionError` fallback) wraps the variant section so the page still shows images, name, and description on failure.

## File map

```
src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx   # PDP page + getProductData
src/ui/components/pdp/
├── gallery-layout.ts            # PDP_GALLERY_LAYOUT + shell class bundles + immersive height
├── gallery-registry.tsx         # layout → { renderer, LCP fallback, skeleton } (the ONLY renderer importer)
├── gallery-utils.ts             # getGalleryImages, resolveSelectedVariantId
├── product-route-skeleton.tsx   # shared route loading + page Suspense skeleton
├── variant-gallery-dynamic.tsx  # Server: searchParams → active registry renderer
├── product-gallery.tsx / immersive-gallery.tsx / mosaic-gallery.tsx   # renderers (+ *-fallback.tsx)
├── variant-section-dynamic.tsx  # price, selectors, add-to-cart, badges
├── variant-section-error.tsx    # "use client" error fallback
├── add-to-cart.tsx · sticky-bar.tsx · product-attributes.tsx
└── variant-selection/           # see product-variants.md
src/ui/components/ui/carousel.tsx, image-carousel.tsx   # Embla primitives + standard gallery
```

`index.ts` exports the public surface but **never** the gallery renderers (see [Gallery registry](#gallery-registry)).

## Image gallery

### Layout modes (`PDP_GALLERY_LAYOUT`)

The whole shop uses **one** PDP gallery style — a build-time constant in `gallery-layout.ts`, not per-product config. Shell classes, the dynamic island renderer, Suspense fallbacks, and route skeletons all read the same value via `activeGalleryVariant()`, so `loading.tsx` can never disagree with the live page.

| Layout                    | Container              | Gallery                                                                               | Attributes accordion |
| ------------------------- | ---------------------- | ------------------------------------------------------------------------------------- | -------------------- |
| **`immersive`** (default) | `container-super-wide` | `ImmersiveGallery` — square Embla filmstrip, viewport-height frames, controls below   | In gallery column    |
| **`mosaic`**              | `container-content`    | `MosaicGallery` — all images in a 2-col 4:5 grid, no carousel (pure Server Component) | Under buy box        |
| **`standard`**            | `container-content`    | `ProductGallery` — 4:5 hero + thumbnail strip (mobile swipe + dots)                   | Under buy box        |

**Page width:** `standard`/`mosaic` use `container-content` so the PDP body matches PLP/cart/search (one catalog column). Only `immersive` breaks wider. Nav/footer/marketing bands set width independently.

### Gallery registry

A shop ships exactly one layout, but the repo keeps a library of them. The registry guarantees only the active one reaches the browser:

```tsx
// gallery-registry.tsx — the ONLY file that imports gallery renderers
export const GALLERY_REGISTRY: Record<PdpGalleryLayout, GalleryVariant> = {
	standard: { Gallery: StandardGallery, Fallback: ProductGalleryFallback, Skeleton: StandardGallerySkeleton },
	immersive: {
		Gallery: ImmersiveGallery,
		Fallback: ImmersiveGalleryFallback,
		Skeleton: ImmersiveGallerySkeleton,
	},
	mosaic: { Gallery: MosaicGallery, Fallback: MosaicGalleryFallback, Skeleton: MosaicGallerySkeleton },
};
export const activeGalleryVariant = () => GALLERY_REGISTRY[PDP_GALLERY_LAYOUT];
```

Why only the active layout ships: interactive renderers load via `next/dynamic` (own chunk; Server-Component renderers like mosaic cost zero client JS); the registry is the **only** importer; and the exhaustive `Record<PdpGalleryLayout, …>` makes the compiler force all three surfaces when you add a key.

**Add a layout:** create `my-gallery.tsx` (+ fallback) → add the key to `PdpGalleryLayout` and classes to `PDP_LAYOUT_CLASSES` → add one `GALLERY_REGISTRY` entry. This is the project-wide build-time-variant pattern — see [Swappable variants of a component](ui-components.md#swappable-variants-of-a-component) for registry vs `cva`.

**Molding it your own way:** the registry is a default, not a cage — import one renderer straight into `VariantGalleryDynamic` if you want. The one thing that silently bloats the bundle: re-exporting _multiple_ `"use client"` renderers through a barrel a Server Component imports (a re-export counts as "used" and defeats cross-boundary tree-shaking). That's the sole reason renderers stay out of `index.ts`; a plain unused `import` is tree-shaken normally.

### Variant images + LCP

`VariantGalleryDynamic` reads `searchParams.variant`, resolves images (priority: `variant.media` → `product.media` → thumbnail) via `getGalleryImages`, and renders `activeGalleryVariant().Gallery` — no per-layout branching.

```tsx
export async function VariantGalleryDynamic({ product, searchParams }) {
	const { variant: variantParam } = await searchParams;
	const selectedVariant = product.variants?.find(
		(v) => v.id === resolveSelectedVariantId(product, variantParam),
	);
	const { Gallery } = activeGalleryVariant();
	return <Gallery images={getGalleryImages(product, selectedVariant)} productName={product.name} />;
}
```

**LCP lives in the gallery Suspense fallback, not a separate hero.** `ProductShell` passes the default hero URL into the active layout's `Fallback` (a real `<Image priority>` at the layout's size → no layout shift when the island streams); the renderer then sets eager/`priority` on the first carousel frame when it hydrates. Variant-specific images load on selection (accepted trade-off).

### Knobs

- **Switch layout (whole shop):** `PDP_GALLERY_LAYOUT` in `gallery-layout.ts` — shell, island, fallbacks, and `ProductRouteSkeleton` all follow.
- **Immersive frame height:** `PDP_IMMERSIVE_IMAGE_HEIGHT` (`--chrome-offset` + `--pdp-immersive-reserved` from `brand.css`).
- **Standard gallery chrome:** `ImageCarousel` props `showArrows` / `showDots` / `showThumbnails` / `onImageClick` (the last reserved for a future lightbox).

## Caching (PDP-specific notes)

`getProductData()` is a `"use cache"` fetch using `applyCacheProfile(CACHE_PROFILES.products, slug)` + `graphqlLanguageCodeVariables(localeSlug)`, merged with `withTranslatedProductFields()`. `localeSlug` is part of the cache key (per-language entry); the tag stays `product:{slug}` so a webhook busts all locales. Do **not** add fetch-level `revalidate`. Full model: `data-caching.md`.

Cached: product data, `h1`/breadcrumbs/JSON-LD, default LCP preload URL. Dynamic (searchParams): gallery images, variant section/price.

## Add-to-cart

`<form action={addToCart}>` → `"use server"` action finds/creates the checkout, adds the line, `revalidatePath`s the cart; the button uses `useFormStatus()` for the pending state and the drawer updates via revalidation. Wrap fallible work in try/catch and fail gracefully (no crash) rather than letting the action throw to the boundary.

## Common tasks

- **New attribute display:** add the field to `ProductDetails.graphql` (run `pnpm run generate`), extract in `page.tsx`, pass to `ProductAttributes`.
- **Sticky bar threshold:** `SCROLL_THRESHOLD` in `sticky-bar.tsx`.
- **Badges (New/Sale):** rendered in `VariantSectionDynamic`.
- **Queries:** `ProductDetails.graphql`, `VariantDetailsFragment.graphql` (regenerate after edits).

## Anti-patterns

❌ Reading `searchParams` in `ProductShell` or inside `getProductData` — collapses the PDP into a dynamic hole; pass the promise to islands only.
❌ `useState` for variant selection — use the `?variant=` URL param (shareable, refresh-safe).
❌ Passing a Server-Component function as a Client `ErrorBoundary` fallback — keep `VariantSectionError` in its own `"use client"` file.
❌ Suspense without an `ErrorBoundary` around the variant section — a throw would crash the page instead of degrading.
❌ Re-exporting gallery renderers from `index.ts` — bloats the bundle across the client boundary.

## Testing

`pnpm test src/ui/components/pdp`. Manual smoke: `loading.tsx` skeleton matches the live layout (no 2-col flash on immersive), gallery swipe + controls per layout, variant selection updates URL and images, add-to-cart pending state, sticky bar after scroll, error boundary degrades cleanly, attributes accordion in the right column.

---

### 2.2 Variant Selection

Variant and attribute selection on product detail pages. Ensures correct "Add to Cart" button state, option availability, discount badges, and URL-driven selection.

For caps, buy-box strategies, and over-budget deep links, see [`product-high-cardinality.md`](product-high-cardinality.md).

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
├── saleor-variant.ts              # Shared Saleor variant shapes + value IDs
├── selection-index.ts             # Once-built Map/Set indexes + *FromIndex helpers
├── utils.ts                       # Public API (delegates to index; rebuilds per call)
├── resolve-group-control.ts       # chips | select | combobox ladder
├── variant-selector.tsx
├── variant-selection-section.tsx  # Builds index once via useMemo
├── optional-attributes.tsx
└── renderers/
    ├── color-swatch-option.tsx
    ├── image-swatch-pill-option.tsx
    ├── button-option.tsx
    └── index.ts
```

Thresholds: `src/config/variants.ts`. Select/combobox are lazy-loaded so the chips path stays lean.

## Merchant order + natural sort

- **Group order** = first-seen order from Saleor's `selectionAttributes` (product-type assignment). Do not re-sort groups with a swatch-first heuristic.
- **Option values** = `sortByOptionLabel` / `compareOptionLabels` (natural / size-aware).

## Key Functions

Prefer building `buildVariantSelectionIndex(variants)` once and calling `*FromIndex` in UI hot paths.

| Function / area                     | Purpose                                    |
| ----------------------------------- | ------------------------------------------ |
| `buildVariantSelectionIndex()`      | Groups + Maps/Sets for O(1)-ish lookups    |
| `findMatchingVariantFromIndex()`    | Complete selection → variant id            |
| `getOptionsForAttributeFromIndex()` | Availability + compatibility per option    |
| `getAdjustedSelectionsFromIndex()`  | Partial accumulation + conflict auto-clear |
| `groupVariantsByAttributes()`       | Public wrapper → `index.groups`            |
| `resolveVariantGroupControl()`      | Per-group chips / select / combobox        |

Compat wrappers in `utils.ts` still exist for tests; they rebuild the index each call.

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

Over-cap / external buy boxes also honor `?sku=` (see [`product-high-cardinality.md`](product-high-cardinality.md)); when both are present, `variant` wins.

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
pnpm test src/ui/components/pdp/variant-selection/selection-index.test.ts
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
❌ **Don't re-sort attribute groups** away from merchant/API order  
❌ **Don't rebuild the selection index on every click** in the picker — memoize once

---

### 2.3 High-Cardinality Attributes

Paper treats large option matrices as a first-class shape: **degrade by attribute-group shape**, never fetch unpaginated variant lists, and keep LCP on the static PDP shell.

Budgets and thresholds live in one fork override point: `src/config/variants.ts` (+ `src/config/facets.ts` for PLP).

## Caps (do not scatter magic numbers)

| Constant                            | Default | Role                                                                     |
| ----------------------------------- | ------- | ------------------------------------------------------------------------ |
| `SALEOR_VARIANT_PAGE_SIZE`          | 100     | Saleor `productVariants(first:)` page size                               |
| `PDP_VARIANT_CAP`                   | 200     | Max variants hydrated for the matrix picker                              |
| `PLP_VARIANT_SAMPLE`                | 50      | Card swatches / facet **option hints** only (not filter truth)           |
| `VARIANT_CHIP_MAX_OPTIONS`          | 10      | Text/numeric groups stay chips                                           |
| `VARIANT_SWATCH_CHIP_MAX_OPTIONS`   | 12      | Swatch groups stay chip grid; then combobox (Select can't show swatches) |
| `VARIANT_NATIVE_SELECT_MAX_OPTIONS` | 24      | Text groups: select, then combobox                                       |

**Stock freshness:** PDP variant payloads (incl. `quantityAvailable`) use the same `product:{slug}` + `catalog` cache profile as the product shell (~5 min TTL, PRODUCT\_\* webhooks). Cart/checkout always re-fetch live.

## Data layer (never the firehose)

- **Product shell** (`ProductDetails`): no unpaginated `Product.variants`. Probe with `productVariants(first: 1) { totalCount }` + `productType`.
- **Matrix path**: paginated `ProductVariantsForPdp` only inside dynamic islands, and only when `totalCount ≤ PDP_VARIANT_CAP`.
- **Lint**: `src/graphql/*.graphql` must not use deprecated `variants {` — enforced in `verify`.
- **PLP cards**: `productVariants(first:)` capped at `PLP_VARIANT_SAMPLE` for swatches; keep the GraphQL `first` arg in sync with that constant.

## Buy-box strategies (`src/lib/catalog/buy-box-strategy.ts`)

Resolve **only inside dynamic islands** — never in the static shell (PPR / LCP).

| Strategy      | When                                                      | Buy box                                            |
| ------------- | --------------------------------------------------------- | -------------------------------------------------- |
| `matrix`      | `totalCount ≤ PDP_VARIANT_CAP` (default)                  | Attribute picker + selection index                 |
| `over_budget` | `totalCount > PDP_VARIANT_CAP`                            | No matrix; ATC via deep link only                  |
| `external`    | Product-type slug in `EXTERNAL_BUYBOX_PRODUCT_TYPE_SLUGS` | Fork picker (seat map, CPQ, …); same deep-link ATC |

`guided` (stepped `attribute.choices`) is **deferred**.

### Deep-link contract (public)

- `?variant=<Saleor global id>` — preferred
- `?sku=<variant sku>` — when the id is unknown (feeds, email, POS)
- When both present, **`variant` wins**
- Resolved buy box: selection summary + ATC enabled **without** loading sibling variants

## Per-group control ladder

Each attribute group picks its own control (`resolveVariantGroupControl`):

| Shape                 | Control                        |
| --------------------- | ------------------------------ |
| Swatches, ≤12 options | Chip / swatch grid             |
| Swatches, >12         | Lazy combobox (swatch leading) |
| Text/numeric, ≤10     | Chips                          |
| Text/numeric, 11–24   | Lazy `<Select>`                |
| Text/numeric, ≥25     | Lazy searchable combobox       |

Select/combobox load via `next/dynamic` (`ssr: false`) so the common chips path stays lean.

## Merchant order + natural sort

- Preserve Saleor's `selectionAttributes` order (product-type assignment order). **Do not** re-sort groups with a fashion “swatch first” heuristic.
- Sort option **values** with `compareOptionLabels` / `sortByOptionLabel` (S before L; Row 10 after Row 2).

## Selection-index performance

Hot paths live in `selection-index.ts`. Build **once** per product payload (`useMemo` in `VariantSelectionSection`):

- `variantById`
- `variantsByAttrValue` (attr → value → variant ids)
- `variantBySelectionKey` (complete fingerprint → variant id)
- Cached `groupSlugs` + `implicitSelections`

Public wrappers in `utils.ts` rebuild an index per call (compat/tests). The picker must use `*FromIndex` helpers.

## PLP facets (server-side)

See [`product-filtering.md`](product-filtering.md). Facets are configured in `src/config/facets.ts` (`PLP_FACETS`). Colors/sizes are presets — not hardcoded Saleor special cases. Listing filters OR attribute slug **aliases** (`size` | `shoe-size` | …) via `ProductWhereInput` (Saleor forbids combining `filter` + `where`).

## Quick-add / over-cap

- `hasVariants` still gates one-click add when multiple variants exist.
- `isOverVariantCap` (`variantTotalCount > PDP_VARIANT_CAP`): never open a variant sheet from PLP — route to the PDP.

## Perf gates (testable invariants)

1. Strategy / `searchParams` / uncached variant fetches stay **inside** Suspense islands — gate with `pnpm run build` on PPR-sensitive changes.
2. Facet toggles use `useOptimistic` + `useTransition` so chips acknowledge instantly while RSC results stream.
3. Unfiltered first-load PLP remains static-friendly; filtered views are soft navigations (combinatorial cache dilution is expected).
4. Common-path PDP client bundle: chips path must not pull Select/cmdk.

## Ceilings (product guidance)

| Scale                        | Approach                                         |
| ---------------------------- | ------------------------------------------------ |
| Matrix ≤ `PDP_VARIANT_CAP`   | Full attribute picker                            |
| SKU lookup / deep link ~2–3k | `over_budget` / external + `?variant=` / `?sku=` |
| Beyond that                  | Split products, or keep inventory outside Saleor |

Dashboard bulk ops / Configurator: prefer commerce-as-code and paginated APIs; never teach the storefront to dump all variants into RSC payloads.

## Anti-patterns

❌ Fetching deprecated unpaginated `Product.variants`  
❌ Resolving buy-box strategy or reading `?variant=` in the static shell  
❌ Shipping a **partial** attribute matrix when over cap  
❌ Client-only color/size filtering against the PLP sample (sample ≠ truth)  
❌ Filtering only the primary attribute slug when aliases exist (`size` without `shoe-size`)  
❌ Rebuilding the selection index on every click in the picker

---

### 2.4 Product Filtering

Product list filtering and sorting. Attribute facets (colors/sizes/…) are **server-side** via Saleor; the PLP variant sample is only for card swatches and option-list hints.

> **Source**: [Saleor API - ProductFilterInput](https://docs.saleor.io/api-reference/products/inputs/product-filter-input) / `ProductWhereInput`  
> **High-cardinality context**: [`product-high-cardinality.md`](product-high-cardinality.md)

## Filter Architecture

| Filter         | Processing     | Mechanism                                                                |
| -------------- | -------------- | ------------------------------------------------------------------------ |
| **Categories** | ✅ Server-side | `ProductFilterInput.categories` (IDs) or `where.category` when facets on |
| **Price**      | ✅ Server-side | `filter.price` or `where.price.range`                                    |
| **Sort**       | ✅ Server-side | `ProductOrder`                                                           |
| **Colors**     | ✅ Server-side | Facet config → `where` OR across `color` / `colour` value slugs          |
| **Sizes**      | ✅ Server-side | Facet config → `where` OR across `size` / `shoe-size` / `clothing-size`  |

Saleor allows **only one** of `filter` or `where` per products query. When any attribute facet is selected, Paper puts the whole constraint set into `where` so aliases can OR correctly.

> The old claim “Saleor needs attribute IDs” is **false** for modern schemas — `AttributeInput` filters by attribute slug + value slugs.

## Facet config (`src/config/facets.ts`)

```ts
export const PLP_FACETS = [
	{ param: "colors", attributeSlug: "color", attributeAliases: ["colour"], control: "swatch" },
	{
		param: "sizes",
		attributeSlug: "size",
		attributeAliases: ["shoe-size", "clothing-size"],
		control: "chip",
	},
] as const;
```

- **URL tokens** = normalized **value slugs** (`?sizes=43`, not display names).
- Forks add/reorder facets here — colors/sizes are presets, not GraphQL special cases.
- Option chips in the filter bar are still derived from the **current page sample** (`PLP_VARIANT_SAMPLE`); that list can be incomplete. Matching itself is exhaustive against all variants.

## Key Files

| File                                           | Purpose                                             |
| ---------------------------------------------- | --------------------------------------------------- |
| `src/config/facets.ts`                         | Which attributes are facets + slug aliases          |
| `src/ui/components/plp/filter-utils.ts`        | `buildProductListingConstraints`, option extractors |
| `src/ui/components/plp/filter-utils.server.ts` | `resolveCategorySlugsToIds`                         |
| `src/ui/components/plp/use-product-filters.ts` | URL sync, optimistic chips, `useTransition`         |
| `src/ui/components/plp/filter-bar.tsx`         | Filter UI                                           |

## Building listing constraints

```typescript
import { buildProductListingConstraints } from "@/ui/components/plp/filter-utils";
import { resolveCategorySlugsToIds } from "@/ui/components/plp/filter-utils.server";

const categoryMap = await resolveCategorySlugsToIds(categorySlugs);
const categoryIds = Array.from(categoryMap.values()).map((c) => c.id);

const { filter, where } = buildProductListingConstraints({
	priceRange: searchParams.price,
	categoryIds,
	colors: searchParams.colors,
	sizes: searchParams.sizes,
});

// Pass exactly one of filter / where (the other is undefined)
await executePublicGraphQL(ProductListPaginatedDocument, {
	variables: { channel, sortBy, filter, where, ... },
});
```

`buildFilterVariables` remains for **category/price only** — do not hang attribute facets on it (single-slug `filter.attributes` cannot OR `shoe-size`).

## Client UX (not client matching)

```tsx
const {
	filteredProducts, // server-already-filtered page
	colorOptions,
	selectedColors,
	isPending,
	resultCount, // prefers server totalCount
	handleColorToggle,
} = useProductFilters({ products, totalCount, enableCategoryFilter: true });
```

- Toggles write sorted slug lists to the URL and use `useOptimistic` + `useTransition`.
- Do **not** re-apply `filterProducts` for colors/sizes on the live PLP (kept only for tests / hybrid experiments).

## Static Price Ranges

Price ranges are static to avoid UI flicker:

```typescript
import { STATIC_PRICE_RANGES_WITH_COUNT } from "@/ui/components/plp/filter-utils";
```

## Adding a New Attribute Facet

1. Add a row to `PLP_FACETS` (`param`, `attributeSlug`, `attributeAliases`, `control`).
2. Ensure listing pages pass `searchParams[param]` into `buildProductListingConstraints` (extend the helper’s convenience fields or `facets` map).
3. Wire FilterBar / `useProductFilters` for that param if it needs a dedicated control.
4. Prefer value **slugs** in the URL.

## Anti-patterns

❌ **Don't filter categories client-side** — resolve slugs → IDs server-side  
❌ **Don't generate dynamic price ranges** — use static ranges  
❌ **Don't hide selected filters** — always show so users can deselect  
❌ **Don't treat the PLP variant sample as filter truth** — sample is for swatches/hints  
❌ **Don't filter only `size` when sneakers use `shoe-size`** — configure aliases  
❌ **Don't pass both `filter` and `where`** — Saleor rejects the combination

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

How checkout sessions are created, stored, synced, and completed — and how to debug payment failures, hydration mismatches, and `CHECKOUT_NOT_FULLY_PAID`. Surface layout is in [`paper-surfaces.md`](paper-surfaces.md); payment-app SDK steps in [`checkout-payment-gateways.md`](checkout-payment-gateways.md); auth in [`data-auth-routes.md`](data-auth-routes.md).

## Session id, storage, lifecycle

The checkout id (a base64 Saleor global id, e.g. `Checkout:a8c7…`) lives in **two** places:

- **Cookie `checkoutId-{channel}`** (primary; set in `src/lib/checkout.ts` via `saveIdToCookie`, `sameSite: "lax"`, `secure` on https). Persists across refreshes/sessions.
- **URL `?checkout=`** on `/checkout`.

`findOrCreate({ channel, checkoutId })` creates a new checkout when there's no id or Saleor can't find it (first item into an empty cart, or a completed checkout whose id is now invalid). On `checkoutComplete` success the checkout becomes an Order, the id is invalidated, and the cookie is cleared.

## Auth + data loading (RSC + client sync)

Sign-in uses the same BFF as storefront (`loginWithBff()` → `POST /api/auth/login`); `CheckoutUserProvider` hydrates `me` from the RSC page; after sign-in call `refetchUser()` → `router.refresh()`. Sign-out = `logout()` action + `detachCheckoutCustomer` when needed.

1. **RSC page** (`checkout/page.tsx`) fetches the full checkout (`fetchCheckoutOnServer`), `me`, order, and channel countries; passes `initialCheckout` when `loadState === "ready"`.
2. **Client** `CheckoutDataProvider` hydrates from `initialCheckout`. RSC updates **merge** via `adoptCheckoutSnapshot`; explicit `refreshCheckout()` **replaces** state. Cart mutations revalidate `/checkout` via `revalidateStorefrontChrome`; use `useRefreshCheckoutRsc()` after auth or address-book changes.
3. **Mutations** are server actions in `src/app/(checkout)/actions.ts`; adopt-vs-refresh semantics in `checkout-sync.ts`.

`useCheckout()` reads from `CheckoutDataProvider` context — **not urql**.

## Payment completion & transition UX

Gateway-agnostic infra shared by Dummy/Stripe/future apps — what happens **after** the PSP authorizes through Saleor:

```
Pay clicked (or 3DS return)
 → markPaymentCompleting(checkoutId)   [sessionStorage: checkout:payment-completing]
 → transactionInitialize / process     [provider-specific]
 → finalizeCheckoutOrder()             [runCheckoutComplete]
     ├─ failure → clearPaymentCompleting(), show inline error
     └─ success → navigateToOrderConfirmation(orderId)  [window.location.replace → /checkout/complete?order=]
 → confirmation page clears completion storage; cookie cleared in runCheckoutComplete after()
```

### Routes & transition storage

| Mechanism                          | Purpose                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| `/checkout?checkout=`              | Active cart flow — `CheckoutApp` + step UI                                                        |
| `/checkout/complete?order=`        | Order confirmation — separate RSC page + `OrderConfirmationApp`                                   |
| `checkout:payment-completing`      | Keeps `PaymentCompletingScreen` up while `checkoutComplete` runs (no flash back to step 1)        |
| `?processingPayment=true`          | Stripe 3DS return flag; pairs with `isCheckoutPaymentActive()` when the payment step is unmounted |
| `?step=contact\|shipping\|payment` | Step deep link; URL is source of truth via `useLiveCheckoutSearchParams()`                        |
| `updateCheckoutQuery()`            | **Shallow** step URL updates (`pushState`/`replaceState`) — avoids re-running checkout RSC        |

**Critical sequencing gotchas:**

- **Don't clear the checkout cookie synchronously on `/checkout?checkout=…` after payment** — the cookie change re-renders the checkout RSC tree and briefly shows `not_found` ("session expired") before navigation. `runCheckoutComplete` clears it in `after()`; the client calls `navigateToOrderConfirmation()`; `RootViews` holds `PaymentCompletingScreen` while `checkout:payment-completing` is set.
- **Don't call `redirect()` from `runCheckoutComplete`** — `NEXT_REDIRECT` is caught by Stripe payment catch blocks as a false "Payment failed" banner.
- **Order confirmation needs `window.location.replace`** (hard nav) — `router.replace` from async post-mutation callbacks doesn't reliably unmount checkout.

### Shallow step navigation

Step changes use **`updateCheckoutQuery({ step })`** (`src/checkout/lib/checkout-search-params.ts`), not `router.replace`: App Router treats `searchParams` as dynamic input, so a router nav would re-fetch checkout on every step click. Shallow history updates the URL for back/refresh/deep-link without a server round-trip.

- **Continue** → `history: "push"` (Back walks Contact → Shipping → Payment).
- **Header stepper / inline Back / Stripe param cleanup** → `replace` (no fake history entries).

`useLiveCheckoutSearchParams()` (`useSyncExternalStore`) keeps step UI, transition guards, and Stripe-return detection synced with shallow updates and `popstate`; ephemeral Stripe params are merged from `window.location.search`, never stale React `searchParams`. `CheckoutSessionLoader` reads only `?checkout=`/`?order=` — **never `?step=`** — and fetches via `get-checkout-session-data.ts` (`React.cache` per id). Use `router.replace` only for in-checkout `?checkout=` changes (orphaned-checkout recovery).

**Self-healing step URL (`CheckoutStepUrlGuard`):** the App Router never sees shallow `?step=` writes, so any router-level URL restore (server-action revalidation — `X-Action-Revalidated: 1` — or RSC refresh) silently `replaceState`s the canonical URL back **without** the step param, rewinding checkout to Contact. Mid-payment this tore down `stripe.confirmPayment()` and left orphaned "Payment started / method: None" PaymentIntents. Two defenses, both required:

- `checkout-search-params.ts` patches `history.pushState`/`replaceState` (installed on first live-URL subscription) so **every** URL write notifies subscribers — the router's silent restores included. The patched dispatch is **deferred to a microtask**: the App Router commits URL writes inside `useInsertionEffect`, where a synchronous dispatch schedules React updates ("useInsertionEffect must not schedule updates") and the guard's heal gets dropped. Patch flag and step intent live on **`globalThis`, not module scope** — dev HMR can keep two live copies of the module in one tab, and split state makes the guard fight the Back button with a stale intent. `updateCheckoutQuery({ step })` records the shopper's **step intent**; `CheckoutStepUrlGuard` (mounted in `CheckoutApp`) re-asserts the intended step whenever a history write drops it. Browser Back/Forward updates intent via `popstate` instead of fighting the shopper. The heal runs **one macrotask after** the change (`setTimeout 0`): on browser Back, Next's popstate handler (registered before checkout hydrates) flushes its traversal synchronously _inside its own listener_, which runs the guard's effect while the intent is still the pre-Back step — a synchronous or microtask heal would clobber the traversal, and `adoptIntentFromUrl` (later in the listener chain) would adopt the clobbered URL, trapping the shopper on the old step.
- **Step UI renders from intent, not the raw URL** (`useCheckoutStepFromUrl` overlays `useCheckoutStepIntent()` on the live query). A revalidation clobber can flash a stale `?step=` before the guard heals it; URL-driven UI would remount the flashed step — payment remounts re-init Stripe and fire gateway actions whose revalidations restore the stale URL again, a self-sustaining payment ⇄ shipping loop. Intent-driven UI never flashes, so the loop can't start. `writeCheckoutQueryHistory` also downgrades a `push` of the current URL to `replace` so double-fired Continues can't duplicate history entries.
- `useSyncCheckoutRouterUrl()` on the payment step aligns the router's canonical URL once on arrival (`router.replace` — one RSC re-run, acceptable on the money step) so revalidations during pay restore the _same_ URL and never remount Stripe Elements mid-confirm. It **re-syncs on unmount when `?step=` diverged** (Back to shipping): without it the canonical URL stays `?step=payment` and every shipping-step server action bounces the shopper back to payment. The unmount sync skips when the pathname changed, so it never fights the payment-success `window.location.replace`.

**Regression e2e:** `pnpm test:e2e:checkout` (`e2e/checkout-step-back.spec.ts`) — browser Back from simulated shallow step history; catches popstate vs guard heal ordering. Requires a running server (`PLAYWRIGHT_BASE_URL` or `pnpm start` on `:3020`).

### Transition guard, Stripe 3DS, live total

- **`useCheckoutTransition()`** returns `"completing"` when `isCheckoutPaymentActive()` (storage key matches id, or `processingPayment` param) → render `PaymentCompletingScreen` instead of the step flow; else `null`.
- **`StripeCheckoutReturnHandler`** mounts at the **checkout shell** (`stripe-checkout-completion-host.tsx`), not inside the payment step (which may be unmounted after redirect). Real failures clear Stripe params, exit the processing screen, and show `PaymentError` **inline on the payment step**. Return URL carries `processingPayment`, `paymentIntent`, `paymentIntentClientSecret` (`build-stripe-return-url.ts`).
- **Live total before charge:** before any `transactionInitialize`, call `updateCheckoutBilling()` → `refreshCheckout()` for a live gross total; if `hasMaterialCheckoutTotalChange(displayed, live)`, show a price-change notice and **block** pay (`checkout-pay-amount.ts`). Saleor re-validates at `checkoutComplete`, but blocking early avoids authorizing the wrong amount.

## Debugging

**Stale cart after storefront edit:** cart actions call `revalidateStorefrontChrome` (incl. `revalidatePath("/checkout")`), so the next checkout nav gets fresh `initialCheckout`; in-flow use `refreshCheckout` (full replace).

**`CHECKOUT_NOT_FULLY_PAID`** ("authorized amount doesn't cover total") — causes: payment app down (transaction created, authorization failed), stale checkout with accumulated partial transactions, or total changed after transaction init. Steps: check `[Payment] Transaction init result:` logs for `transactionEvent.type`; `AUTHORIZATION_FAILURE` → app down/unreachable (verify in **Dashboard → Apps**: active/healthy, URL reachable, Saleor Cloud status); transaction OK but amount wrong → stale checkout data. Recovery: delete the `checkoutId-{channel}` cookie / drop `?checkout=` / use incognito to force a fresh checkout.

**Inspecting a checkout:** decode the id with `atob("Q2hlY2tvdXQ6…")` → `Checkout:<uuid>`, then query `checkout(id) { totalPrice, transactions { chargedAmount authorizedAmount } }` in a GraphQL client.

**Always use live checkout data** (`useCheckout()` / `CheckoutDataProvider`) for payment amounts — never cached PDP prices.

## Key files

| File                                                                                                              | Purpose                                                                     |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `src/lib/checkout.ts`                                                                                             | Checkout create + cookie management (`findOrCreate`, `saveIdToCookie`)      |
| `src/app/(checkout)/checkout/page.tsx` · `checkout-session-loader.tsx`                                            | RSC entry (routing + `me`); active session loader (`?checkout=` only)       |
| `src/checkout/lib/server/get-checkout-session-data.ts`                                                            | Per-request cached session fetches                                          |
| `src/app/(checkout)/actions.ts`                                                                                   | Checkout server actions                                                     |
| `src/checkout/providers/checkout-data.tsx` · `lib/checkout-sync.ts`                                               | Client state + adopt/refresh semantics                                      |
| `src/checkout/hooks/use-checkout.ts` · `use-checkout-transition.ts`                                               | Steps context; payment→order guard                                          |
| `src/checkout/lib/payment/finalize-checkout-order.ts` · `navigate-to-order.ts` · `checkout-payment-completion.ts` | `checkoutComplete` + nav; `markPaymentCompleting`/`isCheckoutPaymentActive` |
| `src/app/(checkout)/checkout/complete/page.tsx` · `order-confirmation-app.tsx`                                    | Confirmation RSC + client shell                                             |
| `src/checkout/components/payment/stripe/stripe-checkout-return-handler.tsx`                                       | Post-redirect completion                                                    |

## Anti-patterns

❌ `router.push`/`replace` for order confirmation — use `navigateToOrderConfirmation()`
❌ Clearing the checkout cookie before leaving `?checkout=` — wait for confirmation
❌ Mounting redirect completion only inside the payment step — mount at the shell
❌ Skipping `clearPaymentCompleting()` on failure — the user must be able to retry
❌ `router.replace` for step changes — use shallow `updateCheckoutQuery({ step })`
❌ Paying against cached/PDP totals — refresh for a live gross total first

## Appendix: checkout v2 cheat sheet

**Which refresh:** `refreshCheckout()` replaces client state (promo/line change); `adoptCheckoutSnapshot` merges an RSC snapshot without clobbering in-flow edits (on `initialCheckout` change only); `useRefreshCheckoutRsc()` triggers `router.refresh()`; cross-surface cart edits propagate via `revalidateStorefrontChrome` + next nav.

**URL params:** `checkout` (RSC reads — required), `order` on `/checkout` (RSC → redirect; canonical is `/checkout/complete?order=`), `step` (client only), `processingPayment`/Stripe params (client; merged from live `window.location.search`).

**Hooks:** `useCheckout()` (compat API; `refetch` → `refreshCheckout`), `useCheckoutData()` (full context incl. `loadState`/`setCheckout`), `useLiveCheckoutSearchParams()`, `useCheckoutTransition()`, `useRefreshCheckoutRsc()`.

**Session states** (`resolveSessionUser`): `guest` (show sign-in), `authenticated` (`me` present), `unavailable` (transient — don't flash login). An expired JWT maps to `guest` via `isDefinitiveAuthFailure` (structured Saleor codes first, message fallback).

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

**Keep the palette to ~3–5 colors.** A premium palette is small: **one** primary/brand color + the neutral ramp (background/foreground/greys) + **1–2** accents (e.g. `bestseller`, sale). Don't exceed ~5 meaningful colors without a deliberate reason — more colors read as noise, not richness.

**Don't default to purple/violet.** It's the generic "AI-generated" tell. Use it only when the brand or reference genuinely calls for it — never as a fallback brand color.

**Changing a background means changing its text.** Never set a surface color without its paired foreground. Use the token _pairs_ so contrast is automatic — `bg-primary`→`text-primary-foreground`, `bg-foreground`→`text-inverse*`, `bg-card`→`text-card-foreground`. Don't hand-pick a text color against a new background.

**Spend brand color by tier (Brand Influence Policy).** Having a token does not mean painting it with brand color. The shell stays neutral; brand color is reserved for **Tier-1 signature** slots (`primary`/CTAs, focus emphasis, links, bestseller/sale badges, selected states). Backgrounds, cards, borders, muted panels and text are a **neutral ramp** — they take at most a whisper of hue, and only when a `tinted`/`bold` surface strategy is deliberately chosen. `destructive`/`success` stay true red/green. See [`design-quality-rubric`](design-quality-rubric.md#the-brand-influence-policy--spend-brand-color-by-tier) for the full tier table, surface strategy, and section rhythm, and [`design-from-image`](design-from-image.md#borrowing-colors-from-a-reference-with-restraint) for borrowing reference colors into OKLCH tokens.

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

| Class                  | Width  | Use for                                                                      |
| ---------------------- | ------ | ---------------------------------------------------------------------------- |
| `container-prose`      | 48rem  | Long-form copy, legal, FAQ (readable measure)                                |
| `container-content`    | 80rem  | Default storefront body                                                      |
| `container-wide`       | 96rem  | Editorial marketing bands (not default PDP body)                             |
| `container-super-wide` | 160rem | **Immersive PDP only** — full-bleed up to 2560px, capped on ultrawide        |
| `container-full`       | 100%   | True edge-to-edge at **every** viewport width (no max)                       |
| `container-nav`        | token  | Header bar + mega-menu column (`--container-nav`, defaults to content width) |

Each bundles `mx-auto w-full px-4 sm:px-6 lg:px-8`. Width-only utilities: `max-w-content`, `max-w-wide`, `max-w-super-wide`. **Full-width ≠ full-measure text** — nest a `container-prose` inside wide/full bands so line length stays ~60–80ch.

### Full-bleed nuance (`super-wide` vs `full`)

For "full bleed" / "immersive edge-to-edge" requests, **default to `container-super-wide`**: it's `100%` up to 160rem (2560px) then centers — full-bleed on every normal monitor, but capped so product imagery doesn't stretch absurdly on ultrawide/4K. Reserve `container-full` (never caps) for rare brand moments that must touch the bezel at any resolution. Tune the cap via `--container-super-wide` in `brand.css`; override immersive PDP via `PDP_LAYOUT_CLASSES.immersive.main` in `gallery-layout.ts`.

**Two width knobs are brand-level, no component edits, reversible:**

- **Nav** — header + mega-menu use `container-nav` (`--container-nav`, default `--container-content`). Set it to `--container-full`/`--container-wide` to take the nav edge-to-edge.
- **Body** — every page body (PDP, PLP, search, cart, CMS, collections/categories, footer, skeletons) uses `container-content`, so `--container-content` is the single body-width token. Widen it globally for a consistent wider frame, or swap one page's wrapper to a wider container for a one-off.

(The checkout surface keeps its own `max-w-7xl` frame by design — separate surface, must not share storefront layout tokens.)

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

## Expressive layer (opt-in, Tier-2 — define as tokens, never inline)

Some brands _do_ call for richer surfaces — a gradient hero band, a softer elevated hover, a signature motion. That's legitimate **Tier-2 structural** expression, governed by two rules:

1. **It lives in `brand.css` as a token** (e.g. `--gradient-hero`, `--shadow-elevated-brand`, `--ease-signature`), mapped in `tailwind.config.cjs` — never an inline `style`/one-off, so a rebrand still flows from one place.
2. **It's opt-in and contained** — on the same deliberate surfaces the influence policy allows a color band (~1 in 3–4 sections; a hero; a feature CTA), never the neutral shell or product surfaces.

Gradient discipline (if used): subtle accent only, analogous hues, 2–3 stops max — never on interactive elements or behind product media. **Hard nos:** glow shadows, neon/text drop-shadows, rainbow/high-contrast gradients on body surfaces. Restraint is the house style — see [`design-quality-rubric`](design-quality-rubric.md) for the full judgment.

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

> **Always act as a world-class ecommerce designer.** Before any visual work, step into the role of a senior product designer at a top commerce studio (Aesop, SSENSE, Apple, Glossier, Hermès, Cotopaxi). Hold every screen to that bar: confident typography, generous and intentional whitespace, a **restrained palette**, and photography-led hierarchy. **Restraint reads as premium — when in doubt, remove.** A page that looks "branded everywhere" looks like a template; a page that looks expensive spends its brand budget deliberately.
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
- **Keep to ~3–5 colors**: one primary/brand + the neutral ramp + 1–2 accents. Don't default to purple/violet (the generic "AI" tell) unless the brand calls for it.
- Token-only (see `ui-design-system`). Body text ≥ 4.5:1, large text / UI ≥ 3:1. On `bg-foreground` bands use `text-inverse*`; change a background only via its paired foreground token.

#### The Brand Influence Policy — spend brand color by tier

Not every element deserves brand color. Each token carries an explicit "expression budget." This is what separates a premium store from a recoloured template:

| Tier                  | Elements                                                                                               | Brand influence                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **1 — Signature**     | Primary CTA (`bg-primary`), focus emphasis, links, bestseller/sale badges, selected/active states      | **Full accent.** These — and only these — carry the saturated brand hue.                                                             |
| **2 — Structural**    | Radius, typography (`--radius`, display font)                                                          | **Full, free.** Personality is cheap and safe here; let shape + type do most of the "feel."                                          |
| **3 — Neutral shell** | `background`, `card`, `popover`, `muted`, `secondary`, `accent`, `border`, `input`, all `*-foreground` | **Near-zero.** Stay a high-contrast neutral grayscale. At most a _whisper_ of hue, and only via a deliberate surface choice (below). |

Semantic colors (`destructive` error, `success`) stay true red/green — they're trust signals, not brand paint. Focus rings stay neutral chrome for consistency.

#### Surface strategy — the background decision is deliberate, not automatic

Most world-class stores use a **white/near-white** ground and reserve color for Tier 1. Going colored is a _choice_, not a default:

- **Clean** (default, ~90% of premium commerce): white/near-white shell, near-black text, color only on signature slots. SSENSE, Apple, Glossier, Cotopaxi.
- **Tinted**: a deliberate, very subtle brand-tinted ground (still light, capped chroma). Aesop, Le Labo.
- **Bold**: a confident colored/dark shell — but keep **product surfaces (cards/media) near-white** so the product stays the hero. Use rarely and commit fully.

#### Section accent rhythm — which sections may take color

Keep most bands on the neutral ground. Reserve color/contrast for rhythm: **at most ~1 in 3–4 sections** becomes a dark (`bg-foreground`) or brand (`bg-primary`) "feature" band — a hero, a values/CTA band, an editorial break. Product media always sits on a neutral surface. One bold moment reads as confident; bold everywhere reads as noise.

> Apply this whether you're steering prompt-by-prompt or matching a reference: keep the neutral ramp neutral, choose a surface strategy deliberately, and route brand color to Tier-1 only. For borrowing exact colors from a reference into OKLCH tokens, see [`design-from-image`](design-from-image.md#borrowing-colors-from-a-reference-with-restraint).

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
- [ ] **Brand budget spent by tier**: shell/chrome stays neutral; brand color appears only on Tier-1 signature slots; surface strategy (clean/tinted/bold) is intentional; ≤ ~1 in 3–4 sections takes a color/dark band.
- [ ] Images: `next/image`, correct `sizes`, `priority` only on LCP, consistent aspect ratios, no CLS, meaningful `alt`.
- [ ] **Mobile (320–430px): no horizontal scroll; tap targets ≥44px; no hover-only; CTA reachable; single-column reads well.**
- [ ] Width choice is intentional (`prose`/`content`/`wide`/`full`) and stated.
- [ ] Motion is subtle and `motion-reduce`-guarded.
- [ ] Server Component by default; `"use client"` only where interactivity demands it (see `page-composition`).
- [ ] Reused existing primitives/sections where they fit; new components follow the section pattern and tokens.
- [ ] Accessibility: focus-visible states, heading order (one `h1`), contrast — consider a `web-design-guidelines` pass.

## Anti-patterns

❌ Branding the shell — tinting backgrounds/cards/borders or coloring most sections (template look). Keep neutrals neutral; reserve brand color for Tier-1 slots
❌ Mistaking "beautiful" for "loud" — glow shadows, neon gradients, gradient-behind-product, maximalist color. Beauty here = crafted typography, space, and restraint, expressed through a customized design system (rich treatments are opt-in Tier-2 tokens, not defaults)
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

| Section                     | File                                        | Purpose                                                                                                       | Key props / variants                                                                                                                                                                                                                                                                                         |
| --------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `MediaHero`                 | `media-hero/media-hero.tsx`                 | Full-viewport photographic / **video** hero with overlaid copy (the immersive, photography-led hero)          | `eyebrow`, `heading`, `subheading`, `primaryCta`, `secondaryCta`, `image`, `videoSrc`, `poster`, `align`, `height` (`medium`/`tall`/`full`/`fold` — `fold` fills to the first viewport fold via `100svh - --chrome-offset`), `overlay`, `copySurface` (`none`/`panel` — light frosted panel for busy photos) |
| `HeroBanner`                | `hero-banner/hero-banner.tsx`               | Top-of-page hero with optional full-bleed background image + CTAs                                             | `heading`, `subheading`, `primaryCta`, `secondaryCta`, `backgroundImage`, `height` (`compact`/`default`/`large`)                                                                                                                                                                                             |
| `EditorialHero`             | `editorial-hero/editorial-hero.tsx`         | Split hero: confident type on a clean canvas + a large product image on a soft panel (suits studio packshots) | `eyebrow`, `heading`, `subheading`, `primaryCta`, `secondaryCta`, `image`, `imageAlt`, `placeholder`                                                                                                                                                                                                         |
| `CategoryTileGrid`          | `category-tile-grid/category-tile-grid.tsx` | Large image tiles linking to categories/collections (label overlay for lifestyle, label-below for packshots)  | `heading`, `eyebrow`, `intro`, `cta`, `tiles[]`, `columns` (`2`/`3`/`4`), `imageFit` (`cover`/`contain`), `aspect`, `tone`, `width`                                                                                                                                                                          |
| `FeaturedCollectionSection` | `featured-collection-section/`              | Product grid from a Saleor collection                                                                         | `heading`, `collectionSlug`, `limit`, `desktopColumns`; server data (`"use cache"`) — inline into the static shell; wrap in `Suspense` with `FeaturedCollectionSkeleton` only on a page that must stream it                                                                                                  |
| `ImageWithText`             | `image-with-text/`                          | Editorial split: image one side, copy + CTA the other                                                         | `heading`, `paragraphs`, `image` (or `placeholder`), `imagePosition` (`left`/`right`), `cta`                                                                                                                                                                                                                 |
| `MulticolumnSection`        | `multicolumn-section/`                      | 2–3 column value props / icons                                                                                | `heading`, `columns[]`, `columnsDesktop` (`2`/`3`)                                                                                                                                                                                                                                                           |
| `RichTextBlock`             | `rich-text-block/`                          | Centered/left prose band (brand story, intro)                                                                 | `heading`, `paragraphs`, `align` (`left`/`center`), `width` (`narrow`/`default`/`wide`)                                                                                                                                                                                                                      |
| `TestimonialSection`        | `testimonial/`                              | Social proof — one centered quote or 2–3 column quote cards                                                   | `heading`, `testimonials[]` (`quote`, `author`, `detail`)                                                                                                                                                                                                                                                    |
| `FaqSection`                | `faq/`                                      | FAQ accordion via native `<details>` (zero client JS)                                                         | `heading`, `items[]` (`question`, `answer`)                                                                                                                                                                                                                                                                  |
| `SpecTable`                 | `spec-table/`                               | Specs / details table (label → value rows), semantic `<table>`                                                | `heading`, `rows[]` (`label`, `value`)                                                                                                                                                                                                                                                                       |
| `LogoStrip`                 | `logo-strip/`                               | Press / partner / trust logo row                                                                              | `heading`, `logos[]` (`src`, `alt`, `href?`)                                                                                                                                                                                                                                                                 |
| `AnnouncementBar`           | `announcement-bar/`                         | Chrome strip (layout, not page body); dismissible via content-hash or optional `id`                           | from `content.chrome.announcementBar`; dismissal keys → `data-storefront-content` § Announcement bar dismissal identity                                                                                                                                                                                      |

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

Pick the page shape by **whether the route reads any runtime data** (`searchParams`/`cookies`/uncached fetch). A skeleton is a **per-hole** affordance, never a **per-page** default:

- **Static page (no runtime data)** → `async page` awaits `params` + `"use cache"` data and renders the shell **directly**. **No page-level `Suspense`, no skeleton** — it prerenders as real content. (homepage, CMS pages)
- **Hybrid page (some runtime data)** → render the cached shell **eagerly**, then wrap **only** the dynamic island in `Suspense` with a small skeleton. (PLP grid via `searchParams`, PDP variant section)

Design changes must stay inside the right layer:

```
Page (async export)                 ← awaits params + "use cache" data only; no runtime data at top level
├── cached shell                    ← STATIC design, prerendered into the PPR shell (renders directly)
│     sections from cached content (hero, story, value columns, featured grid…)
└── Suspense island(s)              ← DYNAMIC design only; present on hybrid pages, absent on static ones
      searchParams / cookies / client hooks  (variant gallery/section, filtered grid, cart)
```

| Put it in the STATIC shell                                        | Put it in a DYNAMIC island (nested Suspense)                      |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| Marketing sections from `getStorefrontContent()`                  | Anything reading `searchParams` (variant gallery/section)         |
| `h1`, breadcrumbs, JSON-LD, copy, value props                     | Anything reading `cookies()` (cart, auth chrome)                  |
| LCP image preload                                                 | `cache: "no-cache"` fetches; client routing hooks                 |
| Cached collection grids via `"use cache"` helpers (e.g. featured) | `searchParams`-filtered/sorted grids; per-request personalization |

Hard constraints (never violate when redesigning):

- Never `await searchParams`/`cookies()` in the shell or inside `"use cache"` — it collapses the whole page into a dynamic hole.
- Catalog/content fetches use `applyCacheProfile(CACHE_PROFILES.*)` — never raw `cacheLife`/`cacheTag`.
- Server Components by default; add `"use client"` only for genuine interactivity.
- Don't fix a PPR build error by wrapping `<main>` in Suspense — fix the segment that owns the dynamic work.

## Homepage molding

File: [`src/app/(storefront)/[locale]/[channel]/(main)/page.tsx`](<../../../src/app/(storefront)/[locale]/[channel]/(main)/page.tsx>)

The homepage composes typed content (`getStorefrontContent`) into an ordered list of sections. To mold it:

1. **Reorder / add / remove sections** by editing the JSX section list. Pull copy from `content.surfaces.homepage` (extend the content model for new fields — see `data-storefront-content`).
2. **Render cached sections directly**: `FeaturedCollectionSection` is `"use cache"`, so it's inlined into the static shell (no `Suspense`, no skeleton) alongside the editorial sections. Wrap a section in `Suspense` only if it reads runtime data — none do today.
3. **Vary width per section** with the container tokens (a full-bleed `HeroBanner` + a `container-content` story + a `container-wide` editorial band is fine).
4. **Width is intentional** — a full-width homepage is supported; don't default to centered-narrow.

```tsx
// Sketch: reordered homepage with a new full-bleed editorial band.
// The homepage is a static `async` page — NO page-level Suspense. The body awaits
// `params` + "use cache" content and renders every section (incl. featured) directly.
return (
  <>
    <HeroBanner heading={hero.heading} backgroundImage={hero.backgroundImage} height="large" primaryCta={…} />

    {/* Cached → inlined into the static shell, not streamed behind a skeleton */}
    <FeaturedCollectionSection locale={locale} channel={channel} {...featured} />

    <ImageWithText heading={editorial.heading} paragraphs={editorial.paragraphs} imagePosition="right" cta={…} />
    <MulticolumnSection heading={values.heading} columns={valueColumns} columnsDesktop={values.columnsDesktop} />
    <RichTextBlock heading={brandStory.heading} paragraphs={brandStory.paragraphs} align="center" width="narrow" />
  </>
);
```

> The homepage is **fully static**: an `async` page that awaits only `params` + `"use cache"` content (never `searchParams`/`cookies`) and renders every section — including the featured collection — directly into the PPR static shell. There is **no page-level `Suspense` and no skeleton**. `pnpm build`'s Cache Components check fails if any uncached/runtime access sneaks in outside a `Suspense`, which is the guarantee that `/` stays a real static shell. Add a `Suspense` island only when you introduce a genuinely dynamic section.

## PDP molding

File: [`src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx`](<../../../src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx>)

PDP is `ProductShell` (cached product) + two dynamic islands (`VariantGalleryDynamic`, `VariantSectionDynamic`). **Layout width, grid ratio, and gallery style** are centralized in [`gallery-layout.ts`](../../../src/ui/components/pdp/gallery-layout.ts) (`PDP_GALLERY_LAYOUT`). To mold the PDP:

1. **Static design** (gallery column shell, name, breadcrumbs, new editorial/spec/related bands) lives in `ProductShell` from cached `product` data.
2. **Variant-dependent UI** stays in the dynamic islands (they read `searchParams.variant`) — don't lift variant state into the shell.
3. **Layout width / columns**: flip `PDP_GALLERY_LAYOUT` for shop-wide immersive vs standard, or extend `PDP_LAYOUT_CLASSES` for a new ratio. Immersive defaults to `container-super-wide` (full-bleed up to 2560px); use `container-full` in `gallery-layout.ts` for true edge-to-edge at any resolution.
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
> **Act as a world-class ecommerce designer** (see the rubric's opening directive): reproduce the _spirit_, with restraint. A reference that's loud everywhere should still become a tasteful, premium store, not a literal repaint.
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
- **Palette direction & surface strategy**: decide the shell first — `clean` (white/near-white, the premium default), `tinted` (subtle brand ground), or `bold` (colored shell, cards stay near-white). Then pick the **accent** the brand spends on Tier-1 only (CTA, badges, links). Don't tint the whole shell to match a colorful reference — that's the template trap (see the rubric's Brand Influence Policy). Light-only.
- **Density & rhythm**: airy vs compact (maps to `py-section-sm/md/lg`).
- **Imagery role**: photography-led? product-forward? editorial?
- **Mobile intent**: how the structure collapses to one column (it must — see rubric).

If the user supplied an image, read it for these signals; don't transcribe its exact pixels.

### 2. Map to the design system (not to raw values)

Translate the brief into **token and component decisions**:

| From the reference                            | Map to                                                                                                          |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Shell mood (bg/text)                          | Pick a **surface strategy** (clean/tinted/bold); keep the neutral ramp neutral unless tinted/bold is deliberate |
| Brand / accent color                          | Tier-1 only: `--primary` (+ `--bestseller`/sale). Adjust in `brand.css` (OKLCH) — never per-component hex       |
| Type personality                              | Choose default vs editorial typography theme; use role tokens (`text-display/h1/h2…`)                           |
| Corner softness                               | `--radius`                                                                                                      |
| Spacing density                               | `py-section-*` choice + spacing tokens                                                                          |
| Layout width                                  | `container-prose/content/wide/full` per band                                                                    |
| Elevation / depth                             | `shadow-card/elevated/overlay`                                                                                  |
| Sections (hero, split, columns, grid, quote…) | Pick from the `ui-sections` catalog                                                                             |

A whole-store restyle is mostly a `brand.css` edit + section selection — that is the point.

#### Borrowing colors from a reference (with restraint)

When the reference gives you concrete colors (swatches, an image, a brand site), map them onto tokens **by tier**, never by repainting the shell:

1. **Pick the shell first** — usually `clean` (keep `--background`/`--foreground` neutral). Choose `tinted`/`bold` only if the reference is _deliberately_ colored and you commit to it (cards/product stay near-white).
2. **Extract only the signature color(s)** — the brand's CTA/accent hue (sometimes a secondary for badges). Ignore the dozens of incidental colors in a screenshot.
3. **Convert to OKLCH channels** — brand.css needs bare `"L C H"`, which you can't eyeball. Use the helper:

```bash
node scripts/brand/color.mjs "#1466b3" "#f08c1d"
# 1466b3 -> 0.5064 0.1424 252.3   → paste into --primary
# f08c1d -> 0.7318 0.1628 60.7    → paste into --bestseller
```

4. **Assign to Tier-1 only** — `--primary` (+ `--bestseller`/sale). Leave the neutral ramp and semantic `--destructive`/`--success` alone. See the rubric's Brand Influence Policy.

This is the whole "match a reference's color" job — a couple of OKLCH tokens, not a brand-DNA exercise.

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

❌ Repainting the whole shell to match a colorful reference (tinted backgrounds/cards everywhere) instead of a clean shell + Tier-1 accent — the template trap
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

**`pnpm run verify` is the single "am I done?" command** (ADR 0003). It chains the deterministic gates fail-fast, so you run one command instead of assembling the matrix yourself:

| Step in `verify`          | Command                       | Catches                                                                                    |
| ------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| Docs drift                | `pnpm run docs:check`         | Rule missing frontmatter, or compiled `AGENTS.md` stale vs `rules/`                        |
| Design tokens             | `pnpm run lint:design-tokens` | Raw hex / `rgb()` / `hsl()` in `src/ui/**/*.tsx` styling — use a `brand.css` token instead |
| Types (auto-runs codegen) | `pnpm run typecheck`          | Type errors (incl. cva `VariantProps`); regenerates GraphQL types first via prehook        |
| Lint                      | `pnpm run lint`               | ESLint / Next rules                                                                        |
| Tests                     | `pnpm run test:run`           | Colocated `*.test.ts` regressions                                                          |

For a tight styling inner loop, `pnpm run verify:quick` runs just `lint:design-tokens` + `typecheck`. Iterate until `verify` is green before declaring done. Keep `verify` mirrored with `.github/workflows/build.yml`.

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

| Change                                        | Gates                                                         |
| --------------------------------------------- | ------------------------------------------------------------- |
| Token / styling tweak                         | `pnpm run verify:quick` + rubric self-check                   |
| New / moved section                           | `pnpm run verify` + advisory review + `web-design-guidelines` |
| Page layout / Suspense change (PDP, homepage) | `pnpm run verify` + `pnpm run build` (PPR)                    |
| Anything shipped to users                     | `pnpm run verify` + full self-check + a11y pass               |

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

## Beautify the primitive — never ship the default look

shadcn/Radix primitives are an **unstyled starting point, not the finished product.** A default-looking button or input is a tell that the work isn't done. When you touch a primitive, make it look _considered_:

- **Extend the `cva` matrix, don't fork.** Add the variant/size you need to the primitive's `cva` map (it flows to `VariantProps`) — see `ui-design-system.md`. Never hand-roll a one-off with `cn()` conditionals or a parallel component.
- **State is part of the design.** Every interactive primitive needs deliberate `hover`, `focus-visible`, `active`, and `disabled`/`aria-disabled` treatments — token-backed, consistent, accessible (`focus-visible` ring, ≥44px tap target).
- **Rhythm over arbitrary numbers.** Size, padding, and radius come from tokens (`rounded-button`/`rounded-card`, spacing scale), so a primitive matches the rest of the system.
- **Restraint still rules.** "Beautiful" here means crafted and consistent, not loud — spend brand color by tier (see `design-quality-rubric` Brand Influence Policy). A primitive earns brand color only on its Tier-1 moments (primary CTA, selected state), never by tinting its whole surface.

> The bar: a developer should be able to drop in a primitive and have it already look like it belongs in a premium store — because the variant, states, and tokens were designed, not defaulted.

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

❌ **NEVER hardcode colors.** No hex / `rgb()` / `hsl()` — hard-failed by the `check-design-tokens` gate. And by convention, no literal `text-white` / `bg-black` / `text-black` in `className` either (use `text-primary-foreground`, `text-inverse*`, etc.) — _everything_ is themed through `brand.css` tokens. Need a color that doesn't exist? Add the token, don't inline it.  
❌ **Don't ship the default primitive look** — extend the `cva` matrix with crafted variants + states (see "Beautify the primitive")  
❌ **Don't add `"use client"` unless needed** - Prefer Server Components  
❌ **Don't hand-roll a new primitive** when an existing shadcn/ui one can be extended via its `cva` map  
❌ **Don't use inline styles** for brand values - Use Tailwind classes backed by tokens

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
8. **Locale×channel pairs** — optional `NEXT_PUBLIC_STOREFRONT_LOCALE_CHANNELS=en:uk,ja:japan`. When set: invalid pairs 404; language switch navigates to the paired channel; region picker filters locales per market; hreflang keys use `bcp47` (`ja-JP`). When unset: any allowed locale × channel is valid, language switch keeps the current channel, hreflang keys stay language-only (`ja`). Must be `NEXT_PUBLIC_` — server (404 guard, hreflang) and client picker/nav share it. See `src/config/locale-channel.ts`, `seo-metadata.md`.
9. **`x-default`** — same as `NEXT_PUBLIC_DEFAULT_LOCALE` (+ that locale’s channel). Intentionally not a separate env.

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

**Translatable catalog slugs (Saleor 3.21+):** Product / category / collection / page URLs may use `translation.slug` per locale. Resolve with `slugLanguageCode` then primary fallback for **every** locale (`src/lib/catalog/resolve-by-slug.ts`); build links with `pickTranslatedSlug`; keep `entity.slug` as cache/webhook identity. Fetch all locale handles via `*LocaleSlugTranslations` aliases (`buildLocaleSlugMap`) for hreflang and zero-hop language switching. See `docs/adr/0004-translatable-slugs.md`.

**Invalidation:** Product update → `revalidateTag("product:{slug}")` → busts EN/PL/DE cached entries → `revalidatePath` for every `/{locale}/{channel}/products/{slug}`.

Full detail: `data-caching.md` § Locale & Caching.

## Implementation map (when migration starts)

| Concern         | Location (planned)                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| Route tree      | `src/app/(storefront)/[locale]/[channel]/…`                                                          |
| Locale config   | `src/config/locale.ts` — extend `available`, maps to `LanguageCodeEnum`                              |
| Channel guard   | move/extend current `[channel]/layout.tsx`                                                           |
| Links           | replace `LinkWithChannel` → locale-aware helper                                                      |
| Pathname helper | `useSelectedPathname` — strip `/{locale}/{channel}`                                                  |
| Middleware      | root redirect, optional `Accept-Language`, preference cookie                                         |
| GraphQL         | pass `languageCode` on public queries                                                                |
| Content         | `getStorefrontContent(channel, localeSlug)` — Saleor Models plain-text translations wired            |
| Picker          | header market + language UI (footer channel select retired or secondary)                             |
| SEO             | `hreflang`, canonical; sitemap only via chunked `generateSitemaps` (see `seo-metadata.md` § Sitemap) |

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
❌ **Overwriting `entity.slug` with the translation** — Breaks cache tags / webhooks; use `pickTranslatedSlug` for URLs only  
❌ **Assuming Saleor falls back between primary and translated slug lookups** — Client must try both (`resolveByPossiblyTranslatedSlug`)  
❌ **Keeping a translated slug when switching locale** — Foreign-language handles 404; rewrite to primary slug via `CatalogIdentityBridge`

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

Built-in slugs today: `en`, `pl`, `de`, `fr`, `fi`, `nb`, `ja`, `ko`.

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
2. Mirror in all locale files (`pl`, `de`, `fr`, `fi`, `nb`, `ja`, `ko`, …).
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
├── index.ts           # Public exports
├── config.ts          # Configuration (no static og:locale)
├── metadata.ts        # Page metadata helpers + resolveSeoDescription
├── metadata.test.ts
├── hreflang.ts        # Locale/channel hreflang + x-default
├── hreflang.test.ts
├── json-ld.ts         # Structured data helpers
└── og-brand-colors.ts
```

## Root / locale layout metadata

`rootMetadata` holds site-wide defaults (title template, icons, robots, OG siteName/images) **without** a hardcoded `og:locale`.

The storefront locale layout (`(storefront)/[locale]/layout.tsx`) exports params-only `generateMetadata` that sets `openGraph.locale` from the URL locale’s `ogLocale` (`ja` → `ja_JP`). Browse pages that call `buildBrowsePageMetadata` replace the OpenGraph block wholesale (and set locale + alternates themselves). Non-browse pages (login, account, cart) inherit the layout locale.

```typescript
// src/app/(storefront)/[locale]/layout.tsx — params-only, PPR-safe
export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale } = await params;
	const definition = resolveLocaleFromSlug(/* … */);
	return { ...rootMetadata, openGraph: { ...rootMetadata.openGraph, locale: definition.ogLocale } };
}
```

## Page Metadata

```typescript
import { buildBrowsePageMetadata, resolveSeoDescription } from "@/lib/seo";

export async function generateMetadata({ params }) {
	const product = await getProductData(/* … */);
	return buildBrowsePageMetadata({
		title: product.seoTitle || product.name,
		description: resolveSeoDescription({
			seoDescription: product.seoDescription,
			body: product.description,
			fallbackName: product.name,
		}),
		locale: params.locale,
		channel: params.channel,
		pathSuffix: catalogPathSuffix("products", product),
		pathSuffixByLocale: buildCatalogPathSuffixByLocale("products", buildLocaleSlugMap(product)),
		ogType: "product", // omits openGraph.type — see PDP og:type below
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

// In JSX (jsonLdScriptProps escapes `</script>` / U+2028 / U+2029 for inline scripts):
{jsonLd && <script {...jsonLdScriptProps(jsonLd)} />}
```

> **Never** inline `dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}` — plain
> `JSON.stringify` does not escape `<`, so a CMS-controlled value containing `</script>`
> breaks out of the script tag (CodeQL "improper code sanitization"). Use `jsonLdScriptProps`,
> or `serializeForInlineScript` from `@/lib/html/inline-script` for other inline scripts.

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

Use `buildBrowsePageMetadata` + `resolveSeoDescription` + JSON-LD (see International URLs and Product JSON-LD above). The live PDP is `src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx` — `ProductShell` hoists `og:type=product` after the product resolves; `generateMetadata` sets `ogType: "product"` so Next never receives an invalid `openGraph.type`.

## International URLs

Browse canonical URLs include locale and channel: `/{locale}/{channel}/…` (see `docs/adr/0001-locale-channel-url-routing.md`, `ui-locale-routing.md`).

- Use `buildBrowsePageMetadata()` for catalog/CMS pages — sets canonical + `hreflang` alternates, plus `og:locale` (from the URL locale's `ogLocale`) and `og:locale:alternate` for other **reachable** locales (matrix locales when `LOCALE_CHANNELS` is set; otherwise all `STOREFRONT_LOCALES`).
- Non-browse pages inherit `og:locale` from the storefront locale layout's `generateMetadata` — never hardcode a locale in OG tags.
- Meta/OG/JSON-LD descriptions: use `resolveSeoDescription()` — `seoDescription` → translated Editor.js plain text → name. Don't let them collapse to the bare entity name.
- **PDP `og:type=product`:** Next's metadata API **rejects** OG types outside its union at runtime (**E237** — throws and drops the page's whole metadata). `ogType: "product"` therefore omits `openGraph.type`, and `ProductShell` hoists `<meta property="og:type" content="product">` **only after the product resolves** (never on the missing-slug `notFound()` path — a sync-shell tag would advertise `product` on 404s). Trade-off: the tag sits behind the page `Suspense` boundary; bot UAs that wait on `generateMetadata` still get the rest of OG, and cached shells resolve quickly. Do **not** use `metadata.other: { "og:type": "product" }` — Next renders that as `name=`, not `property=`.
- `generateMetadata` `pathSuffix` is the path after locale/channel for **this** locale, e.g. `/products/${pickTranslatedSlug(product)}`.
- For translated catalog slugs (ADR 0004), also pass `pathSuffixByLocale` from `buildCatalogPathSuffixByLocale` / `buildLocaleSlugMap` so each `hreflang` points at that language’s handle.
- `<html lang>` is rendered server-side by the storefront root layout (`(storefront)/[locale]/layout.tsx`), derived from the URL locale segment (`htmlLang`, language-only) — no client patching.

```typescript
import { buildBrowsePageMetadata, resolveSeoDescription } from "@/lib/seo";
import { buildCatalogPathSuffixByLocale, buildLocaleSlugMap } from "@/lib/catalog/locale-slugs";
import { catalogPathSuffix } from "@/lib/catalog/canonical-slug";

return buildBrowsePageMetadata({
	title: category.name,
	description: resolveSeoDescription({
		seoDescription: category.seoDescription,
		body: category.description,
		fallbackName: category.name,
	}),
	locale: params.locale,
	channel: params.channel,
	pathSuffix: catalogPathSuffix("categories", category),
	pathSuffixByLocale: buildCatalogPathSuffixByLocale("categories", buildLocaleSlugMap(category)),
});
```

### hreflang keys and `x-default`

`buildLocaleHreflangAlternates()` (used by `buildBrowsePageMetadata`):

| Config                                      | hreflang keys                                | URLs                                             |
| ------------------------------------------- | -------------------------------------------- | ------------------------------------------------ |
| No `NEXT_PUBLIC_STOREFRONT_LOCALE_CHANNELS` | Language-only (`ja`, `en`) from `htmlLang`   | Each locale keeps the **current** page’s channel |
| Pairs set (`ja:japan,en:default,…`)         | Region-aware (`ja-JP`, `en-US`) from `bcp47` | Each locale uses its **paired** channel          |

**`x-default`** points at `NEXT_PUBLIC_DEFAULT_LOCALE` + that locale’s paired/default channel — same knob as the root redirect and invalid-locale fallback. Paper intentionally does **not** add a separate `x-default` env; change the demo/default locale if the fallback URL is wrong.

### Locale×channel pairs (SEO + navigation)

Optional `NEXT_PUBLIC_STOREFRONT_LOCALE_CHANNELS=en:uk,pl:pl` (see `src/config/locale-channel.ts`):

1. Invalid pairs → `notFound()`
2. Language switch navigates to the paired channel (Japanese → `japan`, etc.)
3. Region picker filters languages per market
4. hreflang becomes region-aware (table above)

When unset, any allowlisted locale × channel is valid and language switch **keeps** the current channel.

## Known Next.js / audit findings

- **Streaming metadata “duplicates”:** For normal browser UAs, Next may stream metadata into `<body>` then also place copies in `<head>` after hydration — DevTools can show 2× canonical / 18× hreflang. Bot UAs get blocking `<head>` metadata (`htmlLimitedBots`). Not a Paper double-`generateMetadata` bug; soft locale/market navigations can make leftovers more visible. Prefer curl/bot UA or settled head counts when auditing.
- **E237 `Invalid OpenGraph type: product`:** Closed OG type union in Next’s Metadata API; unknown types throw and abort the metadata RSC payload. Workaround: omit `openGraph.type` + hoist `<meta property="og:type" content="product">` in `ProductShell` only after the product resolves (never on 404).

## Sitemap & robots (do not ship naive)

Paper has **no** `sitemap.ts` / `robots.ts` yet (middleware already reserves `sitemap.xml` / `robots.txt`). On-page canonical + hreflang cover most crawl signals; a wrong sitemap is worse than none.

**Why a single `sitemap.ts` dump fails at scale**

- URL cardinality ≈ products × locales × channels (plus categories / collections / pages). 10k SKUs × 8 locales × 5 channels ≈ 400k product URLs alone.
- Protocol / Google limits: **≤50k URLs and ≤50MB per sitemap file**.
- Live Saleor GraphQL walks of the full catalog risk timeouts, serverless memory, and slow TTFB.
- Translated slugs (ADR 0004) mean each locale may need its own handle — you cannot stamp one primary-slug list across languages.

**Required shape when implementing**

1. **Sitemap index + chunks** via Next [`generateSitemaps`](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps) (`/sitemap.xml` → `/sitemap/0.xml`, …), ~≤40–50k URLs each.
2. **Paginate Saleor with cursors** (`first` / `after`) per chunk — never load the full catalog into memory.
3. **Chunk by stable dimensions** (e.g. `{channel}:{locale}:{entity}:{page}` or at least `{channel}:{page}`), not one global product offset.
4. **Respect `LOCALE_CHANNELS`:** when set, emit only paired locale×channel URLs (same set as hreflang). When unset, avoid a blind full cross-product — prefer channel-scoped chunks; on-page hreflang already advertises language alternates.
5. **Cache aggressively** (long CDN/`Cache-Control`); invalidate via existing PRODUCT\_\* / catalog webhook tags. Mega catalogs may need a background export / blob rather than GraphQL-at-request.
6. Ship **`robots.ts` first** (disallow `noIndexPaths`, eventually `Sitemap:` → index URL), then chunked sitemaps.

| Catalog size              | Approach                                                            |
| ------------------------- | ------------------------------------------------------------------- |
| Demo / ≲5k SKUs × few L×C | Few chunks; on-demand GraphQL OK                                    |
| Mid (tens of k)           | `generateSitemaps` + cursor pagination per channel                  |
| Huge (100k+)              | Precompute / background pipeline; storefront serves cached XML only |

## Disabling SEO

To remove SEO features entirely:

1. Delete `src/lib/seo/` folder
2. Remove `rootMetadata` / locale `generateMetadata` from layouts
3. Remove `buildPageMetadata`/`buildProductJsonLd` from pages
4. Delete `src/app/api/og/`

## Anti-patterns

❌ **Don't hardcode metadata** — Use the helpers  
❌ **Don't skip JSON-LD on product pages** — Important for search  
❌ **Don't forget `noIndexPaths`** — Exclude checkout, cart  
❌ **Don't set `openGraph.type: "product"`** — Triggers Next E237 and drops all page metadata  
❌ **Don't hoist PDP `og:type` on the sync shell before the product resolves** — 404 URLs would advertise `product`  
❌ **Don't hardcode `og:locale` to `en_US`** — Derive from the URL locale  
❌ **Don't list unpaired locales in `og:locale:alternate`** — When `LOCALE_CHANNELS` is set, alternate locales must match the matrix (same as hreflang)  
❌ **Don't treat DevTools double tags as a Paper SEO bug** — Check streaming metadata / bot UA first  
❌ **Don't add a monolithic `sitemap.ts` that loads every product×locale×channel** — Use index + chunks; see Sitemap & robots above

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
