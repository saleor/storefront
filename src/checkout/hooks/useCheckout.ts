import { useEffect, useMemo } from "react";

import { type Checkout, useCheckoutQuery } from "@/checkout/graphql";
import { extractCheckoutIdFromUrl } from "@/checkout/lib/utils/url";
import { useCheckoutUpdateStateActions } from "@/checkout/state/updateStateStore";

export const useCheckout = ({ pause = false } = {}) => {
	const id = useMemo(() => extractCheckoutIdFromUrl(), []);
	const { setLoadingCheckout } = useCheckoutUpdateStateActions();

	const [{ data, fetching, stale }, refetch] = useCheckoutQuery({
		variables: { id, languageCode: "EN_US" },
		pause: pause,
	});

	useEffect(() => setLoadingCheckout(fetching || stale), [fetching, setLoadingCheckout, stale]);

	return useMemo(
		() => ({ checkout: data?.checkout as Checkout, fetching: fetching || stale, refetch }),
		[data?.checkout, fetching, refetch, stale],
	);
};
