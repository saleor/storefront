# Checkout Management

Understanding checkout session lifecycle, storage, and debugging prevents payment failures, hydration mismatches, and "CHECKOUT_NOT_FULLY_PAID" errors. Use live checkout data for payment amounts and handle stale checkouts gracefully.

---

## Overview

This skill covers how checkout sessions are created, stored, and managed in the Saleor storefront.

## Checkout ID Storage

Checkout IDs are stored in **two places**:

### 1. Cookie (Primary Storage)

```
Cookie name: checkoutId-{channel}
Example: checkoutId-default-channel
```

The cookie is set in `src/lib/checkout.ts`:

```typescript
export async function saveIdToCookie(channel: string, checkoutId: string) {
	const cookieName = `checkoutId-${channel}`;
	(await cookies()).set(cookieName, checkoutId, {
		sameSite: "lax",
		secure: shouldUseHttps,
	});
}
```

### 2. URL Query Parameter

```
URL: /checkout?checkout=Q2hlY2tvdXQ6YThjN2Y4YjgtZmU0NS00ZTRkLThhZmItZDdjYWI2YTM5MTdm
```

The checkout ID is a base64-encoded Saleor global ID.

## Checkout Lifecycle

### Creation

A new checkout is created when:

- User adds first item to an empty cart
- No valid checkout ID exists in cookie
- Existing checkout is not found in Saleor

```typescript
// src/lib/checkout.ts
export async function findOrCreate({ channel, checkoutId }) {
	if (!checkoutId) {
		return (await create({ channel })).checkoutCreate?.checkout;
	}
	const checkout = await find(checkoutId);
	return checkout || (await create({ channel })).checkoutCreate?.checkout;
}
```

### Persistence

The checkout persists across:

- Page refreshes
- Browser sessions (cookie-based)
- Cart modifications

### Completion

When `checkoutComplete` mutation succeeds:

- Checkout is converted to an Order
- The checkout ID becomes invalid
- A new checkout should be created for future purchases

## Checkout auth (BFF)

Sign-in during checkout uses the same BFF as storefront (`POST /api/auth/login` via `loginWithBff()`). `CheckoutUserProvider` hydrates `me` from the RSC page; after sign-in, call `refetchUser()` → `router.refresh()` so the server re-fetches the session. Sign-out uses the `logout()` server action + `detachCheckoutCustomer` when needed.

See `data-auth-routes.md` for HttpOnly cookies, header `getHeaderUser()`, and rate limits.

## Data loading (RSC + client sync)

1. **RSC page** (`checkout/page.tsx`) — full checkout (`fetchCheckoutOnServer`), `me`, order, channel countries. Passes `initialCheckout` when `loadState === "ready"`.
2. **Client** — `CheckoutDataProvider` hydrates from `initialCheckout`. `syncCheckoutFromServer` runs only as a fallback when the RSC snapshot is missing or the session id mismatches (`needsCheckoutEntrySync`). Cart mutations revalidate `/checkout` via `revalidateAuthSurfaces`.
3. **Mutations** — `src/app/(checkout)/actions.ts` server actions; `refreshCheckout` / `adoptCheckoutSnapshot` in `checkout-sync.ts`.

`useCheckout()` reads from `CheckoutDataProvider` context (not urql).

## Payment completion and transition UX

Gateway-agnostic infrastructure shared by Dummy, Stripe, and future payment apps. Provider-specific SDK steps live in `checkout-payment-gateways.md`; this section covers what happens **after** the PSP authorizes payment through Saleor.

### Flow

```
User clicks Pay (or returns from 3DS redirect)
        │
        ▼
markPaymentCompleting(checkoutId)     ← sessionStorage: checkout:payment-completing
        │
        ▼
transactionInitialize / process       ← provider-specific (may already be done)
        │
        ▼
finalizeCheckoutOrder()               ← runCheckoutComplete mutation
        │
        ├── failure → clearPaymentCompleting(), show error
        │
        └── success → navigateToOrderConfirmation(orderId)
                      window.location.replace(/checkout/complete?order=…)
        │
        ▼
Order confirmation page (`/checkout/complete`) ← clearPaymentCompleting()
                                               checkout cookie cleared in runCheckoutComplete
```

