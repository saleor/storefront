import { notFound } from "next/navigation";
import { ProductListPaginatedDocument } from "@/gql/graphql";
import { ProductsPerPage, execute } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductsList } from "@/ui/components/ProductsList";

export const metadata = {
	title: "Product List · Saleor Storefront example",
	description: "All products in Saleor Storefront example",
};

type Props = {
	searchParams: {
		cursor: string;
	};
};

export default async function Page({ searchParams }: Props) {
	const { cursor } = searchParams;

	const { products } = await execute(ProductListPaginatedDocument, {
		variables: {
			first: ProductsPerPage,
			after: cursor,
		},
	});

	if (!products) {
		notFound();
	}

	return (
		<div>
			<div className="border-b bg-gray-100/50">
				<div className="mx-auto max-w-7xl p-8">
					<h1 className="text-xl font-semibold">All products</h1>
				</div>
			</div>
			<section className="sm:py-18 mx-auto max-w-2xl px-8 py-12 sm:px-6 lg:max-w-7xl">
				<h2 className="sr-only">Product list</h2>
				<ProductsList products={products.edges.map((e) => e.node)} />
				<Pagination pageInfo={products.pageInfo} />
			</section>
		</div>
	);
}
