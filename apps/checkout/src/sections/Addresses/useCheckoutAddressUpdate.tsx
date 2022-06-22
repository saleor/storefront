import {
  AddressInput,
  useCheckoutBillingAddressUpdateMutation,
  useCheckoutShippingAddressUpdateMutation,
} from "@/checkout/graphql";
import { useAlerts } from "@/checkout/hooks/useAlerts";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useErrors } from "@/checkout/hooks/useErrors";
import { extractMutationErrors } from "@/checkout/lib/utils";
import { useBillingSameAsShipping } from "@/checkout/providers/BillingSameAsShippingProvider";
import { useEffect } from "react";
import { AddressFormData } from "./types";
import { getAddressFormDataFromAddress, getAddressInputData } from "./utils";

export type UseAddressUpdateFn = (address: AddressFormData) => Promise<void>;

export const useCheckoutAddressUpdate = () => {
  const { checkout } = useCheckout();
  const { isBillingSameAsShippingAddress } = useBillingSameAsShipping();

  const shippingErrorProps = useErrors<AddressFormData>();
  const { setApiErrors: setShippingErrors } = shippingErrorProps;
  const billingErrorProps = useErrors<AddressFormData>();
  const { setApiErrors: setBillingErrors } = shippingErrorProps;

  const { showSuccess, showErrors } = useAlerts();

  const [, checkoutShippingAddressUpdate] =
    useCheckoutShippingAddressUpdateMutation();

  const updateShippingAddress = async (address: AddressFormData) => {
    const result = await checkoutShippingAddressUpdate({
      checkoutId: checkout.id,
      shippingAddress: getAddressInputData(address),
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      showErrors(errors, "checkoutShippingUpdate");
      setShippingErrors(errors);
      return;
    }

    showSuccess("checkoutShippingUpdate");

    if (isBillingSameAsShippingAddress) {
      handleUpdateBillingAddress(address);
    }
  };

  const [, checkoutBillingAddressUpdate] =
    useCheckoutBillingAddressUpdateMutation();

  const updateBillingAddress = async (addressInput: AddressInput) => {
    const result = await checkoutBillingAddressUpdate({
      checkoutId: checkout.id,
      billingAddress: addressInput,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      showErrors(errors, "checkoutBillingUpdate");
      setBillingErrors(errors);
      return;
    }

    showSuccess("checkoutBillingUpdate");
  };

  const setBillingAddressWhenSameAsShipping = () => {
    if (!checkout) {
      return;
    }

    const { shippingAddress } = checkout;

    const shouldUpdateBillingAddress =
      isBillingSameAsShippingAddress && !!shippingAddress;

    if (shouldUpdateBillingAddress) {
      updateBillingAddress(
        getAddressInputData(getAddressFormDataFromAddress(shippingAddress))
      );
    }
  };

  const handleUpdateBillingAddress = (address: AddressFormData) =>
    updateBillingAddress(getAddressInputData(address));

  useEffect(setBillingAddressWhenSameAsShipping, [
    isBillingSameAsShippingAddress,
  ]);

  return {
    updateShippingAddress,
    updateBillingAddress: handleUpdateBillingAddress,
    shippingErrorProps,
    billingErrorProps,
  };
};
