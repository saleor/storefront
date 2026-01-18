import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Webhook endpoint for cache invalidation.
 *
 * Configure in Saleor Dashboard:
 * 1. Go to Configuration → Webhooks
 * 2. Create webhook pointing to: https://your-site.com/api/revalidate
 * 3. Select events: PRODUCT_UPDATED, CATEGORY_UPDATED, etc.
 * 4. Copy the secret key and set as SALEOR_WEBHOOK_SECRET env var
 *
 * Security:
 * - Verifies Saleor's HMAC signature (prevents abuse)
 * - Rate limited (10 requests per minute per IP)
 */

const WEBHOOK_SECRET = process.env.SALEOR_WEBHOOK_SECRET;

// ============================================================================
// Rate Limiting (in-memory, suitable for single-instance deployments)
// For multi-instance deployments, use Redis or similar
// ============================================================================

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // Max requests per window

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every minute
setInterval(() => {
	const now = Date.now();
	for (const [key, entry] of rateLimitStore.entries()) {
		if (entry.resetTime < now) {
			rateLimitStore.delete(key);
		}
	}
}, RATE_LIMIT_WINDOW_MS);

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetIn: number } {
	const now = Date.now();
	const entry = rateLimitStore.get(identifier);

	if (!entry || entry.resetTime < now) {
		// New window
		rateLimitStore.set(identifier, {
			count: 1,
			resetTime: now + RATE_LIMIT_WINDOW_MS,
		});
		return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetIn: RATE_LIMIT_WINDOW_MS };
	}

	if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
		// Rate limited
		return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
	}

	// Increment count
	entry.count++;
	return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - entry.count, resetIn: entry.resetTime - now };
}

function getClientIP(request: NextRequest): string {
	// Check various headers for the real IP (behind proxies/CDN)
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) {
		return forwarded.split(",")[0].trim();
	}
	const realIP = request.headers.get("x-real-ip");
	if (realIP) {
		return realIP;
	}
	// Fallback (may not work in all environments)
	return "unknown";
}

/**
 * Verify Saleor webhook signature
 */
function verifyWebhookSignature(payload: string, signature: string | null): boolean {
	if (!WEBHOOK_SECRET || !signature) return false;

	const hmac = createHmac("sha256", WEBHOOK_SECRET);
	hmac.update(payload);
	const expectedSignature = hmac.digest("hex");

	try {
		return timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
	} catch {
		return false;
	}
}

/**
 * Extract product/category info from Saleor webhook payload
 */
function parseWebhookPayload(payload: unknown): {
	type: "product" | "category" | "collection" | "order" | "unknown";
	slug?: string;
	channel?: string;
} {
	if (!payload || typeof payload !== "object") {
		return { type: "unknown" };
	}

	const data = payload as Record<string, unknown>;

	// Product events
	if (data.product && typeof data.product === "object") {
		const product = data.product as Record<string, unknown>;
		return {
			type: "product",
			slug: product.slug as string | undefined,
			channel: (product.channel as Record<string, unknown>)?.slug as string | undefined,
		};
	}

	// Category events
	if (data.category && typeof data.category === "object") {
		const category = data.category as Record<string, unknown>;
		return {
			type: "category",
			slug: category.slug as string | undefined,
		};
	}

	// Collection events
	if (data.collection && typeof data.collection === "object") {
		const collection = data.collection as Record<string, unknown>;
		return {
			type: "collection",
			slug: collection.slug as string | undefined,
			channel: (collection.channel as Record<string, unknown>)?.slug as string | undefined,
		};
	}

	return { type: "unknown" };
}

