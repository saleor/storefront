import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { buildBrowsePageMetadata } from "@/lib/seo";
import { getProductListingPage } from "@/lib/catalog/get-product-listing";
import { getStorefrontContent } from "@/lib/content/server";
import { CategoryHero, PlpListingClient, toProductCardData } from "@/ui/components/plp";
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
		<>
			<CategoryHero
				title={productsCopy.title}
				description={productsCopy.description}
				breadcrumbs={breadcrumbs}
				breadcrumbAriaLabel={tNav("breadcrumbAriaLabel")}
			/>
			<Suspense fallback={<ProductsGridSkeletonFallback />}>
				<ProductsContent params={props.params} />
			</Suspense>
		</>
	);
}

async function ProductsContent({
	params: paramsPromise,
}: {
	params: Promise<{ locale: string; channel: string }>;
}) {
	const params = await paramsPromise;
	const products = await getProductListingPage(params.channel, params.locale, undefined);

	if (!products) {
		notFound();
	}
	const productCards = products.edges.map((e) => toProductCardData(e.node, params.locale, params.channel));

	return (
		<PlpListingClient
			surface="all"
			locale={params.locale}
			channel={params.channel}
			products={productCards}
			pageInfo={products.pageInfo}
			totalCount={products.totalCount ?? productCards.length}
			enableCategoryFilter
		/>
	);
}

function ProductsGridSkeletonFallback() {
	return (
		<div className="container-content animate-skeleton-delayed py-8 opacity-0">
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
