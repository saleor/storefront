import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { searchProducts } from "@/lib/search";
import { SearchResults } from "@/ui/components/search-results";
import { Pagination } from "@/ui/components/pagination";
import { SearchSort } from "./search-sort";
import { SearchIcon } from "lucide-react";

export const metadata = {
	title: "Search products · Saleor Storefront example",
	description: "Search products in Saleor Storefront example",
};

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
	params: Promise<{ channel: string }>;
}) {
	return (
		<section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
	params: Promise<{ channel: string }>;
}) {
	const [searchParams, params] = await Promise.all([searchParamsPromise, paramsPromise]);

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
		redirect(`/${params.channel}/search?query=${encodeURIComponent(query)}`);
	}

	// Parse pagination
	const cursor = Array.isArray(searchParams.cursor) ? searchParams.cursor[0] : searchParams.cursor;
	const direction = searchParams.direction === "backward" ? "backward" : "forward";

	// Parse sort
	const sortParam = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort;
	const sortBy = ["relevance", "price-asc", "price-desc", "name", "newest"].includes(sortParam || "")
		? (sortParam as "relevance" | "price-asc" | "price-desc" | "name" | "newest")
		: "relevance";

	// Search using Saleor
	const result = await searchProducts({
		query,
		channel: params.channel,
		limit: 20,
		cursor,
		direction,
		sortBy,
	});

	const { products, pagination } = result;

	if (pagination.totalCount === 0) {
		return <EmptyState query={query} channel={params.channel} />;
	}

	return (
		<div>
			{/* Header with count and sort */}
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Results for &quot;{query}&quot;</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						{pagination.totalCount} {pagination.totalCount === 1 ? "product" : "products"} found
					</p>
				</div>
				<SearchSort />
			</div>

			{/* Results grid */}
			<SearchResults products={products} channel={params.channel} />

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
			{/* Matches SearchResults: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 */}
			<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="animate-pulse overflow-hidden rounded-lg border border-border bg-card">
						{/* Matches SearchResultCard: aspect-square image + p-4 content */}
						<div className="aspect-square bg-muted" />
						<div className="p-4">
							<div className="mb-1 h-3 w-16 rounded bg-muted" />
							<div className="h-4 w-3/4 rounded bg-muted" />
							<div className="mt-2 h-4 w-20 rounded bg-muted" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function EmptyState({ query, channel }: { query: string; channel: string }) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
				<SearchIcon className="h-8 w-8 text-muted-foreground" />
			</div>
			<h1 className="text-2xl font-semibold">No results for &quot;{query}&quot;</h1>
			<p className="mt-2 max-w-md text-muted-foreground">
				We couldn&apos;t find any products matching your search. Try a different term or browse our
				categories.
			</p>
			<div className="mt-8 flex flex-col gap-3 sm:flex-row">
				<Link
					href={`/${channel}/products`}
					className="hover:bg-primary/90 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors"
				>
					Browse All Products
				</Link>
				<Link
					href={`/${channel}`}
					className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
				>
					Go to Homepage
				</Link>
			</div>
		</div>
	);
}
