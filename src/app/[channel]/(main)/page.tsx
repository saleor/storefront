import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/ProductList";

export const metadata = {
	title: "ACME Storefront, powered by Saleor & Next.js",
	description:
		"Storefront Next.js Example for building performant e-commerce experiences with Saleor - the composable, headless commerce platform for global brands.",
};

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;
	
	try {
		// Try to fetch featured products collection first
		const data = await executeGraphQL(ProductListByCollectionDocument, {
			variables: {
				slug: "featured-products",
				channel: params.channel,
			},
			revalidate: 60,
		});

		if (data.collection?.products) {
			const products = data.collection.products.edges.map(({ node: product }) => product);
			return (
				<section className="mx-auto max-w-7xl p-8 pb-16">
					<h2 className="sr-only">Featured Products</h2>
					<ProductList products={products} />
				</section>
			);
		}
	} catch (error) {
		console.warn('Failed to fetch featured products collection:', error);
	}

	// Fallback: show a simple message if collection doesn't exist
	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<div className="text-center py-16">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to MattsCoinage.com</h1>
				<p className="text-lg text-gray-600 mb-8">Your Saleor storefront is running successfully!</p>
				<p className="text-sm text-gray-500">
					To display products, create a collection called "featured-products" in your Saleor dashboard,
					or browse products directly using the navigation menu.
				</p>
			</div>
		</section>
	);
}
