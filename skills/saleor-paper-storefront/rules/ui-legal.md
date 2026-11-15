---
name: ui-legal
description: What Paper shows for consumer-law duties (EU distance selling) and where each fact comes from in Saleor — seller identity and the /imprint route, legal page links by Saleor Page slug, the "incl. VAT, plus shipping costs" price notice, prior-price reductions, delivery restrictions and payment methods before ordering, the postcode check, the product safety block, the order button wording and the legal notice next to it. Use when touching the footer, imprint, price display, legal pages, the cart's delivery note, the checkout's address or final steps, product safety, or any copy that promises shipping, returns or prices.
---

# Legal surfaces

Paper shows the statements a shop owes its customers. It does not write them: every fact comes from Saleor, and a missing fact shows nothing. The storefront never links to a page that does not exist and never states a figure the store did not set.

This rule covers what is built. It is not legal advice, and it is not a complete list of what a shop needs (see "Not built" below).

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
| Accepted payment methods                               | Public channel metadata `payment.methods`, else the checkout's payment apps                                                                                                             | `getDeliveryPaymentSummary()`                          |
| Whether a postcode is served                           | `shippingMethods` on an address (Saleor applies the zones' postcode rules)                                                                                                              | `checkPostcodeDelivery` server action                  |

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

- The final checkout button's label is `checkout.actions.payTotal`. English reads "Buy now" and German "Zahlungspflichtig bestellen", with nothing else on the button: no amount, no icon text. The other locales say "Pay {total}". Keep the wording a plain statement that ordering costs money; "Continue", "Confirm" or "Order" alone do not say so. The total stays visible in the order summary next to it.
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
- Payment methods: `payment.methods` is a comma list of `PAYMENT_METHOD_KEYS` (translated under `common.deliveryPayment.methods`; brands keep their names). Without it, `paymentMethodsFromGateways` maps known apps (`saleor.app.payment.stripe` → card, the dummy app → test payment) and shows other apps by their name. Add a method by adding its key and its message in every locale.
- Cache: `ChannelDeliveryPayment` uses the `channels` profile (daily revalidate). The revalidate route busts it on `channel_metadata_updated`, but the Paper app subscribes to no channel events, so a metadata or shipping zone change usually shows within a day. The postcode check is live and does not wait. Partial data is allowed: a field error drops that line, the cart and checkout still render, and the postcode check still applies.

### Postcode check

- The information step asks `checkPostcodeDelivery` (`src/app/(checkout)/actions.ts`) whether any shipping method serves country + postcode. The action calls Saleor through the kernel (`liveQuery`, operation `shippingMethodsForAddress`); the browser never talks to Saleor.
- `usePostcodeDelivery` debounces 500 ms and remembers answers per page load. An unserved postcode is a field error (`checkout.errors.postcodeNotServed`), Continue stays on the step and focuses the field, and a polite live region announces the check.
- The shipping step's empty state is a `CheckoutIssueBanner` naming the postcode and the country in the shopper's language, with "Change address".

❌ A sentence that names a region or country as undeliverable from code or a message string. Names come from the store's metadata; the check comes from Saleor.

## Product safety

The product page shows a "Material & safety" block under the buy box, always visible (GPSR Art. 19: manufacturer name, postal and electronic address, EU responsible person, warnings; textile regulation Art. 16: fibre composition before purchase).

- Source: Saleor attributes by slug, mapped in `src/config/product-safety.ts` (`material`, `safety-information`, `manufacturer`, `eu-responsible-person`). Values use Saleor's attribute translations; labels are Paper's own (`pdp.safety`).
- The mapper puts them on `product.safety` and removes them from `product.attributes`. Templates place `slots.productSafety`; the template contract test requires it.
- No attribute set: no block. Some set: only those rows. An email in the manufacturer text becomes a mailto link; the rest shows as entered.

❌ Product safety details only inside a collapsed accordion or a tab.

## Copy that promises something

A sentence about delivery time, shipping cost, a returns window or a discount is a promise. It must come from Saleor or from merchant content, never from a code default or a message string.

❌ "Standard delivery 3-5 business days" in `messages/*.json`.
❌ A returns window, "free returns" or an item-condition rule in code defaults. `policies.returns.windowDays` is `null` unless the merchant sets it.
❌ A fixed "Free shipping" badge.
✅ Delivery days from the shipping method, in the checkout's shipping step.

## Not built

Unit prices, a withdrawal function on order pages, the legal-guarantee notice, and a consent banner.
