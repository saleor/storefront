import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SearchIcon } from "lucide-react";
import { listingViewFromRecord, listingViewKey } from "@/lib/catalog/listing-query";
import { loadListingView } from "@/lib/listing/load";
import { listingProviderFor } from "@/lib/listing/registry";
import { templates } from "@/config/templates";
import { SearchCommerceEvent } from "@/ui/components/search-commerce-event";
import { PlpListingClient } from "@/ui/components/plp";
import { buttonClassName } from "@/ui/components/ui/button";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { buildStorefrontPath } from "@/lib/storefront-path";

// Prefetch: default (auto). Search is reached via form submit, not `prefetch={true}` links.

export async function generateMetadata(props: {
	params: Promise<{ locale: string; channel: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const t = await getTranslations({ locale: params.locale, namespace: "search" });

	return {
		title: t("title"),
		description: t("description"),
		robots: { index: false, follow: true },
	};
}

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Static shell. The results island reads `searchParams` inside Suspense.
 * Filters and paging then swap through `/api/listing` (`surface=search`), which is never cached.
 */
export default function Page(props: {
	searchParams: Promise<SearchParams>;
	params: Promise<{ locale: string; channel: string }>;
}) {
	return (
		<Suspense fallback={<templates.plp.Skeleton />}>
			<SearchContent searchParams={props.searchParams} params={props.params} />
		</Suspense>
	);
}

async function SearchContent({
	searchParams: searchParamsPromise,
	params: paramsPromise,
}: {
	searchParams: Promise<SearchParams>;
	params: Promise<{ locale: string; channel: string }>;
}) {
	const [searchParams, params] = await Promise.all([searchParamsPromise, paramsPromise]);
	const t = await getTranslations({ locale: params.locale, namespace: "search" });
	const queryParam = searchParams.query;
	if (!queryParam) notFound();
	const query = Array.isArray(queryParam) ? queryParam.find((value) => value.length > 0) : queryParam;
	if (!query) notFound();
	if (Array.isArray(queryParam)) {
		redirect(
			`${buildStorefrontPath(params.locale, params.channel, "/search")}?query=${encodeURIComponent(query)}`,
		);
	}

	const view = listingViewFromRecord({
		query,
		cursor: searchParams.cursor,
		direction: searchParams.direction,
		sort: typeof searchParams.sort === "string" ? searchParams.sort : undefined,
		price: typeof searchParams.price === "string" ? searchParams.price : undefined,
		colors: typeof searchParams.colors === "string" ? searchParams.colors : undefined,
		sizes: typeof searchParams.sizes === "string" ? searchParams.sizes : undefined,
		categories: typeof searchParams.categories === "string" ? searchParams.categories : undefined,
		page: typeof searchParams.page === "string" ? searchParams.page : undefined,
	});
	const payload = await loadListingView({
		surface: "search",
		locale: params.locale,
		channel: params.channel,
		view,
	});
	if (!payload) notFound();

	const empty = (
		<>
			<SearchCommerceEvent channel={params.channel} zero />
			<EmptyState
				title={t("noResultsTitle", { query })}
				body={t("noResultsBody")}
				browseAllProducts={t("browseAllProducts")}
				goToHomepage={t("goToHomepage")}
			/>
		</>
	);

	return (
		<templates.plp.Layout
			surface={{ kind: "search", title: t("resultsFor", { query }) }}
			slots={{
				header:
					payload.totalCount === 0 ? null : (
						<div className="container-content pt-8">
							<SearchCommerceEvent channel={params.channel} zero={false} />
							<h1 className="text-balance text-h1">{t("resultsFor", { query })}</h1>
							<p className="mt-1 text-sm text-muted-foreground">
								{t("resultCount", { count: payload.totalCount })}
							</p>
						</div>
					),
				results:
					payload.totalCount === 0 ? null : (
						<PlpListingClient
							surface="search"
							locale={params.locale}
							channel={params.channel}
							products={payload.products}
							pageInfo={payload.pageInfo}
							totalCount={payload.totalCount}
							facetsPlacement={templates.plp.facets}
							initialViewKey={listingViewKey(view)}
							providerId={listingProviderFor("search").id}
							sorts={payload.sorts}
						/>
					),
				empty: payload.totalCount === 0 ? empty : null,
			}}
		/>
	);
}

function EmptyState({
	title,
	body,
	browseAllProducts,
	goToHomepage,
}: {
	title: string;
	body: string;
	browseAllProducts: string;
	goToHomepage: string;
}) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
				<SearchIcon className="h-8 w-8 text-muted-foreground" />
			</div>
			<h1 className="text-balance text-h1">{title}</h1>
			<p className="mt-2 max-w-md text-muted-foreground">{body}</p>
			<div className="mt-8 flex flex-col gap-3 sm:flex-row">
				<LinkWithChannel
					href="/products"
					className={buttonClassName({ asLink: true, className: "rounded-lg px-6 py-3" })}
				>
					{browseAllProducts}
				</LinkWithChannel>
				<LinkWithChannel
					href="/"
					className={buttonClassName({
						asLink: true,
						variant: "outline-solid",
						className: "rounded-lg px-6 py-3 hover:bg-muted",
					})}
				>
					{goToHomepage}
				</LinkWithChannel>
			</div>
		</div>
	);
}
