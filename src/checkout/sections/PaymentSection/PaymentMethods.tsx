import { useMemo } from "react";
import { StripeComponent } from "./StripeElements/stripeComponent";
import { PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection/PaymentSectionSkeleton";
import { useCheckoutUpdateState } from "@/checkout/state/updateStateStore";
import { useCheckout } from "@/checkout/hooks/useCheckout";

export const PaymentMethods = () => {
	const { checkout } = useCheckout();
	const {
		changingBillingCountry,
		updateState: { checkoutDeliveryMethodUpdate },
	} = useCheckoutUpdateState();

	const isReadyForPayment = useMemo(() => {
		return !!(
			checkout.billingAddress?.firstName &&
			checkout.billingAddress?.lastName &&
			checkout.billingAddress?.streetAddress1 &&
			checkout.billingAddress?.city &&
			checkout.billingAddress?.postalCode &&
			checkout.billingAddress?.country.code &&
			checkout.email &&
			checkout.shippingAddress &&
			checkout.shippingMethod
		);
	}, [checkout]);

	// delivery methods change total price so we want to wait until the change is done
	if (changingBillingCountry || checkoutDeliveryMethodUpdate === "loading") {
		return <PaymentSectionSkeleton />;
	}

	return (
		<div className="gap-y-8">
			<StripeComponent isReadyForPayment={isReadyForPayment} />
		</div>
	);
};
