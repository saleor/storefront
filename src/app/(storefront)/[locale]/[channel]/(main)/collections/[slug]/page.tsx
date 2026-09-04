import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { OrderDirection, ProductOrderField } from "@/gql/graphql";
import { catalogPathSuffix, redirectToCanonicalCatalogSlug } from "@/lib/catalog/canonical-slug";
import { CatalogIdentityBridge } from "@/lib/catalog/catalog-identity-bridge";
import { getCollectionData } from "@/lib/catalog/get-collection-data";
import { getCollectionListingPage } from "@/lib/catalog/get-product-listing";
import { buildCatalogPathSuffixByLocale, buildLocaleSlugMap } from "@/lib/catalog/locale-slugs";
import { parseEditorJSToText } from "@/lib/editorjs";
import { buildBrowsePageMetadata } from "@/lib/seo";
import { CategoryHero, PlpListingClient, ProductsGridSkeleton, toProductCardData } from "@/ui/components/plp";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { pickTranslatedSlug } from "@/lib/saleor-translations";

// Prefetch: default (auto) under global `partialPrefetching` — App Shell only until a
// caller opts in with `prefetch={true}` (no collection-destination links do today).

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
		pathSuffixByLocale: collection
			? buildCatalogPathSuffixByLocale("collections", buildLocaleSlugMap(collection))
			: undefined,
	});
};

/**
 * Cached hero + cached first-page grid (params only). Filters swap via `/api/listing`.
 * `searchParams` is awaited only on the rare non-canonical slug redirect.
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
			<CatalogIdentityBridge
				kind="collections"
				primarySlug={collection.slug}
				localeSlugs={buildLocaleSlugMap(collection)}
			/>
			<CategoryHero
				title={collection.name}
				description={plainDescription}
				backgroundImage={collection.backgroundImage?.url}
				breadcrumbs={breadcrumbs}
				breadcrumbAriaLabel={tNav("breadcrumbAriaLabel")}
			/>
			<Suspense fallback={<ProductsGridSkeleton />}>
				<CollectionProducts params={props.params} />
			</Suspense>
		</>
	);
}

async function CollectionProducts({ params: paramsPromise }: { params: PageProps["params"] }) {
	const params = await paramsPromise;
	const collection = await getCollectionData(params.slug, params.channel, params.locale);
	if (!collection) {
		notFound();
	}

	const products = await getCollectionListingPage(collection.slug, params.channel, params.locale, {
		field: ProductOrderField.Collection,
		direction: OrderDirection.Asc,
	});
	if (!products) {
		notFound();
	}

	const productCards = products.edges.map((e) => toProductCardData(e.node, params.locale, params.channel));

	return (
		<PlpListingClient
			surface="collection"
			locale={params.locale}
			channel={params.channel}
			slug={collection.slug}
			products={productCards}
			pageInfo={products.pageInfo}
			totalCount={products.totalCount ?? productCards.length}
		/>
	);
}
