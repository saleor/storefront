import { OrderFragment, ShippingFragment } from "@/checkout-storefront/graphql";
import { Text } from "@saleor/ui-kit";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";

import { Section } from "./Section";

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

    return formatMessage("businessDays", {
      min: min.toString(),
      max: max.toString(),
    });
  };

  return (
    <Section title={formatMessage("deliveryMethodSection")}>
      {!isShipping(deliveryMethod) ? (
        <Text color="secondary">{formatMessage("shippingMethodNotApplicable")}</Text>
      ) : (
        <>
          <Text>{deliveryMethod.name}</Text>
          <Text>{getDeliveryEstimateText()}</Text>
        </>
      )}
    </Section>
  );
};
