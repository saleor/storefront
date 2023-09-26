import { type OrderFragment, type ShippingFragment } from "@/checkout/src/graphql";
import { Text } from "@/checkout/ui-kit";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";

import { Section } from "./Section";
import { deliveryMethodsMessages } from "@/checkout/src/sections/DeliveryMethods/messages";

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

    return formatMessage(deliveryMethodsMessages.businessDays, {
      min: min.toString(),
      max: max.toString(),
    });
  };

  return (
    <Section title={formatMessage(deliveryMethodsMessages.deliveryMethod)}>
      {!isShipping(deliveryMethod) ? (
        <Text color="secondary">
          {formatMessage(deliveryMethodsMessages.shippingMethodNotApplicable)}
        </Text>
      ) : (
        <>
          <Text>{deliveryMethod.name}</Text>
          <Text>{getDeliveryEstimateText()}</Text>
        </>
      )}
    </Section>
  );
};
