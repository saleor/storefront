# 2026-10-data-kernel

Adopt `src/lib/saleor/` as the only Saleor access path.

`upstreamSha` in the manifest stays empty until the commit that releases this migration exists. Do not invent one.

## Steps

1. Move fork edits inside core `.graphql` operations into `src/graphql/extensions/*.graphql`.
2. Move direct `executePublicGraphQL` / `fetch` Saleor calls into a loader under `src/lib/custom/` using `cachedQuery`, `liveQuery`, `sessionQuery`, or `mutate`.
3. Remove any try/catch or `null` fallback a fork wrapped around a cached loader. `cachedQuery` now throws on partial GraphQL errors too, and Next fails a prerender when a `"use cache"` fill throws even if it is caught. A read that is genuinely optional passes `allowPartialData: true`.
4. If a fork file calls an app-token operation (`ChannelsListDocument`, `OrdersByNumberDocument`, or a fork operation with `auth: "app"`), route it through the existing loader or add the file to `APP_AUTH_CALLERS` in `eslint/paper-data-layer.mjs` with a reason.
5. If a fork file under `src/lib/saleor/` must stay different, add `{ "path", "reason" }` to `paper-version.json` `coreOverrides`. Otherwise copy the upstream directory.
6. Run `pnpm data:lock`, `pnpm core:lock:check`, and `pnpm run verify`. The lock is keyed by file and function now, so expect a one-time rewrite of every row.
