import { formatPrice } from "./utils";
import type { ProductCardData } from "./product-card-data";

export function formatProductPrice(
	product: Pick<ProductCardData, "price" | "priceStop" | "currency">,
): string {
	const start = formatPrice(product.price, product.currency);

	if (product.priceStop != null && product.priceStop !== product.price) {
		return `${start} - ${formatPrice(product.priceStop, product.currency)}`;
	}

	return start;
}
