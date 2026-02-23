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
 * Returns [] on failure so the page always renders (never null).
 * Note: the empty array IS cached for the cacheLife duration —
 * on-demand revalidation via cacheTag is the intended recovery path.
 */
async function getFeaturedProducts(channel: string) {
	"use cache";
	cacheLife("minutes");
	cacheTag("collection:featured-products");

	const result = await executePublicGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "featured-products",
			channel,
			first: 12,
		},
		revalidate: 300,
	});

	if (!result.ok) {
		console.warn(`[Homepage] Failed to fetch featured products for ${channel}:`, result.error.message);
		return [];
	}

	return result.data.collection?.products?.edges.map(({ node }) => node) ?? [];
}

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const { channel } = await props.params;
	const products = await getFeaturedProducts(channel);

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<h2 className="sr-only">Product list</h2>
			<ProductList products={products} />
		</section>
	);
}
