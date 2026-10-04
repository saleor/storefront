# Data kernel baseline (pre-change, commit b73bdce3)

Captured from the source inventory before `src/lib/saleor` existed. A production route table and HAR were not captured in this change: `next build` prerenders against a live Saleor. Re-capture with `pnpm build` and `pnpm har:analyze` when comparing a fork.

## Expected differences after the kernel

- Search no longer uses fetch `revalidate: 60`. It is a live query.
- Category slug resolution no longer uses fetch `revalidate: 3600`. It is `"use cache"` on the categories profile.
- Cached loaders throw on Saleor failure instead of caching `null` or `[]`.

## Saleor call shapes before

- Public, session, and app executors in `src/lib/graphql.ts`, plus raw queries for auth.
- 15 `"use cache"` functions, all using `applyCacheProfile`.
- Two manifest bypasses: `src/lib/search/saleor-provider.ts` (`revalidate: 60`) and `src/ui/components/plp/filter-utils.server.ts` (`revalidate: 3600`).
- UI and account pages called the executor directly.

## TTLs

`catalog` and `menus`: stale 5 min, revalidate 1 hour, expire 1 day. `channels`: revalidate 1 day, expire 1 week.
