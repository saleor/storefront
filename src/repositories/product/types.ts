import { type Product } from "@/entities/Product";

export type FilterOption = {
	label: string;
	value: string;
};

export type Filter = {
	name: string;
	slug: string;
	options: FilterOption[];
};

export interface ProductRepository {
	getAll: (
		query: string,
		filters?: FilterOption[],
		options?: Record<string, any>,
	) => Promise<{
		products: Product[] | null;
		cursor: string | number | null;
		hasNextPage: boolean;
		total: number;
	}>;
	getFilters: () => Promise<{ filters: Filter[] }>;
}

export type ProductHit = {
	objectId: string;
	name: string;
	slug: string;
	thumbnail: string;
	categories: { lvl0: string; lvl1: string; lvl2: string };
	pricing: {
		price: {
			net: number;
			gross: number;
		};
		onSale: boolean;
		discount: {};
		priceUndiscounted: {
			net: number;
			gross: number;
		};
	};
};
