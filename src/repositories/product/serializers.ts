import { type ProductHit } from "./types";
import { type Product } from "@/entities/Product";

export const algoliaToProductSerializer = (hit: ProductHit): Product => {
	const { name, thumbnail, pricing, slug, objectId, categories } = hit;

	return {
		id: objectId,
		name,
		slug,
		category: { name: categories["lvl0"] },
		thumbnail: { url: thumbnail, alt: name },
		pricing: {
			from: {
				amount: pricing.price.net,
				currency: "USD",
			},
			to: {
				amount: pricing.price.gross,
				currency: "USD",
			},
		},
	};
};
