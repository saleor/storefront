---
name: pdp
description: Product Detail Page architecture, image gallery/carousel, caching, and add-to-cart flow. Use when modifying PDP layout, debugging gallery swipe/thumbnails, understanding LCP optimization, fixing ErrorBoundary issues, or working with variant-specific images.
---

# Product Detail Page (PDP)

> **Sources**: [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching) · [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) · [Suspense](https://react.dev/reference/react/Suspense)

## When to Use

Use this skill when:

- Modifying PDP layout or components
- Working with the image gallery/carousel
- Understanding caching and streaming architecture
- Debugging add-to-cart issues
- Adding new product information sections

For variant selection logic specifically, see [`variant-selection`](../variant-selection/SKILL.md).

> **Start here:** Read the [Data Flow](#data-flow) section first - it explains how everything connects.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ page.tsx (Server Component)                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐    ┌────────────────────────────────────┐ │
│  │ ProductGallery   │    │ Product Info Column                │ │
│  │ (Client)         │    │                                    │ │
│  │                  │    │  <h1>Product Name</h1>  ← Static   │ │
│  │ • Swipe/arrows   │    │                                    │ │
│  │ • Thumbnails     │    │  ┌────────────────────────────┐   │ │
│  │ • LCP optimized  │    │  │ ErrorBoundary              │   │ │
│  │                  │    │  │  ┌──────────────────────┐  │   │ │
│  │                  │    │  │  │ Suspense             │  │   │ │
│  │                  │    │  │  │  VariantSection ←────│──│── Dynamic
│  │                  │    │  │  │  (Server Action)     │  │   │ │
│  │                  │    │  │  └──────────────────────┘  │   │ │
│  │                  │    │  └────────────────────────────┘   │ │
│  │                  │    │                                    │ │
│  │                  │    │  ProductAttributes  ← Static       │ │
│  └──────────────────┘    └────────────────────────────────────┘ │
│                                                                 │
│  Data: getProductData() with "use cache"  ← Cached 5 min       │
└─────────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Product data is cached** - `getProductData()` uses `"use cache"` (5 min)
2. **Variant section is dynamic** - Reads `searchParams`, streams via Suspense
3. **Gallery shows variant images** - Changes based on `?variant=` URL param
4. **Errors are contained** - ErrorBoundary prevents full page crash

### Data Flow

**Read this first** - understanding how data flows makes everything else click:

```
URL: /us/products/blue-shirt?variant=abc123
                │
                ▼
┌───────────────────────────────────────────────────────────────────┐
│ page.tsx                                                          │
│                                                                   │
│   1. getProductData("blue-shirt", "us")                           │
│      └──► "use cache" ──► GraphQL ──► Returns product + variants  │
│                                                                   │
│   2. searchParams.variant = "abc123"                              │
│      └──► Find variant ──► Get variant.media ──► Gallery images   │
│                                                                   │
│   3. Render page with:                                            │
│      • Gallery ──────────────────► Shows variant images           │
│      • <Suspense> ──► VariantSection streams in                   │
│                       └──► Reads searchParams (makes it dynamic)  │
│                       └──► Server Action: addToCart()             │
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
src/app/[channel]/(main)/products/[slug]/
└── page.tsx                          # Main PDP page

src/ui/components/pdp/
├── index.ts                          # Public exports
├── product-gallery.tsx               # Gallery wrapper
├── variant-section-dynamic.tsx       # Variant selection + add to cart
├── variant-section-error.tsx         # Error fallback (Client Component)
├── add-to-cart.tsx                   # Add to cart button
├── sticky-bar.tsx                    # Mobile sticky add-to-cart
├── product-attributes.tsx            # Description/details accordion
└── variant-selection/                # Variant selection system
    └── ...                           # See variant-selection skill

src/ui/components/ui/
├── carousel.tsx                      # Embla carousel primitives
└── image-carousel.tsx                # Reusable image carousel
```

## Image Gallery

### Features

- **Mobile**: Horizontal swipe (Embla Carousel) + dot indicators
- **Desktop**: Arrow navigation (hover) + thumbnail strip
- **LCP optimized**: First image server-rendered via `ProductGalleryImage`
- **Variant-aware**: Shows variant-specific images when selected

### How Variant Images Work

```tsx
// In page.tsx
const selectedVariant = searchParams.variant
	? product.variants?.find((v) => v.id === searchParams.variant)
	: null;

const images = getGalleryImages(product, selectedVariant);
// Priority: variant.media → product.media → thumbnail
```

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
async function getProductData(slug: string, channel: string) {
	"use cache";
	cacheLife("minutes"); // 5 minute cache
	cacheTag(`product:${slug}`); // For on-demand revalidation

	return await executePublicGraphQL(ProductDetailsDocument, {
		variables: { slug, channel },
	});
}
```

**Note:** `executePublicGraphQL` fetches only publicly visible data, which is safe inside `"use cache"` functions. For user-specific queries, use `executeAuthenticatedGraphQL` (but NOT inside `"use cache"`).

### What's Cached vs Dynamic

| Part                     | Cached? | Why                            |
| ------------------------ | ------- | ------------------------------ |
| Product data             | ✅ Yes  | `"use cache"` directive        |
| Gallery images           | ✅ Yes  | Derived from cached data       |
| Product name/description | ✅ Yes  | Static content                 |
| Variant section          | ❌ No   | Reads `searchParams` (dynamic) |
| Prices                   | ❌ No   | Part of variant section        |

### On-Demand Revalidation

```bash
# Revalidate specific product
curl "/api/revalidate?tag=product:my-product-slug"
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

❌ **Don't read searchParams in cached functions**

```tsx
// ❌ Bad - breaks caching
async function getProductData(slug: string, searchParams: SearchParams) {
  "use cache";
  const variant = searchParams.variant; // Dynamic data in cache!
}

// ✅ Good - read searchParams in page, pass result to cached function
const product = await getProductData(slug, channel);
const variant = searchParams.variant ? product.variants.find(...) : null;
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
