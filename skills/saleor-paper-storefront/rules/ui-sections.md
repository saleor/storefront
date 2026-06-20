# UI Sections (Marketing Blocks)

The catalog of reusable full-bleed marketing sections in [`src/ui/sections/`](../../../src/ui/sections/) and how to compose, select, and author them. **Reuse these before building anything new** — a hand-rolled hero is a code smell when `HeroBanner` exists.

> **Tokens & width:** [`ui-design-system`](ui-design-system.md) · **Design bar:** [`design-quality-rubric`](design-quality-rubric.md) > **Page assembly & PPR rules:** [`page-composition`](page-composition.md) · **Copy source:** [`data-storefront-content`](data-storefront-content.md)
> Exact prop types live in each component file — treat the source as the contract; this rule is the map and the selection guide.

## Catalog

| Section                     | File                                        | Purpose                                                                                                       | Key props / variants                                                                                                                                                                                                         |
| --------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MediaHero`                 | `media-hero/media-hero.tsx`                 | Full-viewport photographic / **video** hero with overlaid copy (the immersive, photography-led hero)          | `eyebrow`, `heading`, `subheading`, `primaryCta`, `secondaryCta`, `image`, `videoSrc`, `poster`, `align`, `height` (`medium`/`tall`/`full`), `overlay`, `copySurface` (`none`/`panel` — light frosted panel for busy photos) |
| `HeroBanner`                | `hero-banner/hero-banner.tsx`               | Top-of-page hero with optional full-bleed background image + CTAs                                             | `heading`, `subheading`, `primaryCta`, `secondaryCta`, `backgroundImage`, `height` (`compact`/`default`/`large`)                                                                                                             |
| `EditorialHero`             | `editorial-hero/editorial-hero.tsx`         | Split hero: confident type on a clean canvas + a large product image on a soft panel (suits studio packshots) | `eyebrow`, `heading`, `subheading`, `primaryCta`, `secondaryCta`, `image`, `imageAlt`, `placeholder`                                                                                                                         |
| `CategoryTileGrid`          | `category-tile-grid/category-tile-grid.tsx` | Large image tiles linking to categories/collections (label overlay for lifestyle, label-below for packshots)  | `heading`, `eyebrow`, `intro`, `cta`, `tiles[]`, `columns` (`2`/`3`/`4`), `imageFit` (`cover`/`contain`), `aspect`, `tone`, `width`                                                                                          |
| `FeaturedCollectionSection` | `featured-collection-section/`              | Product grid from a Saleor collection                                                                         | `heading`, `collectionSlug`, `limit`, `desktopColumns`; server data (`"use cache"`) — wrap in Suspense with `FeaturedCollectionSkeleton`                                                                                     |
| `ImageWithText`             | `image-with-text/`                          | Editorial split: image one side, copy + CTA the other                                                         | `heading`, `paragraphs`, `image` (or `placeholder`), `imagePosition` (`left`/`right`), `cta`                                                                                                                                 |
| `MulticolumnSection`        | `multicolumn-section/`                      | 2–3 column value props / icons                                                                                | `heading`, `columns[]`, `columnsDesktop` (`2`/`3`)                                                                                                                                                                           |
| `RichTextBlock`             | `rich-text-block/`                          | Centered/left prose band (brand story, intro)                                                                 | `heading`, `paragraphs`, `align` (`left`/`center`), `width` (`narrow`/`default`/`wide`)                                                                                                                                      |
| `TestimonialSection`        | `testimonial/`                              | Social proof — one centered quote or 2–3 column quote cards                                                   | `heading`, `testimonials[]` (`quote`, `author`, `detail`)                                                                                                                                                                    |
| `FaqSection`                | `faq/`                                      | FAQ accordion via native `<details>` (zero client JS)                                                         | `heading`, `items[]` (`question`, `answer`)                                                                                                                                                                                  |
| `SpecTable`                 | `spec-table/`                               | Specs / details table (label → value rows), semantic `<table>`                                                | `heading`, `rows[]` (`label`, `value`)                                                                                                                                                                                       |
| `LogoStrip`                 | `logo-strip/`                               | Press / partner / trust logo row                                                                              | `heading`, `logos[]` (`src`, `alt`, `href?`)                                                                                                                                                                                 |
| `AnnouncementBar`           | `announcement-bar/`                         | Chrome strip (layout, not page body); dismissible via content-hash or optional `id`                           | from `content.chrome.announcementBar`; dismissal keys → `data-storefront-content` § Announcement bar dismissal identity                                                                                                      |

> **Editorial with a real image:** use `ImageWithText` with its `image`/`imageAlt` props. The homepage editorial content model exposes `editorial.image` / `editorial.imageAlt` (`HomepageEditorialContent`); unset falls back to the brand placeholder.
>
> **Shared primitives:** band sections compose two primitives — [`Section`](../../../src/ui/sections/section.tsx) (owns `tone` `default`/`muted`/`inverse`, `width`, `spacing`, `bleed`, `aria-labelledby`) and [`SectionHeader`](../../../src/ui/sections/section-header.tsx) (`eyebrow` + `heading` + `intro` + optional arrow `cta`, with a unique heading `id`). Most catalog sections therefore also accept `tone`, `width`, `eyebrow`, `intro`, and `cta` (see each source for the exact set). Use `tone` to alternate band backgrounds for rhythm; pass a distinct heading `id` when the same section repeats on a page. Arrow text links use [`ArrowLink`](../../../src/ui/components/ui/arrow-link.tsx). Button and card corners are token-driven (`rounded-button` / `rounded-card` ← `--radius-button` / `--radius-card` in `brand.css`) — re-shape the whole UI (e.g. pill buttons) from one place, never per-CTA.

## Selection guide ("use X when…")

- **Lead the page / set the mood** → `MediaHero` for an immersive full-viewport image/**video** hero (`overlay="gradient"` by default → inverse `text-inverse*` on scrim; optional `copySurface="panel"` for solid tone on a frosted card); `HeroBanner` for a simpler photographic hero; or `EditorialHero` for a split layout with packshots. One hero per page.
- **Show products** → `FeaturedCollectionSection` (collection-backed). Never hand-roll a product grid for the homepage.
- **Navigate to categories/collections** → `CategoryTileGrid` (large image tiles; `imageFit="cover"` for lifestyle photos, `"contain"` for packshots).
- **Tell a story with a visual** → `ImageWithText`. Alternate `imagePosition` between stacked instances for rhythm.
- **List benefits / values / steps** → `MulticolumnSection`.
- **Pure copy band (no media)** → `RichTextBlock` with `width="narrow"` for readable measure.
- **Customer quotes / reviews** → `TestimonialSection`.
- **Answer common questions** → `FaqSection` (native disclosure; great for SEO, no client JS).
- **Specs / materials / dimensions** → `SpecTable`.
- **Press / partner / "as seen in"** → `LogoStrip`.
- **Nothing fits** → author a new section (below) and add it to this catalog. Don't overload an existing section with unrelated props.

## The section pattern (for new sections)

Every section is a **full-bleed `<section>` band with an inner width container**, token-driven, Server Component by default. **Compose the shared primitives** rather than re-implementing the band/heading — `Section` owns tone + rhythm + width container, `SectionHeader` owns eyebrow/heading/intro/CTA + the unique `id`:

```tsx
import { Section, type SectionTone, type SectionWidth } from "@/ui/sections/section";
import { SectionHeader, type SectionHeaderCta } from "@/ui/sections/section-header";

