# Product Detail Page

Product Detail Page architecture, image gallery/carousel, caching, and add-to-cart flow. Ensures correct PDP layout, variant-aware gallery, LCP optimization, and resilient error handling.

> **Sources**: [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching) · [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) · [Suspense](https://react.dev/reference/react/Suspense)

For variant selection logic specifically, see `product-variants.md`.

> **Start here:** Read the [Data Flow](#data-flow) section first - it explains how everything connects.

## Architecture Overview

```
ProductPage (sync export)
└── Suspense → ProductShell (params + getProductData only — never await searchParams)
    ├── breadcrumbs, h1, attributes, JSON-LD
    ├── Suspense → VariantGalleryDynamic (searchParams → variant images; LCP fallback image)
    └── ErrorBoundary + Suspense → VariantSectionDynamic (searchParams → price, selectors, add-to-cart)

Layout + skeletons: PDP_GALLERY_LAYOUT in gallery-layout.ts (immersive | standard | mosaic)
Route loading: products/[slug]/loading.tsx → ProductRouteSkeleton (same layout constant)

Data: getProductData() with applyCacheProfile(CACHE_PROFILES.products)  ← catalog tier (~5 min)
```

### Key Principles

1. **Product data is cached** — `getProductData()` uses `"use cache"` + cache manifest profile
2. **Shell stays static** — `ProductShell` awaits `params` only; passes `searchParams` promise through
3. **Gallery and variant section are separate dynamic islands** — each in its own Suspense boundary
4. **Gallery shows variant images** — `VariantGalleryDynamic` reads `?variant=` from URL
5. **Errors are contained** — ErrorBoundary around variant section prevents full page crash

### Data Flow

**Read this first** - understanding how data flows makes everything else click:

```
URL: /pl/default-channel/products/blue-shirt?variant=abc123
                │
                ▼
┌───────────────────────────────────────────────────────────────────┐
│ ProductPage (sync) → Suspense → ProductShell                      │
│                                                                   │
│   1. await params → getProductData("blue-shirt", "default-channel", "pl") │
│      └──► "use cache" + CACHE_PROFILES.products ──► translated product    │
│                                                                   │
│   2. Static shell: h1, breadcrumbs, attributes, JSON-LD, preload  │
│                                                                   │
│   3. Nested Suspense islands (each awaits searchParams):          │
│      • VariantGalleryDynamic ──► variant.media for gallery        │
│      • VariantSectionDynamic ──► price, selectors, add-to-cart      │
└───────────────────────────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────────┐
│ User selects different variant (e.g., "Red")                      │
│                                                                   │
│   router.push("?variant=xyz789")                                  │
│      └──► URL changes                                             │
│      └──► Page re-renders with new searchParams                   │
│      └──► Gallery shows red variant images                        │
│      └──► VariantSection shows red variant selected               │
└───────────────────────────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────────┐
│ User clicks "Add to bag"                                          │
│                                                                   │
│   <form action={addToCart}>                                       │
│      └──► Server Action executes                                  │
│      └──► Creates/updates checkout                                │
│      └──► revalidatePath("/cart")                                 │
│      └──► Cart drawer updates                                     │
└───────────────────────────────────────────────────────────────────┘
```

**Why this matters:**

- Product data is **cached** (fast loads)
- URL is the **source of truth** for variant selection
- Gallery reacts to URL changes **without client state**
- Server Actions handle mutations **without API routes**

## File Structure

```
src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/
└── page.tsx                          # Main PDP page

src/ui/components/pdp/
├── index.ts                          # Public exports (no gallery renderers — see registry)
├── gallery-layout.ts                 # PDP_GALLERY_LAYOUT + shell class bundles
├── gallery-registry.tsx              # Canonical layout→renderer/fallback/skeleton map (lazy)
├── gallery-utils.ts                  # getGalleryImages, resolveSelectedVariantId
├── product-route-skeleton.tsx          # Shared route loading + page Suspense skeleton
├── variant-gallery-dynamic.tsx       # Server: searchParams → active registry renderer
├── product-gallery.tsx               # Client: standard Embla carousel wrapper
├── product-gallery-fallback.tsx      # Server: standard LCP fallback image
├── immersive-gallery.tsx             # Client: immersive filmstrip gallery
├── immersive-gallery-fallback.tsx    # Server: immersive LCP fallback + skeleton
├── mosaic-gallery.tsx                # Server: editorial image grid (all images)
├── mosaic-gallery-fallback.tsx       # Server: mosaic LCP fallback + skeleton
├── variant-section-dynamic.tsx       # Variant selection + add to cart
├── variant-section-error.tsx         # Error fallback (Client Component)
├── add-to-cart.tsx                   # Add to cart button
├── sticky-bar.tsx                    # Mobile sticky add-to-cart
├── product-attributes.tsx            # Description/details accordion
└── variant-selection/                # Variant selection system
    └── ...                           # See product-variants rule

src/ui/components/ui/
├── carousel.tsx                      # Embla carousel primitives
└── image-carousel.tsx                # Reusable image carousel (standard gallery)
```

## Image Gallery

### Layout modes (`PDP_GALLERY_LAYOUT`)

The whole shop uses **one** PDP gallery style — a build-time constant in `gallery-layout.ts`, not per-product CMS config. Set it to `"immersive"`, `"standard"`, or `"mosaic"`; shell classes, the dynamic island renderer, Suspense fallbacks, and route skeletons all read the same value.

| Layout                    | Container           | Grid                                 | Gallery                                                        | Attributes accordion           |
| ------------------------- | ------------------- | ------------------------------------ | -------------------------------------------------------------- | ------------------------------ |
| **`immersive`** (default) | `container-full`    | Wide gallery + narrow sticky buy box | `ImmersiveGallery` — square filmstrip, viewport-height frames  | Below images in gallery column |
| **`mosaic`**              | `container-wide`    | Wide gallery + narrow sticky buy box | `MosaicGallery` — all images in a 2-col 4:5 grid (no carousel) | Under buy box in info column   |
| **`standard`**            | `container-content` | `lg:grid-cols-2`                     | `ProductGallery` — 4:5 hero + thumbnail strip                  | Under buy box in info column   |

All three surfaces (renderer, LCP fallback, skeleton) for each layout live in **`gallery-registry.tsx`** — see [Gallery registry](#gallery-registry-canonical-pattern). `VariantGalleryDynamic`, `ProductShell`, and `ProductRouteSkeleton` read the active layout's surfaces from `activeGalleryVariant()`, so route `loading.tsx` never disagrees with the live page.

### Gallery registry (canonical pattern)

A Paper shop ships exactly **one** gallery layout, picked at build time, but we keep a growing _library_ of layouts in the repo. The registry guarantees the unused ones never reach the browser — and that nobody has to think about it per-layout:

```tsx
// gallery-registry.tsx — the ONLY file that imports gallery renderers
const StandardGallery = dynamic(() => import("./product-gallery").then((m) => m.ProductGallery), { loading });
const ImmersiveGallery = dynamic(() => import("./immersive-gallery").then((m) => m.ImmersiveGallery), {
	loading,
});

export const GALLERY_REGISTRY: Record<PdpGalleryLayout, GalleryVariant> = {
	standard: { Gallery: StandardGallery, Fallback: ProductGalleryFallback, Skeleton: StandardGallerySkeleton },
	immersive: {
		Gallery: ImmersiveGallery,
		Fallback: ImmersiveGalleryFallback,
		Skeleton: ImmersiveGallerySkeleton,
	},
	mosaic: { Gallery: MosaicGallery, Fallback: MosaicGalleryFallback, Skeleton: MosaicGallerySkeleton }, // Server Component
};

export const activeGalleryVariant = () => GALLERY_REGISTRY[PDP_GALLERY_LAYOUT];
```

Three things make "only the active layout ships" the default behavior:

1. **Interactive renderers load via `next/dynamic`** → each gets its own chunk; only the active layout's JS (incl. Embla) is requested. Server-Component renderers (mosaic) cost zero client JS and are imported directly.
2. **The registry is the only importer of renderers.** They are NOT re-exported from `index.ts`.
3. **`Record<PdpGalleryLayout, GalleryVariant>` is exhaustive.** Add a key to the union and the compiler forces you to register all three surfaces.

**Add a layout** (the only files you touch): create `my-gallery.tsx` (+ fallback) → add the key to `PdpGalleryLayout` and classes to `PDP_LAYOUT_CLASSES` in `gallery-layout.ts` → add one entry to `GALLERY_REGISTRY`.

> This is the project-wide model for build-time-selected variants of a component — see [Swappable variants of a component](ui-components.md#swappable-variants-of-a-component) for when to use it vs. `cva` prop variants.

#### Molding it your own way

The registry is a convenient default, **not a cage**. Want to hardcode one gallery and delete the rest? Go ahead — import your renderer straight into `VariantGalleryDynamic` and render it. Importing one renderer and using it ships exactly that renderer; nothing unused, no penalty. There is no lint rule policing this.

The **one** thing that silently bloats the bundle (vs. harmless dead code): re-exporting _multiple_ `"use client"` gallery renderers through a barrel (e.g. `index.ts`) that a Server Component imports. A re-export counts as "used," so it defeats tree-shaking across the client boundary and pulls every re-exported renderer into the bundle even though one renders. That's the sole reason renderers stay out of `index.ts`. A plain unused `import` (no re-export) is tree-shaken normally and costs nothing.

### Features (by layout)

**Mosaic (`MosaicGallery`)** — editorial grid

- Every image rendered at once in a 2-column `aspect-[4/5]` grid — no carousel, the page scrolls through the imagery
- Narrow sticky buy box (with the description/details accordion) sits beside the grid on desktop; mobile sticky bar keeps add-to-cart reachable while scanning
- Pure Server Component (no client JS) — first tile eager, rest lazy-loaded

**Immersive (`ImmersiveGallery`)**

- Horizontal Embla filmstrip — square images sized to `100svh - chrome` on desktop
- Controls **below** the strip: prev/next buttons, pill dots, `n / total` counter
- Mobile: swipe the filmstrip; same controls below

**Standard (`ProductGallery` / `ImageCarousel`)**

- **Mobile**: Horizontal swipe + dot indicators under the hero
- **Desktop**: Arrow navigation (hover) + thumbnail strip

**Both**

- **LCP**: server-rendered first image in the gallery Suspense fallback (`ImmersiveGalleryFallback` or `ProductGalleryFallback`) with `priority`, plus eager load on the first streamed carousel frame
- **Variant-aware**: `VariantGalleryDynamic` resolves images from `searchParams.variant`

### How Variant Images Work

```tsx
// variant-gallery-dynamic.tsx — searchParams read here, NOT in ProductShell
export async function VariantGalleryDynamic({ product, searchParams }) {
	const { variant: variantParam } = await searchParams;
	const selectedVariantId = resolveSelectedVariantId(product, variantParam);
	const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
	const images = getGalleryImages(product, selectedVariant);

	// No per-layout branching — the registry resolves the active renderer.
	const { Gallery } = activeGalleryVariant();
	return <Gallery images={images} productName={product.name} />;
}
// Priority: variant.media → product.media → thumbnail
```

### LCP Strategy

Keep LCP in the **gallery Suspense fallback**, not a separate hero above the fold:

1. **`ProductShell`** passes the default hero URL into the active layout's `Fallback` (from `activeGalleryVariant()`) as the nested Suspense fallback (real `<Image priority>` at the layout's size — no layout shift when the island streams)
2. **`ImmersiveGallery`** / **`ProductGallery`** sets eager/`priority` on the first visible carousel image when the island hydrates
3. Variant-specific images load when the user selects a variant (acceptable trade-off)

### Customizing Gallery

**Switch layout for the whole storefront** — edit `PDP_GALLERY_LAYOUT` in `gallery-layout.ts`.

**Standard gallery chrome** — `image-carousel.tsx` props:

```tsx
<ImageCarousel
	images={images}
	productName="..."
	showArrows={true} // Desktop arrow buttons
	showDots={true} // Mobile dot indicators
	showThumbnails={true} // Desktop thumbnail strip
	onImageClick={(i) => {}} // For future lightbox
/>
```

**Immersive frame height** — `PDP_IMMERSIVE_IMAGE_HEIGHT` in `gallery-layout.ts` (uses `--chrome-offset` + `--pdp-immersive-reserved` from `brand.css`).

### Adding Zoom/Lightbox (Future)

Use the `onImageClick` callback:

```tsx
<ImageCarousel images={images} onImageClick={(index) => openLightbox(index)} />
```

## Caching Strategy

### Data Fetching

```tsx
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { withTranslatedProductFields } from "@/lib/saleor-translations";

async function getProductData(slug: string, channel: string, localeSlug: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.products, slug);

	const result = await executePublicGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(slug),
			channel,
			...graphqlLanguageCodeVariables(localeSlug),
		},
	});
	return result.data.product ? withTranslatedProductFields(result.data.product) : null;
}
```

**Note:** `localeSlug` is part of the Next.js cache key (separate entry per language). Tag stays `product:{slug}` — webhooks invalidate all locales. Do not add fetch-level `revalidate` here. See `data-caching.md`.

### What's Cached vs Dynamic

| Part                     | Cached? | Why                                         |
| ------------------------ | ------- | ------------------------------------------- |
| Product data             | ✅ Yes  | `"use cache"` in `getProductData()`         |
| h1, breadcrumbs, JSON-LD | ✅ Yes  | Rendered in `ProductShell` from cached data |
| Default LCP preload URL  | ✅ Yes  | Derived from cached product media           |
| Gallery (variant images) | ❌ No   | `VariantGalleryDynamic` reads searchParams  |
| Variant section (price)  | ❌ No   | `VariantSectionDynamic` reads searchParams  |

### On-Demand Revalidation

```bash
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=product:my-product-slug"
```

## Error Handling

### ErrorBoundary Pattern

```tsx
<ErrorBoundary FallbackComponent={VariantSectionError}>
  <Suspense fallback={<VariantSectionSkeleton />}>
    <VariantSectionDynamic ... />
  </Suspense>
</ErrorBoundary>
```

**Why**: If variant section throws, user still sees:

- Product images ✅
- Product name ✅
- Description ✅
- "Unable to load options. Try again." message

### Server Action Error Handling

```tsx
async function addToCart() {
	"use server";
	try {
		// ... checkout logic
	} catch (error) {
		console.error("Add to cart failed:", error);
		// Graceful failure - no crash
	}
}
```

## Add to Cart Flow

```
User clicks "Add to bag"
        │
        ▼
┌─────────────────────┐
│ form action={...}   │ ← HTML form submission
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ addToCart()         │ ← Server Action
│ "use server"        │
│                     │
│ • Find/create cart  │
│ • Add line item     │
│ • revalidatePath()  │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ useFormStatus()     │ ← Shows "Adding..." state
│ pending: true       │
└─────────────────────┘
        │
        ▼
   Cart drawer updates (via revalidation)
```

## Common Tasks

### Add new product attribute display

1. Check `ProductDetails.graphql` for field
2. If missing, add and run `pnpm run generate`
3. Extract in `page.tsx` helper function
4. Pass to `ProductAttributes` component

### Change gallery thumbnail size (standard layout only)

Edit `image-carousel.tsx`:

```tsx
<button className="relative h-20 w-20 ...">  {/* Change h-20 w-20 */}
```

### Switch PDP layout (mosaic ↔ immersive ↔ standard)

Edit `gallery-layout.ts`:

```tsx
export const PDP_GALLERY_LAYOUT: PdpGalleryLayout = "immersive"; // or "mosaic" | "standard"
```

Shell, island, Suspense fallbacks, and `ProductRouteSkeleton` / `loading.tsx` follow automatically.

### Change sticky bar scroll threshold

Edit `sticky-bar.tsx`:

```tsx
const SCROLL_THRESHOLD = 500; // Change this value
```

### Add product badges (New, Sale, etc.)

Badges are in `VariantSectionDynamic`:

```tsx
{
	isOnSale && <Badge variant="destructive">Sale</Badge>;
}
```

## GraphQL

### Key Queries

- `ProductDetails.graphql` - Main product query
- `VariantDetailsFragment.graphql` - Variant data including media

### After GraphQL Changes

```bash
pnpm run generate  # Regenerate types
```

## Testing

```bash
pnpm test src/ui/components/pdp  # Run PDP tests
```

### Manual Testing Checklist

- [ ] Route `loading.tsx` skeleton matches live layout (no 2-col flash on immersive)
- [ ] Gallery swipe works on mobile (filmstrip or carousel)
- [ ] Immersive: arrows + counter below strip; standard: arrows on desktop hover + thumbnails
- [ ] Variant selection updates URL
- [ ] Variant images change when variant selected
- [ ] Add to cart shows pending state
- [ ] Sticky bar appears after scroll
- [ ] Error boundary catches failures
- [ ] Attributes accordion sits in the correct column for the active layout

## Anti-patterns

❌ **Don't pass Server Component functions to Client Components**

```tsx
// ❌ Bad - VariantSectionError defined in Server Component file
<ErrorBoundary FallbackComponent={VariantSectionError}>

// ✅ Good - VariantSectionError in separate file with "use client"
// See variant-section-error.tsx
```

❌ **Don't read searchParams in ProductShell or cached functions**

```tsx
// ❌ Bad — collapses entire PDP into dynamic hole
async function ProductShell({ searchParams, ... }) {
	const { variant } = await searchParams;
	const product = await getProductData(...);
}

// ✅ Good — pass searchParams promise to dynamic islands only
<Suspense fallback={<ImmersiveGalleryFallback src={...} alt={...} />}>
  <VariantGalleryDynamic product={product} searchParams={searchParams} />
</Suspense>

// Route + page skeletons share ProductRouteSkeleton (reads PDP_GALLERY_LAYOUT)
<Suspense fallback={<ProductRouteSkeleton />}>
  <ProductShell ... />
</Suspense>
```

```tsx
// ❌ Bad — breaks caching
async function getProductData(slug: string, searchParams: SearchParams) {
	"use cache";
	const variant = searchParams.variant;
}
```

❌ **Don't use useState for variant selection**

```tsx
// ❌ Bad - client state, not shareable, lost on refresh
const [selectedVariant, setSelectedVariant] = useState(null);

// ✅ Good - URL is source of truth
router.push(`?variant=${variantId}`);
// Read from searchParams on server
```

❌ **Don't skip ErrorBoundary around Suspense**

```tsx
// ❌ Bad - error crashes entire page
<Suspense fallback={<Skeleton />}>
  <DynamicComponent />
</Suspense>

// ✅ Good - error contained, rest of page visible
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <Suspense fallback={<Skeleton />}>
    <DynamicComponent />
  </Suspense>
</ErrorBoundary>
```

❌ **Don't use index as key for images**

```tsx
// ❌ Bad - breaks React reconciliation when images change
{images.map((img, index) => <Image key={index} ... />)}

// ✅ Good - stable key
{images.map((img) => <Image key={img.url} ... />)}
```
