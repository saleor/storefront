import { OrderFragment, ShippingFragment } from "@/checkout-storefront/graphql";
import { Text } from "@saleor/ui-kit";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";

import { Section } from "./Section";
import { messages } from "@/checkout-storefront/sections/DeliveryMethods/messages";

const isShipping = (
  deliveryMethod: OrderFragment["deliveryMethod"]
): deliveryMethod is ShippingFragment => deliveryMethod?.__typename === "ShippingMethod";

export const DeliverySection = ({
  deliveryMethod,
}: {
  deliveryMethod: OrderFragment["deliveryMethod"];
}) => {
  const formatMessage = useFormattedMessages();

  const getDeliveryEstimateText = () => {
    const { minimumDeliveryDays: min, maximumDeliveryDays: max } =
      deliveryMethod as ShippingFragment;

    if (!min || !max) {
      return undefined;
    }

    return formatMessage(messages.businessDays, {
      min: min.toString(),
      max: max.toString(),
    });
  };

  return (
    <Section title={formatMessage(messages.deliveryMethod)}>
      {!isShipping(deliveryMethod) ? (
        <Text color="secondary">{formatMessage(messages.shippingMethodNotApplicable)}</Text>
      ) : (
        <>
          <Text>{deliveryMethod.name}</Text>
          <Text>{getDeliveryEstimateText()}</Text>
        </>
      )}
    </Section>
  );
};
