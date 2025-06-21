import { paymentMethodToComponent } from "./supportedPaymentApps";
import { PaymentSectionSkeleton } from "@/checkout/sections/PaymentSection/PaymentSectionSkeleton";
import { usePayments } from "@/checkout/sections/PaymentSection/usePayments";
import { useCheckoutUpdateState } from "@/checkout/state/updateStateStore";

export const PaymentMethods = () => {
	const { availablePaymentGateways, fetching } = usePayments();
	const {
		changingBillingCountry,
		updateState: { checkoutDeliveryMethodUpdate },
	} = useCheckoutUpdateState();

	// delivery methods change total price so we want to wait until the change is done
	if (changingBillingCountry || fetching || checkoutDeliveryMethodUpdate === "loading") {
		return <PaymentSectionSkeleton />;
	}

	return (
		<div className="gap-y-8">
			{availablePaymentGateways.map((gateway) => {
				const Component = paymentMethodToComponent[gateway.id];

				// Handle unsupported payment gateways gracefully
				if (!Component) {
					console.warn(
						`Payment gateway "${gateway.id}" is not supported. Available gateways:`,
						Object.keys(paymentMethodToComponent),
					);
					return (
						<div key={gateway.id} className="rounded border border-yellow-300 bg-yellow-50 p-4">
							<p className="text-yellow-800">Payment method &quot;{gateway.id}&quot; is not yet supported.</p>
						</div>
					);
				}

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
