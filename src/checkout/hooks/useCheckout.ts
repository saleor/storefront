import { useEffect, useMemo } from "react";

import { type Checkout, useCheckoutQuery } from "@/checkout/graphql";
import { localeToLanguageCode } from "@/checkout/lib/utils/locale";
import { useLocale } from "@/checkout/hooks/useLocale";
import { extractCheckoutIdFromUrl } from "@/checkout/lib/utils/url";
import { useCheckoutUpdateStateActions } from "@/checkout/state/updateStateStore";

export const useCheckout = ({ pause = false } = {}) => {
	const id = useMemo(() => extractCheckoutIdFromUrl(), []);
	const { locale } = useLocale();
	const { setLoadingCheckout } = useCheckoutUpdateStateActions();

	const [{ data, fetching: loading, stale }, refetch] = useCheckoutQuery({
		variables: { id, languageCode: localeToLanguageCode(locale) },
		pause: pause,
	});

	useEffect(() => setLoadingCheckout(loading || stale), [loading, setLoadingCheckout, stale]);

	return useMemo(
		() => ({ checkout: data?.checkout as Checkout, loading: loading || stale, refetch }),
		[data?.checkout, loading, refetch, stale],
	);
};
