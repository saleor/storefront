---
name: checkout-management
description: Checkout session lifecycle: cookie/URL id, RSC + client sync, payment completion/transition UX, shallow ?step= URLs, debugging CHECKOUT_NOT_FULLY_PAID. Use when debugging checkout flow, sessions, or payment completion.
---

# Checkout Management

How checkout sessions are created, stored, synced, and completed — and how to debug payment failures, hydration mismatches, and `CHECKOUT_NOT_FULLY_PAID`. Surface layout is in [`paper-surfaces.md`](paper-surfaces.md); payment-app SDK steps in [`checkout-payment-gateways.md`](checkout-payment-gateways.md); auth in [`data-auth-routes.md`](data-auth-routes.md).

## Session id, storage, lifecycle

The checkout id (a base64 Saleor global id, e.g. `Checkout:a8c7…`) lives in **two** places:

- **Cookie `checkoutId-{channel}`** (primary; set in `src/lib/checkout.ts` via `saveIdToCookie`, `sameSite: "lax"`, `secure` on https). Persists across refreshes/sessions.
- **URL `?checkout=`** on `/checkout`.

`findOrCreate({ channel, checkoutId })` creates a new checkout when there's no id or Saleor can't find it (first item into an empty cart, or a completed checkout whose id is now invalid). On `checkoutComplete` success the checkout becomes an Order, the id is invalidated, and the cookie is cleared.

## Auth + data loading (RSC + client sync)

Sign-in uses the same BFF as storefront (`loginWithBff()` → `POST /api/auth/login`); `CheckoutUserProvider` hydrates `me` from the RSC page; after sign-in call `refetchUser()` → `router.refresh()`. Sign-out = `logout()` action + `detachCheckoutCustomer` when needed.

1. **RSC page** (`checkout/page.tsx`) fetches the full checkout (`fetchCheckoutOnServer`), `me`, order, and channel countries; passes `initialCheckout` when `loadState === "ready"`.
2. **Client** `CheckoutDataProvider` hydrates from `initialCheckout`. RSC updates **merge** via `adoptCheckoutSnapshot`; explicit `refreshCheckout()` **replaces** state. Cart mutations revalidate `/checkout` via `revalidateStorefrontChrome`; use `useRefreshCheckoutRsc()` after auth or address-book changes.
3. **Mutations** are server actions in `src/app/(checkout)/actions.ts`; adopt-vs-refresh semantics in `checkout-sync.ts`.

`useCheckout()` reads from `CheckoutDataProvider` context — **not urql**.

## Payment completion & transition UX

Gateway-agnostic infra shared by Dummy/Stripe/future apps — what happens **after** the PSP authorizes through Saleor:

```
Pay clicked (or 3DS return)
 → markPaymentCompleting(checkoutId)   [sessionStorage: checkout:payment-completing]
 → transactionInitialize / process     [provider-specific]
 → finalizeCheckoutOrder()             [runCheckoutComplete]
     ├─ failure → clearPaymentCompleting(), show inline error
     └─ success → navigateToOrderConfirmation(orderId)  [window.location.replace → /checkout/complete?order=]
 → confirmation page clears completion storage; cookie cleared in runCheckoutComplete after()
```

### Routes & transition storage

| Mechanism                          | Purpose                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| `/checkout?checkout=`              | Active cart flow — `CheckoutApp` + step UI                                                        |
| `/checkout/complete?order=`        | Order confirmation — separate RSC page + `OrderConfirmationApp`                                   |
| `checkout:payment-completing`      | Keeps `PaymentCompletingScreen` up while `checkoutComplete` runs (no flash back to step 1)        |
| `?processingPayment=true`          | Stripe 3DS return flag; pairs with `isCheckoutPaymentActive()` when the payment step is unmounted |
| `?step=contact\|shipping\|payment` | Step deep link; URL is source of truth via `useLiveCheckoutSearchParams()`                        |
| `updateCheckoutQuery()`            | **Shallow** step URL updates (`pushState`/`replaceState`) — avoids re-running checkout RSC        |

**Critical sequencing gotchas:**

- **Don't clear the checkout cookie synchronously on `/checkout?checkout=…` after payment** — the cookie change re-renders the checkout RSC tree and briefly shows `not_found` ("session expired") before navigation. `runCheckoutComplete` clears it in `after()`; the client calls `navigateToOrderConfirmation()`; `RootViews` holds `PaymentCompletingScreen` while `checkout:payment-completing` is set.
- **Don't call `redirect()` from `runCheckoutComplete`** — `NEXT_REDIRECT` is caught by Stripe payment catch blocks as a false "Payment failed" banner.
- **Order confirmation needs `window.location.replace`** (hard nav) — `router.replace` from async post-mutation callbacks doesn't reliably unmount checkout.

