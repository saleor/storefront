import { Address } from "@/checkout-storefront/components/AddressForm/types";
import {
  getAddressInputDataFromAddress,
  getAddressValidationRulesVariables,
  isMatchingAddress,
} from "@/checkout-storefront/components/AddressForm/utils";
import { useCheckoutBillingAddressUpdateMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { useEffect, useRef } from "react";

interface BillingSameAsShippingFormData {
  billingSameAsShipping: boolean;
  billingAddress: Address;
}

interface BillingSameAsShippingFormProps {
  autoSave: boolean;
}

export const useBillingSameAsShippingForm = (
  { autoSave }: BillingSameAsShippingFormProps = { autoSave: false }
) => {
  const { checkout } = useCheckout();
  const { billingAddress, shippingAddress } = checkout;
  const shippingAddressRef = useRef<Address>(shippingAddress);

  const hasBillingSameAsShipping = isMatchingAddress(shippingAddress, billingAddress);

  const [, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();

  const { onSubmit } = useFormSubmit<
    BillingSameAsShippingFormData,
    typeof checkoutBillingAddressUpdate
  >({
    scope: "checkoutBillingUpdate",
    onSubmit: checkoutBillingAddressUpdate,
    parse: ({ languageCode, checkoutId, billingAddress }) => ({
      languageCode,
      checkoutId,
      billingAddress: getAddressInputDataFromAddress(billingAddress),
      validationRules: getAddressValidationRulesVariables({ autoSave }),
    }),
    onSuccess: ({ formHelpers: { resetForm } }) => {
      resetForm();
    },
  });

  const initialValues = {
    billingSameAsShipping: checkout?.isShippingRequired
      ? !billingAddress || hasBillingSameAsShipping
      : false,
    billingAddress: billingAddress,
  };

  const form = useForm<BillingSameAsShippingFormData>({
    onSubmit,
    initialValues,
  });

  const {
    values: { billingSameAsShipping },
    setFieldValue,
    isSubmitting,
    handleSubmit,
  } = form;

  useEffect(() => {
    const handleBillingSameAsShippingChanged = async () => {
      if (billingSameAsShipping && !isSubmitting && !hasBillingSameAsShipping) {
        console.log({
          isSubmitting,
        });
        await setFieldValue("billingAddress", shippingAddress);
        handleSubmit();
      }
    };

    void handleBillingSameAsShippingChanged();
  }, [
    billingSameAsShipping,
    handleSubmit,
    hasBillingSameAsShipping,
    isSubmitting,
    setFieldValue,
    shippingAddress,
  ]);

  useEffect(() => {
    const handleShippingAddressChanged = async () => {
      const hasShippingAddressChanged = !isMatchingAddress(
        shippingAddress,
        shippingAddressRef.current
      );

      if (!hasShippingAddressChanged) {
        return;
      }

      shippingAddressRef.current = shippingAddress;

      if (billingSameAsShipping) {
        await setFieldValue("billingAddress", shippingAddress);
        handleSubmit();
      }
    };

    void handleShippingAddressChanged();
  }, [billingSameAsShipping, handleSubmit, setFieldValue, shippingAddress]);

  console.log({ isSubmitting });
  return form;
};
