---
name: page-composition
description: Molding PDP/homepage by editing page files within the PPR layer model (static shell vs dynamic islands), width and rhythm. Use when adding, reordering, or re-widthing sections without breaking PPR/caching/LCP.
---

# Page Composition (PDP & Homepage)

How to mold PDP and homepage layouts by editing the page files — adding, removing, reordering, and re-widthing sections — **without breaking PPR, caching, or LCP**. This is the bridge between "design freely" ([`design-quality-rubric`](design-quality-rubric.md)) and "respect the architecture" ([`paper-architecture`](paper-architecture.md), [`data-caching`](data-caching.md)).

> Molding in Paper is **code-level composition**: edit the page's section list and props. There is no runtime page-builder — and that is deliberate (keeps PPR, performance, and fork divergence under control).
> Sections: [`ui-sections`](ui-sections.md) · Tokens/width: [`ui-design-system`](ui-design-system.md) · PDP mechanics: [`product-pdp`](product-pdp.md)

## The one rule that governs everything: the layer model

Every browse page is **sync page → Suspense → cached shell → dynamic islands** (full detail in `data-caching`). Design changes must stay inside the right layer:

```
Page (sync export)                  ← no top-level await of runtime data
└── Suspense (skeleton)
    └── Shell (await params + "use cache" data ONLY)   ← STATIC design lives here
          ├── sections built from cached content (hero, story, value columns…)
          └── Suspense island(s)                       ← DYNAMIC design lives here
                searchParams / cookies / client hooks  (variant gallery, featured grid, cart)
```

| Put it in the STATIC shell                        | Put it in a DYNAMIC island (nested Suspense)              |
| ------------------------------------------------- | --------------------------------------------------------- |
| Marketing sections from `getStorefrontContent()`  | Anything reading `searchParams` (variant gallery/section) |
| `h1`, breadcrumbs, JSON-LD, copy, value props     | Anything reading `cookies()` (cart, auth chrome)          |
| LCP image preload                                 | `cache: "no-cache"` fetches; client routing hooks         |
| Cached collection grids via `"use cache"` helpers | Featured grid streams behind its skeleton                 |

Hard constraints (never violate when redesigning):

- Never `await searchParams`/`cookies()` in the shell or inside `"use cache"` — it collapses the whole page into a dynamic hole.
- Catalog/content fetches use `applyCacheProfile(CACHE_PROFILES.*)` — never raw `cacheLife`/`cacheTag`.
- Server Components by default; add `"use client"` only for genuine interactivity.
- Don't fix a PPR build error by wrapping `<main>` in Suspense — fix the segment that owns the dynamic work.

## Homepage molding

File: [`src/app/(storefront)/[locale]/[channel]/(main)/page.tsx`](<../../../src/app/(storefront)/[locale]/[channel]/(main)/page.tsx>)

The homepage composes typed content (`getStorefrontContent`) into an ordered list of sections. To mold it:

1. **Reorder / add / remove sections** by editing the JSX section list. Pull copy from `content.surfaces.homepage` (extend the content model for new fields — see `data-storefront-content`).
2. **Keep product data streaming**: `FeaturedCollectionSection` stays inside its `<Suspense fallback={<FeaturedCollectionSkeleton/>}>`. Static editorial sections render directly in the shell.
3. **Vary width per section** with the container tokens (a full-bleed `HeroBanner` + a `container-content` story + a `container-wide` editorial band is fine).
4. **Width is intentional** — a full-width homepage is supported; don't default to centered-narrow.

```tsx
// Sketch: reordered homepage with a new full-bleed editorial band.
// Page is a sync export: <Suspense fallback={<HomepageSkeleton />}><HomepageShell …/></Suspense>.
// The sketch below is the HomepageShell body — `params` is the destructured promise.
return (
  <>
    <HeroBanner heading={hero.heading} backgroundImage={hero.backgroundImage} height="large" primaryCta={…} />

    <Suspense fallback={<FeaturedCollectionSkeleton heading={featured.heading} limit={featured.limit} />}>
      <FeaturedCollectionLoader params={params} {...featured} />
    </Suspense>

    <ImageWithText heading={editorial.heading} paragraphs={editorial.paragraphs} imagePosition="right" cta={…} />
    <MulticolumnSection heading={values.heading} columns={valueColumns} columnsDesktop={values.columnsDesktop} />
    <RichTextBlock heading={brandStory.heading} paragraphs={brandStory.paragraphs} align="center" width="narrow" />
  </>
);
```

