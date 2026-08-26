import { Suspense } from "react";
import { brandConfig } from "@/config/brand";
import { resolveLocaleFromSlug } from "@/config/locale";
import { getFeaturedProducts } from "@/lib/catalog/get-featured-products";
import { resolveChannelCurrency } from "@/lib/channels/resolve-channel-currency";
import { buildPolicyLabelValues } from "@/lib/content";
import { formatContentLabel } from "@/lib/content/format-label";
import { getStorefrontContent } from "@/lib/content/server";
import { buildSaleorSrcSet } from "@/lib/images";
import { pickTranslatedSlug } from "@/lib/saleor-translations";
import { PaperSignEditorialPlaceholder } from "@/ui/components/shared/paper-sign";
import { CategoryTileGrid, type CategoryTile } from "@/ui/sections/category-tile-grid/category-tile-grid";
import { EditorialHero } from "@/ui/sections/editorial-hero/editorial-hero";
import { FeaturedCollectionSection } from "@/ui/sections/featured-collection-section/featured-collection-section";
import { ImageWithText } from "@/ui/sections/image-with-text/image-with-text";
import { MediaHero } from "@/ui/sections/media-hero/media-hero";
import { MulticolumnSection } from "@/ui/sections/multicolumn-section/multicolumn-section";
import { RichTextBlock } from "@/ui/sections/rich-text-block/rich-text-block";

export const metadata = {
	description: brandConfig.description,
};

// Prefetch: default (auto). With global `partialPrefetching`, viewport links already get the
// homepage App Shell. No link uses `prefetch={true}` to "/".

type FeaturedProduct = Awaited<ReturnType<typeof getFeaturedProducts>>[number];
type HomeParams = Promise<{ locale: string; channel: string }>;

/** Aliased rungs must stay in sync with CATALOG_CARD_RUNGS in src/lib/images.ts. */
function productThumbnailSrcSet(product: FeaturedProduct) {
	return buildSaleorSrcSet([
		{ width: 256, url: product.thumbnail256?.url },
		{ width: 512, url: product.thumbnail512?.url },
		{ width: 1024, url: product.thumbnail?.url },
	]);
}

function categoryBackgroundSrcSet(category: NonNullable<FeaturedProduct["category"]>) {
	return buildSaleorSrcSet([
		{ width: 256, url: category.backgroundImage256?.url },
		{ width: 512, url: category.backgroundImage512?.url },
		{ width: 1024, url: category.backgroundImage?.url },
	]);
}

function pickImage(product: FeaturedProduct | undefined) {
	if (!product?.thumbnail?.url) return null;
	return {
		url: product.thumbnail.url,
		alt: product.thumbnail.alt || product.name || "",
		srcSet: productThumbnailSrcSet(product),
	};
}

/**
 * Derive shop-by-category tiles from the catalog: one tile per category. Prefer the
 * category's own background image (merchandised lifestyle art); fall back to a
 * representative product thumbnail when the category has no image set.
 */
function buildCategoryTiles(products: readonly FeaturedProduct[], max = 3): CategoryTile[] {
	const seen = new Set<string>();
	const tiles: CategoryTile[] = [];
	for (const product of products) {
		const category = product.category;
		if (!category?.slug || seen.has(category.slug)) continue;
		seen.add(category.slug);
		const categoryName = category.translation?.name || category.name;
		const background = category.backgroundImage;
		const image = background?.url ?? product.thumbnail?.url ?? null;
		const imageAlt = background?.alt || product.thumbnail?.alt || categoryName;
		tiles.push({
			title: categoryName,
			href: `/categories/${pickTranslatedSlug(category)}`,
			image,
			imageSrcSet: background?.url ? categoryBackgroundSrcSet(category) : productThumbnailSrcSet(product),
			imageAlt,
		});
		if (tiles.length >= max) break;
	}
	return tiles;
}

/** Fold-height placeholder so client-nav App Shells keep layout while URL data resolves. */
function HomePageFallback() {
	return (
		<div aria-hidden="true">
			<div className="min-h-[calc(100svh-var(--chrome-offset))] bg-secondary">
				<div className="container-content flex h-full min-h-[calc(100svh-var(--chrome-offset))] flex-col justify-end pb-16 pt-24">
					<div className="h-3 w-24 animate-pulse rounded bg-muted" />
					<div className="mt-4 h-10 w-2/3 max-w-xl animate-pulse rounded bg-muted" />
					<div className="mt-3 h-4 w-1/2 max-w-md animate-pulse rounded bg-muted" />
					<div className="mt-8 h-11 w-36 animate-pulse rounded bg-muted" />
				</div>
			</div>
		</div>
	);
}

