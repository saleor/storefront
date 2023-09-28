import { AdyenDropIn } from "@/checkout/src/sections/PaymentSection/AdyenDropIn/AdyenDropIn";
import { PaymentSectionSkeleton } from "@/checkout/src/sections/PaymentSection/PaymentSectionSkeleton";
import { usePayments } from "@/checkout/src/sections/PaymentSection/usePayments";
import { useCheckoutUpdateState } from "@/checkout/src/state/updateStateStore";

export const PaymentMethods = () => {
	const { availablePaymentGateways, fetching } = usePayments();
	const {
		changingBillingCountry,
		updateState: { checkoutDeliveryMethodUpdate },
	} = useCheckoutUpdateState();

	const { adyen } = availablePaymentGateways;

	// delivery methods change total price so we want to wait until the change is done
	if (changingBillingCountry || fetching || checkoutDeliveryMethodUpdate === "loading") {
		return <PaymentSectionSkeleton />;
	}

	return <div className="mb-3">{adyen ? <AdyenDropIn config={adyen} /> : null}</div>;
};
