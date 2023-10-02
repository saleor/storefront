import { notFound } from "next/navigation";
import { ProductListByCategoryDocument } from "@/gql/graphql";
import { execute } from "@/lib";
import { ProductElement } from "@/ui/components/ProductElement";

export const metadata = {
	title: "Category · Saleor Storefront",
};

export default async function Page({ params }: { params: { slug: string } }) {
	const { category } = await execute(ProductListByCategoryDocument, {
		variables: { slug: params.slug },
	});

	if (!category) {
		notFound();
	}

	const { name, products } = category;

	return (
		<div>
			<div className="border-b bg-slate-100/50">
				<div className="mx-auto max-w-7xl p-8">
					<h2 className="text-xl font-semibold">{name}</h2>
				</div>
			</div>
			<section className="sm:py-18 mx-auto max-w-2xl px-8 py-12 sm:px-6 lg:max-w-7xl">
				<div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{products?.edges.map(({ node: product }) => <ProductElement key={product.id} product={product} />)}
				</div>
			</section>
		</div>
	);
}
