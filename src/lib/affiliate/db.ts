import Database from "better-sqlite3";
import path from "path";
import type { Affiliate, AffiliateApplication, AffiliateWithStats, Commission } from "./types";

// DB path: configurable via env, defaults to ./data/affiliate.db
const DB_PATH = process.env.AFFILIATE_DB_PATH || path.join(process.cwd(), "data", "affiliate.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
	if (_db) return _db;

	// Ensure the data directory exists
	const dir = path.dirname(DB_PATH);
	const fs = require("fs") as typeof import("fs");
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	_db = new Database(DB_PATH);

	// Enable WAL mode for better concurrent read performance
	_db.pragma("journal_mode = WAL");
	_db.pragma("foreign_keys = ON");

	// Create tables if they don't exist
	_db.exec(`
		CREATE TABLE IF NOT EXISTS affiliates (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			code TEXT UNIQUE NOT NULL COLLATE NOCASE,
			name TEXT NOT NULL,
			email TEXT NOT NULL,
			commission_rate REAL NOT NULL CHECK(commission_rate > 0 AND commission_rate <= 1),
			active INTEGER NOT NULL DEFAULT 1,
			created_at TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at TEXT NOT NULL DEFAULT (datetime('now'))
		);

		CREATE TABLE IF NOT EXISTS commissions (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			affiliate_id INTEGER NOT NULL REFERENCES affiliates(id),
			order_id TEXT UNIQUE NOT NULL,
			order_number TEXT NOT NULL,
			order_total REAL NOT NULL,
			discount_amount REAL NOT NULL DEFAULT 0,
			commission_amount REAL NOT NULL,
			currency TEXT NOT NULL DEFAULT 'USD',
			status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'paid')),
			created_at TEXT NOT NULL DEFAULT (datetime('now')),
			paid_at TEXT
		);

		CREATE TABLE IF NOT EXISTS affiliate_applications (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			email TEXT UNIQUE NOT NULL,
			website TEXT NOT NULL DEFAULT '',
			social_media TEXT NOT NULL DEFAULT '',
			promotion_plan TEXT NOT NULL DEFAULT '',
			status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
			admin_notes TEXT,
			created_at TEXT NOT NULL DEFAULT (datetime('now')),
			reviewed_at TEXT
		);

		CREATE INDEX IF NOT EXISTS idx_commissions_affiliate ON commissions(affiliate_id);
		CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);
		CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(code);
		CREATE INDEX IF NOT EXISTS idx_applications_status ON affiliate_applications(status);
		CREATE INDEX IF NOT EXISTS idx_applications_email ON affiliate_applications(email);
	`);

	return _db;
}

// ============================================================================
// Affiliate CRUD
// ============================================================================

export function createAffiliate(data: {
	code: string;
	name: string;
	email: string;
	commission_rate: number;
}): Affiliate {
	const db = getDb();
	const stmt = db.prepare(`
		INSERT INTO affiliates (code, name, email, commission_rate)
		VALUES (@code, @name, @email, @commission_rate)
	`);
	const result = stmt.run(data);
	return getAffiliateById(result.lastInsertRowid as number)!;
}

export function getAffiliateById(id: number): Affiliate | null {
	const db = getDb();
	const row = db.prepare("SELECT * FROM affiliates WHERE id = ?").get(id) as Affiliate | undefined;
	return row ? { ...row, active: Boolean(row.active) } : null;
}

export function getAffiliateByCode(code: string): Affiliate | null {
	const db = getDb();
	const row = db.prepare("SELECT * FROM affiliates WHERE code = ? COLLATE NOCASE").get(code) as
		| Affiliate
		| undefined;
	return row ? { ...row, active: Boolean(row.active) } : null;
}

export function updateAffiliate(
	id: number,
	data: Partial<Pick<Affiliate, "name" | "email" | "commission_rate" | "active">>,
): Affiliate | null {
	const db = getDb();
	const sets: string[] = [];
	const values: Record<string, unknown> = { id };

	if (data.name !== undefined) {
		sets.push("name = @name");
		values.name = data.name;
	}
	if (data.email !== undefined) {
		sets.push("email = @email");
		values.email = data.email;
	}
	if (data.commission_rate !== undefined) {
		sets.push("commission_rate = @commission_rate");
		values.commission_rate = data.commission_rate;
	}
	if (data.active !== undefined) {
		sets.push("active = @active");
		values.active = data.active ? 1 : 0;
	}

	if (sets.length === 0) return getAffiliateById(id);

	sets.push("updated_at = datetime('now')");
	db.prepare(`UPDATE affiliates SET ${sets.join(", ")} WHERE id = @id`).run(values);
	return getAffiliateById(id);
}

export function listAffiliates(): AffiliateWithStats[] {
	const db = getDb();
	return db
		.prepare(
			`
		SELECT
			a.*,
			COALESCE(SUM(c.commission_amount), 0) as total_commissions,
			COALESCE(SUM(CASE WHEN c.status = 'pending' THEN c.commission_amount ELSE 0 END), 0) as pending_amount,
			COALESCE(SUM(CASE WHEN c.status = 'approved' THEN c.commission_amount ELSE 0 END), 0) as approved_amount,
			COALESCE(SUM(CASE WHEN c.status = 'paid' THEN c.commission_amount ELSE 0 END), 0) as paid_amount,
			COUNT(c.id) as order_count
		FROM affiliates a
		LEFT JOIN commissions c ON c.affiliate_id = a.id
		GROUP BY a.id
		ORDER BY a.created_at DESC
	`,
		)
		.all() as AffiliateWithStats[];
}

