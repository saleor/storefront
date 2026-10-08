# Saleor kernel (Paper core)

Forks do not edit this directory. Paper replaces it wholesale on upgrade.

- Call `cachedQuery`, `liveQuery`, `sessionQuery`, or `mutate` from `@/lib/saleor`.
- `cachedQuery` throws on transport failures and on any GraphQL `errors`, even with partial data. Never return `null` from a cached loader to hide a failure.
- An optional cached read that must not fail the build passes `allowPartialData: true`. A try/catch around a cached loader does not help: Next fails the prerender when a `"use cache"` fill throws.
- App-token operations (`auth: "app"` in `operations.ts`) are callable only from `APP_AUTH_CALLERS` in `eslint/paper-data-layer.mjs`.
- Extra fields go in `src/graphql/extensions/`.
- Extra profiles, webhook events, and operations go in `src/config/data-extensions.ts`.
- Fork loaders go in `src/lib/custom/`.
- A hash mismatch against `paper-core.lock.json` must be declared in `paper-version.json` `coreOverrides`.

See `skills/saleor-paper-storefront/rules/data-access.md`.
