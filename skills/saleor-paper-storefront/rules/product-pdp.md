---
name: product-pdp
description: PDP architecture: ProductShell + dynamic gallery/variant islands, gallery registry/layouts, LCP strategy, add-to-cart Server Action. Use when changing the product detail page layout, gallery, or buy box.
---

# Product Detail Page

PDP architecture, the variant-aware image gallery, and the add-to-cart flow. Variant _selection_ logic is in [`product-variants.md`](product-variants.md); caps, buy-box strategies, and over-budget deep links are in [`product-high-cardinality.md`](product-high-cardinality.md); the PPR boundary model and `getProductData` caching are in [`paper-architecture.md`](paper-architecture.md) / [`data-caching.md`](data-caching.md) — this rule covers what's PDP-specific.

## Architecture

```
ProductPage (sync export)
└── Suspense (ProductRouteSkeleton) → ProductShell (awaits params + getProductData only)
    ├── breadcrumbs, h1, attributes, JSON-LD          ← static, cached
    ├── Suspense → VariantGalleryDynamic (searchParams → variant images; LCP fallback)
    └── ErrorBoundary + Suspense → VariantSectionDynamic (searchParams → price, selectors, add-to-cart)
```

Paper-specific invariants:

1. **Shell stays static** — `ProductShell` awaits `params` only and passes the `searchParams` promise through. Reading `searchParams` in the shell or inside `getProductData` collapses the whole PDP into a dynamic hole (see `data-caching.md`).
2. **Gallery and variant section are separate dynamic islands**, each in its own Suspense boundary, so a slow/failed buy box never blocks imagery.
3. **The URL (`?variant=`) is the source of truth** for selection — no `useState`. The gallery and buy box re-render from `searchParams`; selection is shareable and refresh-safe.
4. **Add-to-cart is a Server Action** (`<form action={addToCart}>`) that mutates the checkout and `revalidatePath`s the cart — no API route, no client fetch.
5. **Errors are contained** — an `ErrorBoundary` (with the client `VariantSectionError` fallback) wraps the variant section so the page still shows images, name, and description on failure.

## File map

```
src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx   # PDP page + getProductData
src/ui/components/pdp/
├── gallery-layout.ts            # PDP_GALLERY_LAYOUT + shell class bundles + immersive height
├── gallery-registry.tsx         # layout → { renderer, LCP fallback, skeleton } (the ONLY renderer importer)
├── gallery-utils.ts             # getGalleryImages, resolveSelectedVariantId
├── product-route-skeleton.tsx   # shared route loading + page Suspense skeleton
├── variant-gallery-dynamic.tsx  # Server: searchParams → active registry renderer
├── product-gallery.tsx / immersive-gallery.tsx / mosaic-gallery.tsx   # renderers (+ *-fallback.tsx)
├── variant-section-dynamic.tsx  # price, selectors, add-to-cart, badges
├── variant-section-error.tsx    # "use client" error fallback
├── add-to-cart.tsx · sticky-bar.tsx · product-attributes.tsx
└── variant-selection/           # see product-variants.md
src/ui/components/ui/carousel.tsx, image-carousel.tsx   # Embla primitives + standard gallery
```

