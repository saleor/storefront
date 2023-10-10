import { ProductListDocument } from "@/gql/graphql";
import { execute } from "@/lib/graphql";
import { ProductElement } from "@/ui/components/ProductElement";

export const metadata = {
	title: "Saleor Storefront example",
	description: "Starter pack for building performant e-commerce experiences with Saleor.",
};

export default async function Page() {
	const data = await execute(ProductListDocument);

	if (!data.products) throw Error("No products found");

	const products = data.products.edges.map(({ node: product }) => product);

	return (
		<div>
			<h1 className="sr-only">Saleor Storefront example</h1>
			{/* <CollectionList /> */}
			<section className="mx-auto max-w-7xl p-8">
				<h2 className="sr-only">Product list</h2>
				<div className="mt-4 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{products.map((product, index) => (
						<ProductElement key={product.id} product={product} loading={index < 4 ? "eager" : "lazy"} />
					))}
				</div>
			</section>
		</div>
	);
}
