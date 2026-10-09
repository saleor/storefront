import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { buildBrowsePageMetadata } from "@/lib/seo";
import { getStorefrontContent } from "@/lib/content/server";
import { loadListingView } from "@/lib/listing/load";
import { listingProviderFor } from "@/lib/listing/registry";
import { templates } from "@/config/templates";
import { CategoryHero, PlpListingClient } from "@/ui/components/plp";
import { buildStorefrontPath } from "@/lib/storefront-path";

// Prefetch: default (auto) under global `partialPrefetching` — App Shell only.
// Do not put `prefetch={true}` on header chrome or homepage CTAs (`eslint` bans it).

export async function generateMetadata(props: {
	params: Promise<{ locale: string; channel: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const { surfaces } = await getStorefrontContent(params.channel, params.locale);

	return buildBrowsePageMetadata({
		title: surfaces.products.title,
		description: surfaces.products.description,
		locale: params.locale,
		channel: params.channel,
		pathSuffix: "/products",
	});
}

type PageProps = {
	params: Promise<{ locale: string; channel: string }>;
};

/**
 * Canonical `/products` is params-only — cached first page, no `searchParams`.
 * Filters / sort / cursor swap the grid via `/api/listing` on the client.
 */
export default async function Page(props: PageProps) {
	const params = await props.params;
	const [{ surfaces }, tListing, tNav] = await Promise.all([
		getStorefrontContent(params.channel, params.locale),
		getTranslations({ locale: params.locale, namespace: "productsListing" }),
		getTranslations({ locale: params.locale, namespace: "nav" }),
	]);
	const productsCopy = surfaces.products;

	const breadcrumbs = [
		{ label: tListing("breadcrumbHome"), href: buildStorefrontPath(params.locale, params.channel) },
		{
			label: tListing("breadcrumbProducts"),
			href: buildStorefrontPath(params.locale, params.channel, "/products"),
		},
	];

	return (
		<templates.plp.Layout
			surface={{ kind: "all", title: productsCopy.title, description: productsCopy.description }}
			slots={{
				header: (
					<CategoryHero
						title={productsCopy.title}
						description={productsCopy.description}
						breadcrumbs={breadcrumbs}
						breadcrumbAriaLabel={tNav("breadcrumbAriaLabel")}
					/>
				),
				results: (
					<Suspense fallback={<templates.plp.Skeleton />}>
						<ProductsContent params={props.params} />
					</Suspense>
				),
				empty: null,
			}}
		/>
	);
}

async function ProductsContent({
	params: paramsPromise,
}: {
	params: Promise<{ locale: string; channel: string }>;
}) {
	const params = await paramsPromise;
	const payload = await loadListingView({
		surface: "all",
		locale: params.locale,
		channel: params.channel,
		view: {},
	});

	if (!payload) {
		notFound();
	}

	return (
		<PlpListingClient
			surface="all"
			locale={params.locale}
			channel={params.channel}
			products={payload.products}
			pageInfo={payload.pageInfo}
			totalCount={payload.totalCount}
			enableCategoryFilter
			facetsPlacement={templates.plp.facets}
			providerId={listingProviderFor("all").id}
			sorts={payload.sorts}
		/>
	);
}
