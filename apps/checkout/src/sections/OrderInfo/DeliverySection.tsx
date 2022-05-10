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

  const renderContent = () => {
    if (!isShipping(deliveryMethod)) {
      return (
        <Text color="secondary">
          {formatMessage("shippingMethodNotApplicable")}
        </Text>
      );
    }

    const deliveryDaysRange = [
      deliveryMethod.minimumDeliveryDays,
      deliveryMethod.maximumDeliveryDays,
    ]
      .filter(Boolean)
      .join(" - ");

    return (
      <>
        <Text color="secondary">{deliveryMethod.name}</Text>
        {deliveryDaysRange && (
          <Text color="secondary">
            {formatMessage("shippingDeliveryEstimate", {
              deliveryDaysRange,
            })}
          </Text>
        )}
      </>
    );
  };

  return (
    <Section>
      <SectionTitle>{formatMessage("shippingMethodSection")}</SectionTitle>
      <div>{renderContent()}</div>
    </Section>
  );
};
