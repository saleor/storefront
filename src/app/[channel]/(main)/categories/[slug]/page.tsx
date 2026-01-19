import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { ProductListByCategoryDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { getPaginatedListVariables } from "@/lib/utils";
import { parseEditorJSToText } from "@/lib/editorjs";
import { CategoryHero, transformToProductCard } from "@/ui/components/plp";
import { buildSortVariables, buildFilterVariables } from "@/ui/components/plp/filter-utils";
import { CategoryPageClient } from "./client";

/**
 * Cached category data for hero section and metadata.
 * Part of the static shell with Cache Components.
 */
async function getCategoryData(slug: string, channel: string) {
	"use cache";
	cacheLife("minutes"); // 5 minute cache
	cacheTag(`category:${slug}`); // Tag for on-demand revalidation

	const { category } = await executeGraphQL(ProductListByCategoryDocument, {
		variables: { slug, channel, first: 1 },
		revalidate: 300,
		withAuth: false, // Public data - no cookies in cache scope
	});

	return category;
}

type PageProps = {
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{
		cursor?: string;
		direction?: string;
		sort?: string;
		price?: string;
		colors?: string;
		sizes?: string;
	}>;
};

export const generateMetadata = async (props: PageProps, parent: ResolvingMetadata): Promise<Metadata> => {
	"use cache";
	cacheLife("minutes");

	const params = await props.params;
	const category = await getCategoryData(params.slug, params.channel);
	const plainDescription = parseEditorJSToText(category?.description);

	return {
		title: `${category?.name || "Category"} | ${category?.seoTitle || (await parent).title?.absolute}`,
		description: category?.seoDescription || plainDescription || category?.seoTitle || category?.name,
	};
};

/**
 * Category page with Cache Components.
 * Hero (cached) renders immediately, product grid (dynamic) streams in.
 */
export default async function Page(props: PageProps) {
	const params = await props.params;
	const category = await getCategoryData(params.slug, params.channel);

	if (!category) {
		notFound();
	}

	const plainDescription = parseEditorJSToText(category.description);

	const breadcrumbs = [
		{ label: "Home", href: `/${params.channel}` },
		{ label: category.name, href: `/${params.channel}/categories/${params.slug}` },
	];

	return (
		<>
			{/* Static shell - cached category data renders immediately */}
			<CategoryHero
				title={category.name}
				description={plainDescription}
				backgroundImage={category.backgroundImage?.url}
				breadcrumbs={breadcrumbs}
			/>
			{/* Dynamic content - streams in via Suspense */}
			<Suspense fallback={<ProductsGridSkeleton />}>
				<CategoryProducts params={props.params} searchParams={props.searchParams} />
			</Suspense>
		</>
	);
}

/**
 * Dynamic category products - reads searchParams at request time.
 */
async function CategoryProducts({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: {
	params: PageProps["params"];
	searchParams: PageProps["searchParams"];
}) {
	const [params, searchParams] = await Promise.all([paramsPromise, searchParamsPromise]);

	const paginationVariables = getPaginatedListVariables({ params: searchParams });
	const sortBy = buildSortVariables(searchParams.sort);
	const filter = buildFilterVariables({ priceRange: searchParams.price });

	const { category } = await executeGraphQL(ProductListByCategoryDocument, {
		variables: {
			slug: params.slug,
			channel: params.channel,
			...paginationVariables,
			sortBy,
			filter,
		},
		revalidate: 300,
		withAuth: false, // Public data - no user cookies needed
	});

	if (!category?.products) {
		notFound();
	}

	const productCards = category.products.edges.map((e) => transformToProductCard(e.node, params.channel));

	return (
		<CategoryPageClient
			products={productCards}
			pageInfo={category.products.pageInfo}
			totalCount={category.products.totalCount ?? productCards.length}
		/>
	);
}

/**
 * Products grid skeleton with delayed visibility.
 * Matches ProductGrid/ProductCard dimensions to prevent layout shift.
 */
function ProductsGridSkeleton() {
	return (
		<div className="mx-auto max-w-7xl animate-skeleton-delayed px-4 py-8 opacity-0 sm:px-6 lg:px-8">
			{/* Matches ProductGrid: grid-cols-2 lg:grid-cols-3 */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="animate-pulse">
						{/* Matches ProductCard: aspect-[3/4] rounded-xl */}
						<div className="mb-4 aspect-[3/4] rounded-xl bg-muted" />
						<div className="space-y-1.5">
							<div className="h-4 w-3/4 rounded bg-muted" />
							<div className="h-4 w-1/2 rounded bg-muted" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
