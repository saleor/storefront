import { OptionalAddress } from "@/checkout-storefront/components/AddressForm/types";
import {
  getAddressInputDataFromAddress,
  getAddressValidationRulesVariables,
  getEmptyAddress,
  isMatchingAddress,
  isMatchingAddressData,
} from "@/checkout-storefront/components/AddressForm/utils";
import { useCheckoutBillingAddressUpdateMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { ChangeHandler, useForm } from "@/checkout-storefront/hooks/useForm";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { useCallback, useEffect, useRef } from "react";

interface BillingSameAsShippingFormData {
  billingSameAsShipping: boolean;
  billingAddress: OptionalAddress;
}

interface BillingSameAsShippingFormProps {
  autoSave: boolean;
  onSetBillingSameAsShipping?: (address: OptionalAddress) => void;
}

export const useBillingSameAsShippingForm = (
  { autoSave, onSetBillingSameAsShipping }: BillingSameAsShippingFormProps = { autoSave: false }
) => {
  const { checkout } = useCheckout();
  const { billingAddress, shippingAddress, isShippingRequired } = checkout;
  const previousShippingAddress = useRef<OptionalAddress>(shippingAddress);
  const previousIsShippingRequired = useRef(isShippingRequired);

  const [, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();

  const onSubmit = useFormSubmit<
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
    onSuccess: ({ formData, formHelpers: { resetForm }, result }) => {
      resetForm({
        values: {
          ...formData,
          billingAddress: result?.data?.checkoutBillingAddressUpdate?.checkout?.billingAddress,
        },
      });
    },
  });

  const getInitialShippingAsBillingValue = useCallback(() => {
    if (!checkout.isShippingRequired) {
      return false;
    }

    return !billingAddress || isMatchingAddress(shippingAddress, billingAddress);
  }, [shippingAddress, billingAddress, checkout.isShippingRequired]);

  const initialValues = {
    billingSameAsShipping: getInitialShippingAsBillingValue(),
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
    handleChange,
  } = form;

  const onChange: ChangeHandler = (event) => {
    if (event.target.name === "billingSameAsShipping") {
      previousBillingSameAsShipping.current = billingSameAsShipping;
    }
    handleChange(event);
  };

  // handle "billing same as shipping" checkbox value changes
  useEffect(() => {
    const handleBillingSameAsShippingChanged = async () => {
      const hasBillingSameAsShippingChangedToTrue =
        billingSameAsShipping && !previousBillingSameAsShipping.current;

      const hasBillingSameAsShippingChangedToFalse =
        !billingSameAsShipping && previousBillingSameAsShipping.current;

      if (hasBillingSameAsShippingChangedToFalse) {
        previousBillingSameAsShipping.current = false;

        // autosave means it's geust form and we want to show empty form
        // and clear all the fields in api
        if (autoSave) {
          setFieldValue("billingAddress", getEmptyAddress());
        }
        return;
      }

      if (!hasBillingSameAsShippingChangedToTrue) {
        return;
      }

      previousBillingSameAsShipping.current = true;
      setFieldValue("billingAddress", shippingAddress);
      if (typeof onSetBillingSameAsShipping === "function") {
        onSetBillingSameAsShipping(shippingAddress);
      }
    };

    void handleBillingSameAsShippingChanged();
  }, [
    autoSave,
    billingSameAsShipping,
    handleSubmit,
    onSetBillingSameAsShipping,
    setFieldValue,
    shippingAddress,
  ]);

  // once billing address in api and form don't match, submit
  useEffect(() => {
    if (!isMatchingAddress(billingAddress, form.values.billingAddress)) {
      handleSubmit();
    }
  }, [billingAddress, form.values.billingAddress, handleSubmit]);

  // when shipping address changes in the api, set it as billing address
  useEffect(() => {
    const handleShippingAddressChanged = async () => {
      const hasShippingAddressChanged = !isMatchingAddressData(
        shippingAddress,
        previousShippingAddress.current
      );

      if (!hasShippingAddressChanged) {
        return;
      }

      previousShippingAddress.current = shippingAddress;

      if (billingSameAsShipping) {
        setFieldValue("billingAddress", shippingAddress);
      }
    };

    void handleShippingAddressChanged();
  }, [billingSameAsShipping, handleSubmit, setFieldValue, shippingAddress]);

  useEffect(() => {
    if (!isShippingRequired && previousIsShippingRequired) {
      void setFieldValue("billingSameAsShipping", false);
    }
  }, [isShippingRequired, setFieldValue]);

  return {
    ...form,
    handleChange: onChange,
  };
};
