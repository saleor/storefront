import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductListPaginatedDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { getPaginatedListVariables } from "@/lib/utils";
import { CategoryHero, transformToProductCard } from "@/ui/components/plp";
import { buildSortVariables, buildFilterVariables } from "@/ui/components/plp/filter-utils";
import { resolveCategorySlugsToIds } from "@/ui/components/plp/filter-utils.server";
import { ProductsPageClient } from "./products-client";

export const metadata = {
	title: "Products · Saleor Storefront example",
	description: "All products in Saleor Storefront example",
};

type PageProps = {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{
		cursor?: string | string[];
		direction?: string | string[];
		sort?: string;
		price?: string;
		colors?: string;
		sizes?: string;
		categories?: string;
	}>;
};

/**
 * Products page with Cache Components.
 * Static shell (hero) renders immediately, product grid streams in.
 */
export default async function Page(props: PageProps) {
	const params = await props.params;

	const breadcrumbs = [
		{ label: "Home", href: `/${params.channel}` },
		{ label: "Products", href: `/${params.channel}/products` },
	];

	return (
		<>
			{/* Static shell - renders immediately */}
			<CategoryHero
				title="All Products"
				description="Discover our full collection of premium products."
				breadcrumbs={breadcrumbs}
			/>
			{/* Dynamic content - streams in via Suspense */}
			<Suspense fallback={<ProductsGridSkeleton />}>
				<ProductsContent params={props.params} searchParams={props.searchParams} />
			</Suspense>
		</>
	);
}

/**
 * Dynamic products content - reads searchParams at request time.
 */
async function ProductsContent({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: {
	params: Promise<{ channel: string }>;
	searchParams: PageProps["searchParams"];
}) {
	const [params, searchParams] = await Promise.all([paramsPromise, searchParamsPromise]);

	const paginationVariables = getPaginatedListVariables({ params: searchParams });
	const sortBy = buildSortVariables(searchParams.sort);

	// Parse category slugs from URL and resolve to IDs for server-side filtering
	const categorySlugs = searchParams.categories?.split(",").filter(Boolean) || [];
	const categoryMap = await resolveCategorySlugsToIds(categorySlugs);
	const categoryIds = Array.from(categoryMap.values()).map((c) => c.id);

	const filter = buildFilterVariables({
		priceRange: searchParams.price,
		categoryIds,
	});

	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables: {
			...paginationVariables,
			channel: params.channel,
			sortBy,
			filter,
		},
		revalidate: 300,
	});

	if (!products) {
		notFound();
	}

	const productCards = products.edges.map((e) => transformToProductCard(e.node, params.channel));

	// Build resolved categories array for the client (for active filter display)
	const resolvedCategories = categorySlugs
		.map((slug) => {
			const cat = categoryMap.get(slug);
			return cat ? { slug, id: cat.id, name: cat.name } : null;
		})
		.filter(Boolean) as { slug: string; id: string; name: string }[];

	return (
		<ProductsPageClient
			products={productCards}
			pageInfo={products.pageInfo}
			totalCount={products.totalCount ?? productCards.length}
			resolvedCategories={resolvedCategories}
		/>
	);
}

/**
 * Products grid skeleton with delayed visibility.
 * Prevents flash on fast loads while still showing feedback on slow loads.
 */
function ProductsGridSkeleton() {
	return (
		<div className="mx-auto max-w-7xl animate-skeleton-delayed px-4 py-8 opacity-0 sm:px-6 lg:px-8">
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className="animate-pulse">
						<div className="aspect-square rounded-lg bg-muted" />
						<div className="mt-2 h-4 w-3/4 rounded bg-muted" />
						<div className="mt-1 h-4 w-1/2 rounded bg-muted" />
					</div>
				))}
			</div>
		</div>
	);
}
