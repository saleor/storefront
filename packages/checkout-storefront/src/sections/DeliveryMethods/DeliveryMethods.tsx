import { Title } from "@/checkout-storefront/components/Title";
import { Text } from "@saleor/ui-kit";
import {
  ShippingMethod,
  useCheckoutDeliveryMethodUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import React, { useEffect, useState } from "react";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { SelectBox } from "@/checkout-storefront/components/SelectBox";
import { SelectBoxGroup } from "@/checkout-storefront/components/SelectBoxGroup";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { extractMutationErrors, getFormattedMoney } from "@/checkout-storefront/lib/utils";
import { CommonSectionProps } from "../Addresses/types";
import { Divider } from "@/checkout-storefront/components/Divider";

export const DeliveryMethods: React.FC<CommonSectionProps> = ({ collapsed }) => {
  const formatMessage = useFormattedMessages();
  const { checkout } = useCheckout();
  const { shippingMethods, shippingAddress, deliveryMethod } = checkout;
  const { showErrors } = useAlerts("checkoutDeliveryMethodUpdate");
  const [selectedMethodId, setSelectedMethodId] = useState(checkout?.deliveryMethod?.id);

  const [, updateDeliveryMethod] = useCheckoutDeliveryMethodUpdateMutation();

  useEffect(() => {
    if (selectedMethodId || !shippingMethods.length) {
      return;
    }

    const cheapestMethod = shippingMethods.reduce(
      (resultMethod, currentMethod) =>
        currentMethod.price.amount < resultMethod.price.amount ? currentMethod : resultMethod,
      shippingMethods[0] as ShippingMethod
    );

    setSelectedMethodId(cheapestMethod.id);
  }, [shippingAddress]);

  const handleSubmit = async (selectedMethodId: string) => {
    setSelectedMethodId(selectedMethodId);

    const result = await updateDeliveryMethod({
      deliveryMethodId: selectedMethodId as string,
      checkoutId: checkout.id,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (!hasErrors) {
      return;
    }

    showErrors(errors);
  };

  useEffect(() => {
    if (!deliveryMethod) {
      return;
    }

    setSelectedMethodId(deliveryMethod.id);
  }, [deliveryMethod]);

  const getSubtitle = ({ min, max }: { min?: number | null; max?: number | null }) => {
    if (!min || !max) {
      return undefined;
    }

    return formatMessage("businessDays", {
      min: min.toString(),
      max: max.toString(),
    });
  };

  if (!checkout?.isShippingRequired || collapsed) {
    return null;
  }

  return (
    <>
      <Divider />
      <div className="section">
        <Title className="mb-2">{formatMessage("deliveryMethod")}</Title>
        {!shippingAddress && (
          <Text>Please fill in shipping address to see available shipping methods</Text>
        )}
        <SelectBoxGroup label={formatMessage("deliveryMethodsLabel")}>
          {(shippingMethods as ShippingMethod[])?.map(
            ({ id, name, price, minimumDeliveryDays: min, maximumDeliveryDays: max }) => (
              <SelectBox
                value={id}
                selectedValue={selectedMethodId}
                onSelect={(methodId: string) => {
                  void handleSubmit(methodId);
                }}
              >
                <div className="min-h-12 grow flex flex-col justify-center pointer-events-none">
                  <div className="flex flex-row justify-between self-stretch items-center">
                    <Text>{name}</Text>
                    <Text>{getFormattedMoney(price)}</Text>
                  </div>
                  <Text size="xs" color="secondary">
                    {getSubtitle({ min, max })}
                  </Text>
                </div>
              </SelectBox>
            )
          )}
        </SelectBoxGroup>
      </div>
    </>
  );
};
