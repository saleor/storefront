import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import { ProductListByCollectionDocument, ProductOrderField, OrderDirection } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { executePublicGraphQL } from "@/lib/graphql";
import { getCollectionData } from "@/lib/catalog/get-collection-data";
import { getPaginatedListVariables } from "@/lib/utils";
import { parseEditorJSToText } from "@/lib/editorjs";
import { CategoryHero, ProductsGridSkeleton, toProductCardData } from "@/ui/components/plp";
import { buildSortVariables, buildFilterVariables } from "@/ui/components/plp/filter-utils";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { CollectionPageClient } from "./client";

type PageProps = {
	params: Promise<{ locale: string; slug: string; channel: string }>;
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
	const collection = await getCollectionData(params.slug, params.channel, params.locale);
	const plainDescription = parseEditorJSToText(collection?.description);

	return {
		title: `${collection?.name || "Collection"} | ${collection?.seoTitle || (await parent).title?.absolute}`,
		description: collection?.seoDescription || plainDescription || collection?.seoTitle || collection?.name,
	};
};

/**
 * Cached hero shell (params only) + dynamic product grid island (searchParams).
 * Matches the products listing page pattern — hero is not blocked behind a full-page Suspense.
 */
export default async function Page(props: PageProps) {
	const params = await props.params;
	const collection = await getCollectionData(params.slug, params.channel, params.locale);

	if (!collection) {
		notFound();
	}

	const plainDescription = parseEditorJSToText(collection.description);

	const breadcrumbs = [
		{ label: "Home", href: buildStorefrontPath(params.locale, params.channel) },
		{
			label: collection.name,
			href: buildStorefrontPath(params.locale, params.channel, `/collections/${params.slug}`),
		},
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
				<CollectionProducts params={props.params} searchParams={props.searchParams} />
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
			...graphqlLanguageCodeVariables(params.locale),
		},
	});

	const products = result.ok ? result.data.collection?.products : null;
	if (!products) {
		notFound();
	}

	const productCards = products.edges.map((e) => toProductCardData(e.node, params.locale, params.channel));

	return (
		<CollectionPageClient
			products={productCards}
			pageInfo={products.pageInfo}
			totalCount={products.totalCount ?? productCards.length}
		/>
	);
}
