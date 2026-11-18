---
name: ui-legal
description: What Paper shows for consumer-law duties (EU distance selling) and where each fact comes from in Saleor — seller identity and the /imprint route, legal page links by Saleor Page slug, the "incl. VAT, plus shipping costs" price notice, prior-price reductions, delivery restrictions and payment methods before ordering, the postcode check, the product safety block, the order button wording and the legal notice next to it. Use when touching the footer, imprint, price display, legal pages, the cart's delivery note, the checkout's address or final steps, product safety, or any copy that promises shipping, returns or prices.
---

# Legal surfaces

Paper shows the statements a shop owes its customers. It does not write them: every fact comes from Saleor, and a missing fact shows nothing. The storefront never links to a page that does not exist and never states a figure the store did not set.

Guidance, not legal or tax advice: these features help a shop work towards compliance and do not make it compliant (full notice in `docs/selling-in-the-eu.md`). This rule covers what is built, not everything a shop needs (see "Not built" below).

## Where each fact lives

| Shown                                                  | Source in Saleor                                                                                                                                                                        | Code                                                   |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Seller's legal name, address, phone                    | Shop company address (Dashboard → Settings → Store → Company Information)                                                                                                               | `src/lib/channels/seller-identity.ts`                  |
| Representatives, register, VAT ID, contact email       | Public shop metadata: `seller.legalName`, `seller.representatives`, `seller.register`, `seller.vatId`, `seller.email`                                                                   | `ShopSellerIdentity.graphql`, `getSellerIdentity()`    |
| Terms, privacy, withdrawal information, shipping pages | Saleor Pages with the slugs `terms`, `privacy`, `withdrawal`, `shipping` (translated titles and slugs are used)                                                                         | `src/config/legal.ts`, `getLegalLinks()`               |
| Whether prices include tax                             | The channel's tax configuration ("display gross prices"), read from one product's `pricing.displayGrossPrices`                                                                          | `ChannelPriceDisplay.graphql`, `getPricesIncludeTax()` |
| Free-shipping threshold                                | Shipping methods of the channel's default country; the Storefront — Policies attribute "Free shipping threshold override (not recommended)" overrides. See `data-storefront-content.md` | `src/lib/content/free-shipping.ts`                     |
| Shipping methods, prices, delivery days, VAT amount    | The checkout (`deliveryOptionsCalculate`, `totalPrice.tax`)                                                                                                                             | `src/checkout/views/saleor-checkout/`                  |
| Delivery countries                                     | The channel's shipping zones (`channel.countries`)                                                                                                                                      | `src/lib/delivery-payment.ts`                          |
| Excluded areas inside those countries                  | Public channel metadata `market.deliveryExclusions`, `market.deliveryExclusions.<locale slug>`                                                                                          | `ChannelDeliveryPayment.graphql`                       |
| Accepted payment methods                               | Public channel metadata `payment.methods`, else (checkout only) what the checkout can take payment with                                                                                 | `getDeliveryPaymentSummary()`                          |
| Whether a postcode is served                           | `shop.availableShippingMethods` for the address and for its country (the shop's own zones and postcode rules)                                                                           | `checkPostcodeDelivery` server action                  |

Everything above is readable without a token, except the channel's default country (app token), which the free-shipping threshold needs.

## Seller identity and the imprint

- `/{locale}/{channel}/imprint` renders `SellerIdentity`. It is a route, not a Saleor Page, so the details cannot drift from the shop's settings. `notFound()` when the shop names no seller.
- The footer puts the legal name in the copyright line, the address under it, and links the imprint when there is a seller.
- Every field is optional. Add a field by adding the `metafield(key: …)` alias to `ShopSellerIdentity.graphql`, the property to `SellerIdentity`, and a label under `legal.imprint` in `messages/*.json`.
- Cache: profile `shop` (hourly); an edit shows within the hour. The revalidate route accepts `shop_metadata_updated`, but the Paper app does not subscribe: Saleor delivers that event only to apps with `MANAGE_SETTINGS`, and the app does not ask for it. Saleor has no event for a company address edit.
- The site name in page titles and JSON-LD is still `src/config/brand.ts`.

## Legal page links

`getLegalLinks(locale)` returns only the pages that exist. Use it wherever a legal page is referenced:

- Footer bottom bar: imprint, then every existing legal page, labelled with the page's own title.
- Sign-up form: terms and privacy become links when the pages exist, plain text otherwise.
- Checkout: `OrderLegalNotice` (see below).
- `PriceNote`: "shipping costs" links to the `shipping` page.

An empty `footer` menu renders no columns. Do not add placeholder links.

❌ A hard-coded `href="/privacy"`, `href="#"`, or any link whose target the shop has not created.

## Price notice

`<PriceNote channel locale variant />` (`src/ui/components/price-note.tsx`, server component):

| Variant | Text                                       | Where                                   |
| ------- | ------------------------------------------ | --------------------------------------- |
| `price` | Incl. VAT, plus shipping costs             | Under the product page price            |
| `total` | Incl. VAT                                  | Cart drawer and cart page total         |
| `all`   | All prices incl. VAT, plus shipping costs. | Footer: covers listing cards and search |

It renders nothing when Saleor says the channel shows prices without tax. A new place that shows a price with an add-to-cart control needs the note, or sits on a page whose footer carries the `all` variant.

Paper always renders gross amounts. A channel Saleor marks as net display gets no note and still shows gross: net display is not built.

## Order button and the notice next to it

- The final checkout button's label is `checkout.actions.buyNow`, the same in every place (desktop button, Stripe form, phone bar): "Buy now", "Acheter maintenant", "Kup teraz", "Osta nyt", "Kjøp nå", "今すぐ購入", "지금 구매하기", and in German the statutory "Zahlungspflichtig bestellen". Nothing else on the button: no amount, no icon text (Consumer Rights Directive Art. 8(2): only the order words). The total sits directly above it: in the order summary beside it on desktop, and as a "Total … incl. VAT" line in `MobileStickyAction` on phones. Keep the wording a plain statement that ordering costs money; "Continue", "Confirm" or "Order" alone do not say so.
- `OrderLegalNotice` (`src/checkout/components/payment/order-legal-notice.tsx`) sits next to the button: directly above it on desktop, inside the sticky action bar on phones (`MobileStickyAction`, which is always on screen), and inside the Stripe form. One sentence each for terms, withdrawal and privacy, shown only when its page exists. The checkout session loader resolves the URLs on the server and passes them through `CheckoutLegalLinksProvider`.

## Price reductions

What a strike-through price, a percentage and the sale badge are measured against depends on the channel (`PriceReductionReference`, `src/config/pricing.ts`):

| Rule            | Applies to                                          | Reference price                                                                  |
| --------------- | --------------------------------------------------- | -------------------------------------------------------------------------------- |
| `"prior-price"` | A channel that ships to at least one EU/EEA country | Only Saleor's prior price (`pricing.pricePrior`, `pricing.priceRangePrior`)      |
| `"list-price"`  | Every other channel                                 | The prior price when set, otherwise the list price (`pricing.priceUndiscounted`) |

- The **prior price** is the lowest price of the last 30 days. Merchants keep it in the variant's channel listing (`priorPrice`); Saleor does not fill it by itself. Under `"prior-price"` a product without one shows the plain price, with no strike-through, percentage or badge, even while a promotion runs.
- `getPriceReductionReference(channel)` (`src/lib/channels/get-price-display.ts`) decides: the override in `priceReductionReferenceByChannel`, else the channel's shipping countries against `PRIOR_PRICE_COUNTRIES`. A channel without shipping countries is judged by its default country; with neither known, the stricter rule applies.
- The rule is settled **once on the server**. `withPriceReference` attaches `pricing.priceReference` to PDP variants and cart lines; `toProductCardData` takes the rule as its last argument. Client components read `priceReference` and never choose between `pricePrior` and `priceUndiscounted`.
- Listing cards show the cheapest variant's price, so they strike through only that variant's own reference. A reduction on a dearer variant keeps the badge without a strike-through.

❌ Reading `priceUndiscounted` in a component to draw a strike-through. On an EU channel it shows a reduction from a price nobody paid recently.
❌ Defaulting a new caller of `toProductCardData` to `"list-price"`. Pass `await getPriceReductionReference(channel)`.

## Delivery and payment before ordering

Delivery restrictions and accepted payment methods are stated "at the latest at the beginning of the ordering process" (Consumer Rights Directive Art. 8(3)).

- `<DeliveryPaymentNote>` (`src/ui/components/delivery-payment-note.tsx`) in the cart drawer and on the cart page; `DeliveryPaymentPanel` (`src/checkout/components/delivery-payment-panel.tsx`) at the top of the information step, collapsed, with a disclosure listing countries, excluded areas and the `shipping` page.
- `buildDeliveryPaymentSummary` (`src/lib/delivery-payment.ts`) is pure; the cart (server component) and the checkout session loader build the same summary. Countries: three or fewer are named; all 27 EU states plus up to three others read "27 EU countries and Monaco"; otherwise a count. Excluded areas: three or fewer named, else the first three "and N more".
- Excluded areas are names the store writes in public channel metadata (comma list; the `.<locale slug>` key is read first). Saleor keeps postcode ranges, not names, and reading them needs `MANAGE_SHIPPING`, a write permission Paper does not ask for. No key: no statement about exclusions, never an inferred one.
- Payment methods: `payment.methods` is a comma list of `PAYMENT_METHOD_KEYS` (translated under `common.deliveryPayment.methods`; brands keep their names). Without it, the checkout names what its provider choice can charge (`paymentMethodsForCheckout` in `src/checkout/lib/payment/`: card with Stripe, test payment only where test payments are allowed, nothing for gateways Paper has no integration for), and the cart names no payment method. The cart query does not read `availablePaymentGateways`: it runs on every page and would fire payment apps' gateway-listing webhooks each time. Add a method by adding its key and its message in every locale.
- A failed channel read returns `null` (no note), never an error page; billing countries fall back to the shipping countries the same way.
- Cache: `ChannelDeliveryPayment` uses the `channels` profile (daily revalidate). The revalidate route busts it on `channel_metadata_updated`, but the Paper app does not subscribe (Saleor delivers it only to apps with `MANAGE_CHANNELS`, a write permission the app does not ask for), so a metadata or shipping zone change usually shows within a day. The postcode check is live and does not wait. Partial data is allowed: a field error drops that line, the cart and checkout still render, and the postcode check still applies.

### Postcode check

- The information step asks `checkPostcodeDelivery` (`src/app/(checkout)/actions.ts`) through the kernel (`liveQuery`, operation `shippingMethodsForAddress`); the browser never talks to Saleor. One request asks for the shop's own methods for country + postcode and for the country alone.
- Answers: `served`; `unserved` only when the shop's zones serve the country but exclude the postcode; `unknown` when they have no method for the country (shipping from an app, or inclusion-only postcode rules). `shop.availableShippingMethods` does not include app-provided methods, so `unknown` never blocks. A store whose app serves postcodes its own zones exclude sets `postcodeDeliveryCheck = false` in `src/config/checkout-delivery.ts`.
- The check waits while the shopper types in the postcode field and runs when it loses focus (autofill, which changes the field without focus, and a picked saved address are checked at once). Answers are remembered per page load. An unserved postcode is a field error (`checkout.errors.postcodeNotServed`) derived from the answer, not stored, so it clears when the address changes; Continue stays on the step and focuses the field; a polite live region announces the check.
- Shipping step, no methods: the postcode banner (`noDeliveryTitle`, `noDeliveryToPostcode`) only when this page's check answered `unserved`; otherwise the neutral `noMethodTitle` / `noMethodForAddress` (weight or price limits and app-provided shipping also end there). When Saleor could not be asked, `loadMethodsFailed` with "Try again", never a delivery claim. Country names come from the server-formatted shipping countries.

❌ A sentence that names a region or country as undeliverable from code or a message string. Names come from the store's metadata; the check comes from Saleor.

## Product safety

The product page shows a "Material & safety" block under the buy box, always visible (GPSR Art. 19: manufacturer name, postal and electronic address, EU responsible person, warnings; textile regulation Art. 16: fibre composition before purchase).

- Source: Saleor attributes by slug, mapped in `src/config/product-safety.ts` (`material`, `safety-information`, `manufacturer`, `eu-responsible-person`). Values use Saleor's attribute translations; labels are Paper's own (`pdp.safety`).
- The mapper puts them on `product.safety` and removes them from `product.attributes`. Templates place `slots.productSafety`; the template contract test requires it.
- No attribute set: no block. Some set: only those rows. An email in the manufacturer text becomes a mailto link; the rest shows as entered.

❌ Product safety details only inside a collapsed accordion or a tab.

## Withdrawal function

`/{locale}/{channel}/withdraw` (`WITHDRAW_PATH`): two labelled steps and a receipt (Consumer Rights Directive Art. 11a). Merchant view: `docs/selling-in-the-eu.md`.

- Kernel interface `src/lib/withdrawals/`: `WithdrawalsProvider` (`provider.ts`, types in `types.ts`) with `lookup` and `submit`. Paper ships only `stub`, which records nothing: the review step's button and heading say "Send your withdrawal by email", and the flow ends in the email route. A backend plugs in by implementing the interface and returning it from `getWithdrawalsProvider()`.
- Shown per channel: `withdrawalFunctionByChannel` in `src/config/withdrawals.ts`, else `isEuEeaChannel` (the prior-price test). The page 404s elsewhere; the entry points (footer after the withdrawal page, account order list and order page, the `withdrawal` page's button) follow the same test.
- Built for a backend as well: `customer` mode (signed in; `getSessionAccessToken()` renews the token through the kernel), `orderLink` (`?order=`), `lookup` (name, order number, email; never shows order contents). With `stub` only `lookup` is used.
- `flow.ts` rebuilds every step from the submitted fields: orders from the signed snapshot of step 1 (`form-token.ts`), the statement recomposed from the scope in the customer's language (`statement.ts`). On confirm the recomposed statement must equal the one shown, else the step returns with `statementUpdated`. The signed confirm token carries the idempotency key, kept across Back and "Try again".
- `?order=` is a Saleor order ID, which reads that order's email and address anonymously: the route sends `Referrer-Policy: no-referrer`, the page removes the parameter from the address bar, analytics drop it, and account links include it only when a backend answered for that order.
- The form submits through `onSubmit` + `startTransition` with `method="post"`; buttons wait for hydration. Like other dynamic Paper pages, it needs JavaScript to display.

❌ "Confirm withdrawal" on a screen that records nothing.
❌ Asking for anything beyond name, the order (or part of it) and an email; a survey or retention offer before the receipt.
❌ Docs or copy that call the email route a withdrawal function.

## Copy that promises something

A sentence about delivery time, shipping cost, a returns window or a discount is a promise. It must come from Saleor or from merchant content, never from a code default or a message string.

❌ "Standard delivery 3-5 business days" in `messages/*.json`.
❌ A returns window, "free returns" or an item-condition rule in code defaults. `policies.returns.windowDays` is `null` unless the merchant sets it.
❌ A fixed "Free shipping" badge.
✅ Delivery days from the shipping method, in the checkout's shipping step.

## Not built

Unit prices, the legal-guarantee notice, and a consent banner.
