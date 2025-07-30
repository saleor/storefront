import { notFound, redirect } from "next/navigation";
import { OrderDirection, ProductOrderField, SearchProductsDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";
import { getPaginatedListVariables } from "@/lib/utils";

export const metadata = {
	title: "Search products · Saleor Storefront example",
	description: "Search products in Saleor Storefront example",
};

export default async function Page(props: {
	searchParams: Promise<Record<"query" | "cursor" | "direction", string | string[] | undefined>>;
	params: Promise<{ channel: string }>;
}) {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);

	const searchValue = searchParams.query;

	if (!searchValue) {
		notFound();
	}

	if (Array.isArray(searchValue)) {
		const firstValidSearchValue = searchValue.find((v) => v.length > 0);
		if (!firstValidSearchValue) {
			notFound();
		}
		redirect(`/search?${new URLSearchParams({ query: firstValidSearchValue }).toString()}`);
	}

	const paginationVariables = getPaginatedListVariables({ params: searchParams });

	const { products } = await executeGraphQL(SearchProductsDocument, {
		variables: {
			search: searchValue,
			channel: params.channel,
			sortBy: ProductOrderField.Rating,
			sortDirection: OrderDirection.Asc,
			...paginationVariables,
		},
		revalidate: 60,
	});

	if (!products) {
		notFound();
	}

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			{products.totalCount && products.totalCount > 0 ? (
				<div>
					<h1 className="pb-8 text-xl font-semibold">Search results for &quot;{searchValue}&quot;:</h1>
					<ProductList products={products.edges.map((e) => e.node)} />
					<Pagination pageInfo={products.pageInfo} />
				</div>
			) : (
				<h1 className="mx-auto pb-8 text-center text-xl font-semibold">Nothing found :(</h1>
			)}
		</section>
	);
}
