import React from "react";
import { Title } from "@/checkout/components/Title";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { SelectBox } from "@/checkout/components/SelectBox";
import { SelectBoxGroup } from "@/checkout/components/SelectBoxGroup";
import { getFormattedMoney } from "@/checkout/lib/utils/money";
import { Divider } from "@/checkout/components/Divider";
import { type CommonSectionProps } from "@/checkout/lib/globalTypes";
import { useDeliveryMethodsForm } from "@/checkout/sections/DeliveryMethods/useDeliveryMethodsForm";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
import { useCheckoutUpdateState } from "@/checkout/state/updateStateStore";
import { DeliveryMethodsSkeleton } from "@/checkout/sections/DeliveryMethods/DeliveryMethodsSkeleton";
import { useUser } from "@/checkout/hooks/useUser";

export const DeliveryMethods: React.FC<CommonSectionProps> = ({ collapsed }) => {
	const { checkout } = useCheckout();
	const { authenticated } = useUser();
	const { shippingMethods, shippingAddress, totalPrice } = checkout;
	const form = useDeliveryMethodsForm();
	const { updateState } = useCheckoutUpdateState();

	const getSubtitle = ({ min, max }: { min?: number | null; max?: number | null }) => {
		if (!min || !max) {
			return undefined;
		}

		return `${min}-${max} business days`;
	};

	// Get order total in cents for comparison
	const orderTotal = totalPrice?.gross?.amount || 0;

	// Dynamically determine free shipping threshold based on available shipping methods
	const freeShippingMethods = shippingMethods?.filter((method) => method.price.amount === 0) || [];

	// If there are free shipping methods available, user already qualifies
	const qualifiesForFreeShipping = freeShippingMethods.length > 0;

	// For the message, we'll use a reasonable threshold (like $20 = 2000 cents) if no free shipping is available
	const defaultFreeShippingThreshold = 2000; // $20.00 in cents
	const amountNeededForFreeShipping = qualifiesForFreeShipping
		? 0
		: Math.max(0, defaultFreeShippingThreshold - orderTotal);

	const getFreeShippingMessage = () => {
		if (qualifiesForFreeShipping) {
			return "🎉 You qualify for free shipping!";
		} else {
			const amountFormatted = getFormattedMoney({
				amount: amountNeededForFreeShipping,
				currency: totalPrice?.gross?.currency || "USD",
			});
			return `Add ${amountFormatted} more to qualify for free shipping`;
		}
	};

	if (!checkout?.isShippingRequired || collapsed) {
		return null;
	}

	return (
		<FormProvider form={form}>
			<Divider />
			<div className="py-4" data-testid="deliveryMethods">
				<Title className="mb-2">Delivery methods</Title>

				{/* Show free shipping message */}
				{totalPrice && (
					<div
						className={`mb-3 rounded p-2 text-sm ${
							qualifiesForFreeShipping
								? "border border-green-200 bg-green-50 text-green-700"
								: "border border-blue-200 bg-blue-50 text-blue-700"
						}`}
					>
						{getFreeShippingMessage()}
					</div>
				)}

				{!authenticated && !shippingAddress && (
					<p className="mb-3 text-gray-600">
						Shipping options will be calculated based on your location. Default shipping rates shown for US
						addresses.
					</p>
				)}

				{authenticated && !shippingAddress && updateState.checkoutShippingUpdate ? (
					<DeliveryMethodsSkeleton />
				) : shippingMethods?.length > 0 ? (
					<SelectBoxGroup label="delivery methods">
						{shippingMethods.map(
							({ id, name, price, minimumDeliveryDays: min, maximumDeliveryDays: max }) => (
								<SelectBox key={id} name="selectedMethodId" value={id}>
									<div className="pointer-events-none flex min-h-12 grow flex-col justify-center">
										<div className="flex flex-row items-center justify-between self-stretch">
											<p className="font-medium">{name}</p>
											<p className={`font-semibold ${price.amount === 0 ? "text-green-600" : ""}`}>
												{price.amount === 0 ? "FREE" : getFormattedMoney(price)}
											</p>
										</div>
										<p className="text-xs text-gray-500">{getSubtitle({ min, max })}</p>
									</div>
								</SelectBox>
							),
						)}
					</SelectBoxGroup>
				) : (
					<div className="text-gray-600">
						<p>Loading shipping options...</p>
						<p className="mt-1 text-sm">
							Rates are calculated based on your order total and shipping location.
						</p>
					</div>
				)}
			</div>
		</FormProvider>
	);
};
