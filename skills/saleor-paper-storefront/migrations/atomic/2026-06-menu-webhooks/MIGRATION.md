# Migration: Menu webhook revalidation

## Intent

Invalidate nav/footer caches when Saleor menus change, instead of waiting for menus TTL (~1 hr). Storefront `/api/revalidate` accepts menu webhook payloads.

## Upstream reference

- **Commit:** [`7a0eda01`](https://github.com/saleor/storefront/commit/7a0eda01)

## Prerequisites

- [`2026-06-menu-data-layer`](../2026-06-menu-data-layer/MIGRATION.md)
- [`2026-06-channel-scoped-tags`](../2026-06-channel-scoped-tags/MIGRATION.md) (or skipped with user aware)

## Optional

**Ask user** (manifest `skipPrompt`): skip if relying on TTL only or paper-app not used.

## paper-app (manual — v1)

Storefront changes alone are insufficient for automatic menu events. **Manual prerequisite:**

1. Upgrade [saleor-paper-app](https://github.com/saleor/saleor-paper-app) to a version forwarding `MENU_*` / `MENU_ITEM_*` webhooks (upstream ~`df9df0e`).
2. Reinstall/sync app with `MANAGE_MENUS` permission.
3. Confirm webhook deliveries in Saleor Dashboard.

Do not automate cross-repo steps in v1.

## Steps

### 1. cache-manifest menu revalidation `[architecture]`

- `STOREFRONT_MENU_SLUGS`, `planMenuRevalidation()`
- Map navbar/footer slugs to tags + profiles

### 2. Revalidate route menu branch `[architecture]`

Handle `{ menu: { slug } }` and menu item payloads; fan out `revalidateTag` across `getStorefrontChannelSlugs()`.

### 3. Tests `[architecture]`

Port `cache-manifest.test.ts` menu cases if missing.

## Verify

[`verify.md`](verify.md)

## Record

`7a0eda01`
