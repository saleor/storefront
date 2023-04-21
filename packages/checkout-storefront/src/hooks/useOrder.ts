import { OrderFragment, useOrderQuery } from "@/checkout-storefront/graphql";
import { useLocale } from "@/checkout-storefront/hooks/useLocale";
import { localeToLanguageCode } from "@/checkout-storefront/lib/utils/locale";
import { getQueryParams } from "@/checkout-storefront/lib/utils/url";

export const useOrder = () => {
  const { orderId } = getQueryParams();
  const { locale } = useLocale();

  const [{ data, fetching: loading }] = useOrderQuery({
    pause: !orderId,
    variables: { languageCode: localeToLanguageCode(locale), id: orderId as string },
  });

  return { order: data?.order as OrderFragment, loading };
};
