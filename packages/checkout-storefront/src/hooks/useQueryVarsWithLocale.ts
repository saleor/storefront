import { LanguageCodeEnum } from "@/checkout-storefront/graphql";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { DEFAULT_LOCALE } from "@/checkout-storefront/lib/regions";
import { snakeCase } from "lodash-es";
import { useCallback, useMemo } from "react";

export const useQueryVarsWithLocale = () => {
  const { locale } = useLocale();

  // api doesn't handle minion, sadly
  const localeToUse = useMemo(() => (locale === "minion" ? DEFAULT_LOCALE : locale), [locale]);

  return useCallback(
    <TData>(data: TData) => ({
      ...data,
      languageCode: snakeCase(localeToUse).toUpperCase() as LanguageCodeEnum,
    }),
    [localeToUse]
  );
};
