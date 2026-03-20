import { NextRequest, NextResponse } from "next/server";

// ── Rate limiting ─────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // Max 5 submissions per window per IP

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

// ── Validation ────────────────────────────────────────────────────
const VALID_REASONS = [
	"Product inquiry",
	"Bulk / institutional pricing",
	"Certificate of Analysis request",
	"Shipping question",
	"Returns & refunds",
	"Affiliate program",
	"Other",
] as const;

interface ContactPayload {
	name: string;
	email: string;
	institution?: string;
	reason: string;
	message: string;
}

function validatePayload(body: unknown): { ok: true; data: ContactPayload } | { ok: false; error: string } {
	if (!body || typeof body !== "object") return { ok: false, error: "Invalid request body" };

	const { name, email, institution, reason, message } = body as Record<string, unknown>;

	if (typeof name !== "string" || name.trim().length < 2)
		return { ok: false, error: "Name is required (min 2 characters)" };
	if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
		return { ok: false, error: "A valid email is required" };
	if (typeof reason !== "string" || !VALID_REASONS.includes(reason as (typeof VALID_REASONS)[number]))
		return { ok: false, error: "A valid reason is required" };
	if (typeof message !== "string" || message.trim().length < 10)
		return { ok: false, error: "Message is required (min 10 characters)" };

	return {
		ok: true,
		data: {
			name: name.trim(),
			email: email.trim().toLowerCase(),
			institution: typeof institution === "string" ? institution.trim() : undefined,
			reason,
			message: message.trim(),
		},
	};
}

// ── Handler ───────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
	// Rate limit
	const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
	if (!checkRateLimit(ip)) {
		return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
	}

	// Parse & validate
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const validation = validatePayload(body);
	if (!validation.ok) {
		return NextResponse.json({ error: validation.error }, { status: 400 });
	}

	const { name, email, institution, reason, message } = validation.data;

	// Send email via Resend
	const resendApiKey = process.env.RESEND_API_KEY;
	const contactTo = process.env.CONTACT_EMAIL ?? "support@infinitybiolabs.com";

	if (!resendApiKey) {
		console.error("RESEND_API_KEY is not set — contact form submission dropped");
		return NextResponse.json({ error: "Contact form is temporarily unavailable." }, { status: 503 });
	}

	const institutionLine = institution ? `\nInstitution: ${institution}` : "";

	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${resendApiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from: `InfinityBio Contact <noreply@infinitybiolabs.com>`,
			to: [contactTo],
			reply_to: email,
			subject: `[Contact] ${reason} — ${name}`,
			text: `Name: ${name}\nEmail: ${email}${institutionLine}\nReason: ${reason}\n\n${message}`,
		}),
	});

	if (!res.ok) {
		const errorBody = await res.text();
		console.error("Resend API error:", res.status, errorBody);
		return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 502 });
	}

	return NextResponse.json({ success: true });
}
