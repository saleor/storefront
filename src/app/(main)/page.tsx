import { ProductListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductsList } from "@/ui/components/ProductsList";

export const metadata = {
	title: "Saleor Storefront example",
	description: "Starter pack for building performant e-commerce experiences with Saleor.",
};

export default async function Page() {
	const data = await executeGraphQL(ProductListDocument, { revalidate: 60 });

	if (!data.products) throw Error("No products found");

	const products = data.products.edges.map(({ node: product }) => product);

	return (
		<div>
			<h1 className="sr-only">Saleor Storefront example</h1>
			<section className="mx-auto max-w-7xl p-8">
				<h2 className="sr-only">Product list</h2>
				<ProductsList products={products} />
			</section>
		</div>
	);
}
