import { OrderFragment, useOrderQuery } from "@/checkout-storefront/graphql";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { localeToLanguageCode } from "@/checkout-storefront/lib/utils/locale";

export const useOrder = (id: string) => {
  const { locale } = useLocale();

  const [{ data, fetching: loading }] = useOrderQuery({
    variables: { languageCode: localeToLanguageCode(locale), id },
  });

  return { order: data?.order as OrderFragment, loading };
};
