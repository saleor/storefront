import { ProductDetailsDocument, type LanguageCodeEnum } from "@/gql/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { executePublicGraphQL } from "@/lib/graphql";
import { withTranslatedProductFields } from "@/lib/saleor-translations";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { resolveByPossiblyTranslatedSlug } from "@/lib/catalog/resolve-by-slug";
import { tagPrimaryCatalogSlug } from "@/lib/catalog/tag-primary-slug";

export async function getProductData(slug: string, channel: string, localeSlug: string) {
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
