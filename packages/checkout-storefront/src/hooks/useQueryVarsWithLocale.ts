import { LanguageCodeEnum } from "@/checkout-storefront/graphql";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { snakeCase } from "lodash-es";

export const useQueryVarsWithLocale = () => {
  const { locale } = useLocale();

  return <TData>(data: TData) => ({
    ...data,
    languageCode: snakeCase(locale).toUpperCase() as LanguageCodeEnum,
  });
};
