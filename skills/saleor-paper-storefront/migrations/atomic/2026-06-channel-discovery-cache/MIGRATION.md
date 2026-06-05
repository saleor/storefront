# Migration: PPR-safe channel discovery

## Intent

When `STOREFRONT_DISCOVER_CHANNELS=true`, channel slug resolution runs in `[channel]/layout.tsx` (route guard) and `generateStaticParams`. An **uncached** `ChannelsList` fetch there breaks Cache Components builds:

```
Uncached data was accessed outside of <Suspense>
Route "/[channel]/account/addresses"
```

Route discovery through the same **`"use cache"`** helper as the footer (`getCachedChannelsList`), not a separate `executePublicGraphQL` in `channel-slugs.ts`.

## Upstream reference

- **Commit:** [`223382c0`](https://github.com/saleor/storefront/commit/223382c0) — `Refactor channel retrieval and caching logic`

## Prerequisites

- [`2026-06-channel-allowlist`](../2026-06-channel-allowlist/MIGRATION.md)
- [`2026-06-menu-data-layer`](../2026-06-menu-data-layer/MIGRATION.md) — provides `getCachedChannelsList()`

## Out of scope

- Replacing `STOREFRONT_DISCOVER_CHANNELS` with `STOREFRONT_CHANNELS` (operational choice; see `ui-channels.md`)
- Account route Suspense (see [`2026-06-account-ppr-auth`](../2026-06-account-ppr-auth/MIGRATION.md))

## Steps

### 1. Discovery uses cached ChannelsList `[architecture]`

In `src/lib/channel-slugs.ts`:

- Import `getCachedChannelsList` from `@/lib/channels/get-channels-data`
- `discoverActiveChannelsFromApi()` calls `getCachedChannelsList()`, then derives slugs (e.g. `activeChannelSlugsFromList()`)
- **Remove** direct `executePublicGraphQL(ChannelsListDocument, …)` from this file

### 2. Keep resolution order `[architecture]`

Unchanged:

1. `STOREFRONT_CHANNELS` → sync env list
2. Discovery + token → cached API list
3. `NEXT_PUBLIC_DEFAULT_CHANNEL` fallback

`getStorefrontChannelSlugs` stays wrapped in `React.cache()`.

## Verify

[`verify.md`](verify.md)

## Record

`223382c0`
