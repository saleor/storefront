import { notFound } from "next/navigation";
import { ProductListPaginatedDocument, OrderDirection, ProductOrderField } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";

import { getPaginatedListVariables } from "@/lib/utils";
import { SortBy } from "@/ui/components/SortBy";

export const metadata = {
	title: "Products · Saleor Storefront example",
	description: "All products in Saleor Storefront example",
};

const getSortVariables = (sortParam?: string | string[]) => {
	const sortValue = Array.isArray(sortParam) ? sortParam[0] : sortParam;

	switch (sortValue) {
		case "price-asc":
			return { field: ProductOrderField.MinimalPrice, direction: OrderDirection.Asc };
		case "price-desc":
			return { field: ProductOrderField.MinimalPrice, direction: OrderDirection.Desc };
		default:
			return { field: ProductOrderField.Name, direction: OrderDirection.Asc };
	}
};

export default async function Page(props: {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{
		cursor?: string | string[];
		direction?: string | string[];
		sort?: string | string[];
	}>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;

	const paginationVariables = getPaginatedListVariables({ params: searchParams });
	const sortVariables = getSortVariables(searchParams.sort);

	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables: {
			...paginationVariables,
			channel: params.channel,
			sortBy: sortVariables,
		},
		revalidate: 60,
	});

	if (!products) {
		notFound();
	}

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<div className="mb-6 flex justify-end">
				<SortBy />
			</div>
			<h2 className="sr-only">Product list</h2>
			<ProductList products={products.edges.map((e) => e.node)} />
			<Pagination pageInfo={products.pageInfo} />
		</section>
	);
}
