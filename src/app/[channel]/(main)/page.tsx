import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/ProductList";

// export const experimental_ppr = true; // Requires Next.js canary - uncomment when upgrading

export const metadata = {
	title: "ACME Storefront, powered by Saleor & Next.js",
	description:
		"Storefront Next.js Example for building performant e-commerce experiences with Saleor - the composable, headless commerce platform for global brands.",
};

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;
	const data = await executeGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "featured-products",
			channel: params.channel,
		},
		revalidate: 60,
		withAuth: false,
		tags: ["products", "featured"],
	});

	if (!data.collection?.products) {
		return null;
	}

	const products = data.collection?.products.edges.map(({ node: product }) => product);

	return (
		<>
			{/* Hero Section */}
			<section className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-12 lg:pb-24 lg:pt-32">
				<div className="animate-slide-up-fade space-y-6 text-center">
					<h1 className="font-display text-5xl font-light tracking-tight md:text-6xl lg:text-7xl">
						<span className="mb-2 block text-white">Discover Premium</span>
						<span className="gradient-text block">Products</span>
					</h1>
					<p className="mx-auto max-w-2xl text-xl font-light text-base-300 md:text-2xl">
						Curated collection of high-quality items with exceptional craftsmanship
					</p>
				</div>
				{/* Decorative elements */}
				<div
					className="border-accent-800/30 animate-float absolute left-10 top-10 h-20 w-20 rounded-full border"
					aria-hidden="true"
				></div>
				<div
					className="border-accent-700/20 animate-float absolute bottom-10 right-10 h-32 w-32 rounded-full border"
					style={{ animationDelay: "1s" }}
					aria-hidden="true"
				></div>
			</section>

			<section className="mx-auto max-w-7xl px-6 pb-16 lg:px-12">
				<h2 className="mb-8 font-display text-3xl font-light text-white lg:mb-12">Featured Products</h2>
				<ProductList products={products} />
			</section>
		</>
	);
}
