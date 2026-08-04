"use client";

import { useTranslations } from "next-intl";

interface PlpEmptyFilterResultsProps {
	onClear: () => void;
}

/** Localized empty state when server-side PLP filters return no products. */
export function PlpEmptyFilterResults({ onClear }: PlpEmptyFilterResultsProps) {
	const t = useTranslations("plp");

	return (
		<div className="py-12 text-center">
			<p className="text-lg text-muted-foreground">{t("noMatchingFilters")}</p>
			<button
				type="button"
				onClick={onClear}
				className="mt-4 text-sm font-medium text-foreground underline underline-offset-4"
			>
				{t("clearAll")}
			</button>
		</div>
	);
}
