import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { SelectBoxGroup } from "@/checkout-storefront/components/SelectBoxGroup";
import { SelectBox } from "@/checkout-storefront/components/SelectBox";
import { Text } from "@saleor/ui-kit";
import { paymentSectionLabels, paymentMethodsMessages } from "./messages";
import { usePaymentMethodsForm } from "@/checkout-storefront/sections/PaymentSection/usePaymentMethodsForm";
import { FormProvider } from "@/checkout-storefront/providers/FormProvider";

export const PaymentMethods = () => {
  const formatMessage = useFormattedMessages();
  const { form, availablePaymentMethods } = usePaymentMethodsForm();

  return (
    <FormProvider form={form}>
      <SelectBoxGroup
        label={formatMessage(paymentSectionLabels.paymentProviders)}
        className="flex flex-row gap-2"
      >
        {availablePaymentMethods.map((paymentMethodId) => (
          <SelectBox
            key={paymentMethodId}
            className="shrink"
            name="selectedMethodId"
            value={paymentMethodId}
          >
            <Text>{formatMessage(paymentMethodsMessages[paymentMethodId])}</Text>
          </SelectBox>
        ))}
      </SelectBoxGroup>
    </FormProvider>
  );
};
