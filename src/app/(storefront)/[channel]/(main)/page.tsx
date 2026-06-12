import { Suspense } from "react";
import { brandConfig } from "@/config/brand";
import { homepageContent } from "@/config/homepage-content";
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
export default function Page(props: { params: Promise<{ channel: string }> }) {
	const { hero, featuredCollection, brandStory, values, editorial } = homepageContent;

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

			<Suspense fallback={<FeaturedCollectionSkeleton heading={featuredCollection.heading} />}>
				<FeaturedCollectionLoader
					params={props.params}
					heading={featuredCollection.heading}
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
				columns={values.columns}
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
	limit,
}: {
	params: Promise<{ channel: string }>;
	heading: string;
	limit: number;
}) {
	const { channel } = await params;

	return <FeaturedCollectionSection channel={channel} heading={heading} limit={limit} />;
}
