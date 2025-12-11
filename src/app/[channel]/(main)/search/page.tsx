import { notFound, redirect } from "next/navigation";
import { OrderDirection, ProductOrderField, SearchProductsDocument, ProductListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";
import { ProductListHeader } from "@/ui/components/ProductListHeader";
import { Breadcrumb } from "@/ui/components/Breadcrumb";
import { getPaginatedListVariables } from "@/lib/utils";
import { SearchEmptyState } from "@/ui/components/SearchEmptyState";

export const metadata = {
	title: "Search Products | Luxior Mall",
	description: "Search for products in Luxior Mall. Find the best deals on fashion, electronics, home goods and more.",
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
		case "relevance":
		default:
			return { field: ProductOrderField.Rating, direction: OrderDirection.Desc };
	}
};

export default async function SearchPage(props: {
	searchParams: Promise<{
		query?: string | string[];
		cursor?: string | string[];
		direction?: string | string[];
		sort?: string | string[];
		view?: string | string[];
	}>;
	params: Promise<{ channel: string }>;
}) {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);

	const searchValue = searchParams.query;

	if (!searchValue) {
		notFound();
	}

	// Handle array of search values
	const query = Array.isArray(searchValue) 
		? searchValue.find((v) => v.length > 0) || ""
		: searchValue;

	if (!query) {
		notFound();
	}

	// Redirect if array was provided
	if (Array.isArray(searchValue)) {
		redirect(`/${params.channel}/search?query=${encodeURIComponent(query)}`);
	}

	const paginationVariables = getPaginatedListVariables({ params: searchParams });
	const sortVariables = getSortVariables(searchParams.sort);
	const viewParam = Array.isArray(searchParams.view) ? searchParams.view[0] : searchParams.view;
	const view = viewParam === "list" ? "list" : "grid";

	// Fetch search results
	const { products } = await executeGraphQL(SearchProductsDocument, {
		variables: {
			search: query,
			channel: params.channel,
			sortBy: sortVariables.field,
			sortDirection: sortVariables.direction,
			...paginationVariables,
		},
		revalidate: 60,
	});

	if (!products) {
		notFound();
	}

	const hasResults = products.totalCount && products.totalCount > 0;
	const productCount = products.totalCount ?? 0;

	// Fetch suggested products if no results
	let suggestedProducts = null;
	if (!hasResults) {
		const { products: suggested } = await executeGraphQL(ProductListDocument, {
			variables: {
				first: 8,
				channel: params.channel,
			},
			revalidate: 60,
		});
		suggestedProducts = suggested;
	}

	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
			{/* Breadcrumb */}
			<Breadcrumb 
				items={[{ label: "Search Results" }]} 
				className="mb-6"
			/>

			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-secondary-900">
					Search Results
				</h1>
				<p className="mt-2 text-secondary-600">
					{hasResults ? (
						<>
							Found <span className="font-medium">{productCount}</span> results for{" "}
							<span className="font-medium text-secondary-900">&quot;{query}&quot;</span>
						</>
					) : (
						<>
							No results found for{" "}
							<span className="font-medium text-secondary-900">&quot;{query}&quot;</span>
						</>
					)}
				</p>
			</div>

			{hasResults ? (
				<>
					{/* Product List Header with Sort and View Toggle */}
					<ProductListHeader 
						productCount={productCount}
						currentSort={Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort}
						currentView={view}
					/>

					{/* Product Grid */}
					<h2 className="sr-only">Search results</h2>
					<ProductList 
						products={products.edges.map((e) => e.node)} 
						variant={view as "grid" | "list"}
						columns={4}
					/>

					{/* Pagination */}
					<div className="mt-12">
						<Pagination pageInfo={products.pageInfo} />
					</div>
				</>
			) : (
				<SearchEmptyState 
					query={query}
					suggestedProducts={suggestedProducts?.edges.map((e) => e.node)}
				/>
			)}
		</section>
	);
}
