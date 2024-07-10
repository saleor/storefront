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

type PageProps = {
	params: { channel: string };
	searchParams: { after?: string; before?: string };
};

interface ProductsVariables {
	first?: number;
	after?: string;
	last?: number;
	before?: string;
	channel: string;
}

export default async function Page({ params, searchParams }: PageProps) {
	const cursorAfter = typeof searchParams.after === "string" ? searchParams.after : null;
	const cursorBefore = typeof searchParams.before === "string" ? searchParams.before : null;

	const variables: ProductsVariables = {
		channel: params.channel,
	};

	if (cursorAfter) {
		variables.first = ProductsPerPage;
		variables.after = cursorAfter;
	} else if (cursorBefore) {
		variables.last = ProductsPerPage;
		variables.before = cursorBefore;
	} else {
		variables.first = ProductsPerPage;
	}

	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables,
		revalidate: 60,
	});

	if (!products) {
		notFound();
	}

	const newSearchParams = new URLSearchParams();
	if (products.pageInfo.endCursor) newSearchParams.set("after", products.pageInfo.endCursor);
	if (products.pageInfo.startCursor) newSearchParams.set("before", products.pageInfo.startCursor);

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<h2 className="sr-only">Product list</h2>
			<ProductList products={products.edges.map((e) => e.node)} />
			<Pagination
				pageInfo={{
					basePathname: `/products`,
					hasNextPage: products.pageInfo.hasNextPage,
					hasPreviousPage: products.pageInfo.hasPreviousPage,
					endCursor: products.pageInfo.endCursor || undefined,
					startCursor: products.pageInfo.startCursor || undefined,
					urlSearchParams: newSearchParams,
				}}
			/>
		</section>
	);
}
