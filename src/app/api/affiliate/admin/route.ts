import { NextRequest } from "next/server";
import {
	createAffiliate,
	getAffiliateByCode,
	listAffiliates,
	listApplications,
	listCommissions,
	updateAffiliate,
	updateApplicationStatus,
	updateCommissionStatus,
} from "@/lib/affiliate/db";

const ADMIN_SECRET = process.env.AFFILIATE_ADMIN_SECRET;

function unauthorized() {
	return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function verifyAdmin(request: NextRequest): boolean {
	if (!ADMIN_SECRET) {
		console.warn("[Affiliate Admin] AFFILIATE_ADMIN_SECRET is not set");
		return false;
	}
	const auth = request.headers.get("authorization");
	if (!auth) return false;
	const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
	return token === ADMIN_SECRET;
}

/**
 * GET /api/affiliate/admin
 *
 * Query params:
 *   - view=affiliates (default) — list all affiliates with stats
 *   - view=commissions — list commissions
 *   - view=applications — list affiliate applications
 *   - affiliate_id=N — filter commissions by affiliate
 *   - status=pending|approved|paid|rejected — filter by status
 *   - limit=50 — pagination limit
 *   - offset=0 — pagination offset
 */
export async function GET(request: NextRequest) {
	if (!verifyAdmin(request)) return unauthorized();

	const params = request.nextUrl.searchParams;
	const view = params.get("view") || "affiliates";

	if (view === "affiliates") {
		const affiliates = listAffiliates();
		return Response.json({ affiliates });
	}

	if (view === "commissions") {
		const affiliateId = params.get("affiliate_id");
		const status = params.get("status");
		const limit = parseInt(params.get("limit") || "50", 10);
		const offset = parseInt(params.get("offset") || "0", 10);

		const result = listCommissions({
			affiliate_id: affiliateId ? parseInt(affiliateId, 10) : undefined,
			status: status || undefined,
			limit: Math.min(limit, 200),
			offset,
		});

		return Response.json(result);
	}

	if (view === "applications") {
		const status = params.get("status");
		const limit = parseInt(params.get("limit") || "50", 10);
		const offset = parseInt(params.get("offset") || "0", 10);

		const result = listApplications({
			status: status || undefined,
			limit: Math.min(limit, 200),
			offset,
		});

		return Response.json(result);
	}

	return Response.json(
		{ error: "Invalid view. Use 'affiliates', 'commissions', or 'applications'." },
		{ status: 400 },
	);
}

/**
 * POST /api/affiliate/admin
 *
 * Body:
 *   - action: "create_affiliate" | "update_affiliate" | "update_commission_status" | "approve_application" | "reject_application"
 *
 * create_affiliate: { code, name, email, commission_rate }
 * update_affiliate: { id, name?, email?, commission_rate?, active? }
 * update_commission_status: { ids: number[], status: "pending" | "approved" | "paid" }
 * approve_application: { application_id, code, commission_rate, notes? }
 * reject_application: { application_id, notes? }
 */
export async function POST(request: NextRequest) {
	if (!verifyAdmin(request)) return unauthorized();

	let body: Record<string, unknown>;
	try {
		body = (await request.json()) as Record<string, unknown>;
	} catch {
		return Response.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const action = body.action as string;

	switch (action) {
		case "create_affiliate": {
			const { code, name, email, commission_rate } = body as {
				code: string;
				name: string;
				email: string;
				commission_rate: number;
			};

			if (!code || !name || !email || !commission_rate) {
				return Response.json(
					{ error: "Missing required fields: code, name, email, commission_rate" },
					{ status: 400 },
				);
			}

			if (commission_rate <= 0 || commission_rate > 1) {
				return Response.json(
					{ error: "commission_rate must be between 0 and 1 (e.g. 0.15 for 15%)" },
					{ status: 400 },
				);
			}

			// Check for duplicate code
			const existing = getAffiliateByCode(code);
			if (existing) {
				return Response.json({ error: `Affiliate code "${code}" already exists` }, { status: 409 });
			}

			const affiliate = createAffiliate({ code, name, email, commission_rate });
			return Response.json({ affiliate }, { status: 201 });
		}

		case "update_affiliate": {
			const { id, ...updates } = body as {
				id: number;
				name?: string;
				email?: string;
				commission_rate?: number;
				active?: boolean;
			};

			if (!id) {
				return Response.json({ error: "Missing required field: id" }, { status: 400 });
			}

			if (
				updates.commission_rate !== undefined &&
				(updates.commission_rate <= 0 || updates.commission_rate > 1)
			) {
				return Response.json({ error: "commission_rate must be between 0 and 1" }, { status: 400 });
			}

			// Remove the action field from updates
			const { action: _, ...cleanUpdates } = updates as Record<string, unknown>;
			const affiliate = updateAffiliate(id, cleanUpdates as Parameters<typeof updateAffiliate>[1]);

			if (!affiliate) {
				return Response.json({ error: "Affiliate not found" }, { status: 404 });
			}

			return Response.json({ affiliate });
		}

		case "update_commission_status": {
			const { ids, status } = body as { ids: number[]; status: string };

			if (!ids?.length || !status) {
				return Response.json({ error: "Missing required fields: ids, status" }, { status: 400 });
			}

			if (!["pending", "approved", "paid"].includes(status)) {
				return Response.json({ error: "Status must be 'pending', 'approved', or 'paid'" }, { status: 400 });
			}

			const updated = updateCommissionStatus(ids, status as "pending" | "approved" | "paid");
			return Response.json({ updated });
		}

		case "approve_application": {
			const { application_id, code, commission_rate, notes } = body as {
				application_id: number;
				code: string;
				commission_rate: number;
				notes?: string;
			};

			if (!application_id || !code || !commission_rate) {
				return Response.json(
					{ error: "Missing required fields: application_id, code, commission_rate" },
					{ status: 400 },
				);
			}

			if (commission_rate <= 0 || commission_rate > 1) {
				return Response.json({ error: "commission_rate must be between 0 and 1" }, { status: 400 });
			}

			// Check code isn't already taken
			const existingCode = getAffiliateByCode(code);
			if (existingCode) {
				return Response.json({ error: `Code "${code}" is already in use` }, { status: 409 });
			}

			// Update application status
			const application = updateApplicationStatus(application_id, "approved", notes);
			if (!application) {
				return Response.json({ error: "Application not found" }, { status: 404 });
			}

			// Create the affiliate record from the application
			const affiliate = createAffiliate({
				code,
				name: application.name,
				email: application.email,
				commission_rate,
			});

			return Response.json({ application, affiliate }, { status: 201 });
		}

		case "reject_application": {
			const { application_id, notes } = body as { application_id: number; notes?: string };

			if (!application_id) {
				return Response.json({ error: "Missing required field: application_id" }, { status: 400 });
			}

			const application = updateApplicationStatus(application_id, "rejected", notes);
			if (!application) {
				return Response.json({ error: "Application not found" }, { status: 404 });
			}

			return Response.json({ application });
		}

		default:
			return Response.json(
				{
					error:
						"Invalid action. Use 'create_affiliate', 'update_affiliate', 'update_commission_status', 'approve_application', or 'reject_application'",
				},
				{ status: 400 },
			);
	}
}
