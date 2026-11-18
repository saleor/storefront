# Selling in the EU with Paper

A shop that sells to consumers in the European Union has to show certain things on its storefront: who the seller is, what a price includes, what a reduction is measured against, what the final button commits the customer to, and where the terms are. Paper shows them, and takes every fact from Saleor, so the storefront cannot say one thing while checkout does another.

This page lists what Paper does, where each fact comes from, what you have to set up in Saleor, and what is not built yet.

> **Guidance, not legal or tax advice.** Paper's EU features help you work towards compliance. They do not make your store compliant, and they are not legal, tax or other professional advice. Laws differ by country and change often, and this guide may be incomplete or out of date. You remain responsible for your store's compliance: confirm every point with a qualified lawyer, tax adviser or the competent authority before you rely on it. Example company details and prices are fictitious.

Paper covers only the part a storefront displays, and the rules also differ per product.

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
| Where you deliver and how customers can pay         | Shipping zones; public channel metadata                      | Two optional metadata keys per channel     |
| "We don't deliver to this postcode" before shipping | The shipping zones' postcode rules                           | Postcode rules on shipping zones           |
| "Material & safety" on the product page             | Product attributes with fixed slugs                          | Four attributes                            |
| A returns window                                    | The Storefront — Policies Model                              | "Returns window days", or nothing          |
| "Withdraw from contract" screens                    | Paper; recording needs a backend (not included yet)          | Handle withdrawals sent by email           |

A fact that is missing in Saleor is not shown. Paper has no fallback figures and never links to a page that does not exist.

## What Applies Where

Some behaviour depends on the market a channel serves, some on the language, and some applies everywhere.

| Behaviour                                    | Legal scope                                                                                                                   | Where Paper shows it                                               |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 30-day prior price for sales                 | EU and EEA consumers (Directive 98/6/EC Art. 6a, added by the Omnibus Directive)                                              | Per channel: channels that ship to an EU or EEA country            |
| Order button stating the obligation to pay   | Every EU and EEA country (Consumer Rights Directive Art. 8(2)); German courts are strict about the wording                    | Per language                                                       |
| "Incl. VAT, plus shipping costs"             | EU final-price rules (Directive 98/6/EC Art. 2; Consumer Rights Directive Art. 6(1)(e)); the German phrase is German practice | Per channel when prices are shown including VAT, in every language |
| Imprint and seller details                   | EU-established sellers (E-Commerce Directive Art. 5)                                                                          | Every channel                                                      |
| Where the shop delivers, and payment methods | EU and EEA (Consumer Rights Directive Art. 8(3))                                                                              | Every channel                                                      |
| Product safety information                   | EU (General Product Safety Regulation, Regulation (EU) 2023/988)                                                              | Every channel                                                      |
| Billing address from any country             | EU (Geo-blocking Regulation, Regulation (EU) 2018/302)                                                                        | Every channel, for orders that are shipped                         |
| Withdrawal function                          | EU and EEA (Consumer Rights Directive Art. 11a)                                                                               | Per channel: channels that ship to an EU or EEA country            |

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

A change to these details shows on the storefront within an hour. The storefront also accepts Saleor's `shop_metadata_updated` webhook for an immediate refresh, but the Paper app does not send it: Saleor delivers that event only to apps that hold the broad `MANAGE_SETTINGS` permission, which an hour's delay does not justify.

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

## Delivery and Payment

Customers have to learn where you deliver and how they can pay before they start ordering. Paper puts a short "Delivery and payment" note in the cart drawer and on the cart page, and the same facts at the top of checkout, collapsed, with a list of countries and excluded areas behind a toggle:

> We deliver to 27 EU countries and Monaco. Not to: Canary Islands, Ceuta, Melilla and 7 more. Payment by card or PayPal.

**Countries** come from the channel's shipping zones. Up to three are named; all 27 EU countries are summed up as "27 EU countries", with up to three others named after them; anything else is a count.

**Excluded areas.** Saleor stores excluded postcodes as ranges, which a customer cannot read, and reading them needs a permission that can change your shipping setup. So you name the areas yourself, in public channel metadata (Dashboard → Configuration → Channels → the channel → Metadata):

| Key                            | Example                                        |
| ------------------------------ | ---------------------------------------------- |
| `market.deliveryExclusions`    | `Canary Islands, Ceuta, Melilla, Heligoland`   |
| `market.deliveryExclusions.de` | `Kanarische Inseln, Ceuta, Melilla, Helgoland` |

