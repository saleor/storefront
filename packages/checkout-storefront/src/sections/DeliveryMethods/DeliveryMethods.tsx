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
import { useUpdateShippingLockerIdMutation } from "@/checkout-storefront/graphql";

export const DeliveryMethods: React.FC<CommonSectionProps> = ({
  collapsed,
  onCourierSelection,
}) => {
  const formatMessage = useFormattedMessages();
  const { checkout } = useCheckout();
  const { authenticated } = useUser();
  const { shippingMethods, shippingAddress } = checkout;
  const form = useDeliveryMethodsForm();
  const { updateState } = useCheckoutUpdateState();
  const [, updateShippingLockerId] = useUpdateShippingLockerIdMutation();
  const [selectedRadio, setSelectedRadio] = useState<string>("");
  const [selectedInpostData, setSelectedInpostData] = useState<InpostEventData | null>(null);
  const [, setSelectedCourier] = useState("");

  const shippingMethodName = shippingMethods?.map((shippingMethod) => shippingMethod.name);
  const desiredCourier = "Kurier pobranie, GLS";

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

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
    setSelectedCourier(value);
    if (onCourierSelection) {
      onCourierSelection(value);
    }
  };

  const handleInpostDataChange = async (data: InpostEventData | null) => {
    setSelectedInpostData(data);
    if (data?.name) {
      await updateShippingLockerId({
        checkoutId: checkout.id,
        lockerId: data?.name,
      });
    }
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
                  name="selectedMethodName"
                  value={name}
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
        {selectedRadio === "Inpost paczkomaty" && (
          <React.Fragment>
            {selectedInpostData?.name != null && (
              <React.Fragment>
                <p style={{ padding: "1.2rem" }}>Wybrany Paczkomat: {selectedInpostData?.name}</p>
                <button
                  type="button"
                  className="Select-module_select__cjdcr"
                  style={{ backgroundColor: "#ffcb04" }}
                  onClick={resetInpostData}
                >
                  Zmień punkt odbioru InPost
                </button>
              </React.Fragment>
            )}
            {selectedInpostData?.name == null && (
              <ShippingMethodInpostMap onInpostDataChange={handleInpostDataChange} />
            )}
          </React.Fragment>
        )}
      </div>
    </FormProvider>
  );
};
