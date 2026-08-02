import { formatPrice } from "./utils";
import type { ProductCardData } from "./product-card-data";

export function formatProductPrice(
	product: Pick<ProductCardData, "price" | "priceStop" | "currency" | "localeBcp47">,
): string {
	const start = formatPrice(product.price, product.currency, product.localeBcp47);

	if (product.priceStop != null && product.priceStop !== product.price) {
		return `${start} - ${formatPrice(product.priceStop, product.currency, product.localeBcp47)}`;
	}

	return start;
}