### Shallow step navigation

Step changes use **`updateCheckoutQuery({ step })`** (`src/checkout/lib/checkout-search-params.ts`), not `router.replace`: App Router treats `searchParams` as dynamic input, so a router nav would re-fetch checkout on every step click. Shallow history updates the URL for back/refresh/deep-link without a server round-trip.

- **Continue** → `history: "push"` (Back walks Contact → Shipping → Payment).
- **Header stepper / inline Back / Stripe param cleanup** → `replace` (no fake history entries).

`useLiveCheckoutSearchParams()` (`useSyncExternalStore`) keeps step UI, transition guards, and Stripe-return detection synced with shallow updates and `popstate`; ephemeral Stripe params are merged from `window.location.search`, never stale React `searchParams`. `CheckoutSessionLoader` reads only `?checkout=`/`?order=` — **never `?step=`** — and fetches via `get-checkout-session-data.ts` (`React.cache` per id). Use `router.replace` only for in-checkout `?checkout=` changes (orphaned-checkout recovery).

**Self-healing step URL (`CheckoutStepUrlGuard`):** the App Router never sees shallow `?step=` writes, so any router-level URL restore (server-action revalidation — `X-Action-Revalidated: 1` — or RSC refresh) silently `replaceState`s the canonical URL back **without** the step param, rewinding checkout to Contact. Mid-payment this tore down `stripe.confirmPayment()` and left orphaned "Payment started / method: None" PaymentIntents. Two defenses, both required:

- `checkout-search-params.ts` patches `history.pushState`/`replaceState` (installed on first live-URL subscription) so **every** URL write notifies subscribers — the router's silent restores included. The patched dispatch is **deferred to a microtask**: the App Router commits URL writes inside `useInsertionEffect`, where a synchronous dispatch schedules React updates ("useInsertionEffect must not schedule updates") and the guard's heal gets dropped. Patch flag and step intent live on **`globalThis`, not module scope** — dev HMR can keep two live copies of the module in one tab, and split state makes the guard fight the Back button with a stale intent. `updateCheckoutQuery({ step })` records the shopper's **step intent**; `CheckoutStepUrlGuard` (mounted in `CheckoutApp`) re-asserts the intended step whenever a history write drops it. Browser Back/Forward updates intent via `popstate` instead of fighting the shopper. The heal runs **one macrotask after** the change (`setTimeout 0`): on browser Back, Next's popstate handler (registered before checkout hydrates) flushes its traversal synchronously _inside its own listener_, which runs the guard's effect while the intent is still the pre-Back step — a synchronous or microtask heal would clobber the traversal, and `adoptIntentFromUrl` (later in the listener chain) would adopt the clobbered URL, trapping the shopper on the old step.
- **Step UI renders from intent, not the raw URL** (`useCheckoutStepFromUrl` overlays `useCheckoutStepIntent()` on the live query). A revalidation clobber can flash a stale `?step=` before the guard heals it; URL-driven UI would remount the flashed step — payment remounts re-init Stripe and fire gateway actions whose revalidations restore the stale URL again, a self-sustaining payment ⇄ shipping loop. Intent-driven UI never flashes, so the loop can't start. `writeCheckoutQueryHistory` also downgrades a `push` of the current URL to `replace` so double-fired Continues can't duplicate history entries.
- `useSyncCheckoutRouterUrl()` on the payment step aligns the router's canonical URL once on arrival (`router.replace` — one RSC re-run, acceptable on the money step) so revalidations during pay restore the _same_ URL and never remount Stripe Elements mid-confirm. It **re-syncs on unmount when `?step=` diverged** (Back to shipping): without it the canonical URL stays `?step=payment` and every shipping-step server action bounces the shopper back to payment. The unmount sync skips when the pathname changed, so it never fights the payment-success `window.location.replace`.

**Regression e2e:** `pnpm test:e2e:checkout` (`e2e/checkout-step-back.spec.ts`) — browser Back from simulated shallow step history; catches popstate vs guard heal ordering. Requires a running server (`PLAYWRIGHT_BASE_URL` or `pnpm start` on `:3020`).

### Transition guard, Stripe 3DS, live total

- **`useCheckoutTransition()`** returns `"completing"` when `isCheckoutPaymentActive()` (storage key matches id, or `processingPayment` param) → render `PaymentCompletingScreen` instead of the step flow; else `null`.
- **`StripeCheckoutReturnHandler`** mounts at the **checkout shell** (`stripe-checkout-completion-host.tsx`), not inside the payment step (which may be unmounted after redirect). Real failures clear Stripe params, exit the processing screen, and show `PaymentError` **inline on the payment step**. Return URL carries `processingPayment`, `paymentIntent`, `paymentIntentClientSecret` (`build-stripe-return-url.ts`).
- **Live total before charge:** before any `transactionInitialize`, call `updateCheckoutBilling()` → `refreshCheckout()` for a live gross total; if `hasMaterialCheckoutTotalChange(displayed, live)`, show a price-change notice and **block** pay (`checkout-pay-amount.ts`). Saleor re-validates at `checkoutComplete`, but blocking early avoids authorizing the wrong amount.

