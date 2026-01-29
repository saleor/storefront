import { cacheLife, cacheTag } from "next/cache";
import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/product-list";

export const metadata = {
	title: "ACME Storefront, powered by Saleor & Next.js",
	description:
		"Storefront Next.js Example for building performant e-commerce experiences with Saleor - the composable, headless commerce platform for global brands.",
};

/**
 * Cached function to fetch featured products.
 * With Cache Components, this data becomes part of the static shell,
 * giving users instant page loads while keeping content fresh.
 */
async function getFeaturedProducts(channel: string) {
	"use cache";
	cacheLife("minutes"); // 5 minute cache
	cacheTag("collection:featured-products"); // Tag for on-demand revalidation

	const result = await executePublicGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "featured-products",
			channel,
			first: 12,
		},
		revalidate: 300,
	});

	if (!result.ok) {
		// During build, if the API is unreachable, return null instead of failing.
		// The page will be populated on-demand when a user visits.
		console.warn(`[Homepage] Failed to fetch featured products for ${channel}:`, result.error.message);
		return null;
	}

	return result.data.collection?.products?.edges.map(({ node }) => node) ?? null;
}

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const { channel } = await props.params;
	const products = await getFeaturedProducts(channel);

	if (!products) {
		return null;
	}

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<h2 className="sr-only">Product list</h2>
			<ProductList products={products} />
		</section>
	);
}
