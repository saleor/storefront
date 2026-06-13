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
    ├── <link rel="preload"> for default gallery LCP image
    ├── Suspense → VariantGalleryDynamic (searchParams → variant images)
    └── ErrorBoundary + Suspense → VariantSectionDynamic (searchParams → price, selectors, add-to-cart)

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
├── index.ts                          # Public exports (client-safe only)
├── variant-gallery-dynamic.tsx       # Server: reads searchParams, renders ProductGallery
├── product-gallery.tsx               # Client: Embla carousel wrapper
├── variant-section-dynamic.tsx       # Variant selection + add to cart
├── variant-section-error.tsx         # Error fallback (Client Component)
├── add-to-cart.tsx                   # Add to cart button
├── sticky-bar.tsx                    # Mobile sticky add-to-cart
├── product-attributes.tsx            # Description/details accordion
└── variant-selection/                # Variant selection system
    └── ...                           # See product-variants rule

src/ui/components/ui/
├── carousel.tsx                      # Embla carousel primitives
└── image-carousel.tsx                # Reusable image carousel
```

## Image Gallery

### Features

- **Mobile**: Horizontal swipe (Embla Carousel) + dot indicators
- **Desktop**: Arrow navigation (hover) + thumbnail strip
- **LCP**: `<link rel="preload">` in `ProductShell` for default gallery image + `priority` on first carousel image
- **Variant-aware**: `VariantGalleryDynamic` resolves images from `searchParams.variant`

### How Variant Images Work

```tsx
// variant-gallery-dynamic.tsx — searchParams read here, NOT in ProductShell
export async function VariantGalleryDynamic({ product, searchParams }) {
	const { variant: variantId } = await searchParams;
	const selectedVariant = variantId ? product.variants?.find((v) => v.id === variantId) : null;
	const images = getGalleryImages(product, selectedVariant);
	return <ProductGallery images={images} productName={product.name} />;
}
// Priority: variant.media → product.media → thumbnail
```

### LCP Strategy

Keep LCP simple — no hero-in-fallback pattern:

1. **`ProductShell`** emits `<link rel="preload" as="image" fetchPriority="high">` for the default (non-variant) hero URL
2. **`ProductGallery`** / `ImageCarousel` sets `priority` on the first visible image
3. Variant-specific images load when the user selects a variant (acceptable trade-off)

### Customizing Gallery

```tsx
// image-carousel.tsx props
<ImageCarousel
	images={images}
	productName="..."
	showArrows={true} // Desktop arrow buttons
	showDots={true} // Mobile dot indicators
	showThumbnails={true} // Desktop thumbnail strip
	onImageClick={(i) => {}} // For future lightbox
/>
```

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

### Change gallery thumbnail size

Edit `image-carousel.tsx`:

```tsx
<button className="relative h-20 w-20 ...">  {/* Change h-20 w-20 */}
```

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

- [ ] Gallery swipe works on mobile
- [ ] Arrows appear on desktop hover
- [ ] Variant selection updates URL
- [ ] Variant images change when variant selected
- [ ] Add to cart shows pending state
- [ ] Sticky bar appears after scroll
- [ ] Error boundary catches failures

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
<Suspense fallback={<GallerySkeleton />}>
  <VariantGalleryDynamic product={product} searchParams={searchParams} />
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
