import { notFound, redirect } from "next/navigation";
import { OrderDirection, ProductOrderField, SearchProductsDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";
import { ProductsPerPage } from "@/app/config";

export const metadata = {
	title: "Search products · Saleor Storefront example",
	description: "Search products in Saleor Storefront example",
};

type PageProps = {
	params: { channel: string };
	searchParams: { after?: string; before?: string; query?: string | string[] };
};

interface SearchProductsVariables {
	first: number;
	after?: string;
	last?: number;
	before?: string;
	channel: string;
	search: string;
	sortBy: ProductOrderField;
	sortDirection: OrderDirection;
}

export default async function Page({ params, searchParams }: PageProps) {
	const cursorAfter = typeof searchParams.after === "string" ? searchParams.after : null;
	const cursorBefore = typeof searchParams.before === "string" ? searchParams.before : null;
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

	const variables: SearchProductsVariables = {
		channel: params.channel,
		search: searchValue ,
		sortBy: ProductOrderField.Rating,
		sortDirection: OrderDirection.Asc,
		first: ProductsPerPage,
	};

	if (cursorAfter) {
		variables.after = cursorAfter;
	} else if (cursorBefore) {
		variables.first = 0;
		variables.last = ProductsPerPage;
		variables.before = cursorBefore;
	}

	const { products } = await executeGraphQL(SearchProductsDocument, {
		variables,
		revalidate: 60,
	});

	if (!products) {
		notFound();
	}

	const newSearchParams = new URLSearchParams({
		query: searchValue ,
		...(products.pageInfo.endCursor && { after: products.pageInfo.endCursor }),
		...(products.pageInfo.startCursor && { before: products.pageInfo.startCursor }),
	});

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			{products.totalCount && products.totalCount > 0 ? (
				<div>
					<h1 className="pb-8 text-xl font-semibold">Search results for &quot;{searchValue}&quot;:</h1>
					<ProductList products={products.edges.map((e) => e.node)} />
					<Pagination
						pageInfo={{
							basePathname: `/search`,
							hasNextPage: products.pageInfo.hasNextPage,
							hasPreviousPage: products.pageInfo.hasPreviousPage,
							endCursor: products.pageInfo.endCursor || undefined,
							startCursor: products.pageInfo.startCursor || undefined,
							urlSearchParams: newSearchParams,
						}}
					/>
				</div>
			) : (
				<h1 className="mx-auto pb-8 text-center text-xl font-semibold">Nothing found :(</h1>
			)}
		</section>
	);
}
