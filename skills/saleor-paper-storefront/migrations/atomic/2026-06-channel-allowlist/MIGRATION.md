# Migration: Storefront channel allowlist

## Intent

Prevent every Saleor channel from becoming a storefront route. Explicit allowlist via `STOREFRONT_CHANNELS`; opt-in API discovery; `notFound()` for disallowed channel slugs.

## Upstream reference

- **Commit:** [`3553c93e`](https://github.com/saleor/storefront/commit/3553c93e)

## Prerequisites

- [`2026-06-channel-scoped-tags`](../2026-06-channel-scoped-tags/MIGRATION.md) (applied or consciously skipped with user confirmation)

## Optional

**Ask user** (manifest `skipPrompt`): skip if fork intentionally exposes all Saleor channels.

## Out of scope

- Channel selector dropdown styling

## Steps

### 1. src/config/channels.ts `[architecture]`

- Parse `STOREFRONT_CHANNELS`
- `STOREFRONT_DISCOVER_CHANNELS` opt-in
- Helpers: `getConfiguredStorefrontChannelSlugs`, `needsAsyncChannelDiscovery`

### 2. channel-slugs.ts resolution order `[architecture]`

1. `STOREFRONT_CHANNELS`
2. Discovery + token (if enabled) — **must** use `getCachedChannelsList()` (`"use cache"`), not raw `executePublicGraphQL` in the layout path (see [`2026-06-channel-discovery-cache`](../2026-06-channel-discovery-cache/MIGRATION.md))
3. Default channel only

Use `React.cache()` for dedupe. Requires [`2026-06-menu-data-layer`](../2026-06-menu-data-layer/MIGRATION.md) before discovery works under Cache Components.

### 3. Route guard `[architecture]`

`src/app/[channel]/layout.tsx` — `notFound()` for slugs not in allowlist.

### 4. Footer channel list `[architecture]`

Filter API channels to allowlist; skip fetch for single-channel.

### 5. .env.example `[architecture]`

Document new env vars.

### Migration note for existing forks

Token-only multi-channel setups must set `STOREFRONT_CHANNELS` or `STOREFRONT_DISCOVER_CHANNELS=true`.

## Verify

[`verify.md`](verify.md)

## Record

`3553c93e`