### Routes and transition storage

| Mechanism                     | Purpose                                                                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `/checkout?checkout=`         | Active cart flow — `CheckoutApp` + step UI                                                                                   |
| `/checkout/complete?order=`   | Order confirmation — separate RSC page + `OrderConfirmationApp`                                                              |
| `checkout:payment-completing` | Keeps checkout on `PaymentCompletingScreen` while `checkoutComplete` runs — avoids flashing back to step 1                   |
| `?processingPayment=true`     | Stripe 3DS return URL flag; works with `isCheckoutPaymentActive()` when payment step is unmounted                            |
| `window.location.replace`     | Navigates to a **different pathname** so the confirmation RSC tree loads reliably (legacy `/checkout?order=` redirects here) |

**Do not** clear the checkout cookie while still on `/checkout?checkout=…` after payment succeeds — that can flash "session expired". `runCheckoutComplete` clears the cookie server-side, then navigation leaves the checkout URL immediately.

### Transition guard

`useCheckoutTransition()` (used in `saleor-checkout.tsx`) returns:

| Value          | When                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------ |
| `"completing"` | `isCheckoutPaymentActive()` — storage key matches checkout id or `processingPayment` param |
| `null`         | Normal checkout UI                                                                         |

When `transition === "completing"`, render `PaymentCompletingScreen` instead of the step flow.

### Stripe 3DS / redirect return

`StripeCheckoutReturnHandler` mounts at the **checkout shell** (`stripe-checkout-completion-host.tsx`), not inside the payment step. After redirect, the payment step may be unmounted — shell-level completion avoids losing the return handler.

Return URL includes `processingPayment`, `paymentIntent`, and `paymentIntentClientSecret` query params (see `build-stripe-return-url.ts`).

### Live total before charge

Before any `transactionInitialize`, payment flows:

1. Call `updateCheckoutBilling()`
2. `refreshCheckout()` for a live gross total
3. If `hasMaterialCheckoutTotalChange(displayed, live)` → show price-change notice and **block** pay

Saleor validates amounts at `checkoutComplete`, but blocking early avoids authorizing the wrong amount. See `checkout-pay-amount.ts`.

### Key files

| File                                                                        | Purpose                                            |
| --------------------------------------------------------------------------- | -------------------------------------------------- |
| `src/app/(checkout)/checkout/complete/page.tsx`                             | Order confirmation RSC entry                       |
| `src/checkout/order-confirmation-app.tsx`                                   | Confirmation client shell                          |
| `src/checkout/lib/payment/checkout-payment-completion.ts`                   | `markPaymentCompleting`, `isCheckoutPaymentActive` |
| `src/checkout/lib/payment/finalize-checkout-order.ts`                       | Deduped `checkoutComplete` + navigation            |
| `src/checkout/lib/payment/navigate-to-order.ts`                             | Nav to `/checkout/complete?order=`                 |
| `src/checkout/hooks/use-checkout-transition.ts`                             | `completing` guard                                 |
| `src/checkout/views/saleor-checkout/payment-completing-screen.tsx`          | Full-page "Processing your order" UI               |
| `src/checkout/components/payment/stripe/stripe-checkout-return-handler.tsx` | Post-redirect completion                           |
| `src/checkout/views/order-confirmation/order-confirmation.tsx`              | Clears completion storage on mount                 |

### Anti-patterns

❌ **Don't use `router.push` for order confirmation** — use `navigateToOrderConfirmation()`  
❌ **Don't clear checkout cookie before leaving `?checkout=`** — wait for order confirmation  
❌ **Don't mount redirect completion only inside payment step** — shell survives step unmount  
❌ **Don't skip `clearPaymentCompleting()` on payment failure** — user must be able to retry

## Common Issues

### Stale cart after editing from storefront

**Problem**: User changes cart on `/{channel}/cart`, returns to checkout — old lines or totals.

**Fix**: Cart server actions call `revalidateAuthSurfaces`, which includes `revalidatePath("/checkout")`, so the next checkout navigation gets a fresh RSC `initialCheckout`. In-flow updates use `refreshCheckout` (full replace).

### Stale Checkout with Failed Transactions

