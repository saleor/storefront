import { type OrderFragment, useOrderQuery } from "@/checkout/graphql";
import { getQueryParams } from "@/checkout/lib/utils/url";
import { localeConfig } from "@/config/locale";
import { useSearchParams } from "next/navigation";

export const useOrder = () => {
	const searchParams = useSearchParams();
	const { orderId } = getQueryParams(searchParams);

	const [{ data, fetching: loading }] = useOrderQuery({
		pause: !orderId,
		variables: { languageCode: localeConfig.graphqlLanguageCode, id: orderId as string },
	});

	return { order: data?.order as OrderFragment, loading };
};
