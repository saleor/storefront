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

**Warehouse stock / availability:** Saleor reports an unfulfillable line in one of two ways, set per channel by `useLegacyErrorFlow`, and checkout handles both. Both are a **cart** issue (`$.cart`), not an address-field error. Never attach stock copy to email or street.

- **New flow (`false`):** no mutation fails. The line is listed by id in `checkout.problems` (`CheckoutLineProblemInsufficientStock` with `availableQuantity`, `CheckoutLineProblemVariantNotAvailable`), and only `checkoutComplete` rejects it, which is after the shopper has paid. Keep both line-problem types in the `CheckoutFragment` `problems` selection.
- **Legacy flow (`true`):** `checkoutShippingAddressUpdate` is rejected with `quantity` / `INSUFFICIENT_STOCK` when no warehouse can fulfill a line for that destination. Saleor returns **one error per unavailable variant** and names it only in the message text (no variant or line ids on this path), so `availabilityIssueFromFieldErrors` collects lines from every error and matches the **whole** variant label (name, or SKU when the name is empty). Lines whose variants share a name are all flagged; when there are more such lines than errors the issue is inexact (`isExact: false`) and none of them is removed in bulk.
- **What blocks comes from the live checkout.** `CheckoutAvailabilityProvider` derives it (`checkoutAvailability`) from the `problems` of the checkout in context; the only stored state is a legacy-flow destination issue (`setDestinationIssue`). A block therefore clears as soon as Saleor clears it. Continue and Pay stay disabled while anything blocks, and express wallets are hidden.
- **Per-line numbers.** Saleor checks stock per variant: it sums every line of the variant (gift lines included) and flags each with the variant's total. `stockLinesFromProblems` gives each line its share, so lowering any one flagged line to it fixes the variant. Before a shipping address exists Saleor judges stock for the channel's default country, so those answers are ignored.
- **UI.** `CheckoutIssueBanner` (critical, not dismissible) at the top of the step card on every step, with separate copy for sold-out, short and address-rejected lines (ICU `count`). The order summary marks each line: "Sold out" + Remove; "Only N left" + "Reduce to N" (`updateCheckoutLineQuantity` → `checkoutLinesUpdate`) + Remove; "Not available for this address" + Remove. The banner's bulk Remove (`removeCheckoutLines` → `checkoutLinesDelete`) takes only `removableLineIds`: lines with nothing left, or an exactly matched destination issue. On phones the summary opens once per change of the flagged lines.
- **Gift lines.** Saleor refuses to delete them, and swaps an out-of-stock gift for one in stock (or drops it) whenever it recalculates discounts, which the address re-submit does. `unavailableGiftLineIds` gives such a line a note, never Remove, and it does not block. Saleor still checks gift stock when it creates the order, so `validateCheckoutFulfillment` fails (with a try-again message) if a gift is still listed after the re-submit.
- **Re-check before paying.** Re-submit the saved address on Information Continue even when the form did not change. `validateCheckoutFulfillment` runs before shipping Continue, `transactionInitialize` and `checkoutComplete`: it re-submits the saved shipping address (the legacy-flow check and the gift swap) and returns the checkout Saleor answered with. Callers adopt it (`reportAvailability`), so a problem found at Pay keeps Pay blocked and names the line. When shipping is not required, pass a **live** snapshot. It must **fail closed** on network / unexpected errors — treating "Saleor did not answer" as stock-OK is how a card gets charged with no order.
- **After paying.** If `checkoutComplete` still fails for an unavailable line (sold between the check and completion, or unpublished), `runCheckoutComplete` returns one translated message that says no order was created and, if the shopper paid, not to pay again but to contact the shop; it holds for free orders too. Saleor does **not** auto-remove the line (unlike Shopify's native checkout modal).

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
