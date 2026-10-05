# 2026-10-storefront-templates

Move PDP layout out of the product route and into `src/templates/pdp/`.

Requires `2026-10-data-kernel`. `upstreamSha` stays empty until the commit that releases this migration exists.

## Steps

1. If the fork edited the product page JSX, move that layout into `src/templates/pdp/custom.tsx` using `definePdpTemplate`. Place `slots.gallery` and `slots.buyBox` exactly once. Do not read `searchParams` or cookies in the template.
2. Register the template in `src/templates/pdp/registry.ts`. Set `ACTIVE_PDP_TEMPLATE` and `ACTIVE_PDP_GALLERY` in `src/config/template-selection.ts` to the same gallery.
3. Leave metadata, JSON-LD, and the gallery and buy-box islands in the product route. The route should render `templates.pdp.Layout`.
4. Run `pnpm run verify`.
