import { ProductListByCollectionDocument, ProductListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/ProductList";
import { HeroSection } from "@/ui/components/HeroSection";
import { CategoryGrid } from "@/ui/components/CategoryGrid";
import { NewsletterSignup } from "@/ui/components/NewsletterSignup";
import { TrustBadges } from "@/ui/components/TrustBadges";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { ArrowRight } from "lucide-react";

export const metadata = {
	title: "Luxior Mall | Premium Shopping Experience",
	description:
		"Discover premium products at Luxior Mall. Shop the latest fashion, electronics, home goods and more with free shipping on orders over $50.",
};

export default async function HomePage(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;
	
	// Fetch featured products
	const featuredData = await executeGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "featured-products",
			channel: params.channel,
		},
		revalidate: 60,
	});

	// Fetch new arrivals
	const newArrivalsData = await executeGraphQL(ProductListDocument, {
		variables: {
			first: 8,
			channel: params.channel,
		},
		revalidate: 60,
	});

	const featuredProducts = featuredData.collection?.products?.edges.map(({ node }) => node) || [];
	const newArrivals = newArrivalsData.products?.edges.map(({ node }) => node) || [];

	return (
		<div className="flex flex-col">
			{/* Hero Section */}
			<HeroSection />

			{/* Trust Badges */}
			<TrustBadges />

			{/* Featured Products */}
			{featuredProducts.length > 0 && (
				<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h2 className="text-2xl font-bold text-secondary-900">Featured Products</h2>
							<p className="mt-1 text-secondary-600">Handpicked favorites just for you</p>
						</div>
						<LinkWithChannel
							href="/collections/featured-products"
							className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
						>
							View all
							<ArrowRight className="h-4 w-4" />
						</LinkWithChannel>
					</div>
					<ProductList products={featuredProducts.slice(0, 4)} variant="grid" columns={4} />
				</section>
			)}

			{/* Category Grid */}
			<CategoryGrid channel={params.channel} />

			{/* New Arrivals */}
			{newArrivals.length > 0 && (
				<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h2 className="text-2xl font-bold text-secondary-900">New Arrivals</h2>
							<p className="mt-1 text-secondary-600">The latest additions to our collection</p>
						</div>
						<LinkWithChannel
							href="/products"
							className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
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
