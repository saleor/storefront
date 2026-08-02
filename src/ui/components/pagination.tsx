"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ariaDisabledClassName, buttonClassName } from "@/ui/components/ui/button";
import { cn } from "@/lib/utils";

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
	const t = useTranslations("common.pagination");

	const nextSearchParams = new URLSearchParams(searchParams);
	nextSearchParams.set("cursor", pageInfo.endCursor ?? "");
	nextSearchParams.set("direction", "next");
	const nextPageUrl = `${pathname}?${nextSearchParams.toString()}`;

	const prevSearchParams = new URLSearchParams(searchParams);
	prevSearchParams.set("cursor", pageInfo.startCursor ?? "");
	prevSearchParams.set("direction", "prev");
	const prevPageUrl = `${pathname}?${prevSearchParams.toString()}`;

	const isPrevDisabled = !pageInfo.hasPreviousPage;
	const isNextDisabled = !pageInfo.hasNextPage;

	const disabledLinkClassName = cn(
		"rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground",
		ariaDisabledClassName,
	);

	return (
		<nav className="flex items-center justify-center gap-x-4 px-4 pt-12">
			<Link
				href={isPrevDisabled ? "#" : prevPageUrl}
				onClick={(e) => isPrevDisabled && e.preventDefault()}
				tabIndex={isPrevDisabled ? -1 : undefined}
				className={
					isPrevDisabled ? disabledLinkClassName : buttonClassName({ asLink: true, className: "px-4 py-2" })
				}
				aria-disabled={isPrevDisabled}
			>
				{t("previous")}
			</Link>

			<Link
				href={isNextDisabled ? "#" : nextPageUrl}
				onClick={(e) => isNextDisabled && e.preventDefault()}
				tabIndex={isNextDisabled ? -1 : undefined}
				className={
					isNextDisabled ? disabledLinkClassName : buttonClassName({ asLink: true, className: "px-4 py-2" })
				}
				aria-disabled={isNextDisabled}
			>
				{t("next")}
			</Link>
		</nav>
	);
}
