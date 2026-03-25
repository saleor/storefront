import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { searchProducts } from "@/lib/search";
import { SearchResults } from "@/ui/components/search-results";
import { Pagination } from "@/ui/components/pagination";
import { SearchSort } from "./search-sort";
import { SearchIcon } from "lucide-react";

export const metadata = {
	title: "Search | InfinityBio Labs",
	description: "Search our catalog of pharmaceutical-grade research peptides and biotech compounds.",
};

type SearchParams = {
	query?: string | string[];
	cursor?: string | string[];
	direction?: string | string[];
	sort?: string | string[];
};

export default function Page(props: {
	searchParams: Promise<SearchParams>;
	params: Promise<{ channel: string }>;
}) {
	return (
		<div className="min-h-[70vh] bg-neutral-950">
			<section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<Suspense fallback={<SearchSkeleton />}>
					<SearchContent searchParams={props.searchParams} params={props.params} />
				</Suspense>
			</section>
		</div>
	);
}

async function SearchContent({
	searchParams: searchParamsPromise,
	params: paramsPromise,
}: {
	searchParams: Promise<SearchParams>;
	params: Promise<{ channel: string }>;
}) {
	const [searchParams, params] = await Promise.all([searchParamsPromise, paramsPromise]);

	const queryParam = searchParams.query;
	if (!queryParam) {
		notFound();
	}

	const query = Array.isArray(queryParam) ? queryParam.find((v) => v.length > 0) : queryParam;

	if (!query) {
		notFound();
	}

	if (Array.isArray(queryParam)) {
		redirect(`/${params.channel}/search?query=${encodeURIComponent(query)}`);
	}

	const cursor = Array.isArray(searchParams.cursor) ? searchParams.cursor[0] : searchParams.cursor;
	const direction = searchParams.direction === "backward" ? "backward" : "forward";

	const sortParam = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort;
	const sortBy = ["relevance", "price-asc", "price-desc", "name", "newest"].includes(sortParam || "")
		? (sortParam as "relevance" | "price-asc" | "price-desc" | "name" | "newest")
		: "relevance";

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
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-white">Results for &quot;{query}&quot;</h1>
					<p className="mt-1 text-sm text-neutral-400">
						{pagination.totalCount} {pagination.totalCount === 1 ? "product" : "products"} found
					</p>
				</div>
				<SearchSort />
			</div>

			<SearchResults products={products} channel={params.channel} />

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

function SearchSkeleton() {
	return (
		<div className="animate-skeleton-delayed opacity-0">
			<div className="mb-8">
				<div className="h-8 w-64 animate-pulse rounded bg-neutral-800" />
				<div className="mt-2 h-4 w-32 animate-pulse rounded bg-neutral-800" />
			</div>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<div
						key={i}
						className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.06] bg-neutral-800/40"
					>
						<div className="aspect-square bg-neutral-800" />
						<div className="p-4">
							<div className="mb-1 h-3 w-16 rounded bg-neutral-800" />
							<div className="h-4 w-3/4 rounded bg-neutral-800" />
							<div className="mt-2 h-4 w-20 rounded bg-neutral-800" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function EmptyState({ query, channel }: { query: string; channel: string }) {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-center">
			<div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-800/60">
				<SearchIcon className="h-8 w-8 text-neutral-500" />
			</div>
			<h1 className="text-2xl font-semibold text-white">No results for &quot;{query}&quot;</h1>
			<p className="mt-3 max-w-md text-neutral-400">
				We couldn&apos;t find any products matching your search. Try a different term or browse our
				categories.
			</p>
			<div className="mt-8 flex flex-col gap-3 sm:flex-row">
				<Link
					href={`/${channel}/products`}
					className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:shadow-xl"
				>
					Browse All Products
				</Link>
				<Link
					href={`/${channel}`}
					className="inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/[0.08] hover:text-white"
				>
					Go to Homepage
				</Link>
			</div>
		</div>
	);
}
