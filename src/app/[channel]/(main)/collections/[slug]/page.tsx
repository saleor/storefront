import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { getPaginatedListVariables } from "@/lib/utils";
import { parseEditorJSToText } from "@/lib/editorjs";
import { CategoryHero, transformToProductCard } from "@/ui/components/plp";
import { buildSortVariables, buildFilterVariables } from "@/ui/components/plp/filter-utils";
import { CollectionPageClient } from "./client";

/**
 * Cached collection data for hero section and metadata.
 * Part of the static shell with Cache Components.
 */
async function getCollectionData(slug: string, channel: string) {
	"use cache";
	cacheLife("minutes"); // 5 minute cache
	cacheTag(`collection:${slug}`); // Tag for on-demand revalidation

	const { collection } = await executeGraphQL(ProductListByCollectionDocument, {
		variables: { slug, channel, first: 1 },
		revalidate: 300,
		withAuth: false, // Public data - no cookies in cache scope
	});

	return collection;
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
	const collection = await getCollectionData(params.slug, params.channel);
	const plainDescription = parseEditorJSToText(collection?.description);

	return {
		title: `${collection?.name || "Collection"} | ${collection?.seoTitle || (await parent).title?.absolute}`,
		description: collection?.seoDescription || plainDescription || collection?.seoTitle || collection?.name,
	};
};

/**
 * Collection page with Cache Components.
 * Hero (cached) renders immediately, product grid (dynamic) streams in.
 */
export default async function Page(props: PageProps) {
	const params = await props.params;
	const collection = await getCollectionData(params.slug, params.channel);

	if (!collection) {
		notFound();
	}

	const plainDescription = parseEditorJSToText(collection.description);

	const breadcrumbs = [
		{ label: "Home", href: `/${params.channel}` },
		{ label: collection.name, href: `/${params.channel}/collections/${params.slug}` },
	];

	return (
		<>
			{/* Static shell - cached collection data renders immediately */}
			<CategoryHero
				title={collection.name}
				description={plainDescription}
				backgroundImage={collection.backgroundImage?.url}
				breadcrumbs={breadcrumbs}
			/>
			{/* Dynamic content - streams in via Suspense */}
			<Suspense fallback={<ProductsGridSkeleton />}>
				<CollectionProducts params={props.params} searchParams={props.searchParams} />
			</Suspense>
		</>
	);
}

/**
 * Dynamic collection products - reads searchParams at request time.
 */
async function CollectionProducts({
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

	const { collection } = await executeGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: params.slug,
			channel: params.channel,
			...paginationVariables,
			sortBy,
			filter,
		},
		revalidate: 300,
	});

	if (!collection?.products) {
		notFound();
	}

	const productCards = collection.products.edges.map((e) => transformToProductCard(e.node, params.channel));

	return (
		<CollectionPageClient
			products={productCards}
			pageInfo={collection.products.pageInfo}
			totalCount={collection.products.totalCount ?? productCards.length}
		/>
	);
}

function ProductsGridSkeleton() {
	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
