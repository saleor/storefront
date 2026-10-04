---
name: ui-templates
description: PDP layout templates. Use when molding, restyling, or replacing the product page layout. Edit src/templates and src/config/template-selection.ts. Do not edit the product route, gallery-layout.ts, or Saleor queries for a layout change.
---

# UI templates

A Paper shop picks one PDP layout at build time. The route owns data, caching, and the dynamic islands. The template owns the layout. A new look is a new file in `src/templates/pdp/`, not an edit to the product route.

## What you may edit

| Change                                   | Where                                                                                          |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Rearrange the PDP                        | `src/templates/pdp/<name>.tsx`, then register it in `src/templates/pdp/registry.ts`            |
| Which template the shop uses             | `ACTIVE_PDP_TEMPLATE` in `src/config/template-selection.ts`                                    |
| Which gallery island that template uses  | The template's `gallery` field, and the same value in `ACTIVE_PDP_GALLERY`                     |
| A field the view model does not have yet | `src/graphql/extensions/ProductDetailsExtension.graphql`, then `src/config/storefront-view.ts` |

`ACTIVE_PDP_GALLERY` must equal the active template's `gallery` (`standard`, `immersive`, or `mosaic`). `pnpm test` fails when they disagree. The gallery island and the route skeleton follow `ACTIVE_PDP_GALLERY`.

## What a template receives

`PdpTemplateProps` is the whole API:

- `product` — a `ProductView`. Name, price range, images, description HTML, specs, care, bestseller flag, and `extensions`.
- `slots.gallery` — the variant gallery, already inside Suspense. Place it exactly once.
- `slots.buyBox` — price, variant pickers, add to cart. Already inside Suspense and an error boundary. Place it exactly once.
- `slots.breadcrumbs` and `slots.attributes` — ready-made chrome. Place `attributes` or draw `product.attributes` yourself.

Specs other than size, color, care, and the bestseller flag are already on `product.attributes`. A highlighted material line does not need a new query. A field that is not on `ProductView` goes through the extension fragment and `mapProductExtensions`. Run `pnpm generate` after the fragment change. Do not edit `src/lib/storefront/mappers/product.ts`.

## What a template must not do

These are lint errors (`paper/template-purity`, `paper/ui-no-gql`):

- Import `@/gql`, `@/lib/saleor`, `@/lib/catalog/*`, or `@/app/actions`.
- Call `cookies()`, `headers()`, `draftMode()`, or `connection()`.
- Use `"use cache"` or `cacheLife`.
- Read `searchParams`. The route already did, inside the slots.

Do not edit these to change layout:

- `src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx`
- `src/ui/components/pdp/gallery-layout.ts`
- `src/ui/components/pdp/gallery-registry.tsx`
- `src/lib/storefront/**`

## Add a template

```tsx
// src/templates/pdp/editorial.tsx
import { definePdpTemplate, type PdpTemplateProps } from "@/lib/storefront/templates";
import { ProductRouteSkeleton } from "@/ui/components/pdp/product-route-skeleton";

function EditorialLayout({ product, slots }: PdpTemplateProps) {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<h1 className="text-h1">{product.name}</h1>
			{slots.gallery}
			{slots.buyBox}
		</div>
	);
}

export const editorialPdp = definePdpTemplate({
	id: "editorial",
	gallery: "immersive",
	Layout: EditorialLayout,
	Skeleton: ProductRouteSkeleton,
});
```

Register `editorial: editorialPdp` in `src/templates/pdp/registry.ts`. Set `ACTIVE_PDP_TEMPLATE` to `"editorial"` and `ACTIVE_PDP_GALLERY` to `"immersive"`.

Style with `brand.css` tokens (`bg-background`, `text-foreground`, `text-h1`). The outer wrapper stays `flex min-h-screen flex-col` so the route skeleton matches. The browse layout already renders `<main>`; the template does not.

Switching among `standard`, `immersive`, and `mosaic` is the `gallery` field plus `ACTIVE_PDP_GALLERY`. Their column classes live in `PDP_LAYOUT_CLASSES` and can be reused. A page that is not one of those three is still just a template: arrange the same slots differently.

## Contract version

`STOREFRONT_CONTRACT_VERSION` in `src/lib/storefront/contract/version.ts`. Adding an optional field is not a bump. Removing or renaming a field is.
