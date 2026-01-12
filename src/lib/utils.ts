import { ProductsPerPage } from "@/app/config";
import { clsx, type ClassValue } from "clsx";
import { formatPrice, formatDate as formatLocaleDate } from "@/config/locale";

/** Merge class names with clsx */
export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}

/** @deprecated Use formatDate from @/config/locale instead */
export const formatDate = formatLocaleDate;

/** @deprecated Use formatPrice from @/config/locale instead */
export const formatMoney = formatPrice;

export const formatMoneyRange = (
	range: {
		start?: { amount: number; currency: string } | null;
		stop?: { amount: number; currency: string } | null;
	} | null,
) => {
	const { start, stop } = range || {};
	const startMoney = start && formatMoney(start.amount, start.currency);
	const stopMoney = stop && formatMoney(stop.amount, stop.currency);

	if (startMoney === stopMoney) {
		return startMoney;
	}

	return `${startMoney} - ${stopMoney}`;
};

export function getHrefForVariant({
	productSlug,
	variantId,
}: {
	productSlug: string;
	variantId?: string;
}): string {
	const pathname = `/products/${encodeURIComponent(productSlug)}`;

	if (!variantId) {
		return pathname;
	}

	const query = new URLSearchParams({ variant: variantId });
	return `${pathname}?${query.toString()}`;
}

export type PaginatedListVariables = {
	first?: number;
	after?: string | null;
	last?: number;
	before?: string | null;
};

export const getPaginatedListVariables = ({
	params,
}: {
	params: { [key: string]: unknown };
}): PaginatedListVariables => {
	const cursor = typeof params?.cursor === "string" ? params?.cursor : null;
	const direction = params?.direction === "prev" ? "prev" : "next";

	return direction === "prev"
		? { last: ProductsPerPage, before: cursor }
		: { first: ProductsPerPage, after: cursor };
};
