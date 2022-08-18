import { Title } from "@/checkout-storefront/components/Title";
import { Text } from "@saleor/ui-kit";
import {
  CountryCode,
  ShippingMethod,
  useCheckoutDeliveryMethodUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import React, { useEffect, useRef, useState } from "react";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { SelectBox } from "@/checkout-storefront/components/SelectBox";
import { SelectBoxGroup } from "@/checkout-storefront/components/SelectBoxGroup";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { extractMutationErrors, getById, getFormattedMoney } from "@/checkout-storefront/lib/utils";
import { Divider } from "@/checkout-storefront/components/Divider";
import { CommonSectionProps } from "@/checkout-storefront/lib/globalTypes";

export const DeliveryMethods: React.FC<CommonSectionProps> = ({ collapsed }) => {
  const formatMessage = useFormattedMessages();
  const { checkout } = useCheckout();
  const { shippingMethods, shippingAddress, deliveryMethod } = checkout;
  const { showErrors } = useAlerts("checkoutDeliveryMethodUpdate");
  const [selectedMethodId, setSelectedMethodId] = useState(checkout?.deliveryMethod?.id);
  const shippingCountryRef = useRef<CountryCode | undefined | null>(
    shippingAddress?.country?.code as CountryCode | undefined
  );

  const [, updateDeliveryMethod] = useCheckoutDeliveryMethodUpdateMutation();

  const hasValidMethodSelected =
    selectedMethodId && shippingMethods.some(getById(selectedMethodId));

  const handleAutoSetMethod = () => {
    if (!shippingMethods.length) {
      return;
    }

    const cheapestMethod = shippingMethods.reduce(
      (resultMethod, currentMethod) =>
        currentMethod.price.amount < resultMethod.price.amount ? currentMethod : resultMethod,
      shippingMethods[0] as ShippingMethod
    );

    void handleSubmit(cheapestMethod.id);
  };

  const handleAutoSetMethodAfterMethodsListChange = () => {};

  useEffect(handleAutoSetMethodAfterMethodsListChange, [shippingMethods]);

  useEffect(() => {
    const hasShippingCountryChanged = shippingAddress?.country?.code !== shippingCountryRef.current;

    if (hasValidMethodSelected) {
      return;
    }

    handleAutoSetMethod();

    if (hasShippingCountryChanged) {
      shippingCountryRef.current = shippingAddress?.country?.code as CountryCode;
    }
  }, [shippingAddress, shippingMethods]);

  useEffect(() => {
    if (!deliveryMethod) {
      return;
    }

    setSelectedMethodId(deliveryMethod.id);
  }, [deliveryMethod]);

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
