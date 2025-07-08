import clsx from "clsx";
import { LinkWithChannel } from "../atoms/LinkWithChannel";

export async function Pagination({
	pageInfo,
}: {
	pageInfo: {
		basePathname: string;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		nextSearchParams?: URLSearchParams;
		prevSearchParams?: URLSearchParams;
	};
}) {
	return (
		<nav className="flex items-center justify-center gap-x-4 border-neutral-200 px-4 pt-12">
			<LinkWithChannel
				href={
					pageInfo.hasPreviousPage ? `${pageInfo.basePathname}?${pageInfo.prevSearchParams?.toString()}` : "#"
				}
				className={clsx("px-4 py-2 text-sm font-medium", {
					"rounded bg-neutral-900 text-white hover:bg-neutral-800": pageInfo.hasPreviousPage,
					"cursor-not-allowed border text-neutral-400": !pageInfo.hasPreviousPage,
					"pointer-events-none": !pageInfo.hasPreviousPage,
				})}
				aria-disabled={!pageInfo.hasPreviousPage}
			>
				Previous
			</LinkWithChannel>

			<LinkWithChannel
				href={
					pageInfo.hasNextPage ? `${pageInfo.basePathname}?${pageInfo.nextSearchParams?.toString()}` : "#"
				}
				className={clsx("px-4 py-2 text-sm font-medium", {
					"rounded bg-neutral-900 text-white hover:bg-neutral-800": pageInfo.hasNextPage,
					"cursor-not-allowed border text-neutral-400": !pageInfo.hasNextPage,
					"pointer-events-none": !pageInfo.hasNextPage,
				})}
				aria-disabled={!pageInfo.hasNextPage}
			>
				Next
			</LinkWithChannel>
		</nav>
	);
}
