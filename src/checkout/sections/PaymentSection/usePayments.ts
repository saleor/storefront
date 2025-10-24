import { useEffect } from "react";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";
import { type PaymentStatus } from "@/checkout/sections/PaymentSection/types";
import { usePaymentGatewaysInitialize } from "@/checkout/sections/PaymentSection/usePaymentGatewaysInitialize";
import { usePaymentStatus } from "@/checkout/sections/PaymentSection/utils";

const paidStatuses: PaymentStatus[] = ["overpaid", "paidInFull", "authorized"];

export const usePayments = () => {
	const { checkout } = useCheckout();
	const paymentStatus = usePaymentStatus(checkout);

	const { fetching, availablePaymentGateways } = usePaymentGatewaysInitialize();

	const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();

	useEffect(() => {
		// the checkout was already paid earlier, complete
		// BUT: Don't auto-complete if total is 0 (user should review and confirm manually)
		const checkoutAmount = checkout?.totalPrice?.gross?.amount;
		if (!completingCheckout && paidStatuses.includes(paymentStatus) && checkoutAmount !== 0) {
			void onCheckoutComplete();
		}
	}, [completingCheckout, onCheckoutComplete, paymentStatus, checkout?.totalPrice?.gross?.amount]);

	return { fetching, availablePaymentGateways };
};
