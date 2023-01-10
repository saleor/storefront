import { Address } from "@/checkout-storefront/components/AddressForm/types";
import {
  getAddressInputDataFromAddress,
  getAddressValidationRulesVariables,
  isMatchingAddress,
  isMatchingAddressData,
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
  const previousShippingAddress = useRef<Address>(shippingAddress);

  const hasBillingSameAsShipping = isMatchingAddress(shippingAddress, billingAddress);

  const [, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();

  const onSubmit = useFormSubmit<
    BillingSameAsShippingFormData,
    typeof checkoutBillingAddressUpdate
  >({
    scope: "checkoutBillingUpdate",
    onSubmit: checkoutBillingAddressUpdate,
    shouldAbort: ({ formData }) => {
      if (isMatchingAddress(shippingAddress, formData.billingAddress)) {
        console.log("ABORTIEREN");
        console.log(formData.billingAddress, billingAddress);
        return true;
      } else {
        console.log("PROCEDIEREN");
        return false;
      }
    },
    parse: ({ languageCode, checkoutId, billingAddress }) => ({
      languageCode,
      checkoutId,
      billingAddress: getAddressInputDataFromAddress(billingAddress),
      validationRules: getAddressValidationRulesVariables({ autoSave }),
    }),
    onSuccess: ({ formData, formHelpers: { resetForm }, result }) => {
      resetForm({
        values: {
          ...formData,
          billingAddress: result?.data?.checkoutBillingAddressUpdate?.checkout?.billingAddress,
        },
      });
    },
  });

  const initialValues = {
    billingSameAsShipping: checkout?.isShippingRequired
      ? !billingAddress || hasBillingSameAsShipping
      : false,
    billingAddress: billingAddress,
  };

  const previousBillingSameAsShipping = useRef(initialValues.billingSameAsShipping);

  const form = useForm<BillingSameAsShippingFormData>({
    onSubmit,
    initialValues,
  });

  const {
    values: { billingSameAsShipping },
    setFieldValue,
    handleSubmit,
  } = form;

  useEffect(() => {
    const handleBillingSameAsShippingChanged = async () => {
      const hasBillingSameAsShippingChanged =
        billingSameAsShipping && !previousBillingSameAsShipping.current;

      if (hasBillingSameAsShippingChanged) {
        console.log("SAME SAME");
        previousBillingSameAsShipping.current = true;
        await setFieldValue("billingAddress", shippingAddress);
        handleSubmit();
        return;
      }

      previousBillingSameAsShipping.current = false;
    };

    void handleBillingSameAsShippingChanged();
  }, [billingSameAsShipping, handleSubmit, setFieldValue, shippingAddress]);

  useEffect(() => {
    const handleShippingAddressChanged = async () => {
      const hasShippingAddressChanged = !isMatchingAddressData(
        shippingAddress,
        previousShippingAddress.current
      );

      console.log({
        hasShippingAddressChanged,
        shippingAddress,
        prev: previousShippingAddress.current,
      });

      if (!hasShippingAddressChanged) {
        return;
      }

      previousShippingAddress.current = shippingAddress;

      if (billingSameAsShipping) {
        console.log("SUBMITEN");
        await setFieldValue("billingAddress", shippingAddress);
        handleSubmit();
      }
    };

    void handleShippingAddressChanged();
  }, [billingSameAsShipping, handleSubmit, setFieldValue, shippingAddress]);

  return form;
};
