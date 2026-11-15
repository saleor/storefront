---
name: checkout-components
description: Reusable checkout UI: contact, shipping-address, payment/billing components and input-attributes autofill. Use when composing or extending checkout step UI.
---

# Checkout Components

Reusable checkout UI components for contact, address, and payment flows. Composing these components in checkout steps keeps the flow consistent and maintainable.

---

## Component Locations

```
src/checkout/components/
├── contact/              # Authentication & user display
├── shipping-address/     # Address selection & display
├── payment/              # Payment method & billing
└── address-form/         # Form utilities (existing)
```

## Contact Components

```tsx
import {
	SignInForm, // Email + password + forgot password
	SignedInUser, // Logged-in user display with sign out
	ResetPasswordForm, // New password form (reset callback)
	GuestContact, // Email input + create account checkbox
} from "@/checkout/components/contact";
```

| Component           | Props                                                          | Use Case                     |
| ------------------- | -------------------------------------------------------------- | ---------------------------- |
| `SignInForm`        | `initialEmail?`, `channelSlug`, `onSuccess`, `onGuestCheckout` | BFF sign-in (`loginWithBff`) |
| `SignedInUser`      | `user`, `onSignOut`                                            | Show logged-in user info     |
| `ResetPasswordForm` | `onSuccess`, `onBackToSignIn`                                  | Password reset callback      |
| `GuestContact`      | `email`, `onEmailChange`, `emailError?`, `onSignInClick`       | Guest email entry            |

## Address Components

```tsx
import {
	AddressSelector, // Radio list for saved addresses
	AddressDisplay, // Read-only address card
} from "@/checkout/components/shipping-address";

// Also re-exported from AddressFormFields:
import { AddressFields, FormInput, FormSelect, FieldError } from "@/checkout/components/shipping-address";
```

| Component         | Props                                                                                | Use Case                     |
| ----------------- | ------------------------------------------------------------------------------------ | ---------------------------- |
| `AddressSelector` | `addresses`, `selectedAddressId`, `onSelectAddress`, `defaultAddressId?`, `name?`    | Pick from saved addresses    |
| `AddressDisplay`  | `address`, `title?`, `onEdit?`                                                       | Show address read-only       |
| `AddressFields`   | `orderedFields`, `formData`, `errors`, `onFieldChange`, `autocompleteSection?`, etc. | Dynamic country-aware fields |

**Blank form country:** empty shipping/billing country selects use Saleor `channel.defaultCountry` when that code is in the channel’s shippable countries. Do not default to the first alphabetically listed country (often Afghanistan). `defaultCountry` is staff/app-only — fetch it with a **raw** app-token query (`executeRawGraphQL`, no codegen document). Generated checkout operations are gitignored; a new `ChannelDefaultCountryDocument` crashes a running `next dev` that still has a stale `operations.ts`, which aborted guest Continue on RSC refresh. Never add `defaultCountry` to the public checkout `channel` query (that field error nulls the whole channel and wipes the country list). Resolution is `resolveBlankAddressCountryCode`. Without an app token the blank form falls back to the first listed country. Guest Continue must not swallow mutation errors or let optional marketing-consent metadata abort the step. Skip email/address mutations when the payload already matches the checkout so a no-op Continue still advances.

