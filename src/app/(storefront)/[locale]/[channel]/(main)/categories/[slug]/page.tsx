import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { ProductListByCategoryDocument } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { executePublicGraphQL } from "@/lib/graphql";
import { getCategoryData } from "@/lib/catalog/get-category-data";
import { getPaginatedListVariables } from "@/lib/utils";
import { parseEditorJSToText } from "@/lib/editorjs";
import { buildBrowsePageMetadata } from "@/lib/seo";
import { CategoryHero, ProductsGridSkeleton, toProductCardData } from "@/ui/components/plp";
import { buildSortVariables, buildFilterVariables } from "@/ui/components/plp/filter-utils";
import { buildStorefrontPath } from "@/lib/storefront-path";
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
		pathSuffix: `/categories/${encodeURIComponent(params.slug)}`,
	});
};

/**
 * Cached hero shell (params only) + dynamic product grid island (searchParams).
 * Matches the products listing page pattern — hero is not blocked behind a full-page Suspense.
 */
export default async function Page(props: PageProps) {
	const params = await props.params;
	const category = await getCategoryData(params.slug, params.channel, params.locale);

	if (!category) {
		notFound();
	}

	const plainDescription = parseEditorJSToText(category.description);

	const breadcrumbs = [
		{ label: "Home", href: buildStorefrontPath(params.locale, params.channel) },
		{
			label: category.name,
			href: buildStorefrontPath(params.locale, params.channel, `/categories/${params.slug}`),
		},
	];

	return (
		<>
			<CategoryHero
				title={category.name}
				description={plainDescription}
				backgroundImage={category.backgroundImage?.url}
				breadcrumbs={breadcrumbs}
			/>
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