export async function POST(request: NextRequest) {
	// Rate limit check
	const clientIP = getClientIP(request);
	const rateLimit = checkRateLimit(`post:${clientIP}`);

	if (!rateLimit.allowed) {
		console.warn(`[Revalidate] Rate limited: ${clientIP}`);
		return Response.json(
			{ error: "Too many requests", resetIn: Math.ceil(rateLimit.resetIn / 1000) },
			{
				status: 429,
				headers: {
					"Retry-After": Math.ceil(rateLimit.resetIn / 1000).toString(),
					"X-RateLimit-Remaining": "0",
				},
			},
		);
	}

	// Get raw body for signature verification
	const rawBody = await request.text();

	// Verify Saleor webhook signature
	const signature = request.headers.get("saleor-signature");

	if (!verifyWebhookSignature(rawBody, signature)) {
		// Fallback to static secret for manual testing
		const staticSecret = request.headers.get("x-revalidate-secret");
		if (staticSecret !== process.env.REVALIDATE_SECRET || !process.env.REVALIDATE_SECRET) {
			console.warn("[Revalidate] Invalid signature or secret");
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
	}

	try {
		const payload = JSON.parse(rawBody);
		const { type, slug, channel } = parseWebhookPayload(payload);

		// Default channel if not specified
		const targetChannel = channel || "default-channel";
		const revalidatedPaths: string[] = [];
		const revalidatedTags: string[] = [];

		switch (type) {
			case "product":
				if (slug) {
					// Tag-based: Invalidates "use cache" function data
					// Second arg must match the cacheLife() profile used in the cached function
					revalidateTag(`product:${slug}`, "minutes");
					revalidatedTags.push(`product:${slug}`);

					// Path-based: Invalidates ISR page cache
					revalidatePath(`/${targetChannel}/products/${slug}`);
					revalidatedPaths.push(`/${targetChannel}/products/${slug}`);
				}
				// Also revalidate product listings
				revalidatePath(`/${targetChannel}/products`);
				revalidatedPaths.push(`/${targetChannel}/products`);
				break;

			case "category":
				if (slug) {
					// Tag-based (uses cacheLife("minutes"))
					revalidateTag(`category:${slug}`, "minutes");
					revalidatedTags.push(`category:${slug}`);

					// Path-based
					revalidatePath(`/${targetChannel}/categories/${slug}`);
					revalidatedPaths.push(`/${targetChannel}/categories/${slug}`);
				}
				break;

			case "collection":
				if (slug) {
					// Tag-based (uses cacheLife("minutes"))
					revalidateTag(`collection:${slug}`, "minutes");
					revalidatedTags.push(`collection:${slug}`);

					// Path-based
					revalidatePath(`/${targetChannel}/collections/${slug}`);
					revalidatedPaths.push(`/${targetChannel}/collections/${slug}`);
				}
				break;

			default:
				// Unknown event type - revalidate product listings as safe default
				revalidatePath(`/${targetChannel}/products`);
				revalidatedPaths.push(`/${targetChannel}/products`);
		}

		// Sanitize for logging to prevent log injection
		const sanitizedSlug = slug?.replace(/[\r\n]/g, "") ?? "";
		const sanitizedPaths = revalidatedPaths.map((s) => s.replace(/[\r\n]/g, ""));
		const sanitizedTags = revalidatedTags.map((s) => s.replace(/[\r\n]/g, ""));
		console.log("[Revalidate] Success:", {
			type,
			slug: sanitizedSlug,
			paths: sanitizedPaths,
			tags: sanitizedTags,
		});
		return Response.json({ paths: revalidatedPaths, tags: revalidatedTags, success: true });
	} catch (error) {
		console.error("[Revalidate] Error:", error);
		return Response.json({ error: "Invalid payload" }, { status: 400 });
	}
}

/**
 * GET endpoint for manual cache clearing (protected by secret)
 *
 * @example Path-based revalidation (ISR pages):
 * GET /api/revalidate?secret=xxx&path=/default-channel/products/my-product
 *
 * @example Tag-based revalidation ("use cache" functions):
 * GET /api/revalidate?secret=xxx&tag=product:my-product
 *
 * @example Both at once:
 * GET /api/revalidate?secret=xxx&path=/default-channel/products/my-product&tag=product:my-product
 */
export async function GET(request: NextRequest) {
	// Rate limit check
	const clientIP = getClientIP(request);
	const rateLimit = checkRateLimit(`get:${clientIP}`);

	if (!rateLimit.allowed) {
		console.warn(`[Revalidate] Rate limited: ${clientIP}`);
		return Response.json(
			{ error: "Too many requests", resetIn: Math.ceil(rateLimit.resetIn / 1000) },
			{
				status: 429,
				headers: {
					"Retry-After": Math.ceil(rateLimit.resetIn / 1000).toString(),
					"X-RateLimit-Remaining": "0",
				},
			},
		);
	}

	const searchParams = request.nextUrl.searchParams;
	const secret = searchParams.get("secret");

	if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const path = searchParams.get("path");
	const tag = searchParams.get("tag");

	if (!path && !tag) {
		return Response.json({ error: "Provide path and/or tag parameter" }, { status: 400 });
	}

	const revalidatedPaths: string[] = [];
	const revalidatedTags: string[] = [];

	if (path) {
		revalidatePath(path);
		revalidatedPaths.push(path);
	}

	if (tag) {
		// Profile defaults to "minutes" but can be overridden for navigation ("hours")
		const profile = searchParams.get("profile") || "minutes";
		revalidateTag(tag, profile);
		revalidatedTags.push(tag);
	}

	// Sanitize for logging to prevent log injection
	const sanitizedPaths = revalidatedPaths.map((s) => s.replace(/[\r\n]/g, ""));
	const sanitizedTags = revalidatedTags.map((s) => s.replace(/[\r\n]/g, ""));
	console.log("[Revalidate] Manual:", { paths: sanitizedPaths, tags: sanitizedTags });
	return Response.json({ paths: revalidatedPaths, tags: revalidatedTags, success: true });
}
