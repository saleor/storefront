# Migration: Account PPR and authenticated routes

## Intent

Make `/account/*` safe under Cache Components: auth and `cookies()` only inside a layout Suspense shell; profile data via client context; authenticated GraphQL in nested page Suspense islands. Fixes production build failures such as:

```
Uncached data was accessed outside of <Suspense>
Route "/[channel]/account/addresses"
```

## Upstream reference

- **Commits:** [`3c1f84e6`](https://github.com/saleor/storefront/commit/3c1f84e6) (Suspense + context), [`3b27d901`](https://github.com/saleor/storefront/commit/3b27d901) (AccountLogin, layout revalidation)
- **Rule (destination):** [`../../../rules/data-auth-routes.md`](../../../rules/data-auth-routes.md)

## Prerequisites

- `2026-06-layout-route-loading` — do **not** wrap `<main>{children}</main>` in Suspense as a workaround
- `cacheComponents: true` in `next.config.js`
- Fork has an account section (skip entire migration if no `/account` routes)

## Out of scope

- Checkout auth (`/checkout` keeps its own `AuthProvider`)
- Cart drawer / header user menu (separate Suspense in main layout)
- Account visual styling (presentation-default)

## Steps

### 1. Layout auth gate `[architecture]`

In `src/app/[channel]/(main)/account/layout.tsx`:

- Sync default export wrapping `<Suspense fallback={<AccountSkeleton />}>`
- Async `AccountShell`: `hasAuthSession()` → `getCurrentUser()` → `AccountProvider` or `AccountLogin`
- Do **not** call `connection()` here (breaks PPR with cart in parent tree)
- Do **not** use bare `<LoginForm />` (missing `AuthProvider`)

Port or create:

- `src/lib/auth/has-auth-session.ts`
- `src/app/[channel]/(main)/account/get-current-user.ts` (`React.cache()`)
- `src/ui/components/account/account-context.tsx`
- `src/ui/components/account/account-login.tsx` (`AuthProvider` + `LoginForm`)
- `src/ui/components/account/account-skeleton.tsx`

### 2. Remove `getCurrentUser()` from account pages `[architecture]`

**Addresses / settings:** sync server page (or thin default) rendering client components that call `useAccountUser()`:

- `src/ui/components/account/addresses-page.tsx` (`"use client"`)
- `src/ui/components/account/settings-page.tsx` (`"use client"`)
- `src/app/[channel]/(main)/account/addresses/page.tsx` — must **not** be `async` with `getCurrentUser()`

**Overview:** sync page composing client welcome/default-address + `<Suspense>` around `RecentOrdersSection`.

**Orders:** sync page shell + async content in `<Suspense fallback={<AccountOrdersListSkeleton />}>` (and detail skeleton for order number route).

### 3. Server actions + client context `[architecture]`

In `src/app/[channel]/(main)/account/actions.ts`:

- `revalidatePath("/account", "layout")` after profile/address mutations when UI reads `useAccountUser()`

In client forms (`edit-name-form`, `address-form-dialog`, `address-actions`):

- `router.refresh()` after successful mutations

### 4. Order / overview skeletons `[architecture]` + `[presentation-default]`

Add to `account-skeleton.tsx` (or fork equivalents): `RecentOrdersSectionSkeleton`, `AccountOrdersListSkeleton`, `AccountOrderDetailSkeleton`. Use real fallbacks — not `fallback={null}` on order Suspense.

## Verify

[`verify.md`](verify.md)

## Record

`3b27d901`
