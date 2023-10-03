import clsx from "clsx";
import Link from "next/link";

export async function Pagination({
	pageInfo,
}: {
	pageInfo: {
		endCursor?: string | null;
		hasNextPage: boolean;
	};
}) {
	return (
		<nav className="flex items-center justify-center gap-x-4 border-t border-slate-200 px-4">
			<Link
				href={pageInfo.hasNextPage ? `/products?cursor=${pageInfo.endCursor}` : "#"}
				className={clsx("px-4 py-2 text-sm font-medium ", {
					"hover:bg-slate-100": pageInfo.hasNextPage,
					"cursor-not-allowed text-slate-400": !pageInfo.hasNextPage,
				})}
				aria-disabled={!pageInfo.hasNextPage}
			>
				Next page
			</Link>
		</nav>
	);
}
