# ADR 0005: Saleor data kernel and access modes

**Status:** Accepted (implemented)
**Date:** 2026-10-04

## Decision

Every Saleor call goes through `src/lib/saleor` as one of four modes: `cachedQuery`, `liveQuery`, `sessionQuery`, `mutate`. The operation registry chooses auth. `"use cache"` stays written on loaders, because closure variables become cache keys and must be serializable, so a factory that hides the directive is fragile. `cachedQuery` calls `cacheLife`, which throws outside a cache scope.

A transport or GraphQL failure inside `cachedQuery` throws. That includes a partial response: a resolver failure arrives as `{ product: null, errors }`, and caching it would serve a 404 for the catalog TTL. Next.js does not cache a thrown error, so an outage cannot stick. A missing entity with no errors is still `null`. Uncached modes return partial data with `partialErrors`. An optional cached read whose degraded result is safe for the whole TTL opts out with `allowPartialData` (channel metadata); try/catch around a cached loader does not work, because Next.js fails the prerender when a `"use cache"` fill throws.

Operations that run with the app token are callable only from a named allowlist (`paper/app-auth-callers`). Otherwise the registry would grant that privilege to any file that imports the document.

Enforcement is layered: the API, ESLint boundaries with named allowlists, contract tests, `data-layer.lock.md`, and `paper-core.lock.json`. The data lock keys rows by file and enclosing function, not line numbers, so formatting does not churn it. CI runs both lock checks and `guardrails:canary`, so the layers hold without a local `verify`. Forks extend fragments and `src/config/data-extensions.ts` instead of editing the kernel.

## Consequences

Search is uncached (`liveQuery`). Category slug resolution is a tagged `"use cache"` read. Account orders share `src/lib/account/get-orders.ts`.
