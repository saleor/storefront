---
name: page-composition
description: Molding PDP/homepage by editing page files within the PPR layer model (static shell vs dynamic islands), width and rhythm. Use when adding, reordering, or re-widthing sections without breaking PPR/caching/LCP.
---

# Page Composition (PDP & Homepage)

How to mold PDP and homepage layouts by editing the page files — adding, removing, reordering, and re-widthing sections — **without breaking PPR, caching, or LCP**. This is the bridge between "design freely" ([`design-quality-rubric`](design-quality-rubric.md)) and "respect the architecture" ([`paper-architecture`](paper-architecture.md), [`data-caching`](data-caching.md)).

> Molding in Paper is **code-level composition**: edit the page's section list and props. There is no runtime page-builder — and that is deliberate (keeps PPR, performance, and fork divergence under control).
> Sections: [`ui-sections`](ui-sections.md) · Tokens/width: [`ui-design-system`](ui-design-system.md) · PDP mechanics: [`product-pdp`](product-pdp.md)

## The one rule that governs everything: the layer model

Pick the page shape by **whether the route reads any runtime data** (`searchParams`/`cookies`/uncached fetch). A skeleton is a **per-hole** affordance, never a **per-page** default:

- **Static page (no runtime data)** → sync page wraps an async body that awaits `params` + `"use cache"` data in **page-level `Suspense`** (fold-height fallback). Required for Partial Prefetching: URL data must stay out of the shared App Shell. Direct loads still prerender full HTML per `generateStaticParams`. (homepage; CMS pages follow the same shape when they await `params`)
- **Hybrid page (some runtime data)** → render the cached shell **eagerly**, then wrap **only** the dynamic island in `Suspense` with a small skeleton. (PDP variant section. Listing pages are params-only — the cached first-page grid is not a `searchParams` hole; filters go through `GET /api/listing`.)

Design changes must stay inside the right layer:

```
Page (sync export)
└── Suspense (fold fallback)        ← keeps params out of the shared instant App Shell
      HomePageContent (async)       ← awaits params + "use cache" only; no searchParams/cookies
        cached sections             ← hero, story, value columns, featured grid…
```

| Put it in the STATIC shell                                  | Put it in a DYNAMIC island (nested Suspense)                                   |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Marketing sections from `getStorefrontContent()`            | Anything reading `searchParams` (variant gallery/section)                      |
| `h1`, breadcrumbs, JSON-LD, copy, value props               | Anything reading `cookies()` (cart, auth chrome)                               |
| LCP image preload                                           | `cache: "no-cache"` fetches; client routing hooks                              |
| Cached collection / listing grids via `"use cache"` helpers | `searchParams` on the PDP (`?variant=` / `?sku=`); per-request personalization |

Listing pages are params-only: the cached first-page grid is not a `searchParams` hole. Filters / sort / cursor swap via `GET /api/listing`.

Hard constraints (never violate when redesigning):

- Never `await searchParams`/`cookies()` in the shell or inside `"use cache"` — it collapses the whole page into a dynamic hole.
- Catalog/content fetches use `applyCacheProfile(CACHE_PROFILES.*)` — never raw `cacheLife`/`cacheTag`.
- Server Components by default; add `"use client"` only for genuine interactivity.
- Don't fix a PPR build error by wrapping `<main>` in Suspense — fix the segment that owns the dynamic work.

## Homepage molding

File: [`src/app/(storefront)/[locale]/[channel]/(main)/page.tsx`](<../../../src/app/(storefront)/[locale]/[channel]/(main)/page.tsx>)

The homepage composes typed content (`getStorefrontContent`) into an ordered list of sections. To mold it:

1. **Reorder / add / remove sections** by editing the JSX inside `HomePageContent`. Pull copy from `content.surfaces.homepage` (extend the content model for new fields — see `data-storefront-content`).
2. **Keep the sync `Page` + `Suspense` shell** — do not hoist `await params` into the default export (breaks Partial Prefetching App Shell sharing across locale/channel).
3. **Cached sections stay in `HomePageContent`**: `FeaturedCollectionSection` is `"use cache"` and resolves with the rest of the body. Add a nested `Suspense` only for genuinely dynamic runtime data — none today.
4. **Vary width per section** with the container tokens (a full-bleed `HeroBanner` + a `container-content` story + a `container-wide` editorial band is fine).
5. **Width is intentional** — a full-width homepage is supported; don't default to centered-narrow.

```tsx
// Sketch: sync page shell + async body (Partial Prefetching).
export default function Page({ params }: { params: HomeParams }) {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomePageContent params={params} />
    </Suspense>
  );
}

// Inside HomePageContent — await params + "use cache", then compose sections:
return (
  <>
    <HeroBanner heading={hero.heading} backgroundImage={hero.backgroundImage} height="large" primaryCta={…} />
    <FeaturedCollectionSection locale={locale} channel={channel} {...featured} />
    <ImageWithText heading={editorial.heading} paragraphs={editorial.paragraphs} imagePosition="right" cta={…} />
    <MulticolumnSection heading={values.heading} columns={valueColumns} columnsDesktop={values.columnsDesktop} />
    <RichTextBlock heading={brandStory.heading} paragraphs={brandStory.paragraphs} align="center" width="narrow" />
  </>
);
```

> The homepage body is **cached-only** (`params` + `"use cache"`, never `searchParams`/`cookies`). The page-level `Suspense` exists solely so URL data stays out of the shared instant App Shell; direct loads still prerender full HTML per `generateStaticParams`. Do not remove that boundary to "get content into the shell" — that reintroduces the instant-shell URL-data insight.

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
