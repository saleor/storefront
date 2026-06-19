# UI Sections (Marketing Blocks)

The catalog of reusable full-bleed marketing sections in [`src/ui/sections/`](../../../src/ui/sections/) and how to compose, select, and author them. **Reuse these before building anything new** — a hand-rolled hero is a code smell when `HeroBanner` exists.

> **Tokens & width:** [`ui-design-system`](ui-design-system.md) · **Design bar:** [`design-quality-rubric`](design-quality-rubric.md) > **Page assembly & PPR rules:** [`page-composition`](page-composition.md) · **Copy source:** [`data-storefront-content`](data-storefront-content.md)
> Exact prop types live in each component file — treat the source as the contract; this rule is the map and the selection guide.

## Catalog

| Section                     | File                           | Purpose                                                        | Key props / variants                                                                                                                     |
| --------------------------- | ------------------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `HeroBanner`                | `hero-banner/hero-banner.tsx`  | Top-of-page hero with optional background image + CTAs         | `heading`, `subheading`, `primaryCta`, `secondaryCta`, `backgroundImage`, `height` (`compact`/`default`/`large`)                         |
| `FeaturedCollectionSection` | `featured-collection-section/` | Product grid from a Saleor collection                          | `heading`, `collectionSlug`, `limit`, `desktopColumns`; server data (`"use cache"`) — wrap in Suspense with `FeaturedCollectionSkeleton` |
| `ImageWithText`             | `image-with-text/`             | Editorial split: image one side, copy + CTA the other          | `heading`, `paragraphs`, `image` (or `placeholder`), `imagePosition` (`left`/`right`), `cta`                                             |
| `MulticolumnSection`        | `multicolumn-section/`         | 2–3 column value props / icons                                 | `heading`, `columns[]`, `columnsDesktop` (`2`/`3`)                                                                                       |
| `RichTextBlock`             | `rich-text-block/`             | Centered/left prose band (brand story, intro)                  | `heading`, `paragraphs`, `align` (`left`/`center`), `width` (`narrow`/`default`/`wide`)                                                  |
| `TestimonialSection`        | `testimonial/`                 | Social proof — one centered quote or 2–3 column quote cards    | `heading`, `testimonials[]` (`quote`, `author`, `detail`)                                                                                |
| `FaqSection`                | `faq/`                         | FAQ accordion via native `<details>` (zero client JS)          | `heading`, `items[]` (`question`, `answer`)                                                                                              |
| `SpecTable`                 | `spec-table/`                  | Specs / details table (label → value rows), semantic `<table>` | `heading`, `rows[]` (`label`, `value`)                                                                                                   |
| `LogoStrip`                 | `logo-strip/`                  | Press / partner / trust logo row                               | `heading`, `logos[]` (`src`, `alt`, `href?`)                                                                                             |
| `AnnouncementBar`           | `announcement-bar/`            | Chrome strip (layout, not page body)                           | from `content.chrome.announcementBar`                                                                                                    |

> **Editorial with a real image:** use `ImageWithText` with its `image`/`imageAlt` props. The homepage editorial content model exposes `editorial.image` / `editorial.imageAlt` (`HomepageEditorialContent`); unset falls back to the brand placeholder.

## Selection guide ("use X when…")

- **Lead the page / set the mood** → `HeroBanner`. One per page; `height="large"` for homepage, `compact` for secondary pages.
- **Show products** → `FeaturedCollectionSection` (collection-backed). Never hand-roll a product grid for the homepage.
- **Tell a story with a visual** → `ImageWithText`. Alternate `imagePosition` between stacked instances for rhythm.
- **List benefits / values / steps** → `MulticolumnSection`.
- **Pure copy band (no media)** → `RichTextBlock` with `width="narrow"` for readable measure.
- **Customer quotes / reviews** → `TestimonialSection`.
- **Answer common questions** → `FaqSection` (native disclosure; great for SEO, no client JS).
- **Specs / materials / dimensions** → `SpecTable`.
- **Press / partner / "as seen in"** → `LogoStrip`.
- **Nothing fits** → author a new section (below) and add it to this catalog. Don't overload an existing section with unrelated props.

## The section pattern (for new sections)

Every section is a **full-bleed `<section>` band with an inner width container**, token-driven, Server Component by default. Follow the shape of `rich-text-block.tsx` / `hero-banner.tsx`:

```tsx
import { cn } from "@/lib/utils";

export interface FeatureBandProps {
	heading: string;
	children?: React.ReactNode;
	tone?: "default" | "muted" | "inverse";
	className?: string;
}

const toneClass = {
	default: "bg-background text-foreground",
	muted: "bg-muted text-foreground",
	inverse: "bg-foreground text-inverse",
} as const;

export function FeatureBand({ heading, children, tone = "default", className }: FeatureBandProps) {
	return (
		<section
			className={cn(toneClass[tone], "py-section-md", className)}
			aria-labelledby="feature-band-heading"
		>
			<div className="container-content">
				<h2 id="feature-band-heading" className="text-balance text-h2">
					{heading}
				</h2>
				{children}
			</div>
		</section>
	);
}
```

Rules for new sections:

- **Full-bleed band, inner container** — section owns background + `py-section-*`; inner uses a width container (`container-content` default; `container-wide`/`container-full` for immersive; nest `container-prose` for copy).
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
