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
