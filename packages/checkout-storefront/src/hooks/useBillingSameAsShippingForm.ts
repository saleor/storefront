import { Address } from "@/checkout-storefront/components/AddressForm/types";
import {
  getAddressFormDataFromAddress,
  getAddressValidationRulesVariables,
  isMatchingAddress,
} from "@/checkout-storefront/components/AddressForm/utils";
import { useCheckoutBillingAddressUpdateMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { useEffect, useRef } from "react";

interface BillingSameAsShippingFormData {
  billingSameAsShipping: boolean;
  billingAddress: Address;
}

export const useBillingSameAsShippingForm = () => {
  const { checkout } = useCheckout();
  const { billingAddress, shippingAddress } = checkout;
  const shippingAddressRef = useRef<Address>(shippingAddress);

  const hasBillingSameAsShipping = isMatchingAddress(shippingAddress, billingAddress);

  const [{ fetching: updating }, checkoutBillingAddressUpdate] =
    useCheckoutBillingAddressUpdateMutation();

  const { onSubmit } = useSubmit<
    BillingSameAsShippingFormData,
    typeof checkoutBillingAddressUpdate
  >({
    scope: "checkoutBillingUpdate",
    onSubmit: checkoutBillingAddressUpdate,
    parse: ({ languageCode, checkoutId, billingAddress }) => ({
      languageCode,
      checkoutId,
      billingAddress: getAddressFormDataFromAddress(billingAddress),
      validationRules: getAddressValidationRulesVariables(),
    }),
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
    handleSubmit,
  } = form;

  useEffect(() => {
    const handleBillingSameAsShippingChanged = async () => {
      if (billingSameAsShipping && !updating && !hasBillingSameAsShipping) {
        await setFieldValue("billingAddress", shippingAddress);
        handleSubmit();
      }
    };

    void handleBillingSameAsShippingChanged();
  }, [
    billingSameAsShipping,
    handleSubmit,
    hasBillingSameAsShipping,
    setFieldValue,
    shippingAddress,
    updating,
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

  return form;
};
