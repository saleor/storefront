import { Suspense } from "react";
import { getFeaturedProducts } from "@/lib/catalog/get-featured-products";
import { ProductGrid, ProductsGridSkeleton } from "@/ui/components/plp";

export const metadata = {
	title: "ACME Storefront, powered by Saleor & Next.js",
	description:
		"Storefront Next.js Example for building performant e-commerce experiences with Saleor - the composable, headless commerce platform for global brands.",
};

/**
 * Sync page shell — static section wrapper streams featured products in a nested Suspense island.
 */
export default function Page(props: { params: Promise<{ channel: string }> }) {
	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<h2 className="sr-only">Product list</h2>
			<Suspense fallback={<ProductsGridSkeleton className="pb-16" />}>
				<FeaturedProducts params={props.params} />
			</Suspense>
		</section>
	);
}

async function FeaturedProducts({ params: paramsPromise }: { params: Promise<{ channel: string }> }) {
	const { channel } = await paramsPromise;
	const products = await getFeaturedProducts(channel);

	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<ProductGrid products={products} channel={channel} />
		</div>
	);
}
