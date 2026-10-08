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

`ACTIVE_PDP_GALLERY` must equal the active template's `gallery` (`standard`, `immersive`, `mosaic`, or `columns`). A mismatch is a TypeScript error in `pnpm typecheck`; the app also throws at startup as a backstop. The gallery island and the route skeleton follow `ACTIVE_PDP_GALLERY`.

## What a template receives

`PdpTemplateProps` is the whole API:

- `product` — a `ProductView`. Name, price range, images, description HTML, specs, care, bestseller flag, and `extensions`.
- `slots.gallery` — the variant gallery, already inside Suspense. Place it exactly once. Thumbnails and the hero stay inside this slot. Set the template `gallery` field to `standard` (thumbs under the hero), `immersive`, `mosaic`, or `columns` (thumbs on the left, hero in the center, buy box on the right). `ACTIVE_PDP_GALLERY` must equal that field.
- `slots.buyBox` — price, variant pickers, add to cart. Already inside Suspense and an error boundary. Place it exactly once.
- `slots.breadcrumbs` and `slots.attributes` — ready-made chrome. Place `attributes` or draw `product.attributes` yourself.

Specs other than size, color, care, and the bestseller flag are already on `product.attributes`. A highlighted material line does not need a new query. A field that is not on `ProductView` goes through the extension fragment and `mapProductExtensions`. Run `pnpm generate` after the fragment change. Do not edit `src/lib/storefront/mappers/product.ts`.

## What a template must not do

These are lint errors (`paper/template-purity`, `paper/ui-no-gql`):

- Import `@/gql`, `@/lib/saleor`, `@/lib/catalog/*`, or `@/app/actions`.
- Call `cookies()`, `headers()`, `draftMode()`, or `connection()`.
- Use `"use cache"` or `cacheLife`.
- Read `searchParams`. The route already did, inside the slots.

Lint checks direct imports only. A template can still collapse the static shell by rendering a component that reads cookies or `searchParams` further down. The route stays ◐ in `pnpm build` because the page-level Suspense keeps it partial, so the build cannot see it. The check that does is the instant-navigation e2e (`e2e/instant-navigation.spec.ts`): the PDP title must render inside `instant()`. CI runs it after every build against `next start` (`.github/workflows/build.yml`, browsing `NEXT_PUBLIC_DEFAULT_CHANNEL`; `E2E_BROWSE_PATH` overrides it, see `e2e/helpers/browse-path.ts`) and against each Vercel preview (`.github/workflows/e2e-preview.yml`). CI also runs `pnpm check:ppr-resume` (`scripts/check-ppr-resume.mjs`), which blocks: it fails when a prerendered shell no longer resumes at request time, for example because a template or the chrome reads `new Date()` during render. Read the clock behind `io()` inside `<Suspense>` (see `src/ui/components/copyright-text.tsx`). Locally: `pnpm build && pnpm test:e2e:instant`.

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

Built-in presets are `standard`, `immersive`, `mosaic`, and `columns` in `src/templates/pdp/`. Select one with `ACTIVE_PDP_TEMPLATE` and the matching `ACTIVE_PDP_GALLERY`. A page that is none of those is still just a template: arrange the same slots differently. Do not paint `product.images[0]` above `slots.gallery`. That second image becomes the LCP frame and the gallery slot already carries the preloaded hero.

## Contract version

`STOREFRONT_CONTRACT_VERSION` in `src/lib/storefront/contract/version.ts`. Adding an optional field is not a bump. Removing or renaming a field is. Version 2 adds the listing contract.

## PLP templates

Category, collection, all-products, and search share one template. Slots are `header`, `results`, and `empty`. Place each once. `ACTIVE_PLP_FACETS` (`bar` or `sidebar`) must equal the `facets` field of the template named by `ACTIVE_PLP_TEMPLATE`; a mismatch fails `pnpm typecheck`. The results island owns filters and pagination. Which backend fills the grid is not a template concern — see `rules/plp-listing.md`.