export interface FeatureBandProps {
	heading?: string;
	eyebrow?: string;
	intro?: string;
	cta?: SectionHeaderCta;
	children?: React.ReactNode;
	tone?: SectionTone; // default | muted | inverse
	width?: SectionWidth; // prose | content | wide | full
	className?: string;
}

export function FeatureBand({
	heading,
	eyebrow,
	intro,
	cta,
	children,
	tone,
	width,
	className,
}: FeatureBandProps) {
	const headingId = "feature-band-heading";
	return (
		<Section
			tone={tone}
			width={width}
			className={className}
			aria-labelledby={heading ? headingId : undefined}
		>
			<SectionHeader
				id={headingId}
				eyebrow={eyebrow}
				heading={heading}
				intro={intro}
				cta={cta}
				className="mb-10"
			/>
			{children}
		</Section>
	);
}
```

> Sections with a bespoke flush layout (e.g. `ImageWithText`, heroes) may render their own `<section>` instead of `Section`, but should still expose `tone`/`width` and a unique heading `id`.

Rules for new sections:

- **Compose `Section` + `SectionHeader`** — don't re-implement the band, tone map, rhythm, or `aria-labelledby` wiring by hand. `Section` defaults to `container-content`; use `width="wide"`/`"full"` for immersive, `"prose"` for copy, or `bleed` to own the full width.
- **Tokens only** — colors, spacing, radius, shadow, motion from `ui-design-system`. No hardcoded values.
- **Server Component** unless it needs interactivity; if it fetches catalog data, use `"use cache"` + `applyCacheProfile` and expose a matching skeleton for Suspense (see `page-composition`, `data-caching`).
- **Content via props** — copy comes from `getStorefrontContent()` upstream (the page passes it down), not fetched inside the section. Functional labels use next-intl (`ui-i18n`). Don't hardcode marketing strings.
- **Accessible** — one `h2` per section linked via `aria-labelledby`; meaningful image `alt`; mobile-first per `design-quality-rubric`.
- **Variants via props** (`tone`, `width`, `align`, `imagePosition`) using small `Record` maps or `cva` — keep the surface small and composable.
- **Folder convention** — `src/ui/sections/<section-name>/<section-name>.tsx` (+ `-skeleton.tsx` if it streams). kebab-case files, PascalCase export (see `references/code-conventions.md`).

## Images in sections

Section imagery (hero, editorial) comes from the content layer where wired (e.g. hero `backgroundImage` is a Saleor `FILE` attribute). Some sections accept a `placeholder` node when no image is set. When adding an image field to a section, add the attribute to the content model too — see [`data-storefront-content-attributes`](data-storefront-content-attributes.md).

## Anti-patterns

❌ Hand-rolling a hero / product grid / value-columns layout when a catalog section exists
❌ Fetching `getStorefrontContent` or catalog data _inside_ a presentational section — pass props from the page
❌ Hardcoding marketing copy in a section component (use the content layer / next-intl)
❌ A section that sets its own fixed `max-w-7xl` instead of a width container the page can vary
❌ Adding a new section without a skeleton (if it streams) or without cataloging it here
❌ Overloading one section with many unrelated boolean props instead of composing or adding a new section
