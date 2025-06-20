import { useEffect, useMemo } from "react";

import { type Checkout, useCheckoutQuery } from "@/checkout/graphql";
import { extractCheckoutIdFromUrl } from "@/checkout/lib/utils/url";
import { useCheckoutUpdateStateActions } from "@/checkout/state/updateStateStore";

export const useCheckout = ({ pause = false } = {}) => {
	const id = useMemo(() => extractCheckoutIdFromUrl(), []);
	const { setLoadingCheckout } = useCheckoutUpdateStateActions();

	const [{ data, fetching, stale, error }, refetch] = useCheckoutQuery({
		variables: { id, languageCode: "EN_US" },
		pause: pause,
	});

	useEffect(() => setLoadingCheckout(fetching || stale), [fetching, setLoadingCheckout, stale]);

	// Add debugging for GraphQL errors
	useEffect(() => {
		if (error) {
			console.error("Checkout GraphQL Error:", error);
			console.error("Error details:", JSON.stringify(error, null, 2));
		}
	}, [error]);

	return useMemo(
		() => ({
			checkout: data?.checkout as Checkout,
			fetching: fetching || stale,
			refetch,
			error,
		}),
		[data?.checkout, fetching, refetch, stale, error],
	);
};
