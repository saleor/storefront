import { ProductListDocument } from "@/gql/graphql";
import { execute } from "@/lib";
import { ProductElement } from "@/ui/components/ProductElement";

export const metadata = {
	title: "Storefront by Saleor",
};

export default async function Page() {
	const data = await execute(ProductListDocument);

	if (!data.products) throw Error("No products found");

	const products = data.products.edges.map(({ node: product }) => product);

	return (
		<div>
			{/* <CollectionList /> */}
			<section className="mx-auto max-w-7xl p-8">
				<div className="mt-4 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{products.map((product) => (
						<ProductElement key={product.id} product={product} />
					))}
				</div>
			</section>
		</div>
	);
}
