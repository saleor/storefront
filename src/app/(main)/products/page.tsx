import { notFound } from "next/navigation";
import { ProductListPaginatedDocument } from "@/gql/graphql";
import { ProductsPerPage, execute } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";

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
			<section className="mx-auto max-w-7xl px-8 py-12">
				<h2 className="sr-only">Product list</h2>
				<div className="my-8">
					<ProductList products={products.edges.map(({ node }) => node)} />
				</div>
				<Pagination pageInfo={products.pageInfo} />
			</section>
		</div>
	);
}
