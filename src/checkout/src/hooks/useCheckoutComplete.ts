import { useMemo } from "react";
import { useCheckoutCompleteMutation } from "@/checkout/src/graphql";
import { useCheckout } from "@/checkout/src/hooks/useCheckout";
import { useSubmit } from "@/checkout/src/hooks/useSubmit";
import { replaceUrl } from "@/checkout/src/lib/utils/url";

export const useCheckoutComplete = () => {
	const {
		checkout: { id: checkoutId },
	} = useCheckout();
	const [{ fetching }, checkoutComplete] = useCheckoutCompleteMutation();

	const onCheckoutComplete = useSubmit<{}, typeof checkoutComplete>(
		useMemo(
			() => ({
				parse: () => ({
					checkoutId,
				}),
				onSubmit: checkoutComplete,
				onSuccess: ({ data }) => {
					const order = data.order;

					if (order) {
						const newUrl = replaceUrl({ query: { checkout: undefined, order: order.id } });
						window.location.href = newUrl;
					}
				},
			}),
			[checkoutComplete, checkoutId],
		),
	);
	return { completingCheckout: fetching, onCheckoutComplete };
};