**Problem**: If payment fails multiple times, the checkout accumulates partial transactions. Subsequent payment attempts may fail with:

```
CHECKOUT_NOT_FULLY_PAID: The authorized amount doesn't cover the checkout's total amount.
```

**Solutions**:

1. **Clear cookies** - Delete `checkoutId-{channel}` cookie
2. **Use incognito** - Test in a private browser window
3. **Remove URL param** - Navigate to checkout without `?checkout=XXX`

### Checkout Amount Mismatch

**Problem**: Checkout total changes after transactions are initialized (e.g., shipping added).

**Solution**: Always use live checkout from `useCheckout()` / `CheckoutDataProvider` before payment — never cached PDP prices.

## Key Files

| File                                                  | Purpose                              |
| ----------------------------------------------------- | ------------------------------------ |
| `src/lib/checkout.ts`                                 | Checkout creation, cookie management |
| `src/app/(checkout)/checkout/page.tsx`                | RSC entry, routing + `me`            |
| `src/app/(checkout)/actions.ts`                       | Checkout server actions              |
| `src/checkout/providers/checkout-data.tsx`            | Client cart state + sync             |
| `src/checkout/lib/checkout-sync.ts`                   | adopt vs refresh semantics           |
| `src/checkout/hooks/use-checkout.ts`                  | Context hook for steps               |
| `src/checkout/hooks/use-checkout-transition.ts`       | Payment → order transition guard     |
| `src/checkout/lib/payment/finalize-checkout-order.ts` | `checkoutComplete` + navigation      |
| `src/checkout/lib/utils/url.ts`                       | URL query param extraction           |

## Debugging Checkout Issues

### 1. Check Current Checkout ID

```javascript
// In browser console
document.cookie.split(";").find((c) => c.includes("checkoutId"));
```

### 2. Decode Checkout ID

```javascript
// Base64 decode the checkout ID from URL
atob("Q2hlY2tvdXQ6YThjN2Y4YjgtZmU0NS00ZTRkLThhZmItZDdjYWI2YTM5MTdm");
// Returns: "Checkout:a8c7f8b8-fe45-4e4d-8afb-d7cab6a3917f"
```

### 3. Query Checkout in Saleor

Use GraphQL playground to inspect checkout state:

```graphql
query {
	checkout(id: "Q2hlY2tvdXQ6...") {
		id
		totalPrice {
			gross {
				amount
				currency
			}
		}
		transactions {
			id
			chargedAmount {
				amount
			}
			authorizedAmount {
				amount
			}
		}
	}
}
```

## Payment App Issues

### Transaction Fails with "AUTHORIZATION_FAILURE"

**Symptom**: Transaction is created but fails immediately:

```json
{
	"transaction": { "id": "...", "actions": [] },
	"transactionEvent": {
		"message": "Failed to delivery request.",
		"type": "AUTHORIZATION_FAILURE"
	}
}
```

**Cause**: The payment app (e.g., Dummy Gateway, Stripe, Adyen) is not responding.

**Solutions**:

1. Check **Saleor Dashboard → Apps** - is the payment app active/healthy?
2. Check if the payment app URL is accessible
3. Restart the payment app if self-hosted
4. Check Saleor Cloud status if using cloud-hosted apps

### "CHECKOUT_NOT_FULLY_PAID" Error

**Symptom**: `checkoutComplete` fails with:

```
The authorized amount doesn't cover the checkout's total amount.
```

**Causes**:

1. **Payment app is down** - transaction was created but authorization failed
2. **Stale checkout** - previous partial transactions exist
3. **Amount mismatch** - checkout total changed after transaction init

**Debug steps**:

1. Check `[Payment] Transaction init result:` logs for `transactionEvent.type`
2. If `AUTHORIZATION_FAILURE` → payment app is down/unreachable
3. If transaction succeeded but amount is wrong → checkout data is stale

## Best Practices

1. **Always use live checkout data** for payment amounts
2. **Handle checkout not found** gracefully (create new checkout)
3. **Clear checkout after completion** to avoid stale data
4. **Test with fresh checkouts** when debugging payment issues
5. **Check payment app health** when transactions fail with `AUTHORIZATION_FAILURE`
