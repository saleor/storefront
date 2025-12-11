import { notFound } from "next/navigation";
import { ProductListPaginatedDocument, OrderDirection, ProductOrderField } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";
import { Breadcrumb } from "@/ui/components/Breadcrumb";
import { ProductListHeader } from "@/ui/components/ProductListHeader";

import { getPaginatedListVariables } from "@/lib/utils";

export const metadata = {
	title: "All Products | Luxior Mall",
	description: "Browse our complete collection of premium products at Luxior Mall. Find the best deals on fashion, electronics, home goods and more.",
};

const getSortVariables = (sortParam?: string | string[]) => {
	const sortValue = Array.isArray(sortParam) ? sortParam[0] : sortParam;

	switch (sortValue) {
		case "price-asc":
			return { field: ProductOrderField.MinimalPrice, direction: OrderDirection.Asc };
		case "price-desc":
			return { field: ProductOrderField.MinimalPrice, direction: OrderDirection.Desc };
		case "newest":
			return { field: ProductOrderField.Date, direction: OrderDirection.Desc };
		case "name-asc":
			return { field: ProductOrderField.Name, direction: OrderDirection.Asc };
		case "name-desc":
			return { field: ProductOrderField.Name, direction: OrderDirection.Desc };
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
		view?: string | string[];
	}>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;

	const paginationVariables = getPaginatedListVariables({ params: searchParams });
	const sortVariables = getSortVariables(searchParams.sort);
	const viewParam = Array.isArray(searchParams.view) ? searchParams.view[0] : searchParams.view;
	const view = viewParam === "list" ? "list" : "grid";

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

	const productCount = products.totalCount ?? products.edges.length;

	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
			{/* Breadcrumb */}
			<Breadcrumb 
				items={[{ label: "All Products" }]} 
				className="mb-6"
			/>

			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-secondary-900">All Products</h1>
				<p className="mt-2 text-secondary-600">
					Discover our complete collection of premium products
				</p>
			</div>

			{/* Product List Header with Sort and View Toggle */}
			<ProductListHeader 
				productCount={productCount}
				currentSort={Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort}
				currentView={view}
			/>

			{/* Product Grid */}
			<h2 className="sr-only">Product list</h2>
			<ProductList 
				products={products.edges.map((e) => e.node)} 
				variant={view as "grid" | "list"}
				columns={4}
			/>

			{/* Pagination */}
			<div className="mt-12">
				<Pagination pageInfo={products.pageInfo} />
			</div>
		</section>
	);
}