A comma list. The key with a language suffix (`.de`, `.fr`, the storefront's locale) is shown in that language; the plain key everywhere else. Without either key Paper says nothing about exclusions. Keep the list in step with the postcode rules on your shipping zones: the names are what customers read, the rules are what checkout applies.

**Payment methods.** Set `payment.methods` on the channel to a comma list of these keys:

`card`, `apple-pay`, `google-pay`, `paypal`, `klarna`, `sepa-debit`, `ideal`, `bancontact`, `blik`, `invoice`

Paper translates them and keeps brand names as they are. Without the key, checkout names only what Paper can take payment with ("card" with the Stripe app) and the cart names no payment method. Paper cannot see which methods you switched on in your payment provider, so set the key.

A change to these keys or to your shipping zones shows on the storefront within a day. The storefront accepts Saleor's `channel_metadata_updated` webhook for an immediate refresh, but the Paper app does not send it: Saleor delivers that event only to apps that hold `MANAGE_CHANNELS`, which can create, delete and reconfigure channels. The postcode check below asks Saleor live, so a postcode rule you add applies at once.

**Postcode check.** When a customer enters a postcode at checkout, Paper asks Saleor whether your shipping zones serve it. If your zones serve the country but their postcode rules exclude this postcode, the customer reads "We don't deliver to postcode 35001." under the field and cannot continue until they change the address. They learn it before they choose shipping, not after.

The check sees only the shipping methods defined in your shipping zones. If your shipping methods come from an app, there is no early check: the customer sees the methods, or that none is available, at the shipping step. If an app delivers to postcodes your own zones exclude, turn the check off: `postcodeDeliveryCheck = false` in `src/config/checkout-delivery.ts`.

## Product Safety

Every offer of a consumer product in the EU names the manufacturer (name, postal and email address), an EU responsible person when the manufacturer is outside the EU, and warnings or safety information (General Product Safety Regulation, Art. 19). Textiles state their fibre composition before purchase.

Paper shows these in a "Material & safety" block under the buy box, always open. Create them as product attributes with these slugs and add them to your product types:

| Slug                    | Shown as              |
| ----------------------- | --------------------- |
| `material`              | Material              |
| `safety-information`    | Safety information    |
| `manufacturer`          | Manufacturer          |
| `eu-responsible-person` | EU responsible person |

Plain text or choice attributes, translated in Saleor like any other attribute. An email address in the manufacturer text becomes a link. A product with none of them shows no block; one with some shows those. Using other slugs? Map them in `src/config/product-safety.ts`.

## Returns

Paper states no returns window unless you set one: the Storefront — Policies Model's "Returns window days". With it, the cart, product page and homepage mention your window ("Returns within 30 days.", "30-day returns"). Without it, they say nothing about returns.

Your statutory withdrawal information belongs on the `withdrawal` page; a returns window is a promise on top of it.

## Withdrawal Function

Consumers in the EU and EEA can withdraw from an online purchase through a function on the shop: one step to say which order, labelled "Withdraw from contract" ("Vertrag widerrufen"), a second to confirm, labelled "Confirm withdrawal" ("Widerruf bestätigen"), and a receipt right away. Pressing the confirm button is the time the withdrawal is received.

Paper shows the screens at `/{locale}/{channel}/withdraw` and links them from:

- the footer of every page, next to the withdrawal information page,
- the customer's order list and order page,
- the shop's `withdrawal` page, under its own text.

Customers enter their name, the order number and their email, and choose the whole order or describe which items. Only those details are asked for.

**Where it is shown.** On channels that ship to at least one EU or EEA country, the same test as for prior prices. To show it on another channel (for a voluntary returns policy) or hide it, set the channel in `src/config/withdrawals.ts`.

**What Paper does today.** Recording a withdrawal and sending the receipt needs a backend, and Paper does not include one yet. The screens therefore end with "Send your withdrawal by email": the customer's statement written out, the shop's email address from `seller.email`, and a button that opens their mail app. They never say "Confirm withdrawal", because nothing is recorded.

That email route is not a withdrawal function on its own. Until a backend records withdrawals, you have to receive withdrawals sent by email, confirm each one to the customer without delay with its content and the date and time you received it, and handle them yourself. A backend plugs in as a provider in `src/lib/withdrawals`: the screens, the account links and the receipt are built for it.

**Wording.** English and German use the statutory labels. Other languages use clear translations; check them against your country's rules before you rely on them.

## Free Shipping

Define free shipping in Saleor as a shipping method with price 0 and a minimum order price. Checkout applies it, and Paper advertises the same number in the announcement bar, on the product page and in the cart's progress bar.

Paper reads the threshold for the channel's default country, which needs `SALEOR_APP_TOKEN`. A customer in another country can have a different threshold; they see their own shipping methods and prices at the checkout's shipping step. Without a free method, Paper shows no threshold.

The Storefront — Policies Model has an attribute "Free shipping threshold override (not recommended)". It changes what the storefront advertises, not what checkout charges. Leave it empty unless you have a reason; Paper warns in development when it differs from Saleor.

## Checkout

- **Order button.** The final button says "buy now" in the customer's language ("Acheter maintenant", "Kup teraz", "Osta nyt", "Kjøp nå") and "Zahlungspflichtig bestellen" in German, with nothing else on it. The total is shown directly above it: beside it in the order summary on a computer, and in the bar at the bottom of the screen on a phone.
- **Legal line.** Above the button: one sentence each for the terms, the withdrawal information and the privacy notice, each shown only when its page exists.
- **Countries.** The shipping address form offers the countries of the channel's shipping zones and preselects the channel's default country (the preselection needs `SALEOR_APP_TOKEN`). The billing address can be in any country Saleor knows: a customer in Austria can pay with a card registered in Switzerland.
- **Delivery and payment.** The facts from [Delivery and Payment](#delivery-and-payment) sit at the top of the first step, and an address you do not serve is refused before the shipping step.
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

- The legal-guarantee notice
- A cookie consent banner (Paper's analytics can wait for consent, but there is no banner to collect it)
- Unit prices
- Net price display for business channels

## For Developers

The agent rule [`ui-legal`](../skills/saleor-paper-storefront/rules/ui-legal.md) has the code paths for everything above.
