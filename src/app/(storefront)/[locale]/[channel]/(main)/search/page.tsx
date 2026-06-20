import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { searchProducts, parseSearchSortParam } from "@/lib/search";
import { SearchResults } from "@/ui/components/search-results";
import { Pagination } from "@/ui/components/pagination";
import { ProductsGridSkeleton } from "@/ui/components/plp";
import { SearchSort } from "./search-sort";
import { SearchIcon } from "lucide-react";
import { buttonClassName } from "@/ui/components/ui/button";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { buildStorefrontPath } from "@/lib/storefront-path";

/**
 * Search results are query-dependent and thin — keep them out of the index.
 * Title falls back to the brand template (`%s | Saleor Store`).
 */
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

type SearchParams = {
	query?: string | string[];
	cursor?: string | string[];
	direction?: string | string[];
	sort?: string | string[];
};

/**
 * Search page with Cache Components.
 * Static shell renders immediately, search results stream in.
 */
export default function Page(props: {
	searchParams: Promise<SearchParams>;
	params: Promise<{ locale: string; channel: string }>;
}) {
	return (
		<section className="container-content py-8">
			<Suspense fallback={<SearchSkeleton />}>
				<SearchContent searchParams={props.searchParams} params={props.params} />
			</Suspense>
		</section>
	);
}

/**
 * Dynamic search content - reads searchParams at request time.
 */
async function SearchContent({
	searchParams: searchParamsPromise,
	params: paramsPromise,
}: {
	searchParams: Promise<SearchParams>;
	params: Promise<{ locale: string; channel: string }>;
}) {
	const [searchParams, params] = await Promise.all([searchParamsPromise, paramsPromise]);
	const t = await getTranslations({ locale: params.locale, namespace: "search" });

	// Extract and validate query
	const queryParam = searchParams.query;
	if (!queryParam) {
		notFound();
	}

	// Handle array values (redirect to first valid)
	const query = Array.isArray(queryParam) ? queryParam.find((v) => v.length > 0) : queryParam;

	if (!query) {
		notFound();
	}

	if (Array.isArray(queryParam)) {
		redirect(
			`${buildStorefrontPath(params.locale, params.channel, "/search")}?query=${encodeURIComponent(query)}`,
		);
	}

	// Parse pagination
	const cursor = Array.isArray(searchParams.cursor) ? searchParams.cursor[0] : searchParams.cursor;
	const direction = searchParams.direction === "backward" ? "backward" : "forward";

	// Parse sort
	const sortParam = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort;
	const sortBy = parseSearchSortParam(sortParam);

	// Search using Saleor
	const result = await searchProducts({
		query,
		channel: params.channel,
		locale: params.locale,
		limit: 20,
		cursor,
		direction,
		sortBy,
	});

	const { products, pagination } = result;

	if (pagination.totalCount === 0) {
		return (
			<EmptyState
				title={t("noResultsTitle", { query })}
				body={t("noResultsBody")}
				browseAllProducts={t("browseAllProducts")}
				goToHomepage={t("goToHomepage")}
			/>
		);
	}

	return (
		<div>
			{/* Header with count and sort */}
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-balance text-h1">{t("resultsFor", { query })}</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						{t("resultCount", { count: pagination.totalCount })}
					</p>
				</div>
				<SearchSort />
			</div>

			{/* Results grid */}
			<SearchResults products={products} />

			{/* Pagination */}
			{(pagination.hasNextPage || pagination.hasPreviousPage) && (
				<Pagination
					pageInfo={{
						hasNextPage: pagination.hasNextPage ?? false,
						hasPreviousPage: pagination.hasPreviousPage ?? false,
						startCursor: pagination.prevCursor,
						endCursor: pagination.nextCursor,
					}}
				/>
			)}
		</div>
	);
}

/**
 * Search skeleton with delayed visibility.
 * Matches SearchResults/SearchResultCard dimensions to prevent layout shift.
 */
function SearchSkeleton() {
	return (
		<div className="animate-skeleton-delayed opacity-0">
			<div className="mb-8">
				<div className="h-8 w-64 animate-pulse rounded bg-muted" />
				<div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
			</div>
			<ProductsGridSkeleton className="mx-0 max-w-none px-0 py-0" desktopColumns={3} itemCount={6} />
		</div>
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
