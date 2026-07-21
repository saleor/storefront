import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { ProductListByCollectionDocument, ProductOrderField, OrderDirection } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { executePublicGraphQL } from "@/lib/graphql";
import { catalogPathSuffix, redirectToCanonicalCatalogSlug } from "@/lib/catalog/canonical-slug";
import { CatalogIdentityBridge } from "@/lib/catalog/catalog-identity-bridge";
import { getCollectionData } from "@/lib/catalog/get-collection-data";
import { getPaginatedListVariables } from "@/lib/utils";
import { parseEditorJSToText } from "@/lib/editorjs";
import { buildBrowsePageMetadata } from "@/lib/seo";
import { CategoryHero, ProductsGridSkeleton, toProductCardData } from "@/ui/components/plp";
import { buildSortVariables, buildFilterVariables } from "@/ui/components/plp/filter-utils";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { pickTranslatedSlug } from "@/lib/saleor-translations";
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

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
	const params = await props.params;
	const collection = await getCollectionData(params.slug, params.channel, params.locale);
	const plainDescription = parseEditorJSToText(collection?.description);

	return buildBrowsePageMetadata({
		title: collection?.seoTitle || collection?.name || "Collection",
		description: collection?.seoDescription || plainDescription || collection?.name,
		locale: params.locale,
		channel: params.channel,
		pathSuffix: collection
			? catalogPathSuffix("collections", collection)
			: `/collections/${encodeURIComponent(params.slug)}`,
	});
};

/**
 * Cached hero shell (params only) + dynamic product grid island (searchParams).
 * Matches the products listing page pattern — hero is not blocked behind a full-page Suspense.
 */
export default async function Page(props: PageProps) {
	const params = await props.params;
	const [collection, tListing, tNav] = await Promise.all([
		getCollectionData(params.slug, params.channel, params.locale),
		getTranslations({ locale: params.locale, namespace: "productsListing" }),
		getTranslations({ locale: params.locale, namespace: "nav" }),
	]);

	if (!collection) {
		notFound();
	}

	if (decodeURIComponent(params.slug) !== pickTranslatedSlug(collection)) {
		redirectToCanonicalCatalogSlug({
			locale: params.locale,
			channel: params.channel,
			urlSlug: params.slug,
			kind: "collections",
			entity: collection,
			searchParams: await props.searchParams,
		});
	}

	const plainDescription = parseEditorJSToText(collection.description);
	const collectionPath = catalogPathSuffix("collections", collection);

	const breadcrumbs = [
		{ label: tListing("breadcrumbHome"), href: buildStorefrontPath(params.locale, params.channel) },
		{
			label: collection.name,
			href: buildStorefrontPath(params.locale, params.channel, collectionPath),
		},
	];

	return (
		<>
			<CatalogIdentityBridge kind="collections" primarySlug={collection.slug} />
			<CategoryHero
				title={collection.name}
				description={plainDescription}
				backgroundImage={collection.backgroundImage?.url}
				breadcrumbs={breadcrumbs}
				breadcrumbAriaLabel={tNav("breadcrumbAriaLabel")}
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

	const collection = await getCollectionData(params.slug, params.channel, params.locale);
	if (!collection) {
		notFound();
	}

	const result = await executePublicGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: collection.slug,
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
