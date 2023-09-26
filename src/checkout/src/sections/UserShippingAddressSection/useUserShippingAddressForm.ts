import {
  getAddressInputDataFromAddress,
  getAddressValidationRulesVariables,
  getByMatchingAddress,
  isMatchingAddress,
} from "@/checkout/src/components/AddressForm/utils";
import {
  type AddressFragment,
  useCheckoutShippingAddressUpdateMutation,
} from "@/checkout/src/graphql";
import { useCheckout } from "@/checkout/src/hooks/useCheckout";
import { useFormSubmit } from "@/checkout/src/hooks/useFormSubmit";
import { useUser } from "@/checkout/src/hooks/useUser";
import { getById } from "@/checkout/src/lib/utils/common";
import {
  type AddressListFormData,
  useAddressListForm,
} from "@/checkout/src/sections/AddressList/useAddressListForm";
import { useMemo } from "react";

export const useUserShippingAddressForm = () => {
  const { checkout } = useCheckout();
  const { shippingAddress } = checkout;
  const { user } = useUser();
  const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();

  const onSubmit = useFormSubmit<AddressListFormData, typeof checkoutShippingAddressUpdate>(
    useMemo(
      () => ({
        scope: "checkoutShippingUpdate",
        onSubmit: checkoutShippingAddressUpdate,
        shouldAbort: ({ formData: { addressList, selectedAddressId } }) =>
          !selectedAddressId ||
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
