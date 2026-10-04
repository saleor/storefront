# Saleor kernel (Paper core)

Forks do not edit this directory. Paper replaces it wholesale on upgrade.

- Call `cachedQuery`, `liveQuery`, `sessionQuery`, or `mutate` from `@/lib/saleor`.
- Extra fields go in `src/graphql/extensions/`.
- Extra profiles, webhook events, and operations go in `src/config/data-extensions.ts`.
- Fork loaders go in `src/lib/custom/`.
- A hash mismatch against `paper-core.lock.json` must be declared in `paper-version.json` `coreOverrides`.

See `skills/saleor-paper-storefront/rules/data-access.md`.
