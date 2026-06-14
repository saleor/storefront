"use client";

import { useTranslations } from "next-intl";

/** Shared PDP variant-option tooltips and screen-reader fragments. */
export function useVariantOptionLabels() {
	const t = useTranslations("pdp.variant");

	return {
		outOfStockTitle: (name: string) => t("outOfStockTitle", { name }),
		willChangeSelections: (name: string) => t("willChangeSelections", { name }),
		percentOffTitle: (name: string, percent: number) => t("percentOffTitle", { name, percent }),
		outOfStockA11y: () => t("outOfStockA11y"),
		percentOffA11y: (percent: number) => t("percentOffA11y", { percent }),
		selectedA11y: () => t("selectedA11y"),
	};
}
