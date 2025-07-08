import { notFound } from "next/navigation";
import { ProductListPaginatedDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";
import { ProductsPerPage } from "@/app/config";

export const metadata = {
	title: "Products · Saleor Storefront example",
	description: "All products in Saleor Storefront example",
};

type ProductListPaginatedVars = {
	channel: string;
	first?: number;
	after?: string | null;
	last?: number;
	before?: string | null;
};

export default async function Page(props: {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{
		cursor?: string | string[];
		direction?: string | string[];
	}>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;

	const cursor = typeof searchParams.cursor === "string" ? searchParams.cursor : null;
	const direction = searchParams.direction === "prev" ? "prev" : "next";

	const variables: ProductListPaginatedVars =
		direction === "prev"
			? { last: ProductsPerPage, before: cursor, channel: params.channel }
			: { first: ProductsPerPage, after: cursor, channel: params.channel };

	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables,
		revalidate: 60,
	});

	if (!products) {
		notFound();
	}

	const nextSearchParams = new URLSearchParams({
		cursor: products.pageInfo.endCursor ?? "",
		direction: "next",
	});

	const prevSearchParams = new URLSearchParams({
		cursor: products.pageInfo.startCursor ?? "",
		direction: "prev",
	});

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<h2 className="sr-only">Product list</h2>
			<ProductList products={products.edges.map((e) => e.node)} />
			<Pagination
				pageInfo={{
					basePathname: `/products`,
					hasNextPage: products.pageInfo.hasNextPage,
					hasPreviousPage: products.pageInfo.hasPreviousPage,
					nextSearchParams,
					prevSearchParams,
				}}
			/>
		</section>
	);
}
