import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { catalogPathSuffix, redirectToCanonicalCatalogSlug } from "@/lib/catalog/canonical-slug";
import { CatalogIdentityBridge } from "@/lib/catalog/catalog-identity-bridge";
import { getCategoryData } from "@/lib/catalog/get-category-data";
import { buildCatalogPathSuffixByLocale, buildLocaleSlugMap } from "@/lib/catalog/locale-slugs";
import { parseEditorJSToText } from "@/lib/editorjs";
import { buildBrowsePageMetadata } from "@/lib/seo";
import { loadListingView } from "@/lib/listing/load";
import { listingProviderFor } from "@/lib/listing/registry";
import { templates } from "@/config/templates";
import { CategoryHero, PlpListingClient } from "@/ui/components/plp";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { pickTranslatedSlug } from "@/lib/saleor-translations";

// Prefetch: default (auto) under global `partialPrefetching` — App Shell only. Category
// tiles deliberately do not opt into `prefetch={true}`: one runtime prefetch per tile in a
// grid is a large invocation bill for navigation that already feels instant.

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
 * Cached hero + cached first-page grid (params only). Filters swap via `/api/listing`.
 * `searchParams` is awaited only on the rare non-canonical slug redirect.
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
			<templates.plp.Layout
				surface={{ kind: "category", title: category.name, description: plainDescription }}
				slots={{
					header: (
						<CategoryHero
							title={category.name}
							description={plainDescription}
							backgroundImage={category.backgroundImage?.url}
							breadcrumbs={breadcrumbs}
							breadcrumbAriaLabel={tNav("breadcrumbAriaLabel")}
						/>
					),
					results: (
						<Suspense fallback={<templates.plp.Skeleton />}>
							<CategoryProducts params={props.params} />
						</Suspense>
					),
					empty: null,
				}}
			/>
		</>
	);
}

async function CategoryProducts({ params: paramsPromise }: { params: PageProps["params"] }) {
	const params = await paramsPromise;
	const category = await getCategoryData(params.slug, params.channel, params.locale);
	if (!category) {
		notFound();
	}

	const payload = await loadListingView({
		surface: "category",
		locale: params.locale,
		channel: params.channel,
		slug: category.slug,
		view: {},
	});
	if (!payload) {
		notFound();
	}

	return (
		<PlpListingClient
			surface="category"
			locale={params.locale}
			channel={params.channel}
			slug={category.slug}
			products={payload.products}
			pageInfo={payload.pageInfo}
			totalCount={payload.totalCount}
			facetsPlacement={templates.plp.facets}
			providerId={listingProviderFor("category").id}
			sorts={payload.sorts}
		/>
	);
}
