import React from "react";
import { deliveryMethodsLabels, deliveryMethodsMessages } from "./messages";
import { Title } from "@/checkout/src/components/Title";
import { useCheckout } from "@/checkout/src/hooks/useCheckout";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { SelectBox } from "@/checkout/src/components/SelectBox";
import { SelectBoxGroup } from "@/checkout/src/components/SelectBoxGroup";
import { getFormattedMoney } from "@/checkout/src/lib/utils/money";
import { Divider } from "@/checkout/src/components/Divider";
import { type CommonSectionProps } from "@/checkout/src/lib/globalTypes";
import { useDeliveryMethodsForm } from "@/checkout/src/sections/DeliveryMethods/useDeliveryMethodsForm";
import { FormProvider } from "@/checkout/src/hooks/useForm/FormProvider";
import { useCheckoutUpdateState } from "@/checkout/src/state/updateStateStore";
import { DeliveryMethodsSkeleton } from "@/checkout/src/sections/DeliveryMethods/DeliveryMethodsSkeleton";
import { useUser } from "@/checkout/src/hooks/useUser";

export const DeliveryMethods: React.FC<CommonSectionProps> = ({ collapsed }) => {
	const formatMessage = useFormattedMessages();
	const { checkout } = useCheckout();
	const { authenticated } = useUser();
	const { shippingMethods, shippingAddress } = checkout;
	const form = useDeliveryMethodsForm();
	const { updateState } = useCheckoutUpdateState();

	const getSubtitle = ({ min, max }: { min?: number | null; max?: number | null }) => {
		if (!min || !max) {
			return undefined;
		}

		return formatMessage(deliveryMethodsMessages.businessDays, {
			min: min.toString(),
			max: max.toString(),
		});
	};

	if (!checkout?.isShippingRequired || collapsed) {
		return null;
	}

	return (
		<FormProvider form={form}>
			<Divider />
			<div className="px-4 pb-6 pt-5" data-testid="deliveryMethods">
				<Title className="mb-2">{formatMessage(deliveryMethodsMessages.deliveryMethods)}</Title>
				{!authenticated && !shippingAddress && (
					<p>{formatMessage(deliveryMethodsMessages.noShippingAddressMessage)}</p>
				)}
				{authenticated && !shippingAddress && updateState.checkoutShippingUpdate ? (
					<DeliveryMethodsSkeleton />
				) : (
					<SelectBoxGroup label={formatMessage(deliveryMethodsLabels.deliveryMethods)}>
						{shippingMethods?.map(
							({ id, name, price, minimumDeliveryDays: min, maximumDeliveryDays: max }) => (
								<SelectBox key={id} name="selectedMethodId" value={id}>
									<div className="min-h-12 pointer-events-none flex grow flex-col justify-center">
										<div className="flex flex-row items-center justify-between self-stretch">
											<p>{name}</p>
											<p>{getFormattedMoney(price)}</p>
										</div>
										<p className="font-xs" color="secondary">
											{getSubtitle({ min, max })}
										</p>
									</div>
								</SelectBox>
							),
						)}
					</SelectBoxGroup>
				)}
			</div>
		</FormProvider>
	);
};
