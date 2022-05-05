import { OrderFragment, ShippingFragment } from "@/graphql";
import { Text } from "@/components/Text";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";

import { Section, SectionTitle } from "./Section";

const isShipping = (
  deliveryMethod: OrderFragment["deliveryMethod"]
): deliveryMethod is ShippingFragment =>
  deliveryMethod?.__typename === "ShippingMethod";

export const DeliverySection = ({
  deliveryMethod,
}: {
  deliveryMethod: OrderFragment["deliveryMethod"];
}) => {
  const formatMessage = useFormattedMessages();

  if (!isShipping(deliveryMethod)) {
    return null;
  }

  const deliveryDaysRange = [
    deliveryMethod.minimumDeliveryDays,
    deliveryMethod.maximumDeliveryDays,
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <Section>
      <SectionTitle>{formatMessage("shippingMethodSection")}</SectionTitle>
      <div>
        <Text color="secondary">{deliveryMethod.name}</Text>
        {deliveryDaysRange && (
          <Text color="secondary">
            {formatMessage("shippingDeliveryEstimate", {
              deliveryDaysRange,
            })}
          </Text>
        )}
      </div>
    </Section>
  );
};
