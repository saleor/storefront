import { OrderDirection, ProductOrderField, SearchProductsDocument } from "@/gql/graphql";
import { ProductsPerPage, executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";

export const metadata = {
	title: "Search products · Saleor Storefront example",
	description: "Search products in Saleor Storefront example",
};
type Props = {
	searchParams?: { [key: string]: string | string[] | undefined };
};
export default async function Page({ searchParams }: { searchParams?: Props }) {
	const { cursor, query: searchValue } = searchParams as { [key: string]: string };
	const { products } = await executeGraphQL(SearchProductsDocument, {
		variables: {
			first: ProductsPerPage,
			search: searchValue,
			after: cursor,
			sortBy: ProductOrderField.Rating,
			sortDirection: OrderDirection.Asc,
		},
		revalidate: 60,
	});

	return (
		<div>
			<section className="mx-auto max-w-7xl p-8 pb-16">
				{products && products.totalCount && products.totalCount > 0 ? (
					<div>
						<h1 className="pb-8 text-xl font-semibold">Search results</h1>
						<ProductList products={products.edges.map((e) => e.node)} />
						<Pagination pageInfo={products.pageInfo} />
					</div>
				) : (
					<h1 className="mx-auto pb-8 text-center text-xl font-semibold">Nothing found :(</h1>
				)}
			</section>
		</div>
	);
}
