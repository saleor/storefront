import { type OrderFragment, useOrderQuery } from "@/checkout/src/graphql";
import { useLocale } from "@/checkout/src/hooks/useLocale";
import { localeToLanguageCode } from "@/checkout/src/lib/utils/locale";
import { getQueryParams } from "@/checkout/src/lib/utils/url";

export const useOrder = () => {
  const { orderId } = getQueryParams();
  const { locale } = useLocale();

  const [{ data, fetching: loading }] = useOrderQuery({
    pause: !orderId,
    variables: { languageCode: localeToLanguageCode(locale), id: orderId as string },
  });

  return { order: data?.order as OrderFragment, loading };
};
