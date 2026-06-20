import { Suspense } from "react";
import { brandConfig } from "@/config/brand";
import { resolveLocaleFromSlug } from "@/config/locale";
import { getFeaturedProducts } from "@/lib/catalog/get-featured-products";
import { resolveChannelCurrency } from "@/lib/channels/resolve-channel-currency";
import { buildPolicyLabelValues } from "@/lib/content";
import { formatContentLabel } from "@/lib/content/format-label";
import { getStorefrontContent } from "@/lib/content/server";
import { PaperSignEditorialPlaceholder } from "@/ui/components/shared/paper-sign";
import { CategoryTileGrid, type CategoryTile } from "@/ui/sections/category-tile-grid/category-tile-grid";
import { EditorialHero } from "@/ui/sections/editorial-hero/editorial-hero";
import { FeaturedCollectionSection } from "@/ui/sections/featured-collection-section/featured-collection-section";
import { FeaturedCollectionSkeleton } from "@/ui/sections/featured-collection-section/featured-collection-skeleton";
import { ImageWithText } from "@/ui/sections/image-with-text/image-with-text";
import { MediaHero } from "@/ui/sections/media-hero/media-hero";
import { MulticolumnSection } from "@/ui/sections/multicolumn-section/multicolumn-section";
import { RichTextBlock } from "@/ui/sections/rich-text-block/rich-text-block";

export const metadata = {
	title: brandConfig.siteName,
	description: brandConfig.description,
};

/** Prefer footwear/marquee products for the hero; otherwise the first available image. */
const HERO_SLUG_HINT = /shoe|plimsoll|sneaker|trainer|runner|force|boot/i;

type FeaturedProduct = Awaited<ReturnType<typeof getFeaturedProducts>>[number];

function pickImage(product: FeaturedProduct | undefined) {
	if (!product?.thumbnail?.url) return null;
	return { url: product.thumbnail.url, alt: product.thumbnail.alt || product.name || "" };
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
		const image = category.backgroundImage?.url ?? product.thumbnail?.url ?? null;
		const imageAlt = category.backgroundImage?.alt || product.thumbnail?.alt || categoryName;
		tiles.push({
			title: categoryName,
			href: `/categories/${category.slug}`,
			image,
			imageAlt,
		});
		if (tiles.length >= max) break;
	}
	return tiles;
}

/**
 * Homepage — async shell that awaits only params + cached content/catalog data
 * (no searchParams/cookies), so PPR stays intact. The featured collection still
 * streams in its own Suspense island.
 */
export default async function Page(props: { params: Promise<{ locale: string; channel: string }> }) {
	const { locale, channel } = await props.params;
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
	const heroProduct = products.find((product) => HERO_SLUG_HINT.test(product.slug)) ?? products[0];
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
					primaryCta={{ label: hero.primaryCtaLabel, href: "/products" }}
				/>
			) : (
				// No lifestyle/hero image in the catalog → clean editorial split with a packshot.
				<EditorialHero
					eyebrow={hero.eyebrow}
					heading={hero.heading}
					subheading={hero.subheading}
					image={heroImage?.url}
					imageAlt={heroImage?.alt ?? ""}
					primaryCta={{ label: hero.primaryCtaLabel, href: "/products" }}
					placeholder={<PaperSignEditorialPlaceholder />}
				/>
			)}

			<Suspense
				fallback={
					<FeaturedCollectionSkeleton heading={featuredCollection.heading} limit={featuredCollection.limit} />
				}
			>
				<FeaturedCollectionLoader
					params={props.params}
					heading={featuredCollection.heading}
					collectionSlug={featuredCollection.collectionSlug}
					limit={featuredCollection.limit}
				/>
			</Suspense>

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
				imageAlt={editorial.image ? editorial.imageAlt : editorialFallbackImage?.alt ?? ""}
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

async function FeaturedCollectionLoader({
	params,
	heading,
	collectionSlug,
	limit,
}: {
	params: Promise<{ locale: string; channel: string }>;
	heading: string;
	collectionSlug: string;
	limit: number;
}) {
	const { locale, channel } = await params;

	return (
		<FeaturedCollectionSection
			locale={locale}
			channel={channel}
			heading={heading}
			collectionSlug={collectionSlug}
			limit={limit}
		/>
	);
}
