import { NextRequest } from "next/server";
import { createApplication, getApplicationByEmail } from "@/lib/affiliate/db";

// ============================================================================
// Rate limiting (in-memory, same pattern as revalidate route)
// ============================================================================

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 3; // Max 3 applications per window per IP

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
	const now = Date.now();
	const entry = rateLimitStore.get(ip);
	if (!entry || entry.resetTime < now) {
		rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
		return true;
	}
	if (entry.count >= RATE_LIMIT_MAX) return false;
	entry.count++;
	return true;
}

// ============================================================================
// Validation
// ============================================================================

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 1000;

function sanitize(value: unknown, maxLen = MAX_FIELD_LENGTH): string {
	if (typeof value !== "string") return "";
	return value.trim().slice(0, maxLen);
}

/**
 * POST /api/affiliate/apply
 *
 * Public endpoint for affiliate program applications.
 * Rate-limited to prevent spam.
 *
 * Body: { name, email, website?, social_media?, promotion_plan }
 */
export async function POST(request: NextRequest) {
	// Rate limit
	const ip =
		request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
		request.headers.get("x-real-ip") ||
		"unknown";

	if (!checkRateLimit(ip)) {
		return Response.json(
			{ error: "Too many requests. Please try again later." },
			{ status: 429, headers: { "Retry-After": "900" } },
		);
	}

	let body: Record<string, unknown>;
	try {
		body = (await request.json()) as Record<string, unknown>;
	} catch {
		return Response.json({ error: "Invalid request body" }, { status: 400 });
	}

	// Validate required fields
	const name = sanitize(body.name, 200);
	const email = sanitize(body.email, 200).toLowerCase();
	const website = sanitize(body.website, 500);
	const social_media = sanitize(body.social_media, 500);
	const promotion_plan = sanitize(body.promotion_plan);

	const errors: string[] = [];
	if (!name) errors.push("Name is required");
	if (!email || !EMAIL_RE.test(email)) errors.push("A valid email is required");
	if (!promotion_plan) errors.push("Please describe how you plan to promote our products");

	if (errors.length > 0) {
		return Response.json({ error: errors.join(". ") }, { status: 400 });
	}

	// Check for duplicate email
	const existing = getApplicationByEmail(email);
	if (existing) {
		if (existing.status === "pending") {
			return Response.json(
				{ error: "An application with this email is already under review." },
				{ status: 409 },
			);
		}
		if (existing.status === "approved") {
			return Response.json(
				{ error: "This email is already registered in our affiliate program." },
				{ status: 409 },
			);
		}
		// If rejected, allow re-application (they might have updated their approach)
	}

	try {
		const application = createApplication({ name, email, website, social_media, promotion_plan });

		console.log(`[Affiliate] New application from ${name} (${email})`);

		return Response.json(
			{
				ok: true,
				message:
					"Your application has been submitted. We'll review it and get back to you within a few business days.",
				application_id: application.id,
			},
			{ status: 201 },
		);
	} catch (error) {
		// Handle unique constraint violation (race condition on duplicate email)
		if (error instanceof Error && error.message.includes("UNIQUE constraint")) {
			return Response.json({ error: "An application with this email already exists." }, { status: 409 });
		}
		console.error("[Affiliate] Application error:", error);
		return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
	}
}
