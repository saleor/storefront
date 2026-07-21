import {
	ProductDetailsDocument,
	ProductVariantForPdpDocument,
	ProductVariantsForPdpDocument,
	type ProductDetailsQuery,
	type ProductVariantsForPdpQuery,
} from "@/gql/graphql";
import { PDP_VARIANT_CAP, SALEOR_VARIANT_PAGE_SIZE } from "@/config/variants";
import { executePublicGraphQL } from "@/lib/graphql";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { pickTranslatedName, withTranslatedProductFields } from "@/lib/saleor-translations";

export type ProductShell = NonNullable<ProductDetailsQuery["product"]>;

export type PdpVariant = NonNullable<
	NonNullable<NonNullable<ProductVariantsForPdpQuery["product"]>["productVariants"]>["edges"][number]
>["node"];

export type ProductVariantsForPdpResult = {
	variants: PdpVariant[];
	/** Saleor's total variant count for this product (may exceed what we hydrate). */
	totalCount: number;
	/**
	 * True when totalCount > PDP_VARIANT_CAP — callers must not hydrate the attribute matrix
	 * with a partial list. Use the over-budget buy-box path instead.
	 */
	overBudget: boolean;
};

/**
 * Cached PDP shell — name, media, pricing, product type, assignedAttributes, variant count probe.
 * Does **not** load variant payloads (keeps the static shell lean under PPR).
 */
export async function getProductData(
	slug: string,
	channel: string,
	localeSlug: string,
): Promise<ProductShell | null> {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.products, slug);

	const result = await executePublicGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(slug),
			channel,
			...graphqlLanguageCodeVariables(localeSlug),
		},
	});

	if (!result.ok) {
		console.error(`[getProductData] Failed to fetch product ${slug} for ${channel}:`, result.error.message);
		return null;
	}

	return result.data.product ? withTranslatedProductFields(result.data.product) : null;
}

/**
 * Resolve variants for PDP islands (gallery + buy box).
 *
 * - Under budget: hydrate via paginated `productVariants` (≤ PDP_VARIANT_CAP).
 * - Over budget: skip the matrix; if `variantId` is present, resolve that one SKU for ATC/media.
 *
 * Shared by both islands so budget + deep-link behavior cannot diverge.
 */
export async function resolvePdpVariants(
	product: ProductShell,
	channel: string,
	localeSlug: string,
	options?: { variantId?: string },
): Promise<ProductVariantsForPdpResult> {
	const shellTotalCount = product.productVariants?.totalCount ?? null;
	const overBudget = shellTotalCount != null && shellTotalCount > PDP_VARIANT_CAP;

	if (overBudget) {
		const totalCount = shellTotalCount!;
		const variantId = options?.variantId ? decodeURIComponent(options.variantId) : undefined;
		if (!variantId) {
			return { variants: [], totalCount, overBudget: true };
		}

		const resolved = await getProductVariantForPdp(variantId, channel, localeSlug, product.id, product.slug);
		return {
			variants: resolved ? [resolved] : [],
			totalCount,
			overBudget: true,
		};
	}

	return getProductVariantsForPdp(product.slug, channel, localeSlug);
}

/**
 * Cached, capped PDP variant list via `productVariants` connection.
 *
 * Shares the `product:{slug}` + `catalog` profile with {@link getProductData} so PRODUCT_*
 * webhooks bust both. `quantityAvailable` may be stale up to that TTL — see
 * `src/config/variants.ts`. Cart/checkout always fetch live.
 *
 * ≤100 variants → one request. 101–PDP_VARIANT_CAP → second page.
 * Failures throw (island ErrorBoundary) — never pretend an empty/partial catalog.
 */
