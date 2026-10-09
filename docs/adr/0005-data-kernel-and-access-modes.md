# ADR 0005: Saleor data kernel and access modes

**Status:** Accepted
**Date:** 2026-10-04

## Decision

Every Saleor call goes through `src/lib/saleor` as one of four modes: `cachedQuery`, `liveQuery`, `sessionQuery`, `mutate`. The operation registry chooses auth. `"use cache"` stays written on loaders, because closure variables become cache keys and must be serializable, so a factory that hides the directive is fragile. `cachedQuery` calls `cacheLife`, which throws outside a cache scope.

A transport or GraphQL failure inside `cachedQuery` throws. Next.js does not cache a thrown error, so an outage cannot stick for the catalog TTL. A missing entity is still `null`.

Enforcement is layered: the API, ESLint boundaries with named allowlists, contract tests, `data-layer.lock.md`, and `paper-core.lock.json`. Forks extend fragments and `src/config/data-extensions.ts` instead of editing the kernel.

## Consequences

Search is uncached (`liveQuery`). Category slug resolution is a tagged `"use cache"` read. Account orders share `src/lib/account/get-orders.ts`.
