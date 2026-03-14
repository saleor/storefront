import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import { ProductListByCollectionDocument, ProductOrderField, OrderDirection } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { getPaginatedListVariables } from "@/lib/utils";
import { parseEditorJSToText } from "@/lib/editorjs";
import { CategoryHero, transformToProductCard } from "@/ui/components/plp";
import { buildSortVariables, buildFilterVariables } from "@/ui/components/plp/filter-utils";
import { CollectionPageClient } from "./client";

async function getCollectionData(slug: string, channel: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.collections, slug);

	const result = await executePublicGraphQL(ProductListByCollectionDocument, {
		variables: { slug, channel, first: 1 },
		revalidate: 300,
	});

	if (!result.ok) {
		console.error(`[getCollectionData] Failed to fetch collection ${slug}:`, result.error.message);
		return null;
	}

	return result.data.collection;
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
	const params = await props.params;
	const collection = await getCollectionData(params.slug, params.channel);
	const plainDescription = parseEditorJSToText(collection?.description);

	return {
		title: `${collection?.name || "Collection"} | ${collection?.seoTitle || (await parent).title?.absolute}`,
		description: collection?.seoDescription || plainDescription || collection?.seoTitle || collection?.name,
	};
};

/**
 * Sync page shell with dedicated Suspense boundary.
 * Cached hero + dynamic product grid stream inside this boundary,
 * not through the layout's main Suspense.
 */
export default function Page(props: PageProps) {
	return (
		<Suspense fallback={<PageSkeleton />}>
			<CollectionContent params={props.params} searchParams={props.searchParams} />
		</Suspense>
	);
}

async function CollectionContent({
	params: paramsPromise,
	searchParams,
}: {
	params: PageProps["params"];
	searchParams: PageProps["searchParams"];
}) {
	const params = await paramsPromise;
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
			<CategoryHero
				title={collection.name}
				description={plainDescription}
				backgroundImage={collection.backgroundImage?.url}
				breadcrumbs={breadcrumbs}
			/>
			<Suspense fallback={<ProductsGridSkeleton />}>
				<CollectionProducts params={paramsPromise} searchParams={searchParams} />
			</Suspense>
		</>
	);
}

async function CollectionProducts({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: {
	params: PageProps["params"];
	searchParams: PageProps["searchParams"];
}) {
	const [params, searchParams] = await Promise.all([paramsPromise, searchParamsPromise]);

	const paginationVariables = getPaginatedListVariables({ params: searchParams });
	const sortBy = buildSortVariables(searchParams.sort) ?? {
		field: ProductOrderField.Collection,
		direction: OrderDirection.Asc,
	};
	const filter = buildFilterVariables({ priceRange: searchParams.price });

	const result = await executePublicGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: params.slug,
			channel: params.channel,
			...paginationVariables,
			sortBy,
			filter,
		},
		revalidate: 300,
	});

	const products = result.ok ? result.data.collection?.products : null;
	if (!products) {
		notFound();
	}

	const productCards = products.edges.map((e) => transformToProductCard(e.node, params.channel));

	return (
		<CollectionPageClient
			products={productCards}
			pageInfo={products.pageInfo}
			totalCount={products.totalCount ?? productCards.length}
		/>
	);
}

function PageSkeleton() {
	return (
		<div className="animate-skeleton-delayed opacity-0">
			<div className="bg-muted px-4 py-12 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<div className="bg-muted-foreground/10 h-8 w-48 animate-pulse rounded" />
					<div className="bg-muted-foreground/10 mt-3 h-4 w-96 max-w-full animate-pulse rounded" />
				</div>
			</div>
			<ProductsGridSkeleton />
		</div>
	);
}

function ProductsGridSkeleton() {
	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="animate-pulse">
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
