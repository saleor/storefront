import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { SelectBoxGroup } from "@/checkout-storefront/components/SelectBoxGroup";
import { SelectBox } from "@/checkout-storefront/components/SelectBox";
import { Text } from "@saleor/ui-kit";
import { paymentSectionLabels, paymentMethodsMessages } from "./messages";
import { usePaymentMethodsForm } from "@/checkout-storefront/sections/PaymentSection/usePaymentMethodsForm";
import { PaymentMethodID } from "checkout-common";
import { ChangeEvent } from "react";
import { AdyenDropIn } from "./AdyenDropIn/AdyenDropIn";

export const PaymentMethods = () => {
  const formatMessage = useFormattedMessages();
  const {
    availablePaymentMethods,
    availablePaymentProviders,
    onSelectPaymentMethod,
    selectedPaymentMethod,
  } = usePaymentMethodsForm();

  const showAdyenDropin = availablePaymentProviders.includes("adyen");
  const showOtherPaymentProviders = availablePaymentProviders.some(
    (provider) => provider && provider !== "adyen"
  );

  return (
    <>
      {showAdyenDropin && <AdyenDropIn />}
      {showOtherPaymentProviders && (
        <SelectBoxGroup
          label={formatMessage(paymentSectionLabels.paymentProviders)}
          className="flex flex-row gap-2"
        >
          {availablePaymentMethods.map((paymentMethodId) => (
            <SelectBox
              key={paymentMethodId}
              className="shrink"
              value={paymentMethodId}
              selectedValue={selectedPaymentMethod || availablePaymentMethods[0]}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onSelectPaymentMethod(event.target.value as PaymentMethodID)
              }
            >
              <Text>{formatMessage(paymentMethodsMessages[paymentMethodId])}</Text>
            </SelectBox>
          ))}
        </SelectBoxGroup>
      )}
    </>
  );
};
