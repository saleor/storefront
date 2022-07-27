import { Title } from "@/checkout-storefront/components/Title";
import { Text } from "@saleor/ui-kit";
import {
  ShippingMethod,
  useCheckoutDeliveryMethodUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import React, { useEffect, useRef, useState } from "react";
import { getFormattedMoney } from "@/checkout-storefront/hooks/useFormattedMoney";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { RadioBox } from "@/checkout-storefront/components/RadioBox";
import { RadioBoxGroup } from "@/checkout-storefront/components/RadioBoxGroup";
import { useAlerts } from "@/checkout-storefront/hooks/useAlerts";
import { extractMutationErrors } from "@/checkout-storefront/lib/utils";

interface ShippingMethodsProps {}

export const ShippingMethods: React.FC<ShippingMethodsProps> = ({}) => {
  const formatMessage = useFormattedMessages();
  const { checkout } = useCheckout();
  const { showErrors, showSuccess } = useAlerts("checkoutDeliveryMethodUpdate");
  const [selectedMethodId, setSelectedMethodId] = useState(checkout?.deliveryMethod?.id);

  const selectedMethodIdRef = useRef(selectedMethodId);

  const [, updateDeliveryMethod] = useCheckoutDeliveryMethodUpdateMutation();

  const handleSubmit = async () => {
    const result = await updateDeliveryMethod({
      deliveryMethodId: selectedMethodId as string,
      checkoutId: checkout.id,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (!hasErrors) {
      showSuccess();
      return;
    }

    showErrors(errors);
  };

  useEffect(() => {
    if (selectedMethodId && selectedMethodId !== selectedMethodIdRef.current) {
      void handleSubmit();
    }
  }, [selectedMethodId]);

  const getSubtitle = ({ min, max }: { min?: number | null; max?: number | null }) => {
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
    <div className="mt-6 mb-8">
      <Title>{formatMessage("deliveryMethod")}</Title>
      {!checkout?.shippingAddress && (
        <Text>Please fill in shipping address to see available shipping methods</Text>
      )}
      <RadioBoxGroup label={formatMessage("shippingMethodsLabel")}>
        {(checkout?.shippingMethods as ShippingMethod[])?.map(
          ({ id, name, price, minimumDeliveryDays: min, maximumDeliveryDays: max }) => (
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
