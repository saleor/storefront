import { Title } from "@/components/Title";
import { Text } from "@saleor/ui-kit";
import {
  ShippingMethod,
  useCheckoutDeliveryMethodUpdateMutation,
} from "@/graphql";
import { useCheckout } from "@/hooks/useCheckout";
import { getDataWithToken } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { getFormattedMoney } from "@/hooks/useFormattedMoney";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { RadioBox } from "@/components/RadioBox";
import { RadioBoxGroup } from "@/components/RadioBoxGroup";

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
      updateDeliveryMethod(
        getDataWithToken({ deliveryMethodId: selectedMethodId })
      );
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
