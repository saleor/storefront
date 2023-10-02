import { AdyenDropIn } from "@/checkout/sections/PaymentSection/AdyenDropIn/AdyenDropIn";
import { PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection/PaymentSectionSkeleton";
import { usePayments } from "@/checkout/sections/PaymentSection/usePayments";
import { useCheckoutUpdateState } from "@/checkout/state/updateStateStore";

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

	return <div className="mb-8">{adyen ? <AdyenDropIn config={adyen} /> : null}</div>;
};
