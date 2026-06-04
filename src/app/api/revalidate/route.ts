import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { DefaultChannelSlug } from "@/app/config";
import { getStorefrontChannelSlugs } from "@/lib/channel-slugs";
import {
	CACHE_PROFILES,
	buildTag,
	buildPath,
	isGlobalTagProfile,
	getChannelScopedTagProfiles,
	resolveManualRevalidateTag,
	resolveRevalidateProfileForTag,
	type CacheProfile,
} from "@/lib/cache-manifest";
import { revalidateTags } from "@/lib/revalidate-tags";
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
	profile: CacheProfile,
	channel: string,
	slug: string,
	tagEntries: Array<{ tag: string; profile: CacheProfile["cacheProfile"] }>,
	paths: string[],
) {
	tagEntries.push({ tag: buildTag(profile, { slug, channel }), profile: profile.cacheProfile });

	const path = buildPath(profile, channel, slug);
	if (path) {
		revalidatePath(path);
		paths.push(path);
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
		const tagEntries: Array<{ tag: string; profile: CacheProfile["cacheProfile"] }> = [];

		switch (type) {
			case "product":
				if (slug) {
					revalidateProfile(CACHE_PROFILES.products, targetChannel, slug, tagEntries, revalidatedPaths);
				}
				revalidatePath(`/${targetChannel}/products`);
				revalidatedPaths.push(`/${targetChannel}/products`);

				if (categorySlug) {
					revalidateProfile(
						CACHE_PROFILES.categories,
						targetChannel,
						categorySlug,
						tagEntries,
						revalidatedPaths,
					);
				}
				break;

			case "category":
				if (slug) {
					revalidateProfile(CACHE_PROFILES.categories, targetChannel, slug, tagEntries, revalidatedPaths);
				}
				break;

			case "collection":
				if (slug) {
					revalidateProfile(CACHE_PROFILES.collections, targetChannel, slug, tagEntries, revalidatedPaths);
				}
				break;

			default:
				revalidatePath(`/${targetChannel}/products`);
				revalidatedPaths.push(`/${targetChannel}/products`);
		}

		const revalidatedTags = await revalidateTags(tagEntries);

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
 * @example Tag-based revalidation:
 * curl -H "Authorization: Bearer <token>" "https://store.com/api/revalidate?tag=product:my-product"
 *
 * @example Channel-scoped tag (navigation, footer menu):
 * curl -H "Authorization: Bearer <token>" "https://store.com/api/revalidate?tag=navigation:default-channel"
 * curl -H "Authorization: Bearer <token>" "https://store.com/api/revalidate?tag=navigation&channel=default-channel"
 *
 * @example Both at once:
 * curl -H "Authorization: Bearer <token>" "https://store.com/api/revalidate?path=/default-channel/products/my-product&tag=product:my-product"
 *
 * @example Revalidate all cached data:
 * curl -H "Authorization: Bearer <token>" "https://store.com/api/revalidate?all=1"
 */
export async function GET(request: NextRequest) {
	const token = extractBearerToken(request);
	if (!verifySecret(token)) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const searchParams = request.nextUrl.searchParams;
	const path = searchParams.get("path");
	const tagParam = searchParams.get("tag");
	const channelParam = searchParams.get("channel");
	const all = searchParams.get("all");
	const profileOverride = searchParams.get("profile");

	if (!path && !tagParam && !all) {
		return Response.json({ error: "Provide path, tag, and/or all parameter" }, { status: 400 });
	}

	const revalidatedPaths: string[] = [];
	const revalidatedTags: string[] = [];

	if (all === "1" || all === "true") {
		revalidatePath("/", "layout");
		revalidatedPaths.push("/ (all routes)");

		const tagEntries: Array<{ tag: string; profile: CacheProfile["cacheProfile"] }> = [];

		for (const p of Object.values(CACHE_PROFILES)) {
			if (isGlobalTagProfile(p)) {
				tagEntries.push({ tag: buildTag(p), profile: p.cacheProfile });
			}
		}

		const channelTagProfiles = getChannelScopedTagProfiles();
		const channelSlugs = await getStorefrontChannelSlugs();
		if (channelSlugs.length === 0 && channelTagProfiles.length > 0) {
			console.warn(
				"[Revalidate] Full purge: no channel slugs resolved — channel-scoped tags skipped. " +
					"Set NEXT_PUBLIC_DEFAULT_CHANNEL or STOREFRONT_CHANNELS.",
			);
		}
		for (const p of channelTagProfiles) {
			for (const channel of channelSlugs) {
				tagEntries.push({ tag: buildTag(p, { channel }), profile: p.cacheProfile });
			}
		}

		revalidatedTags.push(...(await revalidateTags(tagEntries)));

		const slugProfiles = Object.values(CACHE_PROFILES)
			.filter((p) => p.tagPattern.includes("{slug}"))
			.map((p) => p.id);

		console.log(
			"[Revalidate] Full purge:",
			'revalidatePath("/", "layout") invalidates all routes (including slug-based:',
			slugProfiles.join(", ") + ").",
			"Also revalidated tags:",
			revalidatedTags.join(", ") || "(none)",
		);
	}

	if (path) {
		console.log(
			`[Revalidate] Path: revalidatePath("${path.replace(/[\r\n]/g, "")}") — invalidates this specific route`,
		);
		revalidatePath(path);
		revalidatedPaths.push(path);
	}

	if (tagParam) {
		const tag = resolveManualRevalidateTag(tagParam, channelParam);
		const profile = resolveRevalidateProfileForTag(tag, profileOverride);
		console.log(
			`[Revalidate] Tag: revalidateTag("${tag.replace(
				/[\r\n]/g,
				"",
			)}", "${profile}") — invalidates "use cache" entries with this tag`,
		);
		revalidatedTags.push(...(await revalidateTags([{ tag, profile }])));
	}

	console.log("[Revalidate] Done:", { paths: revalidatedPaths, tags: revalidatedTags });
	return Response.json({ paths: revalidatedPaths, tags: revalidatedTags, success: true });
}
