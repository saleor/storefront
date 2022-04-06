import { Title } from "@components/Title";
import { Text } from "@components/Text";
import {
  ShippingMethod,
  useCheckoutDeliveryMethodUpdateMutation,
} from "@graphql";
import { useCheckout } from "@hooks/useCheckout";
import { getDataWithToken } from "@lib/utils";
import React, { useEffect, useState } from "react";

interface ShippingMethodsProps {}

export const ShippingMethods: React.FC<ShippingMethodsProps> = ({}) => {
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

  return (
    <div className="my-6">
      <Title>Shipping methods</Title>
      <Text className="mb-2">(scrollable)</Text>
      <div style={{ maxHeight: 300, overflowY: "scroll" }}>
        {(checkout?.shippingMethods as ShippingMethod[])?.map(
          ({ id, name, price }) => (
            <div>
              <input
                type="radio"
                className="mr-2 mt-1"
                checked={selectedMethodId === id}
                onChange={() => setSelectedMethodId(id)}
              />
              <label>{`${name} - ${price.amount} ${price.currency}`}</label>
            </div>
          )
        )}
      </div>
    </div>
  );
};
