# Detect

Pending when `src/templates/pdp/registry.ts` is missing, or the product route still branches on `PDP_LAYOUT_CLASSES`.

```bash
test -f src/templates/pdp/registry.ts && ! grep -q PDP_LAYOUT_CLASSES "src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx"
```
