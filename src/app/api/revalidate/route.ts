import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { DefaultChannelSlug } from "@/app/config";
import {
	CACHE_PROFILES,
	buildTag,
	buildPath,
	findDependentPages,
	findPageByTag,
	buildPagePath,
} from "@/lib/cache-manifest";
import { extractBearerToken, verifySecret, verifyWebhookSignature } from "@/lib/api-auth";

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
 * - Verifies Saleor's HMAC signature (timing-safe)
 * - Falls back to Bearer token / x-revalidate-secret header
 */

// ============================================================================
// Webhook payload parsing
// ============================================================================

function parseWebhookPayload(payload: unknown): {
	type: "product" | "category" | "collection" | "unknown";
	slug?: string;
	channel?: string;
	categorySlug?: string;
} {
	if (!payload || typeof payload !== "object") {
		return { type: "unknown" };
	}

	const data = payload as Record<string, unknown>;

	if (data.product && typeof data.product === "object") {
		const product = data.product as Record<string, unknown>;
		const category = product.category as Record<string, unknown> | undefined;
		return {
			type: "product",
			slug: product.slug as string | undefined,
			channel: (product.channel as Record<string, unknown>)?.slug as string | undefined,
			categorySlug: category?.slug as string | undefined,
		};
	}

	if (data.productVariant && typeof data.productVariant === "object") {
		const variant = data.productVariant as Record<string, unknown>;
		const product = variant.product as Record<string, unknown> | undefined;
		if (product) {
			const category = product.category as Record<string, unknown> | undefined;
			return {
				type: "product",
				slug: product.slug as string | undefined,
				channel: (product.channel as Record<string, unknown>)?.slug as string | undefined,
				categorySlug: category?.slug as string | undefined,
			};
		}
	}

	if (data.category && typeof data.category === "object") {
		const category = data.category as Record<string, unknown>;
		return {
			type: "category",
			slug: category.slug as string | undefined,
		};
	}

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

// ============================================================================
// Revalidation helper — keeps the switch cases DRY
// ============================================================================

function revalidateProfile(
	profile: (typeof CACHE_PROFILES)[keyof typeof CACHE_PROFILES],
	channel: string,
	slug: string,
	tags: string[],
	paths: string[],
) {
	// NOTE: revalidateTag doesn't work for Cache Components in Next.js 16.
	// We only use revalidatePath which works reliably.
	const tag = buildTag(profile, slug);
	tags.push(tag);

	const path = buildPath(profile, channel, slug);
	if (path) {
		revalidatePath(path);
		paths.push(path);
	}

	// Cascade to dependent pages (e.g., homepage depends on "collection:featured-products")
	const dependentPages = findDependentPages(tag);
	for (const page of dependentPages) {
		const pagePath = buildPagePath(page, channel);
		if (!paths.includes(pagePath)) {
			revalidatePath(pagePath);
			paths.push(pagePath);
		}
	}
}

// ============================================================================
// POST — Saleor webhook
// ============================================================================

export async function POST(request: NextRequest) {
	const rawBody = await request.text();

	const signature = request.headers.get("saleor-signature");
	if (!verifyWebhookSignature(rawBody, signature)) {
		const token = extractBearerToken(request) ?? request.headers.get("x-revalidate-secret");
		if (!verifySecret(token)) {
			console.warn("[Revalidate] Invalid signature or secret");
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}
	}

	try {
		const payload = JSON.parse(rawBody);

		if (process.env.NODE_ENV === "development") {
			console.log("[Revalidate] Raw payload:", JSON.stringify(payload, null, 2));
		}

		const { type, slug, channel, categorySlug } = parseWebhookPayload(payload);

		const targetChannel = channel || DefaultChannelSlug;
		if (!targetChannel) {
			return Response.json(
				{ error: "Channel not specified in webhook and NEXT_PUBLIC_DEFAULT_CHANNEL not set" },
				{ status: 400 },
			);
		}
		const revalidatedPaths: string[] = [];
		const revalidatedTags: string[] = [];

		switch (type) {
			case "product":
				if (slug) {
					revalidateProfile(CACHE_PROFILES.products, targetChannel, slug, revalidatedTags, revalidatedPaths);
				}
				revalidatePath(`/${targetChannel}/products`);
				revalidatedPaths.push(`/${targetChannel}/products`);

				if (categorySlug) {
					revalidateProfile(
						CACHE_PROFILES.categories,
						targetChannel,
						categorySlug,
						revalidatedTags,
						revalidatedPaths,
					);
				}
				break;

			case "category":
				if (slug) {
					revalidateProfile(
						CACHE_PROFILES.categories,
						targetChannel,
						slug,
						revalidatedTags,
						revalidatedPaths,
					);
				}
				break;

			case "collection":
				if (slug) {
					revalidateProfile(
						CACHE_PROFILES.collections,
						targetChannel,
						slug,
						revalidatedTags,
						revalidatedPaths,
					);
				}
				break;

			default:
				revalidatePath(`/${targetChannel}/products`);
				revalidatedPaths.push(`/${targetChannel}/products`);
		}

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

// ============================================================================
// GET — Manual cache clearing (protected by secret)
// ============================================================================

/**
 * @example Path-based revalidation:
 * curl -H "Authorization: Bearer <token>" "https://store.com/api/revalidate?path=/default-channel/products/my-product"
 *
 * @example Tag-based revalidation (converts tag to path):
 * curl -H "Authorization: Bearer <token>" "https://store.com/api/revalidate?tag=product:my-product&channel=default-channel"
 *
 * @example Purge all cached data:
 * curl -H "Authorization: Bearer <token>" "https://store.com/api/revalidate?all=1"
 */
export async function GET(request: NextRequest) {
	const token = extractBearerToken(request);
	if (!verifySecret(token)) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const searchParams = request.nextUrl.searchParams;
	const path = searchParams.get("path");
	const tag = searchParams.get("tag");
	const all = searchParams.get("all");

	if (!path && !tag && !all) {
		return Response.json({ error: "Provide path, tag, or all parameter" }, { status: 400 });
	}

	const revalidatedPaths: string[] = [];
	const revalidatedTags: string[] = [];

	if (all === "1" || all === "true") {
		// Clear all routes — the only reliable way to purge everything in Next.js 16
		revalidatePath("/", "layout");
		revalidatedPaths.push("/ (all routes)");
	}

	if (path) {
		console.log(
			`[Revalidate] Path: revalidatePath("${path.replace(/[\r\n]/g, "")}") — invalidates this specific route`,
		);
		revalidatePath(path);
		revalidatedPaths.push(path);
	}

	if (tag) {
		// Resolve tag → path(s) and revalidatePath (revalidateTag is unreliable with Cache Components).
		revalidatedTags.push(tag);

		const channel = searchParams.get("channel") || DefaultChannelSlug || "default-channel";

		// Also revalidate the corresponding path for completeness
		for (const profile of Object.values(CACHE_PROFILES)) {
			const pathPattern = profile.pathPattern;
			if (typeof pathPattern !== "string" || !profile.tagPattern.includes("{slug}")) continue;
			const prefix = profile.tagPattern.replace("{slug}", "");
			if (tag.startsWith(prefix)) {
				const slug = tag.slice(prefix.length);
				let path = pathPattern.replace("{channel}", channel);
				path = path.replace("{slug}", slug);
				if (!revalidatedPaths.includes(path)) {
					revalidatePath(path);
					revalidatedPaths.push(path);
				}
				break;
			}
		}

		// Direct manual page tag support: ?tag=page:homepage&channel=default-channel
		const pageFromTag = findPageByTag(tag);
		if (pageFromTag && channel) {
			const pagePath = buildPagePath(pageFromTag, channel);
			if (!revalidatedPaths.includes(pagePath)) {
				revalidatePath(pagePath);
				revalidatedPaths.push(pagePath);
				console.log(`[Revalidate] Page tag: "${tag}" -> ${pagePath}`);
			}
		}

		// Cascade to dependent pages
		if (channel) {
			const dependentPages = findDependentPages(tag);
			for (const page of dependentPages) {
				const pagePath = buildPagePath(page, channel);
				if (!revalidatedPaths.includes(pagePath)) {
					revalidatePath(pagePath);
					revalidatedPaths.push(pagePath);
					console.log(`[Revalidate] Cascade: page "${page.id}" at ${pagePath}`);
				}
			}
		}
	}

	console.log("[Revalidate] Done:", { paths: revalidatedPaths, tags: revalidatedTags });
	return Response.json({ paths: revalidatedPaths, tags: revalidatedTags, success: true });
}
