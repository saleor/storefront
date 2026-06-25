# Paper Storefront — Caching Architecture Reference

Background for the `2026-06-cache-ppr` migration batch. For upgrade steps, use [`../atomic/`](../atomic/) migrations and [`../SKILL.md`](../SKILL.md).

## Next.js 16 mental model

Paper targets **Next.js 16** with `cacheComponents: true`. Cache Components and `"use cache"` are **stable** in 16 (replacing the Next.js 15 `experimental.ppr` / `experimental.dynamicIO` flags). `'use cache: private'` remains experimental — Paper does not use it.

With `cacheComponents: true`, caching is opt-in via `"use cache"`:

| Old (Next 14/15)                         | New (Next 16 + Cache Components)        |
| ---------------------------------------- | --------------------------------------- |
| Cache everything by default              | Cache **nothing** by default            |
| Opt out with `dynamic = 'force-dynamic'` | Opt **in** with `"use cache"`           |
| Route-level ISR                          | Function-level `cacheLife` + `cacheTag` |

Three layers: static shell (cached functions), dynamic holes (`Suspense` + runtime APIs), invalidation (`cacheTag` + webhooks).

## E-commerce freshness

> **Display pages are cached for performance. Transactional flows are always real-time.**

| Surface                     | Freshness                | Mechanism                            |
| --------------------------- | ------------------------ | ------------------------------------ |
| PDP, PLP, homepage          | Cached (~5 min fallback) | `"use cache"` + webhooks             |
| Navigation, footer          | Cached (~1 hr fallback)  | `"use cache"` menus tier             |
| Cart, checkout, add-to-cart | Always fresh             | `cache: "no-cache"` / Server Actions |

Stale PDP price is acceptable; Saleor recalculates at cart and checkout.

## Locale

Browse URLs are `/{locale}/{channel}/…`. Cached catalog fetches take `localeSlug` — separate cache entry per language, same TTL and warm-path speed. Invalidation tags stay slug-scoped; webhooks revalidate every locale path via `buildPathsForAllLocales()`. See `data-caching.md` § Locale & Caching.

## Target architecture (post-migration)

```
ProductPage (sync shell)
└── Suspense
    └── ProductShell (params only → getProductData(slug, channel, locale) "use cache")
        ├── breadcrumbs, h1, attributes, JSON-LD
        ├── Suspense → VariantGalleryDynamic (searchParams)
        └── Suspense → VariantSectionDynamic (searchParams)

Layout
├── Suspense → Header (cached menus, dynamic cart/user)
├── main → page children (route loading.tsx participates)
├── Suspense → Footer (cached menus + channels)
└── Suspense → CartDrawer (cookies, no-cache)
```

## Key project files

| Purpose           | Location                                               |
| ----------------- | ------------------------------------------------------ |
| Cache manifest    | `src/lib/cache-manifest.ts`                            |
| cacheLife tiers   | `src/lib/cache-life-profiles.ts`                       |
| Menu data         | `src/lib/menus/get-menu-data.ts`                       |
| Catalog data      | `src/lib/catalog/`                                     |
| GraphQL locale    | `src/lib/graphql-locale.ts`, `src/config/locale.ts`    |
| Translation merge | `src/lib/saleor-translations.ts`                       |
| Channel config    | `src/config/channels.ts`, `src/lib/channel-slugs.ts`   |
| Revalidation      | `src/app/api/revalidate/route.ts`                      |
| Timeless rules    | `skills/saleor-paper-storefront/rules/data-caching.md` |

## Anti-patterns

- `cache: "no-cache"` on display/catalog data
- Authenticated fetch inside `"use cache"`
- `searchParams` at page top level (collapses PPR shell)
- `"use cache"` on whole layout components (cache at data boundary)
- Omitting `localeSlug` from cached catalog/menu fetches (wrong language across locales)
