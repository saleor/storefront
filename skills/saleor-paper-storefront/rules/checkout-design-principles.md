# Checkout Design Principles

Evidence-based UX principles for Paper Checkout. Grounded in Baymard, Stripe, and conversion research; mapped to Paper's checkout v2 architecture.

> **Related:** `paper-surfaces`, `checkout-management`, `checkout-components`, `checkout-payment-gateways`

---

## Why these exist

Checkout is the last-mile commitment ritual — not a form. ~70% of carts are abandoned (Baymard). The top drivers are **surprise costs**, **forced accounts**, **complexity**, and **mobile friction** — all design-elastic (small changes move conversion measurably).

Paper Checkout defaults should optimize **first-time buyers, mobile, and international shipping**. Forks with mostly returning customers may adopt one-page or accordion variants — but only after measuring step drop-off.

---

## Principles

### 1. Minimize commitment before value

Show total cost, delivery expectation, and return policy **before** pay. Never introduce mandatory new costs at payment.

- Order summary on every step: subtotal → shipping → tax → discount → total.
- Shipping method and cost on the shipping step, not first revealed at payment.
- Prefer shipping estimates on cart/PDP (storefront) to reduce checkout shock.

**Elasticity:** Extra costs are the #1 cited abandonment reason (39–48% of US shoppers).

### 2. Guest is the default path

First-time buyers complete as guests. Account creation is an **upgrade**, not a gate.

- `GuestContact` and "Continue as guest" must be visually primary over sign-in.
- Optional "create account" on the information step — de-emphasized, never required.
- Prefer post-order account invite on `/checkout/complete` (3–5× higher capture than pre-checkout gates).

**Elasticity:** Forced account creation drives ~19–26% of abandonments.

### 3. Optimize for mobile thumbs

Mobile abandonment is ~12pp worse than desktop. Design mobile-first; desktop inherits.

- Sticky primary CTA (`MobileStickyAction`) with specific labels: "Continue to shipping", `Pay {total}`.
- Collapsed order summary with **visible total** at top of mobile checkout.
- 44×44px minimum tap targets; correct `inputmode` and `autocomplete` on every field.
- **Address entry:** Paper uses **browser autofill** (`input-attributes.ts`) — not paid address APIs (Google Places, Loqate, etc.). Returning shoppers and mobile OS profiles get one-tap fill; that is the default tradeoff vs per-session API cost.
- Trust copy **above** the pay CTA on mobile, not buried in footer. Accepted methods come from the payment UI (Stripe Element, express wallets) — do not hardcode card-brand lists.

**Elasticity:** Sticky mobile CTA alone often yields +5–12% checkout completion.

### 4. Steps serve cognition, not ceremony

Multi-step is correct for first-time, mobile, and high-AOV flows. Each step must be short, validatable, and skippable for returning users.

- Paper flow: Contact → Shipping (if required) → Payment.
- Shallow `?step=` URLs via `updateCheckoutQuery()` — not full RSC navigations.
- Completed steps should collapse to **summaries** (address, method), not bare headers.
- Returning users with saved addresses: prefer review/skip over re-entry.

**Note:** One-page checkout wins for returning/low-AOV segments — document fork patterns, don't assume universal one-page.

### 5. The order summary is a confidence instrument

Users must always see **what they're buying** and **what they're paying** without memory or detours.

- Desktop: sticky right-hand summary with line items, thumbnails, running totals.
- Mobile: collapsed bar (item count + total), tap to expand — never fully hidden.
- Inline edit/remove where possible; explain total changes when shipping or promo updates.

### 6. Express pay is a first-class path

Wallets (Apple Pay, Google Pay, Link) skip the highest-friction fields. Treat them as primary, not decorative.

- Surface express checkout on the payment step (Stripe Express Checkout Element).
- Extend upstream (cart/PDP) when cart is complete enough to charge.
- Never show wallet buttons in a disabled state — prompt for missing selections instead (Stripe Apple Pay guidance).
- Collect mandatory order details (variant, qty, address) before wallet confirmation.

### 7. Validate late, recover gracefully

Use reward-early-punish-late validation: clear errors on `input`, validate on `blur`, batch on submit.

- Preserve entered data on errors — never wipe the form.
- Specific, plain-language error copy next to the field; error summary on submit for multiple failures.
- `aria-live` for dynamic errors (accessibility = conversion).

### 8. Trust is contextual

Security reassurance matters **at payment**, not on step 1.

- Lock icon and "Secure checkout" adjacent to the pay CTA; processor attribution when relevant (e.g. Stripe).
- Focused checkout surface: no full storefront nav, no distracting pop-ups.
- Merchant branding in header (`CheckoutHeader`) — user knows who they're paying.

### 9. Never lie about price

Display pages may cache prices for performance; checkout must always charge the live total.

