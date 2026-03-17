export interface Affiliate {
	id: number;
	code: string;
	name: string;
	email: string;
	commission_rate: number; // 0.0–1.0 (e.g. 0.15 = 15%)
	active: boolean;
	created_at: string;
	updated_at: string;
}

export interface Commission {
	id: number;
	affiliate_id: number;
	order_id: string;
	order_number: string;
	order_total: number;
	discount_amount: number;
	commission_amount: number;
	currency: string;
	status: "pending" | "approved" | "paid";
	created_at: string;
	paid_at: string | null;
}

export interface AffiliateWithStats extends Affiliate {
	total_commissions: number;
	pending_amount: number;
	approved_amount: number;
	paid_amount: number;
	order_count: number;
}

export interface AffiliateApplication {
	id: number;
	name: string;
	email: string;
	website: string;
	social_media: string;
	promotion_plan: string;
	status: "pending" | "approved" | "rejected";
	admin_notes: string | null;
	created_at: string;
	reviewed_at: string | null;
}
