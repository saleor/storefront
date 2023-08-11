import { Title } from "@/checkout-storefront/components/Title";
import { Text } from "@saleor/ui-kit";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import React, { useState } from "react";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { SelectBox } from "@/checkout-storefront/components/SelectBox";
import { SelectBoxGroup } from "@/checkout-storefront/components/SelectBoxGroup";
import { getFormattedMoney } from "@/checkout-storefront/lib/utils/money";
import { Divider } from "@/checkout-storefront/components/Divider";
import { CommonSectionProps } from "@/checkout-storefront/lib/globalTypes";
import { deliveryMethodsLabels, deliveryMethodsMessages } from "./messages";
import { useDeliveryMethodsForm } from "@/checkout-storefront/sections/DeliveryMethods/useDeliveryMethodsForm";
import { FormProvider } from "@/checkout-storefront/hooks/useForm/FormProvider";
import { useCheckoutUpdateState } from "@/checkout-storefront/state/updateStateStore";
import { DeliveryMethodsSkeleton } from "@/checkout-storefront/sections/DeliveryMethods/DeliveryMethodsSkeleton";
import { useUser } from "@/checkout-storefront/hooks/useUser";
import ShippingMethodInpostMap from "@/checkout-storefront/components/InpostMap/ShippingMethodInpostMap";
import { InpostEventData } from "@/checkout-storefront/components/InpostMap/ShippingMethodInpostMap";

export const DeliveryMethods: React.FC<CommonSectionProps> = ({ collapsed }) => {
  const formatMessage = useFormattedMessages();
  const { checkout } = useCheckout();
  const { authenticated } = useUser();
  const { shippingMethods, shippingAddress } = checkout;
  const form = useDeliveryMethodsForm();
  const { updateState } = useCheckoutUpdateState();

  const getSubtitle = ({ min, max }: { min?: number | null; max?: number | null }) => {
    if (!min || !max) {
      return undefined;
    }

    return formatMessage(deliveryMethodsMessages.businessDays, {
      min: min.toString(),
      max: max.toString(),
    });
  };

  if (!checkout?.isShippingRequired || collapsed) {
    return null;
  }

  const [selectedRadio, setSelectedRadioCode] = useState("");

  const handleRadioChange = (value: string) => {
    setSelectedRadioCode(value);
  };

  const [selectedInpostData, setSelectedInpostData] = useState<InpostEventData | null>(null);

  const handleInpostDataChange = (data: InpostEventData | null) => {
    setSelectedInpostData(data);
  };

  const resetInpostData = () => {
    setSelectedInpostData(null);
  };

  return (
    <FormProvider form={form}>
      <Divider />
      <div className="section" data-testid="deliveryMethods">
        <Title className="mb-2">{formatMessage(deliveryMethodsMessages.deliveryMethods)}</Title>
        {!authenticated && !shippingAddress && (
          <Text>{formatMessage(deliveryMethodsMessages.noShippingAddressMessage)}</Text>
        )}
        {authenticated && !shippingAddress && updateState.checkoutShippingUpdate ? (
          <DeliveryMethodsSkeleton />
        ) : (
          <SelectBoxGroup label={formatMessage(deliveryMethodsLabels.deliveryMethods)}>
            {shippingMethods?.map(
              ({ id, name, price, minimumDeliveryDays: min, maximumDeliveryDays: max }) => (
                <SelectBox
                  key={id}
                  name="selectedMethodId"
                  value={id}
                  onRadioChange={handleRadioChange}
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
        )}
        {selectedRadio == "U2hpcHBpbmdNZXRob2Q6NjQ=" && (
          <div>
            {selectedInpostData?.name != null && (
              <div>
                <p style={{ padding: "1.2rem" }}>Wybrany Paczkomat: {selectedInpostData?.name}</p>
                <button
                  className="Select-module_select__cjdcr"
                  style={{ backgroundColor: "#ffcb04" }}
                  onClick={resetInpostData}
                >
                  Zmień punkt odbioru InPost
                </button>
              </div>
            )}
            {selectedInpostData?.name == null && (
              <ShippingMethodInpostMap onInpostDataChange={handleInpostDataChange} />
            )}
          </div>
        )}
      </div>
    </FormProvider>
  );
};
