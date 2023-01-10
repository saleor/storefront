import {
  getAddressInputDataFromAddress,
  getAddressValidationRulesVariables,
  getByMatchingAddress,
  isMatchingAddress,
} from "@/checkout-storefront/components/AddressForm/utils";
import {
  AddressFragment,
  useCheckoutShippingAddressUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { getById } from "@/checkout-storefront/lib/utils/common";
import {
  AddressListFormData,
  useAddressListForm,
} from "@/checkout-storefront/sections/AddressList/useAddressListForm";
import { useAuthState } from "@saleor/sdk";
import { useMemo } from "react";

export const useUserShippingAddressForm = () => {
  const { checkout } = useCheckout();
  const { shippingAddress } = checkout;
  const { user } = useAuthState();
  const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();

  const onSubmit = useFormSubmit<AddressListFormData, typeof checkoutShippingAddressUpdate>(
    useMemo(
      () => ({
        scope: "checkoutShippingUpdate",
        onSubmit: checkoutShippingAddressUpdate,
        shouldAbort: ({ formData: { addressList, selectedAddressId } }) =>
          isMatchingAddress(shippingAddress, addressList.find(getById(selectedAddressId))),
        parse: ({ languageCode, checkoutId, selectedAddressId, addressList }) => ({
          languageCode,
          checkoutId,
          validationRules: getAddressValidationRulesVariables(),
          shippingAddress: getAddressInputDataFromAddress(
            addressList.find(getByMatchingAddress({ id: selectedAddressId })) as AddressFragment
          ),
        }),
        onSuccess: ({ formHelpers: { resetForm }, formData }) => resetForm({ values: formData }),
      }),
      [checkoutShippingAddressUpdate, shippingAddress]
    )
  );

  const { form, userAddressActions } = useAddressListForm({
    onSubmit,
    defaultAddress: user?.defaultShippingAddress,
    checkoutAddress: shippingAddress,
  });

  return { form, userAddressActions };
};
