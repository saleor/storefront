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
 * - Rate limited by design (only called on actual Saleor events)
 */

const WEBHOOK_SECRET = process.env.SALEOR_WEBHOOK_SECRET;

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
		const revalidated: string[] = [];

		switch (type) {
			case "product":
				if (slug) {
					revalidatePath(`/${targetChannel}/products/${slug}`);
					revalidated.push(`/${targetChannel}/products/${slug}`);
				}
				revalidatePath(`/${targetChannel}/products`);
				revalidated.push(`/${targetChannel}/products`);
				break;

			case "category":
				if (slug) {
					revalidatePath(`/${targetChannel}/categories/${slug}`);
					revalidated.push(`/${targetChannel}/categories/${slug}`);
				}
				break;

			case "collection":
				if (slug) {
					revalidatePath(`/${targetChannel}/collections/${slug}`);
					revalidated.push(`/${targetChannel}/collections/${slug}`);
				}
				break;

			default:
				// Unknown event type - revalidate product listings as safe default
				revalidatePath(`/${targetChannel}/products`);
				revalidated.push(`/${targetChannel}/products`);
		}

		// Sanitize for logging to prevent log injection
		const sanitizedSlug = slug?.replace(/[\r\n]/g, "") ?? "";
		const sanitizedPaths = revalidated.map((s) => s.replace(/[\r\n]/g, ""));
		console.log("[Revalidate] Success:", { type, slug: sanitizedSlug, revalidated: sanitizedPaths });
		return Response.json({ revalidated, success: true });
	} catch (error) {
		console.error("[Revalidate] Error:", error);
		return Response.json({ error: "Invalid payload" }, { status: 400 });
	}
}

/**
 * GET endpoint for manual cache clearing (protected by secret)
 *
 * @example
 * GET /api/revalidate?secret=xxx&path=/default-channel/products/my-product
 */
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const secret = searchParams.get("secret");

	if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const path = searchParams.get("path");
	const tag = searchParams.get("tag");
	const revalidated: string[] = [];

	if (path) {
		revalidatePath(path);
		revalidated.push(path);
	}

	if (tag) {
		revalidateTag(tag);
		revalidated.push(`tag:${tag}`);
	}

	if (revalidated.length === 0) {
		return Response.json({ error: "Provide path or tag parameter" }, { status: 400 });
	}

	// Sanitize for logging to prevent log injection
	const sanitized = revalidated.map((s) => s.replace(/[\r\n]/g, ""));
	console.log("[Revalidate] Manual:", sanitized);
	return Response.json({ revalidated, success: true });
}
