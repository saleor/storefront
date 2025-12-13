import { HomepageCollectionsDocument, ProductListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/ProductList";
import { HeroSection } from "@/ui/components/HeroSection";
import { CategoryGrid } from "@/ui/components/CategoryGrid";
import { NewsletterSignup } from "@/ui/components/NewsletterSignup";
import { TrustBadges } from "@/ui/components/TrustBadges";
import { HomepageSection } from "@/ui/components/HomepageSection";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { ArrowRight } from "lucide-react";

export const metadata = {
	title: "Luxior Mall | Premium Shopping Experience",
	description:
		"Discover premium products at Luxior Mall. Shop the latest fashion, electronics, home goods and more with free shipping on orders over $50.",
};

// Helper to get metadata value
function getMetadataValue(
	metadata: Array<{ key: string; value: string }> | null | undefined,
	key: string,
): string | null {
	return metadata?.find((m) => m.key === key)?.value || null;
}

export default async function HomePage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	// Fetch all collections with their products - this is the main data source
	const collectionsData = await executeGraphQL(HomepageCollectionsDocument, {
		variables: {
			channel: params.channel,
			first: 20,
		},
		revalidate: 60, // Revalidate every minute for fresh content
	});

	// Fetch latest products as fallback/new arrivals
	const newArrivalsData = await executeGraphQL(ProductListDocument, {
		variables: {
			first: 8,
			channel: params.channel,
		},
		revalidate: 60,
	});

	const collections = collectionsData.collections?.edges.map(({ node }) => node) || [];
	const newArrivals = newArrivalsData.products?.edges.map(({ node }) => node) || [];

	// Filter and sort collections for homepage display
	// Collections with "homepage_show" metadata set to "true" will be displayed
	// Collections are sorted by "homepage_priority" metadata (lower = higher priority)
	const homepageCollections = collections
		.filter((collection) => {
			const showOnHomepage = getMetadataValue(collection.metadata, "homepage_show");
			// Show collection if it has homepage_show=true OR if it has products
			return showOnHomepage === "true" || (collection.products?.edges.length ?? 0) > 0;
		})
		.sort((a, b) => {
			const priorityA = parseInt(getMetadataValue(a.metadata, "homepage_priority") || "99", 10);
			const priorityB = parseInt(getMetadataValue(b.metadata, "homepage_priority") || "99", 10);
			return priorityA - priorityB;
		});

	// Separate featured collection (if exists) for special treatment
	const featuredCollection = homepageCollections.find(
		(c) => c.slug === "featured-products" || getMetadataValue(c.metadata, "homepage_style") === "featured",
	);

	// Other collections to display
	const otherCollections = homepageCollections.filter((c) => c !== featuredCollection).slice(0, 5); // Limit to 5 additional sections

	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<HeroSection />

			{/* Trust Badges */}
			<TrustBadges />

			{/* Featured Collection (if exists) */}
			{featuredCollection && featuredCollection.products?.edges.length ? (
				<HomepageSection
					title={featuredCollection.name}
					subtitle="Handpicked favorites just for you"
					slug={featuredCollection.slug}
					products={featuredCollection.products.edges.map((e) => e.node)}
					totalCount={featuredCollection.products.totalCount ?? 0}
					backgroundImage={featuredCollection.backgroundImage}
					metadata={featuredCollection.metadata}
					variant="featured"
					columns={4}
					maxProducts={4}
				/>
			) : null}

			{/* Category Grid */}
			<CategoryGrid />

			{/* Dynamic Collection Sections from Dashboard */}
			{otherCollections.map((collection) => {
				const products = collection.products?.edges.map((e) => e.node) || [];
				if (products.length === 0) return null;

				const style = getMetadataValue(collection.metadata, "homepage_style") as
					| "grid"
					| "banner"
					| "featured"
					| undefined;

				return (
					<HomepageSection
						key={collection.id}
						title={collection.name}
						slug={collection.slug}
						products={products}
						totalCount={collection.products?.totalCount || 0}
						backgroundImage={collection.backgroundImage}
						metadata={collection.metadata}
						variant={style || "grid"}
						columns={4}
						maxProducts={8}
					/>
				);
			})}

			{/* New Arrivals (Latest Products) */}
			{newArrivals.length > 0 && (
				<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
					<div className="mb-8 flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-secondary-900">New Arrivals</h2>
							<p className="mt-1 text-secondary-600">The latest additions to our collection</p>
						</div>
						<LinkWithChannel
							href="/products"
							className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
						>
							Shop all
							<ArrowRight className="h-4 w-4" />
						</LinkWithChannel>
					</div>
					<ProductList products={newArrivals.slice(0, 8)} variant="grid" columns={4} />
				</section>
			)}

			{/* Newsletter Signup */}
			<NewsletterSignup />
		</div>
	);
}
