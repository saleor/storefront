# Migration: Layout route loading

## Intent

Remove `<Suspense fallback={null}>` around `{children}` in main layout so segment `loading.tsx` files show during client navigation. Add PLP loading skeletons where missing.

## Upstream reference

- **Commit:** [`be97b7e6`](https://github.com/saleor/storefront/commit/be97b7e6)

## Prerequisites

None (independent)

## Out of scope

- Header/footer/cart Suspense (keep as-is)
- Skeleton visual styling (presentation-default)

## Steps

### 1. Layout main `[architecture]`

In `src/app/[channel]/(main)/layout.tsx`:

- Render `{props.children}` directly inside `<main>`
- Remove Suspense wrapper with `fallback={null}` around children only

### 2. PlpPageLoading `[architecture]` + `[presentation-default]`

Create `src/ui/components/plp/plp-page-loading.tsx` — hero + grid skeleton structure. Copy upstream layout if new; **preserve fork classes** if similar file exists.

### 3. Route loading.tsx `[architecture]`

Add or update:

- `categories/[slug]/loading.tsx`
- `collections/[slug]/loading.tsx`

Re-export or use `PlpPageLoading`.

## Verify

[`verify.md`](verify.md)

## Record

`be97b7e6`
