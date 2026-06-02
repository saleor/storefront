# Checkout Management

Understanding checkout session lifecycle, storage, payment transactions, and debugging prevents payment failures, hydration mismatches, and "CHECKOUT_NOT_FULLY_PAID" errors. Use live checkout data for payment amounts and handle stale checkouts gracefully.

---

## Overview

This skill covers how checkout sessions are created, stored, and managed in the Saleor storefront, including the full payment transaction flow.

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

---

## Payment Transaction Flow

The payment flow follows a 4-step sequence using Saleor's transaction API:

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAYMENT TRANSACTION FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. paymentGatewayInitialize                                    │
│      └─ Gets available gateways and their config                 │
│                                                                  │
│   2. transactionInitialize                                       │
│      └─ Creates a transaction with the chosen gateway            │
│      └─ Returns transaction ID + event data                      │
│                                                                  │
│   3. transactionProcess (if needed, e.g. 3D Secure)              │
│      └─ Processes additional payment steps                       │
│      └─ Used after redirects (Stripe 3DS, Adyen redirect)        │
│                                                                  │
│   4. checkoutComplete                                            │
│      └─ Converts checkout to order                               │
│      └─ Requires authorized/charged amount >= checkout total     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Mutations (in `src/checkout/graphql/payment.graphql`)

```graphql
# Step 1: Initialize payment gateways
mutation paymentGatewaysInitialize($checkoutId: ID!, $paymentGateways: [PaymentGatewayToInitialize!]) {
	paymentGatewayInitialize(id: $checkoutId, paymentGateways: $paymentGateways) {
		gatewayConfigs { id data errors { field message code } }
		errors { field message code }
	}
}

# Step 2: Initialize a transaction
mutation transactionInitialize($checkoutId: ID!, $action: TransactionFlowStrategyEnum, ...) {
	transactionInitialize(id: $checkoutId, action: $action, paymentGateway: $paymentGateway, amount: $amount) {
		transaction { id actions }
		transactionEvent { message type }
		data
		errors { field code message }
	}
}

# Step 3: Process transaction (after redirect)
mutation transactionProcess($id: ID!, $data: JSON) {
	transactionProcess(id: $id, data: $data) {
		transaction { id actions }
		transactionEvent { message type }
		data
		errors { field code message }
	}
}
```

### Dummy Payment Gateway (Testing)

The built-in flow uses `mirumee.payments.dummy` for testing:

```typescript
const initResult = await transactionInitialize({
	checkoutId,
	paymentGateway: {
		id: "mirumee.payments.dummy",
		data: {
			event: {
				includePspReference: true,
				type: "CHARGE_SUCCESS",
			},
		},
	},
});
```

After successful transaction init, immediately call `checkoutComplete`:

```typescript
const completeResult = await checkoutComplete({ checkoutId });
const order = completeResult.data?.checkoutComplete?.order;
```

### Payment Status Detection

The `usePayments` hook (in `src/_reference/checkout-sections/PaymentSection/usePayments.ts`) auto-completes checkout when payment is detected:

```typescript
const paidStatuses: PaymentStatus[] = ["overpaid", "paidInFull", "authorized"];

// Auto-complete when payment status changes to paid
useEffect(() => {
	if (!completingCheckout && paidStatuses.includes(paymentStatus)) {
		void onCheckoutComplete();
	}
}, [completingCheckout, paymentStatus]);
```

### Stripe/Adyen Integration (Reference Code)

Reference implementations live in `src/_reference/checkout-sections/PaymentSection/`:

| File                                            | Purpose                                  |
| ----------------------------------------------- | ---------------------------------------- |
| `StripeV2DropIn/stripeForm.tsx`                 | Stripe V2 DropIn payment form            |
| `StripeV2DropIn/useCheckoutCompleteRedirect.ts` | Post-redirect completion (3DS flow)      |
| `AdyenDropIn/useAdyenDropin.ts`                 | Adyen DropIn integration                 |
| `DummyDropIn/dummyComponent.tsx`                | Dummy gateway for testing                |
| `PaymentMethods.tsx`                            | Gateway selection UI                     |
| `usePayments.ts`                                | Payment status detection + auto-complete |

The Stripe redirect flow:

1. `transactionInitialize` → Stripe creates PaymentIntent
2. User completes 3DS → Stripe redirects back with `paymentIntent` query param
3. `useCheckoutCompleteRedirect` detects redirect, calls `transactionProcess` to sync Saleor
4. Then calls `onCheckoutComplete()` to finalize the order

---

## Common Issues

### Hydration Mismatch with Checkout ID

**Problem**: `extractCheckoutIdFromUrl()` called during SSR reads an empty URL, causing React hydration mismatch and "PageNotFound" flash.

**Symptom**: Checkout page briefly shows error then loads correctly on refresh.

**Fix**: Delay extraction until after client-side mount:

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
const id = useMemo(() => (mounted ? extractCheckoutIdFromUrl() : null), [mounted]);
```

See `src/checkout/hooks/use-checkout.ts` for the full implementation.

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

**Solution**: Always use live checkout data via `useCheckout()` hook before payment:

```typescript
const { checkout: liveCheckout } = useCheckout();
const checkout = liveCheckout || initialCheckout;
const totalAmount = checkout.totalPrice.gross.amount;
```

## Key Files

| File                                                  | Purpose                              |
| ----------------------------------------------------- | ------------------------------------ |
| `src/lib/checkout.ts`                                 | Checkout creation, cookie management |
| `src/checkout/hooks/use-checkout.ts`                  | React hook for checkout data         |
| `src/checkout/lib/utils/url.ts`                       | URL query param extraction           |
| `src/graphql/CheckoutCreate.graphql`                  | Checkout creation mutation           |
| `src/checkout/graphql/payment.graphql`                | Payment transaction mutations        |
| `src/checkout/views/saleor-checkout/payment-step.tsx` | Payment step UI                      |

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
		availablePaymentGateways {
			id
			name
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

## Checkout Components

Reusable checkout UI components in `src/checkout/components/`:

| Directory           | Components                                                        |
| ------------------- | ----------------------------------------------------------------- |
| `contact/`          | `SignInForm`, `SignedInUser`, `ResetPasswordForm`, `GuestContact` |
| `shipping-address/` | `AddressSelector`, `AddressDisplay`, `AddressFields`              |
| `payment/`          | `PaymentMethodSelector`, `BillingAddressSection`                  |

Steps (e.g., `InformationStep.tsx`) import and compose these based on auth state. Check component prop types directly in the source files.

---

## Best Practices

1. **Always use live checkout data** for payment amounts
2. **Handle checkout not found** gracefully (create new checkout)
3. **Clear checkout after completion** to avoid stale data
4. **Test with fresh checkouts** when debugging payment issues
5. **Check payment app health** when transactions fail with `AUTHORIZATION_FAILURE`
6. **Check `transactionEvent.type`** after `transactionInitialize` — anything other than `CHARGE_SUCCESS` or `AUTHORIZATION_SUCCESS` means payment failed
