import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { ProductListByCategoryDocument } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { executePublicGraphQL } from "@/lib/graphql";
import { catalogPathSuffix, redirectToCanonicalCatalogSlug } from "@/lib/catalog/canonical-slug";
import { CatalogIdentityBridge } from "@/lib/catalog/catalog-identity-bridge";
import { getCategoryData } from "@/lib/catalog/get-category-data";
import { buildCatalogPathSuffixByLocale, buildLocaleSlugMap } from "@/lib/catalog/locale-slugs";
import { getPaginatedListVariables } from "@/lib/utils";
import { parseEditorJSToText } from "@/lib/editorjs";
import { buildBrowsePageMetadata } from "@/lib/seo";
import { CategoryHero, ProductsGridSkeleton, toProductCardData } from "@/ui/components/plp";
import { buildSortVariables, buildFilterVariables } from "@/ui/components/plp/filter-utils";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { pickTranslatedSlug } from "@/lib/saleor-translations";
import { CategoryPageClient } from "./client";

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
	const category = await getCategoryData(params.slug, params.channel, params.locale);
	const plainDescription = parseEditorJSToText(category?.description);

	return buildBrowsePageMetadata({
		title: category?.seoTitle || category?.name || "Category",
		description: category?.seoDescription || plainDescription || category?.name,
		locale: params.locale,
		channel: params.channel,
		pathSuffix: category
			? catalogPathSuffix("categories", category)
			: `/categories/${encodeURIComponent(params.slug)}`,
		pathSuffixByLocale: category
			? buildCatalogPathSuffixByLocale("categories", buildLocaleSlugMap(category))
			: undefined,
	});
};

/**
 * Hybrid PLP — cached hero rendered eagerly into the PPR static shell, only the
 * `searchParams`-driven product grid streams behind a `Suspense` island. The hero comes
 * exclusively from `getCategoryData()` (`"use cache"`), so it prerenders as real content
 * (no page-level `Suspense`, no hero skeleton on the page itself). Matches the products
 * listing page pattern. Route `loading.tsx` (`PlpPageLoading`) remains the height-matched
 * instant-navigation fallback.
 */
export default async function Page(props: PageProps) {
	const resolvedParams = await props.params;
	const [category, tListing, tNav] = await Promise.all([
		getCategoryData(resolvedParams.slug, resolvedParams.channel, resolvedParams.locale),
		getTranslations({ locale: resolvedParams.locale, namespace: "productsListing" }),
		getTranslations({ locale: resolvedParams.locale, namespace: "nav" }),
	]);

	if (!category) {
		notFound();
	}

	if (decodeURIComponent(resolvedParams.slug) !== pickTranslatedSlug(category)) {
		redirectToCanonicalCatalogSlug({
			locale: resolvedParams.locale,
			channel: resolvedParams.channel,
			urlSlug: resolvedParams.slug,
			kind: "categories",
			entity: category,
			searchParams: await props.searchParams,
		});
	}

	const plainDescription = parseEditorJSToText(category.description);
	const categoryPath = catalogPathSuffix("categories", category);

	const breadcrumbs = [
		{
			label: tListing("breadcrumbHome"),
			href: buildStorefrontPath(resolvedParams.locale, resolvedParams.channel),
		},
		{
			label: category.name,
			href: buildStorefrontPath(resolvedParams.locale, resolvedParams.channel, categoryPath),
		},
	];

	return (
		<>
			<CatalogIdentityBridge
				kind="categories"
				primarySlug={category.slug}
				localeSlugs={buildLocaleSlugMap(category)}
			/>
			{/* Static shell — cached hero renders immediately, prerendered into the PPR shell */}
			<CategoryHero
				title={category.name}
				description={plainDescription}
				backgroundImage={category.backgroundImage?.url}
				breadcrumbs={breadcrumbs}
				breadcrumbAriaLabel={tNav("breadcrumbAriaLabel")}
			/>
			{/* Dynamic island — only the searchParams-driven grid streams behind a skeleton */}
			<Suspense fallback={<ProductsGridSkeleton />}>
				<CategoryProducts params={props.params} searchParams={props.searchParams} />
			</Suspense>
		</>
	);
}

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

	// Resolve via cached getCategoryData (handles translated URL slugs), then list by primary slug.
	const category = await getCategoryData(params.slug, params.channel, params.locale);
	if (!category) {
		notFound();
	}

	const result = await executePublicGraphQL(ProductListByCategoryDocument, {
		variables: {
			slug: category.slug,
			channel: params.channel,
			...paginationVariables,
			sortBy,
			filter,
			...graphqlLanguageCodeVariables(params.locale),
		},
	});

	const products = result.ok ? result.data.category?.products : null;
	if (!products) {
		notFound();
	}

	const productCards = products.edges.map((e) => toProductCardData(e.node, params.locale, params.channel));

	return (
		<CategoryPageClient
			products={productCards}
			pageInfo={products.pageInfo}
			totalCount={products.totalCount ?? productCards.length}
		/>
	);
}
