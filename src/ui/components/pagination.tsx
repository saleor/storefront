"use client";

import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export function Pagination({
	pageInfo,
}: {
	pageInfo: {
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		endCursor?: string | null;
		startCursor?: string | null;
	};
}) {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Construct next and previous page URLs based on the current search parameters
	// and the pageInfo provided.
	const nextSearchParams = new URLSearchParams(searchParams);
	nextSearchParams.set("cursor", pageInfo.endCursor ?? "");
	nextSearchParams.set("direction", "next");
	const nextPageUrl = `${pathname}?${nextSearchParams.toString()}`;

	const prevSearchParams = new URLSearchParams(searchParams);
	prevSearchParams.set("cursor", pageInfo.startCursor ?? "");
	prevSearchParams.set("direction", "prev");
	const prevPageUrl = `${pathname}?${prevSearchParams.toString()}`;

	return (
		<nav className="flex items-center justify-center gap-x-3 px-4 pb-4 pt-14">
			<Link
				href={pageInfo.hasPreviousPage ? prevPageUrl : "#"}
				className={clsx("rounded-lg px-5 py-2.5 text-sm font-medium transition-all", {
					"border border-white/[0.08] bg-white/[0.04] text-neutral-300 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white":
						pageInfo.hasPreviousPage,
					"cursor-not-allowed border border-white/[0.04] text-neutral-700": !pageInfo.hasPreviousPage,
					"pointer-events-none": !pageInfo.hasPreviousPage,
				})}
				aria-disabled={!pageInfo.hasPreviousPage}
			>
				Previous
			</Link>

			<Link
				href={pageInfo.hasNextPage ? nextPageUrl : "#"}
				className={clsx("rounded-lg px-5 py-2.5 text-sm font-medium transition-all", {
					"border border-white/[0.08] bg-white/[0.04] text-neutral-300 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white":
						pageInfo.hasNextPage,
					"cursor-not-allowed border border-white/[0.04] text-neutral-700": !pageInfo.hasNextPage,
					"pointer-events-none": !pageInfo.hasNextPage,
				})}
				aria-disabled={!pageInfo.hasNextPage}
			>
				Next
			</Link>
		</nav>
	);
}
