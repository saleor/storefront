export type Product = {
	name: string;
	slug: string;
	id: string;
	thumbnail?: {
		url: string;
		alt?: string;
	};
	category?: {
		name: string;
	};
	pricing: {
		from: {
			amount: number;
			currency: string;
		};
		to: {
			amount: number;
			currency: string;
		};
	};
};
