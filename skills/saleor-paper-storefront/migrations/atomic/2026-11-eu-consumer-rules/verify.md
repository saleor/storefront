# Verify

- `pnpm run verify` passes, and `pnpm build:check` shows ◐ for the imprint, products and the product page.
- `/{locale}/{channel}/imprint` renders the shop's company address and `seller.*` metadata, and returns 404 for a shop that names no seller.
- Every footer link resolves. No link points at `/privacy`, `/terms` or `#`.
- On a channel that displays gross prices, the product page shows the price notice and the footer shows the all-prices line.
- On a channel that ships to the EU/EEA, a product on promotion without `priorPrice` shows no strike-through; with `priorPrice` it shows that price struck through. On any other channel a promotion still shows the list price struck through.
- The storefront advertises the same free-shipping threshold as the price-0 shipping method's minimum order price for the channel's default country, or none.
- The payment step's button reads "Buy now" / "Zahlungspflichtig bestellen", and the legal notice appears above it once the `terms`, `withdrawal` and `privacy` pages exist (in the sticky bar on phones).
