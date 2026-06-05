import { Suspense } from "react";
import { getFeaturedProducts } from "@/lib/catalog/get-featured-products";
import { FeaturedProductsSkeleton } from "@/ui/components/featured-products-skeleton";
import { ProductList } from "@/ui/components/product-list";

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
			<Suspense fallback={<FeaturedProductsSkeleton />}>
				<FeaturedProducts params={props.params} />
			</Suspense>
		</section>
	);
}

async function FeaturedProducts({ params: paramsPromise }: { params: Promise<{ channel: string }> }) {
	const { channel } = await paramsPromise;
	const products = await getFeaturedProducts(channel);

	return <ProductList products={products} channel={channel} />;
}
