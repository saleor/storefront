import { useEffect } from "react";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";
import { getQueryParams } from "@/checkout/lib/utils/url";

export const useCheckoutCompleteRedirect = () => {
	const { completingCheckout, onCheckoutComplete } = useCheckoutComplete();

	useEffect(() => {
		const { paymentIntent, paymentIntentClientSecret, processingPayment } = getQueryParams();

		if (!paymentIntent || !paymentIntentClientSecret || !processingPayment) {
			return;
		}

		if (!completingCheckout) {
			void onCheckoutComplete();
		}
	}, [completingCheckout, onCheckoutComplete]);
};
