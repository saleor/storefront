# Migration: Named cacheLife tiers

## Intent

Register domain-specific `cacheLife` profiles (`catalog`, `menus`, `channels`) in Next.js config and remove redundant fetch-level `revalidate` from `"use cache"` functions. Cached GraphQL should rely on `cacheLife()` + webhooks, not duplicate TTL on fetch.

## Upstream reference

- **Commit:** [`9f662a68`](https://github.com/saleor/storefront/commit/9f662a68) — Named cacheLife tiers and drop redundant fetch revalidate

## Prerequisites

- Next.js 16 with `cacheComponents: true` in `next.config.js`
- Existing `"use cache"` usage on catalog/menu fetches (or planned)

## Before you start

Run [`detect.md`](detect.md). If optional N/A.

## Out of scope

- Styling, UI components
- Checkout/cart caching (always fresh)

## Discovery

If paths differ, search for: `cacheLife("minutes")`, `revalidate: 300` inside cached functions, `next.config.js` cacheLife block.

## Steps

### 1. Add tier definitions `[architecture]`

Create or port `src/lib/cache-life-profiles.data.mjs` and `src/lib/cache-life-profiles.ts`:

- Profiles: `catalog` (~5 min), `menus` (~1 hr), `channels` (~1 day)
- Export `paperCacheLifeProfiles` for `next.config.js`

Reference upstream files; adjust only if fork uses different TTL needs (document in commit message).

### 2. Register in next.config.js `[architecture]`

Import `paperCacheLifeProfiles` and pass to Next.js `cacheLife` config (see upstream `next.config.js`).

### 3. Replace generic profile names `[architecture]`

In cached functions and manifest (next migration), replace `"minutes"` / `"hours"` with `catalog` / `menus` / `channels` as appropriate.

### 4. Remove fetch `revalidate` from `"use cache"` functions `[architecture]`

Search `"use cache"` functions for `revalidate: 300` (or similar) on `executePublicGraphQL` calls. Remove — `cacheLife` owns TTL.

## Presentation-default rule

N/A for this migration (config/lib only).

## Verify

See [`verify.md`](verify.md).

## Record

Append to `paper-version.json` with `upstreamSha`: `9f662a68`.
