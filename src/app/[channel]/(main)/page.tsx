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
		<>
			<h2 className="sr-only">Product list</h2>
			<Suspense fallback={<ProductsGridSkeleton />}>
				<FeaturedProducts params={props.params} />
			</Suspense>
		</>
	);
}

async function FeaturedProducts({ params: paramsPromise }: { params: Promise<{ channel: string }> }) {
	const { channel } = await paramsPromise;
	const products = await getFeaturedProducts(channel);

	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<ProductGrid products={products} channel={channel} />
		</div>
	);
}
