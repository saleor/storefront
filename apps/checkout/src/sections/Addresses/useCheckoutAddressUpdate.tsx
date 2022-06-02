import {
  AddressInput,
  useCheckoutBillingAddressUpdateMutation,
  useCheckoutShippingAddressUpdateMutation,
} from "@/graphql";
import { useCheckout } from "@/hooks/useCheckout";
import { extractMutationErrors } from "@/lib/utils";
import { useBillingSameAsShipping } from "@/providers/BillingSameAsShippingProvider";
import { useErrors } from "@/providers/ErrorsProvider";
import { useEffect } from "react";
import { AddressFormData } from "./types";
import { getAddressFormDataFromAddress, getAddressInputData } from "./utils";

export type UseAddressUpdateFn = (address: AddressFormData) => Promise<void>;

export const useCheckoutAddressUpdate = () => {
  const { checkout } = useCheckout();
  const { isBillingSameAsShippingAddress } = useBillingSameAsShipping();

  const { setApiErrors: setShippingApiErrors } = useErrors<AddressFormData>(
    "checkoutShippingUpdate"
  );
  const { setApiErrors: setBillingApiErrors } = useErrors<AddressFormData>(
    "checkoutBillingUpdate"
  );

  const [, checkoutShippingAddressUpdate] =
    useCheckoutShippingAddressUpdateMutation();

  const updateShippingAddress = async (address: AddressFormData) => {
    const result = await checkoutShippingAddressUpdate({
      id: checkout.id,
      shippingAddress: getAddressInputData(address),
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      setShippingApiErrors(errors);
      return;
    }

    if (isBillingSameAsShippingAddress) {
      handleUpdateBillingAddress(address);
    }
  };

  const [, checkoutBillingAddressUpdate] =
    useCheckoutBillingAddressUpdateMutation();

  const updateBillingAddress = async (addressInput: AddressInput) => {
    const result = await checkoutBillingAddressUpdate({
      id: checkout.id,
      billingAddress: addressInput,
    });

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      setBillingApiErrors(errors);
    }
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
  };
};
