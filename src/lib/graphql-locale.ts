import { getGraphqlLanguageCode } from "@/config/locale";
import type { LanguageCodeEnum } from "@/gql/graphql";

/** GraphQL `languageCode` variable from a browse URL locale slug. */
export function graphqlLanguageCodeVariables(localeSlug: string): { languageCode: LanguageCodeEnum } {
	return { languageCode: getGraphqlLanguageCode(localeSlug) as LanguageCodeEnum };
}

/** GraphQL `slugLanguageCode` for resolving catalog entities by translated slug. */
export function graphqlSlugLanguageCodeVariables(localeSlug: string): {
	slugLanguageCode: LanguageCodeEnum;
} {
	return { slugLanguageCode: getGraphqlLanguageCode(localeSlug) as LanguageCodeEnum };
}
