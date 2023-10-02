import { Section } from "./Section";
import { type OrderFragment, type ShippingFragment } from "@/checkout/graphql";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";

import { deliveryMethodsMessages } from "@/checkout/sections/DeliveryMethods/messages";

const isShipping = (deliveryMethod: OrderFragment["deliveryMethod"]): deliveryMethod is ShippingFragment =>
	deliveryMethod?.__typename === "ShippingMethod";

export const DeliverySection = ({ deliveryMethod }: { deliveryMethod: OrderFragment["deliveryMethod"] }) => {
	const formatMessage = useFormattedMessages();

	const getDeliveryEstimateText = () => {
		const { minimumDeliveryDays: min, maximumDeliveryDays: max } = deliveryMethod as ShippingFragment;

		if (!min || !max) {
			return undefined;
		}

		return formatMessage(deliveryMethodsMessages.businessDays, {
			min: min.toString(),
			max: max.toString(),
		});
	};

	return (
		<Section title={formatMessage(deliveryMethodsMessages.deliveryMethod)}>
			{!isShipping(deliveryMethod) ? (
				<p color="secondary">{formatMessage(deliveryMethodsMessages.shippingMethodNotApplicable)}</p>
			) : (
				<>
					<p>{deliveryMethod.name}</p>
					<p>{getDeliveryEstimateText()}</p>
				</>
			)}
		</Section>
	);
};
