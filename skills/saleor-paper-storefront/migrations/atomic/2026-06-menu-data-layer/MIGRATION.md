# Migration: Menu data layer

## Intent

Move `"use cache"` from layout components (`NavLinks`, footer) into dedicated data modules. Components become thin async wrappers + presentational views — matches Next.js guidance (cache at data boundary).

## Upstream reference

- **Commit:** [`72a0a6d6`](https://github.com/saleor/storefront/commit/72a0a6d6)

## Prerequisites

- [`2026-06-cache-manifest-v3`](../2026-06-cache-manifest-v3/MIGRATION.md)

## Out of scope

- Footer/header visual design (preserve fork classNames)
- Channel-scoped tags (next optional migration)

## Discovery

Search: `"use cache"` in `nav-links.tsx`, `footer.tsx`, `MenuDocument`, `executePublicGraphQL.*menu`.

## Steps

### 1. Create get-menu-data.ts `[architecture]`

`src/lib/menus/get-menu-data.ts`:

- `getNavbarMenuItems(channel)` — `"use cache"`, menu slug `navbar`, cache tags via manifest
- `getFooterMenuItems(channel)` — footer slug

### 2. Create get-channels-data.ts if footer lists channels `[architecture]`

`src/lib/channels/get-channels-data.ts` — cached `ChannelsList` when token present.

### 3. Split presentation `[architecture]` + `[presentation-default]`

- `NavLinksView` — presentational; **keep fork styling** if file exists
- `NavLinks` — thin wrapper: fetch → view
- `FooterMenuColumns` or equivalent for footer menus

### 4. Remove `"use cache"` from footer.tsx / nav shell `[architecture]`

Footer/header orchestrate only; no direct cached GraphQL in UI files.

## Verify

[`verify.md`](verify.md)

## Record

`72a0a6d6`
