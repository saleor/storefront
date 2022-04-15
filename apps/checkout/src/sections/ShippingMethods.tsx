import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
import {
  ShippingMethod,
  useCheckoutDeliveryMethodUpdateMutation,
} from "@/graphql";
import { useCheckout } from "@/hooks/useCheckout";
import { getDataWithToken } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { RadioGroup } from "@/components/RadioGroup";
import { getFormattedMoney } from "@/hooks/useFormattedMoney";
import { Radio } from "@/components/Radio";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";

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

  return (
    <div className="my-6">
      <Title>{formatMessage("deliveryMethod")}</Title>
      <RadioGroup label={formatMessage("shippingMethodsLabel")}>
        {(checkout?.shippingMethods as ShippingMethod[])?.map(
          ({
            id,
            name,
            price,
            minimumDeliveryDays: min,
            maximumDeliveryDays: max,
          }) => (
            <Radio
              value={id}
              title={`${name} - ${getFormattedMoney(price)}`}
              subtitle={getSubtitle({ min, max })}
              selectedValue={selectedMethodId}
              onSelect={setSelectedMethodId}
            />
          )
        )}
      </RadioGroup>
    </div>
  );
};
