---
name: data-access
description: Canonical Saleor access. Use cachedQuery, liveQuery, sessionQuery, or mutate from @/lib/saleor. Use when adding a GraphQL field, a cached entity, a live query, a mutation, or a webhook invalidation. Never call Saleor from UI code or pass fetch revalidate.
---

# Data access

Saleor is reached through `src/lib/saleor`. Loaders keep the `"use cache"` directive. The kernel applies the manifest profile, so a cached read outside `"use cache"` throws, and a transport failure is not cached.

| You need                                   | Call                                            | Where                                                                                    |
| ------------------------------------------ | ----------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Catalog, menus, content that webhooks bust | `cachedQuery(doc, { profile, tag, variables })` | Inside `"use cache"` in `src/lib/{catalog,menus,channels,content,search,account,custom}` |
| Search, filtered listings, checkout-by-id  | `liveQuery`                                     | Server, not inside `"use cache"`                                                         |
| `me`, orders, account reads                | `sessionQuery`                                  | Server. Request-memoized. Never cached                                                   |
| Cart, checkout, account writes             | `mutate`                                        | `"use server"` modules only. Then `refresh()`, never `revalidatePath`                    |
| Auth BFF without a document                | `rawMutation`                                   | `src/app/api/auth/*` only                                                                |

Auth comes from `src/lib/saleor/operations.ts`, not from the call. A cached operation may also be read live (the listing long tail). A session read or a mutation cannot be cached.

## Recipes

**Add a field a fork owns.** Edit `src/graphql/extensions/*.graphql`. Do not edit the core operation. Run `pnpm generate`.

**Add a cached entity.** Add a profile to `src/lib/saleor/cache/manifest.ts` (or `src/config/data-extensions.ts` on a fork), a loader that calls `cachedQuery`, and a webhook scope in `webhook-events.ts`. Run `pnpm data:lock`.

**Add a mutation.** Add the `.graphql` document, register it as `mutate` in `operations.ts`, call `mutate` from a server action.

**Opt in a webhook.** Add the event to `WEBHOOK_EVENT_SCOPES`. Unmapped events skip. There is no catch-all purge.

## After a data change

`pnpm data:lock` rewrites `data-layer.lock.md`. Review that diff: it is the cost surface. `pnpm core:lock` only when `src/lib/saleor/` itself changed on purpose.

## Anti-patterns

- `cache` / `revalidate` on a Saleor call. Freshness is the manifest profile plus webhooks.
- `executeGraphQL` or `fetch` to `NEXT_PUBLIC_SALEOR_API_URL` outside the kernel.
- `cacheTag` / `cacheLife` / `revalidateTag` / `revalidatePath` outside the kernel.
- Returning `null` or `[]` from `"use cache"` when Saleor failed. Throw. A missing entity is still `null`.
- Importing `@/checkout/*` from storefront code. URLs go through `@paper/session-bridge`.
