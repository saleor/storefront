import {
	ProductDetailsDocument,
	ProductVariantForPdpDocument,
	ProductVariantsForPdpDocument,
	type LanguageCodeEnum,
	type ProductDetailsQuery,
	type ProductVariantsForPdpQuery,
} from "@/gql/graphql";
import { PDP_VARIANT_CAP, SALEOR_VARIANT_PAGE_SIZE } from "@/config/variants";
import {
	resolveBuyBoxStrategy,
	resolvePdpVariantDeepLink,
	type PdpVariantDeepLink,
} from "@/lib/catalog/buy-box-strategy";
import { resolveByPossiblyTranslatedSlug } from "@/lib/catalog/resolve-by-slug";
import { tagPrimaryCatalogSlug } from "@/lib/catalog/tag-primary-slug";
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
	 * True when the buy-box strategy is not `matrix` — callers must not hydrate a
	 * partial attribute matrix. Use deep-link ATC (`?variant=` / `?sku=`) instead.
	 */
	overBudget: boolean;
	/** Resolved page-level buy-box strategy (island-only; never in the shell). */
	strategy: ReturnType<typeof resolveBuyBoxStrategy>;
};

/**
 * Cached PDP shell — name, media, pricing, product type, assignedAttributes, variant count probe.
 * Does **not** load variant payloads (keeps the static shell lean under PPR).
 *
 * Resolves primary or translated URL slugs (ADR 0004).
 */
export async function getProductData(
	slug: string,
	channel: string,
	localeSlug: string,
): Promise<ProductShell | null> {
	"use cache";
	const decodedSlug = decodeURIComponent(slug);
	applyCacheProfile(CACHE_PROFILES.products, decodedSlug);

	const languageVariables = graphqlLanguageCodeVariables(localeSlug);

	const fetchProduct = async (vars: { slug: string; slugLanguageCode?: LanguageCodeEnum }) => {
		const result = await executePublicGraphQL(ProductDetailsDocument, {
			variables: {
				slug: vars.slug,
				channel,
				...languageVariables,
				...(vars.slugLanguageCode ? { slugLanguageCode: vars.slugLanguageCode } : {}),
			},
		});

		if (!result.ok) {
			console.error(
				`[getProductData] Failed to fetch product ${vars.slug} for ${channel}:`,
				result.error.message,
			);
			return null;
		}

		return result.data.product;
	};

	const product = await resolveByPossiblyTranslatedSlug({
		localeSlug,
		urlSlug: decodedSlug,
		fetchByPrimarySlug: (urlSlug) => fetchProduct({ slug: urlSlug }),
		fetchByTranslatedSlug: (urlSlug, slugLanguageCode) => fetchProduct({ slug: urlSlug, slugLanguageCode }),
	});

	if (!product) return null;

	tagPrimaryCatalogSlug(CACHE_PROFILES.products, decodedSlug, product.slug);
	return withTranslatedProductFields(product);
}

/**
 * Resolve variants for PDP islands (gallery + buy box).
 *
 * - `matrix`: hydrate via paginated `productVariants` (≤ PDP_VARIANT_CAP).
 * - `over_budget` / `external`: skip the matrix; if a deep link (`?variant=` /
 *   `?sku=`) is present, resolve that one SKU for ATC/media.
 *
 * Shared by both islands so budget + deep-link behavior cannot diverge.
 * Strategy resolution stays here (dynamic island) — never in the product shell.
 * Variant list fetch uses the product's **primary** slug (`product.slug`).
 */
export async function resolvePdpVariants(
	product: ProductShell,
	channel: string,
	localeSlug: string,
	options?: { variantId?: string | null; sku?: string | null },
): Promise<ProductVariantsForPdpResult> {
	const shellTotalCount = product.productVariants?.totalCount ?? null;
	const strategy = resolveBuyBoxStrategy({
		totalCount: shellTotalCount,
		productTypeSlug: product.productType?.slug,
	});
	const deepLink = resolvePdpVariantDeepLink({
		variant: options?.variantId,
		sku: options?.sku,
	});

	if (strategy !== "matrix") {
		const totalCount = shellTotalCount ?? 0;
		if (!deepLink) {
			return { variants: [], totalCount, overBudget: true, strategy };
		}

		const resolved = await getProductVariantForPdp(deepLink, channel, localeSlug, product.id, product.slug);
		return {
			variants: resolved ? [resolved] : [],
			totalCount,
			overBudget: true,
			strategy,
		};
	}

	const list = await getProductVariantsForPdp(product.slug, channel, localeSlug);
	// Shell `totalCount` can lag PRODUCT_* updates — if the list fetch is over cap,
	// honor deep-link ATC instead of stranding the shopper with an empty buy box.
	if (list.overBudget) {
		if (!deepLink) {
			return { ...list, strategy: "over_budget" };
		}
		const resolved = await getProductVariantForPdp(deepLink, channel, localeSlug, product.id, product.slug);
		return {
			variants: resolved ? [resolved] : [],
			totalCount: list.totalCount,
			overBudget: true,
			strategy: "over_budget",
		};
	}

	return { ...list, strategy: "matrix" };
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
		return { variants: [], totalCount, overBudget: true, strategy: "over_budget" };
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
		strategy: "matrix" as const,
	};
}

/**
 * Cached single-variant lookup for deep links (`?variant=` / `?sku=`) on
 * non-matrix buy-box strategies.
 */
async function getProductVariantForPdp(
	deepLink: PdpVariantDeepLink,
	channel: string,
	localeSlug: string,
	expectedProductId: string,
	productSlug: string,
): Promise<PdpVariant | null> {
	"use cache";
	// Same product:{slug} tag as the shell/list so PRODUCT_* webhooks bust this entry.
	applyCacheProfile(CACHE_PROFILES.products, productSlug);

	const id = deepLink.kind === "id" ? decodeURIComponent(deepLink.id) : undefined;
	const sku = deepLink.kind === "sku" ? deepLink.sku : undefined;
	const cacheKey = deepLink.kind === "id" ? id! : `sku:${sku}`;

	const result = await executePublicGraphQL(ProductVariantForPdpDocument, {
		variables: {
			id,
			sku,
			channel,
			...graphqlLanguageCodeVariables(localeSlug),
		},
	});

	if (!result.ok) {
		console.error(`[getProductVariantForPdp] Failed to fetch variant ${cacheKey}:`, result.error.message);
		return null;
	}

	const variant = result.data.productVariant;
	if (!variant) return null;
	if (variant.product?.id && variant.product.id !== expectedProductId) {
		console.warn(
			`[getProductVariantForPdp] Variant ${cacheKey} belongs to another product (expected ${expectedProductId})`,
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
