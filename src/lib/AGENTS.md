# Storefront data

Saleor is reached through `@/lib/saleor`. Read `skills/saleor-paper-storefront/rules/data-access.md` before changing how Paper calls Saleor.

- Catalog reads: `cachedQuery` inside `"use cache"`, profile from `CACHE_PROFILES`.
- Search and filtered listings: `liveQuery`. Do not cache filter permutations.
- Customer reads: `sessionQuery`. Mutations: `mutate` in a server action, then `refresh()`.
- Do not pass `cache` or `revalidate` into a Saleor call.
- Do not import `@/lib/saleor/*` internals or `@/checkout/*` from storefront UI.
- After a data change, run `pnpm data:lock` and review `data-layer.lock.md`.
