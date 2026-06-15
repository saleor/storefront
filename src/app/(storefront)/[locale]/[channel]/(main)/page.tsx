import { Suspense } from "react";
import { brandConfig } from "@/config/brand";
import { resolveLocaleFromSlug } from "@/config/locale";
import { resolveChannelCurrency } from "@/lib/channels/resolve-channel-currency";
import { buildPolicyLabelValues } from "@/lib/content";
import { formatContentLabel } from "@/lib/content/format-label";
import { getStorefrontContent } from "@/lib/content/server";
import { FeaturedCollectionSection } from "@/ui/sections/featured-collection-section/featured-collection-section";
import { FeaturedCollectionSkeleton } from "@/ui/sections/featured-collection-section/featured-collection-skeleton";
import { HeroBanner } from "@/ui/sections/hero-banner/hero-banner";
import { ImageWithText } from "@/ui/sections/image-with-text/image-with-text";
import { MulticolumnSection } from "@/ui/sections/multicolumn-section/multicolumn-section";
import { RichTextBlock } from "@/ui/sections/rich-text-block/rich-text-block";

export const metadata = {
	title: brandConfig.siteName,
	description: brandConfig.description,
};

/**
 * Homepage — sync shell; only the featured collection streams in Suspense.
 * Static sections use channel-relative hrefs (LinkWithChannel in section CTAs).
 */
export default async function Page(props: { params: Promise<{ locale: string; channel: string }> }) {
	const { locale, channel } = await props.params;
	const content = await getStorefrontContent(channel, locale);
	const { hero, featuredCollection, brandStory, values, editorial } = content.surfaces.homepage;

	// Resolve policy tokens (e.g. "{returnsWindowDays}") in editorial value columns so the
	// returns window stays consistent with the cart and announcement.
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
			<HeroBanner
				heading={hero.heading}
				subheading={hero.subheading}
				height="large"
				primaryCta={{
					label: hero.primaryCtaLabel,
					href: "/products",
				}}
			/>

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

			<ImageWithText
				heading={editorial.heading}
				paragraphs={editorial.paragraphs}
				imagePosition={editorial.imagePosition}
				cta={{
					label: editorial.ctaLabel,
					href: "/collections",
				}}
			/>

			<MulticolumnSection
				heading={values.heading}
				columns={valueColumns}
				columnsDesktop={values.columnsDesktop}
			/>

			<RichTextBlock
				heading={brandStory.heading}
				paragraphs={brandStory.paragraphs}
				align="center"
				width="narrow"
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
