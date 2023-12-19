import { useEffect } from "react";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";
import { type PaymentStatus } from "@/checkout/sections/PaymentSection/types";
import { usePaymentGatewaysInitialize } from "@/checkout/sections/PaymentSection/usePaymentGatewaysInitialize";
import { usePaymentStatus } from "@/checkout/sections/PaymentSection/utils";
import { useIdempotency } from "@/checkout/hooks/useIdempotency";

const paidStatuses: PaymentStatus[] = ["overpaid", "paidInFull", "authorized"];

export const usePayments = () => {
	const { checkout } = useCheckout();
	const paymentStatus = usePaymentStatus(checkout);

	const { fetching, availablePaymentGateways } = usePaymentGatewaysInitialize();

	const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();

	const { clearIdempotencyKey } = useIdempotency();

	useEffect(() => {
		// the checkout was already paid earlier, complete
		if (!completingCheckout && paidStatuses.includes(paymentStatus)) {
			void clearIdempotencyKey();
			void onCheckoutComplete();
		}
	}, [completingCheckout, onCheckoutComplete, paymentStatus, clearIdempotencyKey]);

	return { fetching, availablePaymentGateways };
};
