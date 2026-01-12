import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { type Checkout, useCheckoutQuery } from "@/checkout/graphql";
import { extractCheckoutIdFromParams, getQueryParams } from "@/checkout/lib/utils/url";
import { useCheckoutUpdateStateActions } from "@/checkout/state/updateStateStore";
import { localeConfig } from "@/config/locale";

export const useCheckout = ({ pause = false } = {}) => {
	const searchParams = useSearchParams();
	const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
	const id = extractCheckoutIdFromParams(queryParams);

	const { setLoadingCheckout } = useCheckoutUpdateStateActions();

	// Pause the query if there's no checkout ID
	const shouldPause = pause || !id;

	const [{ data, fetching, stale }, refetch] = useCheckoutQuery({
		variables: { id: id || "", languageCode: localeConfig.graphqlLanguageCode },
		pause: shouldPause,
	});

	useEffect(() => setLoadingCheckout(fetching || stale), [fetching, setLoadingCheckout, stale]);

	return useMemo(
		() => ({
			checkout: data?.checkout as Checkout,
			fetching: fetching || stale,
			refetch,
			hasCheckoutId: !!id,
		}),
		[data?.checkout, fetching, refetch, stale, id],
	);
};