## Debugging

**Stale cart after storefront edit:** cart actions call `revalidateStorefrontChrome` (incl. `revalidatePath("/checkout")`), so the next checkout nav gets fresh `initialCheckout`; in-flow use `refreshCheckout` (full replace).

**`CHECKOUT_NOT_FULLY_PAID`** ("authorized amount doesn't cover total") — causes: payment app down (transaction created, authorization failed), stale checkout with accumulated partial transactions, or total changed after transaction init. Steps: check `[Payment] Transaction init result:` logs for `transactionEvent.type`; `AUTHORIZATION_FAILURE` → app down/unreachable (verify in **Dashboard → Apps**: active/healthy, URL reachable, Saleor Cloud status); transaction OK but amount wrong → stale checkout data. Recovery: delete the `checkoutId-{channel}` cookie / drop `?checkout=` / use incognito to force a fresh checkout.

**Inspecting a checkout:** decode the id with `atob("Q2hlY2tvdXQ6…")` → `Checkout:<uuid>`, then query `checkout(id) { totalPrice, transactions { chargedAmount authorizedAmount } }` in a GraphQL client.

**Always use live checkout data** (`useCheckout()` / `CheckoutDataProvider`) for payment amounts — never cached PDP prices.

## Key files

| File                                                                                                              | Purpose                                                                     |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `src/lib/checkout.ts`                                                                                             | Checkout create + cookie management (`findOrCreate`, `saveIdToCookie`)      |
| `src/app/(checkout)/checkout/page.tsx` · `checkout-session-loader.tsx`                                            | RSC entry (routing + `me`); active session loader (`?checkout=` only)       |
| `src/checkout/lib/server/get-checkout-session-data.ts`                                                            | Per-request cached session fetches                                          |
| `src/app/(checkout)/actions.ts`                                                                                   | Checkout server actions                                                     |
| `src/checkout/providers/checkout-data.tsx` · `lib/checkout-sync.ts`                                               | Client state + adopt/refresh semantics                                      |
| `src/checkout/hooks/use-checkout.ts` · `use-checkout-transition.ts`                                               | Steps context; payment→order guard                                          |
| `src/checkout/lib/payment/finalize-checkout-order.ts` · `navigate-to-order.ts` · `checkout-payment-completion.ts` | `checkoutComplete` + nav; `markPaymentCompleting`/`isCheckoutPaymentActive` |
| `src/app/(checkout)/checkout/complete/page.tsx` · `order-confirmation-app.tsx`                                    | Confirmation RSC + client shell                                             |
| `src/checkout/components/payment/stripe/stripe-checkout-return-handler.tsx`                                       | Post-redirect completion                                                    |

## Anti-patterns

❌ `router.push`/`replace` for order confirmation — use `navigateToOrderConfirmation()`
❌ Clearing the checkout cookie before leaving `?checkout=` — wait for confirmation
❌ Mounting redirect completion only inside the payment step — mount at the shell
❌ Skipping `clearPaymentCompleting()` on failure — the user must be able to retry
❌ `router.replace` for step changes — use shallow `updateCheckoutQuery({ step })`
❌ Paying against cached/PDP totals — refresh for a live gross total first

## Appendix: checkout v2 cheat sheet

**Which refresh:** `refreshCheckout()` replaces client state (promo/line change); `adoptCheckoutSnapshot` merges an RSC snapshot without clobbering in-flow edits (on `initialCheckout` change only); `useRefreshCheckoutRsc()` triggers `router.refresh()`; cross-surface cart edits propagate via `revalidateStorefrontChrome` + next nav.

**URL params:** `checkout` (RSC reads — required), `order` on `/checkout` (RSC → redirect; canonical is `/checkout/complete?order=`), `step` (client only), `processingPayment`/Stripe params (client; merged from live `window.location.search`).

**Hooks:** `useCheckout()` (compat API; `refetch` → `refreshCheckout`), `useCheckoutData()` (full context incl. `loadState`/`setCheckout`), `useLiveCheckoutSearchParams()`, `useCheckoutTransition()`, `useRefreshCheckoutRsc()`.

**Session states** (`resolveSessionUser`): `guest` (show sign-in), `authenticated` (`me` present), `unavailable` (transient — don't flash login). An expired JWT maps to `guest` via `isDefinitiveAuthFailure` (structured Saleor codes first, message fallback).
