# Migration: Cache manifest v3

## Intent

Centralize cache tag → profile mapping in `cache-manifest.ts` (v3), use named tiers from cache-life-profiles, and batch `revalidateTag` calls. Enables consistent webhook and manual invalidation.

## Upstream reference

- **Commit:** [`9f662a68`](https://github.com/saleor/storefront/commit/9f662a68) (same commit as cache-life-profiles)

## Prerequisites

- [`2026-06-cache-life-profiles`](../2026-06-cache-life-profiles/MIGRATION.md) applied

## Before you start

Run [`detect.md`](detect.md).

## Out of scope

- Styling
- Channel-scoped tags (next migration)

## Discovery

Search for `cacheTag`, `revalidateTag`, `/api/revalidate` if `cache-manifest.ts` missing or renamed.

## Steps

### 1. Port or update cache-manifest.ts `[architecture]`

- Map tags (`product:{slug}`, `category:{slug}`, etc.) to `catalog` / `menus` / `channels` profiles
- Export helpers: `applyCacheProfile`, `buildTag`, tag registry constants
- Manifest version ≥ 3

### 2. Add revalidate-tags helper `[architecture]`

Create `src/lib/revalidate-tags.ts` with parallel `revalidateTag(tag, profile)` batching if missing.

### 3. Wire revalidate route `[architecture]`

Update `src/app/api/revalidate/route.ts` to use manifest helpers and two-arg `revalidateTag(tag, profile)`.

### 4. Update cached functions `[architecture]`

Ensure `"use cache"` functions call `cacheLife("catalog")` / `cacheLife("menus")` via manifest helpers, not generic `"minutes"`.

## Verify

See [`verify.md`](verify.md).

## Record

`upstreamSha`: `9f662a68`
