/**
 * Shared Next.js Image props for catalog surfaces.
 * Keeps `sizes` aligned with layout breakpoints so the optimizer requests appropriately sized variants.
 */

/**
 * Homepage featured collection grid: 2 col → 4 col (lg).
 * Pair with ProductGrid desktopColumns={4}.
 */
export const FEATURED_COLLECTION_IMAGE_SIZES =
	"(max-width: 1024px) calc((100vw - 3rem) / 2), calc((min(100vw, 80rem) - 4rem - 4.5rem) / 4)";

/**
 * PLP / collection / category grid: 2 col → 3 col (lg).
 * Accounts for px-4/px-8 padding and gap-4/gap-6 between cards.
 */
export const PLP_IMAGE_SIZES =
	"(max-width: 1024px) calc((100vw - 3rem) / 2), calc((min(100vw, 80rem) - 4rem - 3rem) / 3)";

/**
 * Full-bleed hero background. `100vw` is honest here — the image really does span the
 * viewport — and `deviceSizes` in next.config.js caps the widest variant at 1920.
 * Only use this on edge-to-edge surfaces; a half-width panel wants
 * {@link SPLIT_PANEL_IMAGE_SIZES} instead, or it requests double the pixels it shows.
 */
export const PLP_HERO_IMAGE_SIZES = "100vw";

/** Two-column section where the image occupies one column on desktop (lg:grid-cols-2) */
export const SPLIT_PANEL_IMAGE_SIZES = "(max-width: 1024px) 100vw, 50vw";

/** PDP main gallery: full width on mobile, half viewport on desktop split layout */
export const PDP_MAIN_IMAGE_SIZES = "(max-width: 768px) 100vw, 50vw";

/**
 * PDP immersive gallery: full-width square on mobile, height-driven square that
 * fills the viewport (≈ 60% width) on desktop. Width follows the fixed height,
 * so request a generously sized variant on large screens.
 */
export const PDP_IMMERSIVE_IMAGE_SIZES = "(max-width: 1024px) 100vw, 60vw";

/**
 * PDP mosaic gallery: all images tiled in a 2-column grid.
 * Each tile is ~half the gallery column — half viewport on mobile, ~30vw on the
 * wide editorial column on desktop.
 */
export const PDP_MOSAIC_IMAGE_SIZES = "(max-width: 1024px) 50vw, 30vw";

/** PDP desktop thumbnail strip */
export const PDP_THUMBNAIL_IMAGE_SIZES = "80px";

/** Cart drawer line item — fixed 80px slot (h-24 w-20) */
export const CART_THUMBNAIL_IMAGE_SIZES = "80px";

/** LCP candidate on Home, PLP, and PDP — only one high-priority image per viewport */
export const LCP_IMAGE_PRIORITY_COUNT = 1;

/** Match Next.js default — higher values slow cold /_next/image encoding on Vercel */
export const PRODUCT_IMAGE_QUALITY = 75;

/* -------------------------------------------------------------------------- */
/* Saleor-native responsive images                                            */
/* -------------------------------------------------------------------------- */

/**
 * Saleor's fixed thumbnail ladder (`saleor/thumbnail/__init__.py`). A requested size
 * snaps to the **nearest** rung, not the next one up — asking for 300 returns 256.
 * Only ever request values from this list, or the width you get back is not the
 * width you put in the `srcset` descriptor.
 */
export const SALEOR_THUMBNAIL_RUNGS = [32, 64, 128, 256, 512, 1024, 2048, 4096] as const;

/**
 * Rungs requested for PLP/collection/category cards. Covers a 2-up mobile grid at 2x
 * (~340px) through a 3-up desktop grid at 2x (~780px).
 */
export const CATALOG_CARD_RUNGS = [256, 512, 1024] as const;

/** Rungs requested for the PDP gallery, which runs up to full-bleed on desktop. */
export const PDP_GALLERY_RUNGS = [512, 1024, 2048] as const;

/**
 * Which pipeline serves catalog images.
 *
 * - `saleor` — plain `<img srcset>` pointing at Saleor's CDN-backed thumbnails.
 *   Saleor has already produced a correctly-sized WebP, so this skips `/_next/image`
 *   entirely and the transformation is never billed.
 * - `vercel` — route everything through `next/image`. The escape hatch: set
 *   `NEXT_PUBLIC_PAPER_IMAGE_PIPELINE=vercel` to revert without a code change.
 *
 * Surfaces without a Saleor rung set (local assets, CMS uploads) always use
 * `next/image` regardless of this setting.
 */
export const PAPER_IMAGE_PIPELINE: "saleor" | "vercel" =
	process.env.NEXT_PUBLIC_PAPER_IMAGE_PIPELINE === "vercel" ? "vercel" : "saleor";

/**
 * Origin to `preconnect` when the Saleor pipeline is active.
 *
 * Under `next/image` every image is same-origin (`/_next/image?url=…`) and rides the
 * connection the document already opened. Pointing `<img>` straight at Saleor makes the
 * LCP image cross-origin, so without this hint the browser pays DNS + TCP + TLS before
 * requesting its first byte.
 *
 * Returns `null` when the pipeline is `vercel` (the hint would open a socket nothing
 * uses) or when the API URL is unset or unparseable. Assumes media is served from the
 * API origin, which holds for Saleor Cloud and typical self-hosted deploys; a separate
 * media domain needs its own hint.
 */
export function saleorMediaPreconnectOrigin(): string | null {
	if (PAPER_IMAGE_PIPELINE !== "saleor") return null;

	try {
		return new URL(process.env.NEXT_PUBLIC_SALEOR_API_URL ?? "").origin;
	} catch {
		return null;
	}
}

export interface SaleorSrcSetEntry {
	/** Must be a value from {@link SALEOR_THUMBNAIL_RUNGS} that was actually requested. */
	width: number;
	url: string | null | undefined;
}

/**
 * Builds a `srcset` from aliased Saleor thumbnail fields.
 *
 * Returns `undefined` for fewer than two usable rungs: a single-candidate `srcset`
 * tells the browser nothing that `src` doesn't, and the caller uses that signal to
 * fall back to `next/image`.
 */
export function buildSaleorSrcSet(entries: readonly SaleorSrcSetEntry[]): string | undefined {
	const seen = new Set<number>();
	const candidates: string[] = [];

	for (const { width, url } of entries) {
		if (!url || seen.has(width)) continue;
		seen.add(width);
		candidates.push(`${url} ${width}w`);
	}

	return candidates.length > 1 ? candidates.join(", ") : undefined;
}
