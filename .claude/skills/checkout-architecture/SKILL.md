---
name: checkout-architecture
description: Reference for reusable checkout UI components. Use when working with SignInForm, AddressSelector, PaymentMethodSelector, or composing checkout step views.
---

# Checkout Components Skill

Quick reference for reusable checkout components extracted during the architecture refactor.

## Component Locations

```
src/checkout/components/
├── contact/              # Authentication & user display
├── shipping-address/     # Address selection & display
├── payment/              # Payment method & billing
└── AddressForm/          # Form utilities (existing)
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

| Component           | Props                                                          | Use Case                 |
| ------------------- | -------------------------------------------------------------- | ------------------------ |
| `SignInForm`        | `initialEmail?`, `channelSlug`, `onSuccess`, `onGuestCheckout` | Sign-in form             |
| `SignedInUser`      | `user`, `onSignOut`                                            | Show logged-in user info |
| `ResetPasswordForm` | `onSuccess`, `onBackToSignIn`                                  | Password reset callback  |
| `GuestContact`      | `email`, `onEmailChange`, `emailError?`, `onSignInClick`       | Guest email entry        |

## Address Components

```tsx
import {
	AddressSelector, // Radio list for saved addresses
	AddressDisplay, // Read-only address card
} from "@/checkout/components/shipping-address";

// Also re-exported from AddressFormFields:
import { AddressFields, FormInput, FormSelect, FieldError } from "@/checkout/components/shipping-address";
```

| Component         | Props                                                                             | Use Case                     |
| ----------------- | --------------------------------------------------------------------------------- | ---------------------------- |
| `AddressSelector` | `addresses`, `selectedAddressId`, `onSelectAddress`, `defaultAddressId?`, `name?` | Pick from saved addresses    |
| `AddressDisplay`  | `address`, `title?`, `onEdit?`                                                    | Show address read-only       |
| `AddressFields`   | `orderedFields`, `formData`, `errors`, `onFieldChange`, etc.                      | Dynamic country-aware fields |

## Payment Components

```tsx
import {
	PaymentMethodSelector, // Card/PayPal/iDEAL tabs
	BillingAddressSection, // Same-as-shipping toggle + form
	isCardDataValid, // Helper function
	type PaymentMethodType, // "card" | "paypal" | "ideal"
	type CardData, // { cardNumber, expiry, cvc, nameOnCard }
	type BillingAddressData, // { countryCode, formData, selectedAddressId? }
} from "@/checkout/components/payment";
```

| Component               | Props                                                                                                 | Use Case                      |
| ----------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------- |
| `PaymentMethodSelector` | `value`, `onChange`, `cardData?`, `onCardDataChange?`                                                 | Payment method picker         |
| `BillingAddressSection` | `billingAddress?`, `shippingAddress?`, `userAddresses?`, `isShippingRequired?`, `errors?`, `onChange` | Billing with same-as-shipping |

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
