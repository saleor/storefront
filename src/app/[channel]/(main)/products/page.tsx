import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductListPaginatedDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { getPaginatedListVariables } from "@/lib/utils";
import { CategoryHero, transformToProductCard } from "@/ui/components/plp";
import { buildSortVariables, buildFilterVariables } from "@/ui/components/plp/filter-utils";
import { resolveCategorySlugsToIds } from "@/ui/components/plp/filter-utils.server";
import { ProductsPageClient } from "./products-client";

export const metadata = {
	title: "Research Compounds | InfinityBio Labs",
	description:
		"Browse our full catalog of pharmaceutical-grade research peptides and biotech compounds. HPLC-verified ≥98% purity, third-party tested, with Certificate of Analysis for every batch.",
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
				title="Research Compounds"
				description="Pharmaceutical-grade peptides and biotech compounds. HPLC-verified ≥98% purity, independently tested, with COA on every order."
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

	const result = await executePublicGraphQL(ProductListPaginatedDocument, {
		variables: {
			...paginationVariables,
			channel: params.channel,
			sortBy,
			filter,
		},
		revalidate: 300,
	});

	if (!result.ok || !result.data.products) {
		notFound();
	}

	const products = result.data.products;
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

function ProductsGridSkeleton() {
	return (
		<div className="min-h-screen bg-neutral-950">
			<div className="mx-auto max-w-7xl animate-skeleton-delayed px-4 py-10 opacity-0 sm:px-6 sm:py-12 lg:px-8">
				<div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<div
							key={i}
							className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.06] bg-neutral-900/60"
						>
							<div className="aspect-[3/4] bg-neutral-800/40" />
							<div className="border-t border-white/[0.05] px-4 py-4">
								<div className="mb-2 h-3 w-16 rounded bg-neutral-800" />
								<div className="mb-3 h-4 w-3/4 rounded bg-neutral-800" />
								<div className="h-4 w-1/3 rounded bg-neutral-800" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