export async function getProductVariantsForPdp(
	slug: string,
	channel: string,
	localeSlug: string,
): Promise<ProductVariantsForPdpResult> {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.products, slug);

	const decodedSlug = decodeURIComponent(slug);
	const languageVariables = graphqlLanguageCodeVariables(localeSlug);

	const firstPage = await fetchVariantPage(
		decodedSlug,
		channel,
		languageVariables,
		SALEOR_VARIANT_PAGE_SIZE,
		null,
	);
	if (!firstPage) {
		throw new Error(`[getProductVariantsForPdp] Failed to fetch variants for ${decodedSlug} (${channel})`);
	}

	const totalCount = firstPage.totalCount ?? firstPage.nodes.length;
	const overBudget = totalCount > PDP_VARIANT_CAP;

	if (overBudget) {
		return { variants: [], totalCount, overBudget: true };
	}

	const variants = [...firstPage.nodes];

	if (totalCount > SALEOR_VARIANT_PAGE_SIZE && firstPage.endCursor && firstPage.hasNextPage) {
		const remaining = Math.min(PDP_VARIANT_CAP - variants.length, SALEOR_VARIANT_PAGE_SIZE);
		const secondPage = await fetchVariantPage(
			decodedSlug,
			channel,
			languageVariables,
			remaining,
			firstPage.endCursor,
		);
		if (!secondPage) {
			// Fail closed: a partial matrix would silently drop options.
			throw new Error(
				`[getProductVariantsForPdp] Incomplete variant page for ${decodedSlug} (${channel}): ` +
					`got ${variants.length}/${totalCount}`,
			);
		}
		variants.push(...secondPage.nodes);
	}

	if (totalCount > variants.length) {
		throw new Error(
			`[getProductVariantsForPdp] Incomplete variant list for ${decodedSlug} (${channel}): ` +
				`got ${variants.length}/${totalCount}`,
		);
	}

	return {
		variants: variants.map((variant) => ({
			...variant,
			name: pickTranslatedName(variant),
		})),
		totalCount,
		overBudget: false,
	};
}

/**
 * Cached single-variant lookup for `?variant=` deep links on over-budget products.
 */
async function getProductVariantForPdp(
	variantId: string,
	channel: string,
	localeSlug: string,
	expectedProductId: string,
	productSlug: string,
): Promise<PdpVariant | null> {
	"use cache";
	// Same product:{slug} tag as the shell/list so PRODUCT_* webhooks bust this entry.
	applyCacheProfile(CACHE_PROFILES.products, productSlug);

	const result = await executePublicGraphQL(ProductVariantForPdpDocument, {
		variables: {
			id: variantId,
			channel,
			...graphqlLanguageCodeVariables(localeSlug),
		},
	});

	if (!result.ok) {
		console.error(`[getProductVariantForPdp] Failed to fetch variant ${variantId}:`, result.error.message);
		return null;
	}

	const variant = result.data.productVariant;
	if (!variant) return null;
	if (variant.product?.id && variant.product.id !== expectedProductId) {
		console.warn(
			`[getProductVariantForPdp] Variant ${variantId} belongs to another product (expected ${expectedProductId})`,
		);
		return null;
	}

	const { product: _product, ...rest } = variant;
	return {
		...rest,
		name: pickTranslatedName(rest),
	};
}

type LanguageVariables = ReturnType<typeof graphqlLanguageCodeVariables>;

async function fetchVariantPage(
	slug: string,
	channel: string,
	languageVariables: LanguageVariables,
	first: number,
	after: string | null,
): Promise<{
	nodes: PdpVariant[];
	totalCount: number | null | undefined;
	hasNextPage: boolean;
	endCursor: string | null | undefined;
} | null> {
	const result = await executePublicGraphQL(ProductVariantsForPdpDocument, {
		variables: {
			slug,
			channel,
			first,
			after,
			...languageVariables,
		},
	});

	if (!result.ok) {
		console.error(
			`[getProductVariantsForPdp] Failed to fetch variants for ${slug} (${channel}):`,
			result.error.message,
		);
		return null;
	}

	const connection = result.data.product?.productVariants;
	if (!connection) return null;

	return {
		nodes: connection.edges.map((edge) => edge.node),
		totalCount: connection.totalCount,
		hasNextPage: connection.pageInfo.hasNextPage,
		endCursor: connection.pageInfo.endCursor,
	};
}