/**
 * Homepage body — awaits `params` + cached catalog/content. Wrapped by the page's
 * Suspense so Partial Prefetching can share one App Shell across locale/channel URLs.
 * Direct loads still prerender full HTML per `generateStaticParams` (Suspense resolves
 * at build time); client navigations show {@link HomePageFallback} until the cached
 * body streams in.
 */
async function HomePageContent({ params }: { params: HomeParams }) {
	const { locale, channel } = await params;
	const content = await getStorefrontContent(channel, locale);
	const { hero, featuredCollection, categories, brandStory, values, editorial } = content.surfaces.homepage;

	// Source real product imagery from the same cached collection the featured
	// section uses (deduped by "use cache" key).
	const products = await getFeaturedProducts(
		channel,
		locale,
		featuredCollection.limit,
		featuredCollection.collectionSlug,
	);
	const heroProduct = products[0];
	const heroImage = pickImage(heroProduct);
	const editorialProduct = products.find(
		(product) => product.slug !== heroProduct?.slug && product.thumbnail?.url,
	);
	const editorialFallbackImage = pickImage(editorialProduct);
	const categoryTiles = buildCategoryTiles(products);

	const currency = await resolveChannelCurrency(channel);
	const policyValues = buildPolicyLabelValues(content.policies, {
		currency,
		locale: resolveLocaleFromSlug(locale).bcp47,
	});
	const valueColumns = values.columns.map((column) => ({
		...column,
		text: formatContentLabel(column.text, policyValues),
	}));

	return (
		<>
			{hero.backgroundImage ? (
				// Art-directed full-bleed media → immersive overlay hero.
				<MediaHero
					id="homepage-hero-heading"
					eyebrow={hero.eyebrow}
					heading={hero.heading}
					subheading={hero.subheading}
					image={hero.backgroundImage}
					align="left"
					height="fold"
					primaryCta={{ label: hero.primaryCtaLabel, href: "/products" }}
				/>
			) : (
				// No lifestyle/hero image in the catalog → clean editorial split with a packshot.
				<EditorialHero
					eyebrow={hero.eyebrow}
					heading={hero.heading}
					subheading={hero.subheading}
					image={heroImage?.url}
					imageSrcSet={heroImage?.srcSet}
					imageAlt={heroImage?.alt ?? ""}
					primaryCta={{ label: hero.primaryCtaLabel, href: "/products" }}
					placeholder={<PaperSignEditorialPlaceholder />}
				/>
			)}

			{/* Cached collection — resolves with the rest of the body inside Suspense. */}
			<FeaturedCollectionSection
				locale={locale}
				channel={channel}
				heading={featuredCollection.heading}
				collectionSlug={featuredCollection.collectionSlug}
				limit={featuredCollection.limit}
			/>

			{categoryTiles.length >= 2 ? (
				<CategoryTileGrid
					eyebrow={categories.eyebrow}
					heading={categories.heading}
					tiles={categoryTiles}
					columns={categoryTiles.length >= 3 ? 3 : 2}
					imageFit="cover"
					tone="muted"
				/>
			) : null}

			<ImageWithText
				heading={editorial.heading}
				paragraphs={editorial.paragraphs}
				image={editorial.image ?? editorialFallbackImage?.url}
				imageSrcSet={editorial.image ? undefined : editorialFallbackImage?.srcSet}
				imageAlt={editorial.image ? editorial.imageAlt : (editorialFallbackImage?.alt ?? "")}
				imageFit={editorial.image ? "cover" : "contain"}
				imagePosition={editorial.imagePosition}
				placeholder={<PaperSignEditorialPlaceholder />}
				cta={{ label: editorial.ctaLabel, href: "/collections" }}
			/>

			<MulticolumnSection
				heading={values.heading}
				columns={valueColumns}
				columnsDesktop={values.columnsDesktop}
				tone="muted"
			/>

			<RichTextBlock
				heading={brandStory.heading}
				paragraphs={brandStory.paragraphs}
				align="center"
				width="narrow"
				tone="inverse"
			/>
		</>
	);
}

/**
 * Sync page shell — `params` are URL data and must stay behind Suspense for a shared
 * instant App Shell (Next.js 16.3 Partial Prefetching).
 */
export default function Page({ params }: { params: HomeParams }) {
	return (
		<Suspense fallback={<HomePageFallback />}>
			<HomePageContent params={params} />
		</Suspense>
	);
}
