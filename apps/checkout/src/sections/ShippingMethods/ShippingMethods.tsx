import { Title } from "@/checkout/components/Title";
import { Text } from "@saleor/ui-kit";
import {
  ShippingMethod,
  useCheckoutDeliveryMethodUpdateMutation,
} from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import React, { useEffect, useState } from "react";
import { getFormattedMoney } from "@/checkout/hooks/useFormattedMoney";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { RadioBox } from "@/checkout/components/RadioBox";
import { RadioBoxGroup } from "@/checkout/components/RadioBoxGroup";

interface ShippingMethodsProps {}

export const ShippingMethods: React.FC<ShippingMethodsProps> = ({}) => {
  const formatMessage = useFormattedMessages();
  const { checkout } = useCheckout();
  const [selectedMethodId, setSelectedMethodId] = useState(
    checkout?.deliveryMethod?.id
  );
  const [, updateDeliveryMethod] = useCheckoutDeliveryMethodUpdateMutation();

  useEffect(() => {
    if (selectedMethodId) {
      updateDeliveryMethod({
        id: checkout.id,
        deliveryMethodId: selectedMethodId,
      });
    }
  }, [selectedMethodId]);

  const getSubtitle = ({
    min,
    max,
  }: {
    min?: number | null;
    max?: number | null;
  }) => {
    if (!min || !max) {
      return undefined;
    }

    return formatMessage("businessDays", {
      min: min.toString(),
      max: max.toString(),
    });
  };

  if (!checkout?.isShippingRequired) {
    return null;
  }

  return (
    <div className="mt-6">
      <Title>{formatMessage("deliveryMethod")}</Title>
      {!checkout?.shippingAddress && (
        <Text>
          Please fill in shipping address to see available shipping methods
        </Text>
      )}
      <RadioBoxGroup label={formatMessage("shippingMethodsLabel")}>
        {(checkout?.shippingMethods as ShippingMethod[])?.map(
          ({
            id,
            name,
            price,
            minimumDeliveryDays: min,
            maximumDeliveryDays: max,
          }) => (
            <RadioBox
              value={id}
              title={`${name} - ${getFormattedMoney(price)}`}
              subtitle={getSubtitle({ min, max })}
              selectedValue={selectedMethodId}
              onSelect={setSelectedMethodId}
            />
          )
        )}
      </RadioBoxGroup>
    </div>
  );
};