`index.ts` exports the public surface but **never** the gallery renderers (see [Gallery registry](#gallery-registry)).

## Image gallery

### Layout modes (`PDP_GALLERY_LAYOUT`)

The whole shop uses **one** PDP gallery style — a build-time constant in `gallery-layout.ts`, not per-product config. Shell classes, the dynamic island renderer, Suspense fallbacks, and route skeletons all read the same value via `activeGalleryVariant()`, so `loading.tsx` can never disagree with the live page.

| Layout                    | Container              | Gallery                                                                               | Attributes accordion |
| ------------------------- | ---------------------- | ------------------------------------------------------------------------------------- | -------------------- |
| **`immersive`** (default) | `container-super-wide` | `ImmersiveGallery` — square Embla filmstrip, viewport-height frames, controls below   | In gallery column    |
| **`mosaic`**              | `container-content`    | `MosaicGallery` — all images in a 2-col 4:5 grid, no carousel (pure Server Component) | Under buy box        |
| **`standard`**            | `container-content`    | `ProductGallery` — 4:5 hero + thumbnail strip (mobile swipe + dots)                   | Under buy box        |

**Page width:** `standard`/`mosaic` use `container-content` so the PDP body matches PLP/cart/search (one catalog column). Only `immersive` breaks wider. Nav/footer/marketing bands set width independently.

### Gallery registry

A shop ships exactly one layout, but the repo keeps a library of them. The registry guarantees only the active one reaches the browser:

```tsx
// gallery-registry.tsx — the ONLY file that imports gallery renderers
export const GALLERY_REGISTRY: Record<PdpGalleryLayout, GalleryVariant> = {
	standard: { Gallery: StandardGallery, Fallback: ProductGalleryFallback, Skeleton: StandardGallerySkeleton },
	immersive: {
		Gallery: ImmersiveGallery,
		Fallback: ImmersiveGalleryFallback,
		Skeleton: ImmersiveGallerySkeleton,
	},
	mosaic: { Gallery: MosaicGallery, Fallback: MosaicGalleryFallback, Skeleton: MosaicGallerySkeleton },
};
export const activeGalleryVariant = () => GALLERY_REGISTRY[PDP_GALLERY_LAYOUT];
```

Why only the active layout ships: interactive renderers load via `next/dynamic` (own chunk; Server-Component renderers like mosaic cost zero client JS); the registry is the **only** importer; and the exhaustive `Record<PdpGalleryLayout, …>` makes the compiler force all three surfaces when you add a key.

**Add a layout:** create `my-gallery.tsx` (+ fallback) → add the key to `PdpGalleryLayout` and classes to `PDP_LAYOUT_CLASSES` → add one `GALLERY_REGISTRY` entry. This is the project-wide build-time-variant pattern — see [Swappable variants of a component](ui-components.md#swappable-variants-of-a-component) for registry vs `cva`.

**Molding it your own way:** the registry is a default, not a cage — import one renderer straight into `VariantGalleryDynamic` if you want. The one thing that silently bloats the bundle: re-exporting _multiple_ `"use client"` renderers through a barrel a Server Component imports (a re-export counts as "used" and defeats cross-boundary tree-shaking). That's the sole reason renderers stay out of `index.ts`; a plain unused `import` is tree-shaken normally.

### Variant images + LCP

`VariantGalleryDynamic` reads `searchParams.variant`, resolves images (priority: `variant.media` → `product.media` → thumbnail) via `getGalleryImages`, and renders `activeGalleryVariant().Gallery` — no per-layout branching.

```tsx
export async function VariantGalleryDynamic({ product, searchParams }) {
	const { variant: variantParam } = await searchParams;
	const selectedVariant = product.variants?.find(
		(v) => v.id === resolveSelectedVariantId(product, variantParam),
	);
	const { Gallery } = activeGalleryVariant();
	return <Gallery images={getGalleryImages(product, selectedVariant)} productName={product.name} />;
}
```

**LCP lives in the gallery Suspense fallback, not a separate hero.** `ProductShell` passes the default hero URL into the active layout's `Fallback` (a real `<Image priority>` at the layout's size → no layout shift when the island streams); the renderer then sets eager/`priority` on the first carousel frame when it hydrates. Variant-specific images load on selection (accepted trade-off).

### Knobs

- **Switch layout (whole shop):** `PDP_GALLERY_LAYOUT` in `gallery-layout.ts` — shell, island, fallbacks, and `ProductRouteSkeleton` all follow.
- **Immersive frame height:** `PDP_IMMERSIVE_IMAGE_HEIGHT` (`--chrome-offset` + `--pdp-immersive-reserved` from `brand.css`).
- **Standard gallery chrome:** `ImageCarousel` props `showArrows` / `showDots` / `showThumbnails` / `onImageClick` (the last reserved for a future lightbox).

## Caching (PDP-specific notes)

`getProductData()` is a `"use cache"` fetch using `applyCacheProfile(CACHE_PROFILES.products, slug)` + `graphqlLanguageCodeVariables(localeSlug)`, merged with `withTranslatedProductFields()`. `localeSlug` is part of the cache key (per-language entry); the tag stays `product:{slug}` so a webhook busts all locales. Do **not** add fetch-level `revalidate`. Full model: `data-caching.md`.

Cached: product data, `h1`/breadcrumbs/JSON-LD, default LCP preload URL. Dynamic (searchParams): gallery images, variant section/price.

## Add-to-cart

`<form action={addToCart}>` → `"use server"` action finds/creates the checkout, adds the line, `revalidatePath`s the cart; the button uses `useFormStatus()` for the pending state and the drawer updates via revalidation. Wrap fallible work in try/catch and fail gracefully (no crash) rather than letting the action throw to the boundary.

## Common tasks

- **New attribute display:** add the field to `ProductDetails.graphql` (run `pnpm run generate`), extract in `page.tsx`, pass to `ProductAttributes`.
- **Sticky bar threshold:** `SCROLL_THRESHOLD` in `sticky-bar.tsx`.
- **Badges (New/Sale):** rendered in `VariantSectionDynamic`.
- **Queries:** `ProductDetails.graphql`, `VariantDetailsFragment.graphql` (regenerate after edits).

## Anti-patterns

❌ Reading `searchParams` in `ProductShell` or inside `getProductData` — collapses the PDP into a dynamic hole; pass the promise to islands only.
❌ `useState` for variant selection — use the `?variant=` URL param (shareable, refresh-safe).
❌ Passing a Server-Component function as a Client `ErrorBoundary` fallback — keep `VariantSectionError` in its own `"use client"` file.
❌ Suspense without an `ErrorBoundary` around the variant section — a throw would crash the page instead of degrading.
❌ Re-exporting gallery renderers from `index.ts` — bloats the bundle across the client boundary.

## Testing

`pnpm test src/ui/components/pdp`. Manual smoke: `loading.tsx` skeleton matches the live layout (no 2-col flash on immersive), gallery swipe + controls per layout, variant selection updates URL and images, add-to-cart pending state, sticky bar after scroll, error boundary degrades cleanly, attributes accordion in the right column.
