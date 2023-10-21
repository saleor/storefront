import { Section } from "./Section";
import { type OrderFragment, type ShippingFragment } from "@/checkout/graphql";

const isShipping = (deliveryMethod: OrderFragment["deliveryMethod"]): deliveryMethod is ShippingFragment =>
	deliveryMethod?.__typename === "ShippingMethod";

export const DeliverySection = ({ deliveryMethod }: { deliveryMethod: OrderFragment["deliveryMethod"] }) => {
	const getDeliveryEstimateText = () => {
		const { minimumDeliveryDays: min, maximumDeliveryDays: max } = deliveryMethod as ShippingFragment;

		if (!min || !max) {
			return undefined;
		}

		return `${min}-${max} business days`;
	};

	return (
		<Section title="Delivery method">
			{!isShipping(deliveryMethod) ? (
				<p color="secondary">Not applicable</p>
			) : (
				<>
					<p>{deliveryMethod.name}</p>
					<p>{getDeliveryEstimateText()}</p>
				</>
			)}
		</Section>
	);
};