> The homepage follows the canonical sync page → `Suspense` → `HomepageShell` model (the static shell awaits only `params` + `"use cache"` content — never `searchParams`/`cookies`), with a route `loading.tsx` (`HomepageSkeleton`) for instant navigations and the featured collection streaming in its nested `Suspense` island. Keep that constraint when editing.

## PDP molding

File: [`src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx`](<../../../src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx>)

PDP is `ProductShell` (cached product) + two dynamic islands (`VariantGalleryDynamic`, `VariantSectionDynamic`). **Layout width, grid ratio, and gallery style** are centralized in [`gallery-layout.ts`](../../../src/ui/components/pdp/gallery-layout.ts) (`PDP_GALLERY_LAYOUT`). To mold the PDP:

1. **Static design** (gallery column shell, name, breadcrumbs, new editorial/spec/related bands) lives in `ProductShell` from cached `product` data.
2. **Variant-dependent UI** stays in the dynamic islands (they read `searchParams.variant`) — don't lift variant state into the shell.
3. **Layout width / columns**: flip `PDP_GALLERY_LAYOUT` for shop-wide immersive vs standard, or extend `PDP_LAYOUT_CLASSES` for a new ratio. Immersive defaults to `container-super-wide` (full-bleed up to 2560px); use `container-full` in `gallery-layout.ts` for true edge-to-edge at any resolution.
4. **Add a new PDP section** (related products, reviews, story, spec table): render it in `ProductShell` from cached data, or as its own nested `<Suspense>` island if it needs runtime/searchParams data. Keep the buy box (`VariantSectionDynamic`) and its add-to-cart Server Action intact.
5. **Preserve LCP**: keep the gallery Suspense fallback (`ImmersiveGalleryFallback` / `ProductGalleryFallback`) with `priority` on the default hero — don't add a heavier hero above the gallery.
6. **Preserve mobile commerce UX**: keep the sticky add-to-cart bar (`sticky-bar.tsx`); use CSS `order-*` (see `data-caching` §CSS order) when dynamic content must appear above static `h1` while keeping `h1` in the static shell for SEO.
7. **Route skeletons**: use `ProductRouteSkeleton` in `loading.tsx` — never hand-roll a 2-column skeleton that disagrees with `PDP_GALLERY_LAYOUT`.

```tsx
// Sketch: immersive PDP (default) — attributes below gallery, buy box sticky right
const layout = PDP_LAYOUT_CLASSES[PDP_GALLERY_LAYOUT];

<main className={layout.main}>
	<div className={layout.grid}>
		<div className={layout.galleryColumn}>
			<Suspense fallback={<ImmersiveGalleryFallback src={lcpUrl} alt={product.name} />}>
				<VariantGalleryDynamic product={product} searchParams={searchParams} />
			</Suspense>
		</div>
		<div className={layout.infoColumn}>
			<h1 className="order-2 text-balance text-h1">{product.name}</h1>
			<ErrorBoundary FallbackComponent={VariantSectionError}>
				<Suspense fallback={<VariantSectionSkeleton />}>
					<VariantSectionDynamic product={product} searchParams={searchParams} />
				</Suspense>
			</ErrorBoundary>
		</div>
		{layout.attributesPlacement === "gallery" && (
			<div className={layout.attributesGalleryBlock}>
				<ProductAttributes ... />
			</div>
		)}
	</div>
</main>
```

## Workflow for a layout change

1. Decide static vs dynamic for each new/changed element (use the table above).
2. Pick width per section (`container-*`) and rhythm (`py-section-*`).
3. Build from existing sections/primitives; author new sections per `ui-sections` only when needed.
4. Pull copy from the content layer / next-intl — don't hardcode.
5. Run the `design-quality-rubric` self-check (especially mobile).
6. Verify PPR/perf (see [`design-verification`](design-verification.md)): `pnpm exec tsc --noEmit`, then a build for PPR-sensitive changes.

## Anti-patterns

❌ Awaiting `searchParams`/`cookies()` in the shell or `"use cache"` to make a section "dynamic" — use a nested Suspense island
❌ Lifting variant selection into the shell or into React state (URL is the source of truth — see `product-variants`)
❌ Adding a marketing hero above the PDP gallery that displaces the LCP image
❌ Making a whole section a Client Component for one interactive child — isolate the client part
❌ Hardcoding section copy in the page instead of `getStorefrontContent()` / next-intl
❌ Turning the page into a runtime block renderer to "reorder" — reorder in code; that is the supported mold surface
❌ Fixing PPR build errors by wrapping `<main>` in Suspense
