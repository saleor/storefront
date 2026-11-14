# Selling in the EU with Paper

A shop that sells to consumers in the European Union has to show certain things on its storefront: who the seller is, what a price includes, what a reduction is measured against, what the final button commits the customer to, and where the terms are. Paper shows them, and takes every fact from Saleor, so the storefront cannot say one thing while checkout does another.

This page lists what Paper does, where each fact comes from, what you have to set up in Saleor, and what is not built yet.

It is not legal advice. The rules differ per country and per product, and Paper covers only the part a storefront displays. Have your shop reviewed before you go live.

## At a Glance

| What the customer sees                              | Where it comes from in Saleor                                | You set up                                 |
| --------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------ |
| Imprint page and seller line in the footer          | Shop company address and public shop metadata `seller.*`     | Company information and five metadata keys |
| Links to terms, privacy, withdrawal, shipping pages | Saleor Pages with fixed slugs                                | Four pages                                 |
| "Incl. VAT, plus shipping costs" next to prices     | The channel's tax configuration                              | Tax configuration with gross display       |
| Sale badge, strike-through price, percentage        | The variant's prior price (lowest price of the last 30 days) | `priorPrice` on variant channel listings   |
| Free-shipping threshold                             | A shipping method priced 0 with a minimum order price        | Shipping methods                           |
| Order button wording and the legal line above it    | Paper's translations; the legal pages above                  | Nothing                                    |
| Shipping methods, prices, delivery days, VAT amount | The checkout                                                 | Shipping zones and methods, delivery days  |

A fact that is missing in Saleor is not shown. Paper has no fallback figures and never links to a page that does not exist.

## Seller Details and the Imprint

Paper renders an imprint at `/{locale}/{channel}/imprint` and puts the seller's legal name and address in the footer of every page.

Saleor has no seller entity yet, so the details live in two places:

- **Company address and phone:** Dashboard → Settings → Store → Company Information.
- **Public shop metadata:**

| Key                      | Example                                    |
| ------------------------ | ------------------------------------------ |
| `seller.legalName`       | `Northvale Outfitters GmbH`                |
| `seller.representatives` | `Anna Example (Geschäftsführerin)`         |
| `seller.register`        | `Amtsgericht Charlottenburg, HRB 000000 B` |
| `seller.vatId`           | `DE000000000`                              |
| `seller.email`           | `hello@example.com`                        |

Every field is optional; the imprint shows what is set. Public metadata is readable without a token, so never store private numbers there. The imprint is a route, not a Saleor Page, so it cannot drift from the shop's settings. A shop that names no seller has no imprint and no imprint link.

A metadata change shows at once when the Paper app forwards Saleor's `SHOP_METADATA_UPDATED` event; otherwise within an hour. Saleor has no event for a company address edit.

## Legal Pages

Create these as Saleor Pages (Models). Paper links each one only when it exists, with the page's own title, and uses translated titles and slugs:

| Slug         | Linked from                                           |
| ------------ | ----------------------------------------------------- |
| `terms`      | Footer, sign-up form, the line above the order button |
| `privacy`    | Footer, sign-up form, the line above the order button |
| `withdrawal` | Footer, the line above the order button               |
| `shipping`   | Footer, and "shipping costs" in the price notice      |

The slugs are set in `src/config/legal.ts`. An empty `footer` menu shows no placeholder links.

## Prices

**Notice next to prices.** When the channel's tax configuration says prices are displayed gross, Paper adds:

- "Incl. VAT, plus shipping costs" under the price on the product page
- "Incl. VAT" at the cart total
- "All prices incl. VAT, plus shipping costs." in the footer, which covers listings and search

Paper always displays gross amounts. A channel that Saleor marks as net display gets no notice; net display is not built.

**Price reductions.** When a shop announces a price reduction to consumers in the EU or EEA, the reference has to be the lowest price of the previous 30 days, not the list price. Saleor carries that value as the variant listing's `priorPrice`.

Paper picks the rule per channel:

| Channel                                 | A reduction is measured against                          |
| --------------------------------------- | -------------------------------------------------------- |
| Ships to at least one EU or EEA country | The prior price only. No prior price, no reduction shown |
| Ships only elsewhere                    | The prior price when set, otherwise the list price       |

Two consequences for an EU shop:

- Saleor does not fill `priorPrice` by itself. Keep it up to date on every variant listing you put on promotion, or the sale badge, strike-through price and percentage do not appear.
- A product that was cheaper two weeks ago is not shown as reduced from its list price.

To override the rule for a channel, set it in `src/config/pricing.ts`:

```ts
export const priceReductionReferenceByChannel = { uk: "prior-price" };
```

**Not built:** unit prices (price per litre or kilogram).

## Free Shipping

Define free shipping in Saleor as a shipping method with price 0 and a minimum order price. Checkout applies it, and Paper advertises the same number in the announcement bar, on the product page and in the cart's progress bar.

Paper reads the threshold for the channel's default country, which needs `SALEOR_APP_TOKEN`. A customer in another country can have a different threshold; they see their own shipping methods and prices at the checkout's shipping step. Without a free method, Paper shows no threshold.

The Storefront — Policies Model has an attribute "Free shipping threshold override (not recommended)". It changes what the storefront advertises, not what checkout charges. Leave it empty unless you have a reason; Paper warns in development when it differs from Saleor.

## Checkout

- **Order button.** The final button reads "Buy now" in English and "Zahlungspflichtig bestellen" in German, with nothing else on it. The total stays in the order summary beside it.
- **Legal line.** Above the button: one sentence each for the terms, the withdrawal information and the privacy notice, each shown only when its page exists.
- **Countries.** The address form offers the countries of the channel's shipping zones and preselects the channel's default country (the preselection needs `SALEOR_APP_TOKEN`).
- **Shipping.** Method names, prices and delivery days come from Saleor for the address entered.
- **VAT.** The summary shows the VAT amount and recalculates it for the destination country.
- **Stock.** Paper reads `checkout.problems`, so it works with the channel setting `useLegacyErrorFlow: false`: a customer whose item sold out is stopped before payment.

## Languages

Paper ships German, French, Polish, Finnish, Norwegian, Japanese and Korean next to English. Set the locales in the environment:

```bash
NEXT_PUBLIC_STOREFRONT_LOCALES=de,en
NEXT_PUBLIC_DEFAULT_LOCALE=de
NEXT_PUBLIC_DEFAULT_TIME_ZONE=Europe/Berlin
```

Product names, descriptions and attribute values come from Saleor's translations. Paper never redirects by IP address or browser language; customers switch with the region picker.

## Not Built Yet

- A statement of delivery restrictions and accepted payment methods before checkout starts
- A withdrawal function on order pages
- The legal-guarantee notice
- A cookie consent banner (Paper's analytics can wait for consent, but there is no banner to collect it)
- Unit prices
- A dedicated product-safety block on the product page (manufacturer and safety attributes show under "Product Details")
- Net price display for business channels

## For Developers

The agent rule [`ui-legal`](../skills/saleor-paper-storefront/rules/ui-legal.md) has the code paths for everything above.