**Warehouse stock / availability:** Saleor reports an unfulfillable line in one of two ways, set per channel by `useLegacyErrorFlow`, and checkout handles both. **Legacy flow (`true`):** `checkoutShippingAddressUpdate` is rejected with `quantity` / `INSUFFICIENT_STOCK` when no warehouse can fulfill a line for that destination. **New flow (`false`):** no mutation fails; the line is listed in `checkout.problems` (`CheckoutLineProblemInsufficientStock`, `CheckoutLineProblemVariantNotAvailable`) and only `checkoutComplete` rejects it, which is after the shopper has paid. Both are a **cart** issue (`$.cart`), not an address-field error. Show `CheckoutIssueBanner` (critical, not dismissible) at the top of the step card on every step, mark the line in the order summary, and offer **Remove**. `CheckoutAvailabilityProvider` merges the issue a step reported with the lines in the live checkout's `problems`, so Continue and Pay stay disabled while Saleor lists a line and clear by themselves once it is gone. A stock issue a step reported from `problems` lapses as soon as the checkout in context changes, so the live `problems` decide and a shopper who fixed the cart is not left blocked; Information Continue stays on the step while the updated checkout lists a line. Keep both line-problem types in the `CheckoutFragment` `problems` selection. Re-submit the saved address on Information Continue even when the form did not change — that is when the legacy flow re-checks warehouse stock. Re-check again before `transactionInitialize` / `checkoutComplete` with `validateCheckoutFulfillment`, passing a **live** checkout snapshot, so we never charge then fail. It must **fail closed** on network / unexpected errors at shipping and pay — treating “Saleor did not answer” as stock-OK is how a card gets charged with no order. If `checkoutComplete` still fails for an unavailable line (sold between the check and completion, or unpublished), `runCheckoutComplete` returns one translated message that says no order was created and, if the shopper paid, not to pay again but to contact the shop; it holds for free orders too. Saleor does **not** auto-remove the line (unlike Shopify’s native checkout modal). Never attach stock copy to email or street.

## Form field autofill (`input-attributes`)

Checkout text inputs must expose `name`, `autoComplete`, and `inputMode` so mobile keyboards and browser autofill work, and validation can focus the first error (`querySelector('[name="…"]')`).

**Source of truth:** `src/checkout/lib/consts/input-attributes.ts`

| Export                                      | Use                                                  |
| ------------------------------------------- | ---------------------------------------------------- |
| `formatAddressAutocomplete(field, section)` | `shipping given-name`, `billing address-line1`, etc. |
| `inputModeTags`                             | `tel` for phone, `text` for postal code              |
| `contactFieldAttributes`                    | Email, password, promo code metadata                 |

`AddressFields` accepts `autocompleteSection="shipping" | "billing"` (default `shipping`). Billing passes `"billing"`. Country `<select>` elements use `shipping country` / `billing country` and `name="countryCode"`.

When adding a new checkout input:

1. Add metadata to `input-attributes.ts` (or reuse `contactFieldAttributes`).
2. Set `name` to match validation error keys.
3. Pair `autoComplete` with the correct section token for address fields.
4. See `checkout-design-principles.md` §3 (mobile thumbs).

## Payment Components

Integrated Saleor payment apps render via `IntegratedPaymentUi` (see `checkout-payment-gateways` rule). Steps compose billing + provider UI — there is no generic card-form fallback.

```tsx
import {
	PaymentMethodArea, // Resolves provider → IntegratedPaymentUi
	IntegratedPaymentUi,
	PaymentGatewayAlerts,
	BillingAddressSection,
	type BillingAddressData,
} from "@/checkout/components/payment";
```

| Component               | Props                                                                                                 | Use Case                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `PaymentMethodArea`     | `provider`, `checkout`, `billing`, error/notice callbacks                                             | Payment step wrapper                           |
| `IntegratedPaymentUi`   | Same — maps `provider.type` to Stripe, Dummy, or future gateway components                            | Add new gateway UI in one switch               |
| `PaymentGatewayAlerts`  | `gateways`                                                                                            | Warn when no / unsupported gateway on checkout |
| `BillingAddressSection` | `billingAddress?`, `shippingAddress?`, `userAddresses?`, `isShippingRequired?`, `errors?`, `onChange` | Billing with same-as-shipping                  |

## Usage Pattern

Steps import and compose these components:

```tsx
// In InformationStep.tsx
import { SignInForm, SignedInUser, GuestContact } from "@/checkout/components/contact";
import { AddressSelector } from "@/checkout/components/shipping-address";

// Orchestrate based on auth state
{
	authenticated ? (
		<SignedInUser user={user} onSignOut={handleSignOut} />
	) : contactSection === "signIn" ? (
		<SignInForm onSuccess={handleSignInSuccess} />
	) : (
		<GuestContact email={email} onEmailChange={setEmail} />
	);
}
```

## When to Create New Components

Extract into `components/` when:

- Used in **2+ places**
- **Self-contained** with clear props interface
- **100+ lines** that can be isolated

Keep inline when:

- **One-off** UI specific to that step
- Tightly coupled to step's state machine
