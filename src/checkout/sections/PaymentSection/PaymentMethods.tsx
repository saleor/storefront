import { useMemo } from "react";
import { paymentMethodToComponent } from "./supportedPaymentApps";
import { PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection/PaymentSectionSkeleton";
import { usePayments } from "@/checkout/sections/PaymentSection/usePayments";
import { useCheckoutUpdateState } from "@/checkout/state/updateStateStore";
import { useCheckout } from "@/checkout/hooks/useCheckout";

export const PaymentMethods = () => {
	const { checkout } = useCheckout();
	const { availablePaymentGateways, fetching } = usePayments();
	const {
		changingBillingCountry,
		updateState: { checkoutDeliveryMethodUpdate },
	} = useCheckoutUpdateState();

	const gatewaysWithDefinedComponent = useMemo(
		() => availablePaymentGateways.filter((gateway) => gateway.id in paymentMethodToComponent),
		[availablePaymentGateways],
	);

	// Check if checkout is ready for payment processing
	const isCheckoutReady = useMemo(() => {
		if (!checkout) return false;

		// Must have billing address
		if (!checkout.billingAddress) {
			return false;
		}

		// If shipping is required, must have shipping address and delivery method
		if (checkout.isShippingRequired) {
			if (!checkout.shippingAddress || !checkout.deliveryMethod) {
				return false;
			}
		}

		// Must have a stable total (not zero)
		if (!checkout.totalPrice?.gross?.amount || checkout.totalPrice.gross.amount <= 0) {
			return false;
		}

		return true;
	}, [checkout]);

	// Show skeleton while loading or checkout not ready
	if (changingBillingCountry || fetching || checkoutDeliveryMethodUpdate === "loading" || !isCheckoutReady) {
		return <PaymentSectionSkeleton />;
	}

	return (
		<div className="gap-y-8">
			{gatewaysWithDefinedComponent.map((gateway) => {
				const Component = paymentMethodToComponent[gateway.id];
				return (
					<Component
						key={gateway.id}
						// @ts-expect-error -- gateway matches the id but TypeScript doesn't know that
						config={gateway}
					/>
				);
			})}
		</div>
	);
};
