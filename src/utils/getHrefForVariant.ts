type Args = {
	productSlug: string;
	variantId: string;
};

export function getHrefForVariant({ productSlug, variantId }: Args): string {
	const pathname = `/products/${encodeURIComponent(productSlug)}`;
	const query = new URLSearchParams({ variant: variantId });
	return `${pathname}?${query.toString()}`;
}
