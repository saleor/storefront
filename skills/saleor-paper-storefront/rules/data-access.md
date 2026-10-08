---
name: data-access
description: Canonical Saleor access. Use cachedQuery, liveQuery, sessionQuery, or mutate from @/lib/saleor. Use when adding a GraphQL field, a cached entity, a live query, a mutation, or a webhook invalidation. Never call Saleor from UI code or pass fetch revalidate.
---

# Data access

Saleor is reached through `src/lib/saleor`. Loaders keep the `"use cache"` directive. The kernel applies the manifest profile, so a cached read outside `"use cache"` throws.

`cachedQuery` throws `SaleorDataError` on a transport failure and on any GraphQL `errors`, even when Saleor also sent partial data. A resolver failure arrives as `{ product: null, errors }`; caching it would serve a 404 for the catalog TTL. Next.js does not cache a throw. A missing entity with no errors is still `null`. `liveQuery`, `sessionQuery`, and `mutate` return partial data as `ok: true` with `partialErrors`, and log them.

Do not wrap a cached loader in try/catch to make it optional: Next.js fails the prerender when a `"use cache"` fill throws, even if the caller catches it. An optional read whose degraded result is safe for the whole profile TTL passes `allowPartialData: true` (today only `ChannelsList`, where a token without channel permissions is a deployment setting). The lock marks those rows `(allows partial data)`. Never use it for catalog entities.

| You need                                   | Call                                            | Where                                                                                          |
| ------------------------------------------ | ----------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Catalog, menus, content that webhooks bust | `cachedQuery(doc, { profile, tag, variables })` | Inside `"use cache"` in `src/lib/{catalog,menus,channels,content,listing,account,custom}`      |
| Search, filtered listings, checkout-by-id  | `liveQuery`                                     | Server, not inside `"use cache"`. Listings go through `loadListing`, not a direct call         |
| `me`, orders, account reads                | `sessionQuery`                                  | Server. Request-memoized. Never cached                                                         |
| Cart, checkout, account writes             | `mutate`                                        | `"use server"` modules only. Then `refresh()`, never `revalidatePath`                          |
| Auth BFF without a document                | `rawMutation`                                   | `src/app/api/auth/*` and the few files in `RAW_MUTATION_ALLOW` (`eslint/paper-data-layer.mjs`) |

Auth comes from `src/lib/saleor/operations.ts`, not from the call. A cached operation may also be read live (the listing long tail). A session read or a mutation cannot be cached.

**App-token operations** (`auth: "app"`, today `ChannelsList` and `ordersByNumber`) run with `SALEOR_APP_TOKEN`. Only files in `APP_AUTH_CALLERS` (`eslint/paper-data-layer.mjs`, rule `paper/app-auth-callers`) may call them. A contract test keeps that rule's document list in sync with the registry. Adding a caller is a reviewed exception: the token can read data no shopper should see.

## Recipes

**Add a field a fork owns.** Edit `src/graphql/extensions/*.graphql`. Do not edit the core operation. Run `pnpm generate`.

**Add a cached entity.** Add a profile to `src/lib/saleor/cache/manifest.ts` (or `src/config/data-extensions.ts` on a fork), a loader that calls `cachedQuery`, and a webhook scope in `src/lib/saleor/invalidation/webhook-events.ts` (or `data-extensions.ts`). Run `pnpm data:lock`.

**Add a mutation.** Add the `.graphql` document, register it as `mutate` in `src/lib/saleor/operations.ts` (or `data-extensions.ts`), call `mutate` from a server action.

**Opt in a webhook.** Add the event to `WEBHOOK_EVENT_SCOPES`. Unmapped events skip. There is no catch-all purge.

## After a data change

`pnpm data:lock` rewrites `data-layer.lock.md`. Review that diff: it is the cost surface. Rows are keyed by file and enclosing function (`file › function`), not line numbers, so a formatting change does not touch the lock. `pnpm core:lock` only when `src/lib/saleor/` itself changed on purpose.

CI runs `data:lock:check`, `core:lock:check`, and `guardrails:canary` (each data-layer lint rule must still fire on a known-bad file). Run `pnpm run verify` locally; it covers the first two.

## Anti-patterns

- `cache` / `revalidate` on a Saleor call. Freshness is the manifest profile plus webhooks.
- `executeGraphQL` or `fetch` to `NEXT_PUBLIC_SALEOR_API_URL` outside the kernel.
- Calling an app-token operation from a file outside `APP_AUTH_CALLERS`.
- `cacheTag` / `cacheLife` / `revalidateTag` / `revalidatePath` outside the kernel.
- Returning `null` or `[]` from `"use cache"` when Saleor failed. Throw. A missing entity is still `null`.
- Importing `@/checkout/*` from storefront code. URLs go through `@paper/session-bridge`.
