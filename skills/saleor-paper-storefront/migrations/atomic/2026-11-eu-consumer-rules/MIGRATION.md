# 2026-11-eu-consumer-rules

Show what a shop owes its customers (seller, legal pages, price notice, price reductions, order button), with every fact taken from Saleor. Read `rules/ui-legal.md` first; it is the destination. `docs/selling-in-the-eu.md` is the merchant's side.

Requires `2026-10-listing-contract`. `upstreamSha` stays empty until the commit that releases this migration exists.

Several defaults change what an existing shop shows. Tell the user about each one marked **Visible** before porting it.

## Steps

1. **Seller and legal pages.** Add `ShopSellerIdentity.graphql`, `src/lib/channels/seller-identity.ts`, `get-seller-identity.ts`, `src/config/legal.ts`, `src/lib/catalog/get-legal-links.ts` and the `imprint` route. The kernel brings the `shop` cache profile.
2. **Footer. Visible.** Replace hard-coded legal links with the imprint link and `getLegalLinks`. An empty `footer` menu renders no columns: a fork that relied on the placeholder Support / Company links has to create the pages and the menu, or keep its own columns.
3. **Price notice.** Add `ChannelPriceDisplay.graphql`, `get-price-display.ts` and `PriceNote`; render it under the product page price (shell and buy box), at the cart totals and in the footer.
4. **Price reductions. Visible on channels that ship to the EU/EEA.** Fetch `pricePrior` / `priceRangePrior` next to the list price. Resolve the reference on the server (`getPriceReductionReference`, `withPriceReference`, the last argument of `toProductCardData`) and make components read `pricing.priceReference`. A fork component that reads `priceUndiscounted` to draw a strike-through must switch. On an EU/EEA channel, products without `priorPrice` lose their sale badge and strike-through: the merchant sets `priorPrice`, or the fork sets `priceReductionReferenceByChannel` in `src/config/pricing.ts`.
5. **Free-shipping threshold. Visible.** The code default is `null` and the value comes from Saleor's shipping methods (`ChannelShippingMethods.graphql`, `free-shipping.ts`, `get-saleor-free-shipping.ts`, wired in `get-storefront-content.ts`). A fork that set its own default in `defaults.ts` keeps it as an override; say so and suggest removing it. The Policies attribute is now "Free shipping threshold override (not recommended)". The old attribute `free-shipping-threshold` is ignored: it was seeded with 75 on every store, so its value is not a merchant's choice. Tell the user that a deliberately set threshold has to be entered again in the renamed field, or better, configured on the shipping method.
6. **Shipping claims. Visible.** Drop the delivery-time sentence from `pdp.attributes.shippingBody`, add `shippingAtCheckout`, and remove the checkout summary's fixed trust tiles.
7. **Order button. Visible.** `checkout.actions.payTotal` reads "Buy now" in English and "Zahlungspflichtig bestellen" in German. Add `OrderLegalNotice`, `CheckoutLegalLinksProvider`, and the links in the checkout session loader. Keep a fork's own button wording only if it still states that ordering costs money.
8. Mirror every new message key in all locale files (`legal`, `common.prices`, `checkout.legal`, `pdp.attributes.shippingAtCheckout`).
9. Run `pnpm generate`, `pnpm data:lock`, `pnpm content:export-seed` and `pnpm run verify`.
