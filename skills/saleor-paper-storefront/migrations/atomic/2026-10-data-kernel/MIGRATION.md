# 2026-10-data-kernel

Adopt `src/lib/saleor/` as the only Saleor access path.

`upstreamSha` in the manifest stays empty until the commit that releases this migration exists. Do not invent one.

## Steps

1. Move fork edits inside core `.graphql` operations into `src/graphql/extensions/*.graphql`.
2. Move direct `executePublicGraphQL` / `fetch` Saleor calls into a loader under `src/lib/custom/` using `cachedQuery`, `liveQuery`, `sessionQuery`, or `mutate`.
3. If a fork file under `src/lib/saleor/` must stay different, add `{ "path", "reason" }` to `paper-version.json` `coreOverrides`. Otherwise copy the upstream directory.
4. Run `pnpm data:lock`, `pnpm core:lock:check`, and `pnpm run verify`.
