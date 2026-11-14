---
name: ui-legal
description: What Paper shows for consumer-law duties (EU distance selling) and where each fact comes from in Saleor — seller identity and the /imprint route, legal page links by Saleor Page slug, the "incl. VAT, plus shipping costs" price notice, the order button wording and the legal notice next to it. Use when touching the footer, imprint, price display, legal pages, the checkout's final button, or any copy that promises shipping, returns or prices.
---

# Legal surfaces

Paper shows the statements a shop owes its customers. It does not write them: every fact comes from Saleor, and a missing fact shows nothing. The storefront never links to a page that does not exist and never states a figure the store did not set.

This rule covers what is built. It is not legal advice, and it is not a complete list of what a shop needs (see "Not built" below).

## Where each fact lives

| Shown                                                  | Source in Saleor                                                                                                               | Code                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| Seller's legal name, address, phone                    | Shop company address (Dashboard → Settings → Store → Company Information)                                                      | `src/lib/channels/seller-identity.ts`                  |
| Representatives, register, VAT ID, contact email       | Public shop metadata: `seller.legalName`, `seller.representatives`, `seller.register`, `seller.vatId`, `seller.email`          | `ShopSellerIdentity.graphql`, `getSellerIdentity()`    |
| Terms, privacy, withdrawal information, shipping pages | Saleor Pages with the slugs `terms`, `privacy`, `withdrawal`, `shipping` (translated titles and slugs are used)                | `src/config/legal.ts`, `getLegalLinks()`               |
| Whether prices include tax                             | The channel's tax configuration ("display gross prices"), read from one product's `pricing.displayGrossPrices`                 | `ChannelPriceDisplay.graphql`, `getPricesIncludeTax()` |
| Free-shipping threshold                                | Shipping methods of the channel's default country; the Storefront — Policies Model overrides. See `data-storefront-content.md` | `src/lib/content/free-shipping.ts`                     |
| Shipping methods, prices, delivery days, VAT amount    | The checkout (`deliveryOptionsCalculate`, `totalPrice.tax`)                                                                    | `src/checkout/views/saleor-checkout/`                  |

Everything above is readable without a token, except the channel's default country (app token), which the free-shipping threshold needs.

## Seller identity and the imprint

- `/{locale}/{channel}/imprint` renders `SellerIdentity`. It is a route, not a Saleor Page, so the details cannot drift from the shop's settings. `notFound()` when the shop names no seller.
- The footer puts the legal name in the copyright line, the address under it, and links the imprint when there is a seller.
- Every field is optional. Add a field by adding the `metafield(key: …)` alias to `ShopSellerIdentity.graphql`, the property to `SellerIdentity`, and a label under `legal.imprint` in `messages/*.json`.
- Cache: profile `shop` (hourly). `shop_metadata_updated` busts it. Saleor has no event for a company address edit.
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

- The final checkout button's label is `checkout.actions.payTotal`. German reads "Zahlungspflichtig bestellen" with nothing else on the button. Other locales say "Pay {total}". Keep the wording a plain statement that ordering costs money; "Continue", "Confirm" or "Order" alone do not say so.
- `OrderLegalNotice` (`src/checkout/components/payment/order-legal-notice.tsx`) sits directly above the button for server-submit gateways and inside the Stripe form. One sentence each for terms, withdrawal and privacy, shown only when its page exists. The checkout session loader resolves the URLs on the server and passes them through `CheckoutLegalLinksProvider`.

## Copy that promises something

A sentence about delivery time, shipping cost, a returns window or a discount is a promise. It must come from Saleor or from merchant content, never from a code default or a message string.

❌ "Standard delivery 3-5 business days" in `messages/*.json`.
❌ A fixed "Free shipping" badge.
✅ Delivery days from the shipping method, in the checkout's shipping step.

## Not built

Unit prices, the 30-day prior price for discounts (`pricePrior`), a statement of delivery restrictions and accepted payment methods before checkout, a withdrawal function on order pages, the legal-guarantee notice, a consent banner, and a dedicated product-safety block on the product page.
