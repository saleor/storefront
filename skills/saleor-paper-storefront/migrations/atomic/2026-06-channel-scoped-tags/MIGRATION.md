# Migration: Channel-scoped cache tags

## Intent

Scope nav/footer cache tags per channel (`navigation:{channel}`, `footer-menu:{channel}`) so invalidating one channel's menu does not flush all channels. Add shared channel slug discovery for revalidation fan-out.

## Upstream reference

- **Commit:** [`e0ba7249`](https://github.com/saleor/storefront/commit/e0ba7249)

## Prerequisites

None in manifest — this migration shipped before cache-life and menu-data-layer in upstream git.

If [`2026-06-cache-manifest-v3`](../2026-06-cache-manifest-v3/MIGRATION.md) is not applied yet, port tag patterns onto the fork's current manifest/revalidate code; reconcile with manifest v3 when that migration runs.

If nav/footer still use inline `"use cache"` (menu-data-layer not applied), apply channel-scoped tags at the current fetch sites. [`2026-06-menu-data-layer`](../2026-06-menu-data-layer/MIGRATION.md) will move fetches into `get-menu-data.ts` — ensure channel tags follow the data layer.

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
