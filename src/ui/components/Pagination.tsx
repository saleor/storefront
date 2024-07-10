import clsx from "clsx";
import { LinkWithChannel } from "../atoms/LinkWithChannel";

export function Pagination({
	pageInfo,
}: {
	pageInfo: {
		basePathname: string;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		endCursor?: string;
		startCursor?: string;
		urlSearchParams: URLSearchParams;
	};
}) {
	const getNextPageUrl = () => {
		if (!pageInfo.hasNextPage || !pageInfo.endCursor) return "#";
		const params = new URLSearchParams(pageInfo.urlSearchParams.toString());
		params.set("after", pageInfo.endCursor);
		params.delete("before");
		return `${pageInfo.basePathname}?${params.toString()}`;
	};

	const getPreviousPageUrl = () => {
		if (!pageInfo.hasPreviousPage || !pageInfo.startCursor) return "#";
		const params = new URLSearchParams(pageInfo.urlSearchParams.toString());
		params.set("before", pageInfo.startCursor);
		params.delete("after");
		return `${pageInfo.basePathname}?${params.toString()}`;
	};

	return (
		<nav className="flex items-center justify-center gap-x-4 border-neutral-200 px-4 pt-12">
			<LinkWithChannel
				href={getPreviousPageUrl()}
				className={clsx("px-4 py-2 text-sm font-medium", {
					"rounded bg-neutral-900 text-neutral-50 hover:bg-neutral-800": pageInfo.hasPreviousPage,
					"cursor-not-allowed rounded border text-neutral-400": !pageInfo.hasPreviousPage,
					"pointer-events-none": !pageInfo.hasPreviousPage,
				})}
				aria-disabled={!pageInfo.hasPreviousPage}
			>
				Previous
			</LinkWithChannel>
			<span className="px-4 py-2 text-sm font-medium text-neutral-900">Page</span>
			<LinkWithChannel
				href={getNextPageUrl()}
				className={clsx("px-4 py-2 text-sm font-medium", {
					"rounded bg-neutral-900 text-neutral-50 hover:bg-neutral-800": pageInfo.hasNextPage,
					"cursor-not-allowed rounded border text-neutral-400": !pageInfo.hasNextPage,
					"pointer-events-none": !pageInfo.hasNextPage,
				})}
				aria-disabled={!pageInfo.hasNextPage}
			>
				Next
			</LinkWithChannel>
		</nav>
	);
}
