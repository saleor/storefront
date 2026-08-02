"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { isSearchSortValue, SEARCH_SORT_VALUES } from "@/lib/search/sort-options";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/ui/components/ui/dropdown-menu";
import { Button } from "@/ui/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export function SearchSort() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const t = useTranslations("search");
	const tSort = useTranslations("search.sortOptions");

	const rawSort = searchParams.get("sort") || "relevance";
	const currentSort = isSearchSortValue(rawSort) ? rawSort : "relevance";
	const currentLabel = tSort(currentSort);

	const handleSortChange = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value === "relevance") {
			params.delete("sort");
		} else {
			params.set("sort", value);
		}
		// Reset pagination when sort changes
		params.delete("cursor");
		params.delete("direction");
		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline-solid" size="sm" className="gap-2">
					<ArrowUpDown className="h-4 w-4" />
					<span className="hidden sm:inline">{currentLabel}</span>
					<span className="sm:hidden">{t("sort")}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuRadioGroup value={currentSort} onValueChange={handleSortChange}>
					{SEARCH_SORT_VALUES.map((value) => (
						<DropdownMenuRadioItem key={value} value={value}>
							{tSort(value)}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
