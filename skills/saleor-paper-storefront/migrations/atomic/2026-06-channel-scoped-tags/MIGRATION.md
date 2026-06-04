# Migration: Channel-scoped cache tags

## Intent

Scope nav/footer cache tags per channel (`navigation:{channel}`, `footer-menu:{channel}`) so invalidating one channel's menu does not flush all channels. Add shared channel slug discovery for revalidation fan-out.

## Upstream reference

- **Commit:** [`e0ba7249`](https://github.com/saleor/storefront/commit/e0ba7249)

## Prerequisites

- [`2026-06-cache-manifest-v3`](../2026-06-cache-manifest-v3/MIGRATION.md)
- [`2026-06-menu-data-layer`](../2026-06-menu-data-layer/MIGRATION.md)

## Optional

**Ask user** (manifest `skipPrompt`): skip if single-channel storefront with no multi-channel invalidation needs.

If skipped, record `skipped: true` — dependent `2026-06-channel-allowlist` and `2026-06-menu-webhooks` may need skip too.

## Out of scope

- Footer channel selector styling

## Steps

### 1. cache-manifest tag patterns `[architecture]`

- `navigation:{channel}`, `footer-menu:{channel}`
- `buildTag` validates channel placeholder
- Manifest v2+ channel scoping

### 2. channel-slugs.ts `[architecture]`

Shared `getStorefrontChannelSlugs()` for revalidation fan-out.

### 3. Menu data layer tags `[architecture]`

`getNavbarMenuItems` / `getFooterMenuItems` pass `{ channel }` to `applyCacheProfile`.

### 4. Revalidate route `[architecture]`

Support `?tag=navigation&channel=us` shorthand and `?all=1` for all channels.

## Verify

[`verify.md`](verify.md)

## Record

`e0ba7249`
