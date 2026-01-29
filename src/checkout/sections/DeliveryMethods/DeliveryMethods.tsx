import type { FC } from "react";
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
export const DeliveryMethods: FC<CommonSectionProps> = ({ collapsed }) => {
	const { checkout } = useCheckout();
	const { shippingMethods, shippingAddress } = checkout;
	const form = useDeliveryMethodsForm();
	const { updateState } = useCheckoutUpdateState();

	const getSubtitle = ({ min, max }: { min?: number | null; max?: number | null }) => {
		if (!min || !max) {
			return undefined;
		}

		return `${min}-${max} business days`;
	};

	if (!checkout?.isShippingRequired || collapsed) {
		return null;
	}

	// Show skeleton while shipping address is being saved and methods are being fetched
	if (updateState.checkoutShippingUpdate === "loading") {
		return (
			<FormProvider form={form}>
				<Divider />
				<DeliveryMethodsSkeleton />
			</FormProvider>
		);
	}

	// Show message when shipping address is required but not filled
	if (!shippingAddress) {
		return (
			<FormProvider form={form}>
				<Divider />
				<div className="py-4" data-testid="deliveryMethods">
					<Title className="mb-2">Delivery methods</Title>
					<p>Please fill in shipping address to see available shipping methods</p>
				</div>
			</FormProvider>
		);
	}

	return (
		<FormProvider form={form}>
			<Divider />
			<div className="py-4" data-testid="deliveryMethods">
				<Title className="mb-2">Delivery methods</Title>
				<SelectBoxGroup label="delivery methods">
					{shippingMethods?.map(({ id, name, price, minimumDeliveryDays: min, maximumDeliveryDays: max }) => (
						<SelectBox key={id} name="selectedMethodId" value={id}>
							<div className="pointer-events-none flex min-h-12 grow flex-col justify-center">
								<div className="flex flex-row items-center justify-between self-stretch">
									<p>{name}</p>
									<p>{getFormattedMoney(price)}</p>
								</div>
								<p className="font-xs" color="secondary">
									{getSubtitle({ min, max })}
								</p>
							</div>
						</SelectBox>
					))}
				</SelectBoxGroup>
			</div>
		</FormProvider>
	);
};
