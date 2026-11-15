# Detect

The shop has no `src/config/legal.ts`, or still measures a reduction against the list price everywhere.

Look for:

- `priceUndiscounted` or `priceRangeUndiscounted` read in a component to draw a strike-through
- `freeShippingThreshold: 75` in `src/lib/content/defaults.ts`
- `href="/privacy"`, `href="/terms"` or `defaultFooterLinks` in the footer
- no `src/app/(storefront)/[locale]/[channel]/(main)/imprint/`
- no `src/lib/delivery-payment.ts`, or a hard-coded sentence in the shipping step blaming a whole country for an unserved address
- `manufacturer` or `safety-information` attributes shown only inside the "Product Details" accordion
