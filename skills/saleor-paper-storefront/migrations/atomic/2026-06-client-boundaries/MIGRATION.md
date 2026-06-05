# Migration: Client boundaries

## Intent

Isolate client providers (`CartProvider`) in a dedicated client wrapper; avoid importing client context from barrels that mix server actions. Use server `Link` on homepage product cards to reduce unnecessary client boundaries.

## Upstream reference

- **Commit:** [`41851941`](https://github.com/saleor/storefront/commit/41851941)

## Prerequisites

None

## Out of scope

- Cart drawer UI styling
- Logo/branding components

## Steps

### 1. StorefrontProviders `[architecture]`

Create `src/ui/components/storefront-providers.tsx` (`"use client"`) wrapping `CartProvider`.

### 2. Layout imports `[architecture]`

- Layout uses `StorefrontProviders` for client boundary
- Import `CartDrawerWrapper` directly, not from cart barrel mixing server/client

### 3. ProductElement server link `[architecture]`

- Homepage product cards: server `Link` with channel-prefixed href
- Pass `channel` through `ProductList`

### 4. Import path fixes `[architecture]`

Standardize `@/ui/atoms/link-with-channel` where client link still needed.

## Verify

[`verify.md`](verify.md)

## Record

`41851941`