// ============================================================================
// Commission CRUD
// ============================================================================

export function recordCommission(data: {
	affiliate_id: number;
	order_id: string;
	order_number: string;
	order_total: number;
	discount_amount: number;
	commission_amount: number;
	currency: string;
}): Commission {
	const db = getDb();
	const stmt = db.prepare(`
		INSERT INTO commissions (affiliate_id, order_id, order_number, order_total, discount_amount, commission_amount, currency)
		VALUES (@affiliate_id, @order_id, @order_number, @order_total, @discount_amount, @commission_amount, @currency)
	`);
	const result = stmt.run(data);
	return db.prepare("SELECT * FROM commissions WHERE id = ?").get(result.lastInsertRowid) as Commission;
}

export function getCommissionByOrderId(orderId: string): Commission | null {
	const db = getDb();
	return (db.prepare("SELECT * FROM commissions WHERE order_id = ?").get(orderId) as Commission) || null;
}

export function listCommissions(filters?: {
	affiliate_id?: number;
	status?: string;
	limit?: number;
	offset?: number;
}): { commissions: Commission[]; total: number } {
	const db = getDb();
	const where: string[] = [];
	const values: Record<string, unknown> = {};

	if (filters?.affiliate_id) {
		where.push("c.affiliate_id = @affiliate_id");
		values.affiliate_id = filters.affiliate_id;
	}
	if (filters?.status) {
		where.push("c.status = @status");
		values.status = filters.status;
	}

	const whereClause = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
	const limit = filters?.limit || 50;
	const offset = filters?.offset || 0;

	const total = (
		db.prepare(`SELECT COUNT(*) as count FROM commissions c ${whereClause}`).get(values) as { count: number }
	).count;

	const commissions = db
		.prepare(
			`
		SELECT c.*, a.code as affiliate_code, a.name as affiliate_name
		FROM commissions c
		JOIN affiliates a ON a.id = c.affiliate_id
		${whereClause}
		ORDER BY c.created_at DESC
		LIMIT @limit OFFSET @offset
	`,
		)
		.all({ ...values, limit, offset }) as Commission[];

	return { commissions, total };
}

export function updateCommissionStatus(ids: number[], status: "pending" | "approved" | "paid"): number {
	const db = getDb();
	const placeholders = ids.map(() => "?").join(",");
	const paidAt = status === "paid" ? "datetime('now')" : "NULL";

	const stmt = db.prepare(
		`UPDATE commissions SET status = ?, paid_at = ${paidAt} WHERE id IN (${placeholders})`,
	);
	const result = stmt.run(status, ...ids);
	return result.changes;
}

// ============================================================================
// Affiliate Applications
// ============================================================================

export function createApplication(data: {
	name: string;
	email: string;
	website: string;
	social_media: string;
	promotion_plan: string;
}): AffiliateApplication {
	const db = getDb();
	const stmt = db.prepare(`
		INSERT INTO affiliate_applications (name, email, website, social_media, promotion_plan)
		VALUES (@name, @email, @website, @social_media, @promotion_plan)
	`);
	const result = stmt.run(data);
	return db
		.prepare("SELECT * FROM affiliate_applications WHERE id = ?")
		.get(result.lastInsertRowid) as AffiliateApplication;
}

export function getApplicationByEmail(email: string): AffiliateApplication | null {
	const db = getDb();
	return (
		(db
			.prepare("SELECT * FROM affiliate_applications WHERE email = ? COLLATE NOCASE")
			.get(email) as AffiliateApplication) || null
	);
}

export function listApplications(filters?: { status?: string; limit?: number; offset?: number }): {
	applications: AffiliateApplication[];
	total: number;
} {
	const db = getDb();
	const where: string[] = [];
	const values: Record<string, unknown> = {};

	if (filters?.status) {
		where.push("status = @status");
		values.status = filters.status;
	}

	const whereClause = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
	const limit = filters?.limit || 50;
	const offset = filters?.offset || 0;

	const total = (
		db.prepare(`SELECT COUNT(*) as count FROM affiliate_applications ${whereClause}`).get(values) as {
			count: number;
		}
	).count;

	const applications = db
		.prepare(
			`SELECT * FROM affiliate_applications ${whereClause} ORDER BY created_at DESC LIMIT @limit OFFSET @offset`,
		)
		.all({ ...values, limit, offset }) as AffiliateApplication[];

	return { applications, total };
}

export function updateApplicationStatus(
	id: number,
	status: "approved" | "rejected",
	admin_notes?: string,
): AffiliateApplication | null {
	const db = getDb();
	db.prepare(
		`UPDATE affiliate_applications SET status = ?, admin_notes = ?, reviewed_at = datetime('now') WHERE id = ?`,
	).run(status, admin_notes || null, id);
	return (
		(db.prepare("SELECT * FROM affiliate_applications WHERE id = ?").get(id) as AffiliateApplication) || null
	);
}
