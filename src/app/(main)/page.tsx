import { ProductListDocument } from "@/gql/graphql";
import { execute } from "@/lib/graphql";
import { ProductList } from "@/ui/components/ProductList";

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
				<div className="mt-4">
					<ProductList products={products} />
				</div>
			</section>
		</div>
	);
}
