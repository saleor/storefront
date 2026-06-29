import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { ProductListByCategoryDocument } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { executePublicGraphQL } from "@/lib/graphql";
import { getCategoryData } from "@/lib/catalog/get-category-data";
import { getPaginatedListVariables } from "@/lib/utils";
import { parseEditorJSToText } from "@/lib/editorjs";
import { buildBrowsePageMetadata } from "@/lib/seo";
import { CategoryHero, PlpPageLoading, ProductsGridSkeleton, toProductCardData } from "@/ui/components/plp";
import { buildSortVariables, buildFilterVariables } from "@/ui/components/plp/filter-utils";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { CategoryPageClient } from "./client";

/** Cached category hero + grid shell. `allow-runtime` pairs with category tiles (prefetch={true}). */
export const prefetch = "allow-runtime";

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
		pathSuffix: `/categories/${encodeURIComponent(params.slug)}`,
	});
};

/**
 * Cached hero shell (params only) + dynamic product grid island (searchParams).
 * Sync page → Suspense → `CategoryShell` so PPR prerenders the hero and the route
 * `loading.tsx` can surface a shell on instant navigations. Matches the products
 * listing page pattern — hero is not blocked behind a full-page Suspense.
 */
export default function Page(props: PageProps) {
	return (
		<Suspense fallback={<PlpPageLoading />}>
			<CategoryShell params={props.params} searchParams={props.searchParams} />
		</Suspense>
	);
}

async function CategoryShell({
	params,
	searchParams,
}: {
	params: PageProps["params"];
	searchParams: PageProps["searchParams"];
}) {
	const resolvedParams = await params;
	const [category, tListing, tNav] = await Promise.all([
		getCategoryData(resolvedParams.slug, resolvedParams.channel, resolvedParams.locale),
		getTranslations({ locale: resolvedParams.locale, namespace: "productsListing" }),
		getTranslations({ locale: resolvedParams.locale, namespace: "nav" }),
	]);

	if (!category) {
		notFound();
	}

	const plainDescription = parseEditorJSToText(category.description);

	const breadcrumbs = [
		{
			label: tListing("breadcrumbHome"),
			href: buildStorefrontPath(resolvedParams.locale, resolvedParams.channel),
		},
		{
			label: category.name,
			href: buildStorefrontPath(
				resolvedParams.locale,
				resolvedParams.channel,
				`/categories/${resolvedParams.slug}`,
			),
		},
	];

	return (
		<>
			<CategoryHero
				title={category.name}
				description={plainDescription}
				backgroundImage={category.backgroundImage?.url}
				breadcrumbs={breadcrumbs}
				breadcrumbAriaLabel={tNav("breadcrumbAriaLabel")}
			/>
			<Suspense fallback={<ProductsGridSkeleton />}>
				<CategoryProducts params={params} searchParams={searchParams} />
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

	const result = await executePublicGraphQL(ProductListByCategoryDocument, {
		variables: {
			slug: params.slug,
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