- RSC + server actions use `cache: "no-cache"` for checkout data.
- Refresh checkout before `transactionInitialize`; block pay on `hasMaterialCheckoutTotalChange`.
- Saleor validates at `checkoutComplete` — but blocking early avoids wrong authorization and trust loss.

### 10. Checkout ends cleanly

A broken ending erodes repeat purchase more than a slow form.

- `PaymentCompletingScreen` while `checkoutComplete` runs — no flash of "session expired".
- Hard navigation to `/checkout/complete?order=` via `navigateToOrderConfirmation()`.
- Clear cookie in `after()` — not before leaving `?checkout=`.
- Confirmation page: receipt, next steps, soft account invite.

### 11. Design for merchant mix, not one platform's median

Paper is a **reference implementation** for Saleor headless. Defaults favor broad DTC; forks customize.

- Multi-step default is research-aligned for Paper's likely audience.
- Payment registry (`INTEGRATED_GATEWAYS`) lets merchants add Stripe, Adyen, etc. without forking step UI.
- Document layout variants (one-page, accordion) as fork decisions — not Paper core unless measured.

### 12. Measure step elasticity

Layout debates are resolved with data, not opinions.

- Instrument drop-off per `?step=`, device, new vs returning, AOV.
- Shallow step URLs keep analytics clean.
- If checkout CVR is within ~3pp of category median, fix upstream (PDP, cart, traffic) first.

---

## Paper alignment checklist

When reviewing checkout UI changes, verify:

| Principle          | Paper mechanism                                                    |
| ------------------ | ------------------------------------------------------------------ |
| Fresh totals       | `CheckoutDataProvider`, `refreshCheckout()`, `checkout-pay-amount` |
| Guest-first        | `GuestContact`, orphaned-cart recovery                             |
| Mobile CTA         | `MobileStickyAction`                                               |
| Address autofill   | `input-attributes.ts`, `AddressFields` `autocompleteSection`       |
| Step URLs          | `updateCheckoutQuery()`, `useLiveCheckoutSearchParams()`           |
| Express pay        | `StripeExpressCheckout`, `executeStripeCheckoutPayment`            |
| Trust at pay       | `PaymentTrustSignals`                                              |
| Payment transition | `PaymentCompletingScreen`, `finalizeCheckoutOrder`                 |
| Focused surface    | `(checkout)` layout, `CheckoutPageShell`                           |

---

## Known gaps (prioritized)

| Priority  | Gap                                                                                     | Principle |
| --------- | --------------------------------------------------------------------------------------- | --------- |
| Done (P0) | Autofill/`inputmode` on checkout fields — `src/checkout/lib/consts/input-attributes.ts` | #3        |
| Done (P0) | Trust signals above pay CTA — `PaymentTrustSignals`                                     | #8        |
| P1        | Post-order account invite on confirmation                                               | #2        |
| P1        | Auto-apply promo (avoid "Apply" button)                                                 | #1, #5    |
| P2        | Express checkout on cart                                                                | #6        |
| P2        | Returning-user fast path                                                                | #4        |
| P2        | Storefront shipping estimate before checkout                                            | #1        |

### Deferred / fork-only (not Paper core)

| Item                                                   | When to consider                                                                                                                                                                | Principle |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Address API autocomplete (Google Places, Loqate, etc.) | High guest first-order share, measurable address-step drop-off, or weak browser autofill in target markets — not for returning-shopper-heavy stores where P0 autofill is enough | #3        |

Do **not** add Places/Loqate to Paper by default: per-session cost, vendor keys, and intl edge cases. Forks own the integration.

---

## Anti-patterns

❌ Forced account creation before pay  
❌ Hidden totals or shipping revealed only at payment  
❌ Full RSC navigation for step-only changes (`router.replace` for `?step=`)  
❌ Caching checkout totals at payment time  
❌ Clearing checkout cookie before order confirmation navigation  
❌ Accordion checkout without collapsed step summaries or correct back-button behavior  
❌ Premature inline validation while user is still typing  
❌ One-page checkout as dogma without segment data  
❌ Upsells or cross-sell that compete with the primary pay CTA  
❌ Shipping Google Places / Loqate into Paper core without fork-specific ROI data

---

## References

- [Baymard Checkout Usability](https://baymard.com/research/checkout-usability)
- [Baymard 2024 Checkout Findings](https://baymard.com/blog/checkout-2024-launch)
- [Stripe Mobile Checkout UI](https://stripe.com/resources/more/mobile-checkout-ui)
- [Stripe Express Checkout Element](https://docs.stripe.com/elements/express-checkout-element)
- [Statista: US checkout abandonment reasons 2025](https://www.statista.com/statistics/1228452/reasons-for-abandonments-during-checkout-united-states/)
