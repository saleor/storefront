# Verify

- `pnpm run verify` passes, and `pnpm build:check` shows ◐ for the imprint, products and the product page.
- `/{locale}/{channel}/imprint` renders the shop's company address and `seller.*` metadata, and returns 404 for a shop that names no seller.
- Every footer link resolves. No link points at `/privacy`, `/terms` or `#`.
- On a channel that displays gross prices, the product page shows the price notice and the footer shows the all-prices line.
- On a channel that ships to the EU/EEA, a product on promotion without `priorPrice` shows no strike-through; with `priorPrice` it shows that price struck through. On any other channel a promotion still shows the list price struck through.
- The storefront advertises the same free-shipping threshold as the price-0 shipping method's minimum order price for the channel's default country, or none.
- On a channel with shipping zones, the cart drawer, the cart page and the top of checkout state where the shop delivers and, when known, how customers can pay; `market.deliveryExclusions` names appear when set and nothing about exclusions appears when not.
- At checkout, a postcode that no shipping method serves shows an error under the field and keeps the customer on the information step; a served postcode continues.
- The product page shows "Material & safety" under the buy box for a product with any of the mapped attributes, and those attributes are gone from "Product Details".
- Without a returns window in the Policies Model, no page mentions returns.
- The payment step's button reads "Buy now" / "Zahlungspflichtig bestellen", and the legal notice appears above it once the `terms`, `withdrawal` and `privacy` pages exist (in the sticky bar on phones).
- On an EU/EEA channel the footer links "Vertrag widerrufen" / "Withdraw from contract"; `/{locale}/{channel}/withdraw` shows step 1, and the second step ends in "Send your withdrawal by email" with the seller's address. The route sends `Referrer-Policy: no-referrer`. A non-EU channel answers 404.
