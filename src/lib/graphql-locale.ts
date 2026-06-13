import { getGraphqlLanguageCode } from "@/config/locale";
import type { LanguageCodeEnum } from "@/gql/graphql";

/** GraphQL `languageCode` variable from a browse URL locale slug. */
export function graphqlLanguageCodeVariables(localeSlug: string): { languageCode: LanguageCodeEnum } {
	return { languageCode: getGraphqlLanguageCode(localeSlug) as LanguageCodeEnum };
}
