import {
  AddressInput,
  useCheckoutBillingAddressUpdateMutation,
  useCheckoutShippingAddressUpdateMutation,
} from "@/graphql";
import { useCheckout } from "@/hooks/useCheckout";
import { extractMutationErrors, getDataWithToken } from "@/lib/utils";
import { ApiErrors } from "@/providers/ErrorsProvider";
import { useEffect, useState } from "react";
import { AddressFormData } from "./types";
import { getAddressFormDataFromAddress, getAddressInputData } from "./utils";

export const useCheckoutAddressUpdate = ({
  useShippingAsBillingAddress,
}: {
  useShippingAsBillingAddress: boolean;
}) => {
  const { checkout } = useCheckout();

  const [shippingAddressUpdateErrors, setShippingAddressUpdateErrors] =
    useState<ApiErrors<AddressFormData>>([]);

  const [billingAddressUpdateErrors, setBillingAddressUpdateErrors] = useState<
    ApiErrors<AddressFormData>
  >([]);

  const [, checkoutShippingAddressUpdate] =
    useCheckoutShippingAddressUpdateMutation();

  const updateShippingAddress = async (address: AddressFormData) => {
    const result = await checkoutShippingAddressUpdate(
      getDataWithToken({ shippingAddress: getAddressInputData(address) })
    );

    const [hasErrors, errors] = extractMutationErrors(result);

    if (hasErrors) {
      setShippingAddressUpdateErrors(errors);
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
      setBillingAddressUpdateErrors(errors);
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
    shippingAddressUpdateErrors,
    billingAddressUpdateErrors,
  };
};
