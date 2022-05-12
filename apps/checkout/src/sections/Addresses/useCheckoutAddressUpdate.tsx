import {
  AddressInput,
  useCheckoutBillingAddressUpdateMutation,
  useCheckoutShippingAddressUpdateMutation,
} from "@/graphql";
import { useCheckout } from "@/hooks/useCheckout";
import { extractMutationErrors, getDataWithToken } from "@/lib/utils";
import { useErrors } from "@/providers/ErrorsProvider";
import { useEffect } from "react";
import { AddressFormData } from "./types";
import { getAddressFormDataFromAddress, getAddressInputData } from "./utils";

export type UseAddressUpdateFn = (address: AddressFormData) => Promise<void>;

export const useCheckoutAddressUpdate = ({
  useShippingAsBillingAddress,
}: {
  useShippingAsBillingAddress: boolean;
}) => {
  const { checkout } = useCheckout();
  const { setApiErrors: setShippingApiErrors } = useErrors<AddressFormData>(
    "checkoutShippingUpdate"
  );
  const { setApiErrors: setBillingApiErrors } = useErrors<AddressFormData>(
    "checkoutBillingUpdate"
  );

  const [, checkoutShippingAddressUpdate] =
    useCheckoutShippingAddressUpdateMutation();

  const updateShippingAddress = async (address: AddressFormData) => {
    const result = await checkoutShippingAddressUpdate(
      getDataWithToken({ shippingAddress: getAddressInputData(address) })
    );

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      setShippingApiErrors(errors);
      return;
    }

    if (useShippingAsBillingAddress) {
      handleUpdateBillingAddress(address);
    }
  };

  const [, checkoutBillingAddressUpdate] =
    useCheckoutBillingAddressUpdateMutation();

  const updateBillingAddress = async (addressInput: AddressInput) => {
    const result = await checkoutBillingAddressUpdate(
      getDataWithToken({
        billingAddress: addressInput,
      })
    );

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
      useShippingAsBillingAddress && !!shippingAddress;

    if (shouldUpdateBillingAddress) {
      updateBillingAddress(
        getAddressInputData(getAddressFormDataFromAddress(shippingAddress))
      );
    }
  };

  const handleUpdateBillingAddress = (address: AddressFormData) =>
    updateBillingAddress(getAddressInputData(address));

  useEffect(setBillingAddressWhenSameAsShipping, [useShippingAsBillingAddress]);

  return {
    updateShippingAddress,
    updateBillingAddress: handleUpdateBillingAddress,
  };
};
