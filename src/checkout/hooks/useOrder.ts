import { type OrderFragment, useOrderQuery } from "@/checkout/graphql";
import { useLocale } from "@/checkout/hooks/useLocale";
import { localeToLanguageCode } from "@/checkout/lib/utils/locale";
import { getQueryParams } from "@/checkout/lib/utils/url";

export const useOrder = () => {
	const { orderId } = getQueryParams();
	const { locale } = useLocale();

	const [{ data, fetching: loading }] = useOrderQuery({
		pause: !orderId,
		variables: { languageCode: localeToLanguageCode(locale), id: orderId as string },
	});

	return { order: data?.order as OrderFragment, loading };
};
