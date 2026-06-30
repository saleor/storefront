---
name: paper-architecture
description: Canonical Next.js 16 App Router stance for Paper: Server Components by default, Server Actions, Cache Components (PPR), BFF auth, two surfaces. Read first when unfamiliar with the codebase or making cross-cutting architectural changes.
---

# Paper architecture (canonical Next.js)

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
❌ **Don't fix PPR build errors by wrapping only `<main>{children}</main>` in Suspense** — add a layout/page shell that owns the async fetch, with a real skeleton (see § Layout shell Suspense)  
❌ **Don't duplicate architecture essays in feature PRs** — extend this file or an ADR if the decision is cross-cutting
