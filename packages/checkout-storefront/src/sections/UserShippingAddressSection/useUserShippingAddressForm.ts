import {
  getAddressInputDataFromAddress,
  getAddressValidationRulesVariables,
  getByMatchingAddress,
} from "@/checkout-storefront/components/AddressForm/utils";
import {
  AddressFragment,
  useCheckoutShippingAddressUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useDebouncedSubmit } from "@/checkout-storefront/hooks/useDebouncedSubmit";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import {
  AddressListFormData,
  useAddressListForm,
} from "@/checkout-storefront/sections/AddressList/useAddressListForm";
import { useAuthState } from "@saleor/sdk";
import { useMemo } from "react";

export const useUserShippingAddressForm = () => {
  const { checkout } = useCheckout();
  const { user } = useAuthState();
  const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();

  const onSubmit = useFormSubmit<AddressListFormData, typeof checkoutShippingAddressUpdate>(
    useMemo(
      () => ({
        scope: "checkoutShippingUpdate",
        onSubmit: checkoutShippingAddressUpdate,
        parse: ({ languageCode, checkoutId, selectedAddressId, addressList }) => ({
          languageCode,
          checkoutId,
          validationRules: getAddressValidationRulesVariables(),
          shippingAddress: getAddressInputDataFromAddress(
            addressList.find(getByMatchingAddress({ id: selectedAddressId })) as AddressFragment
          ),
        }),
      }),
      [checkoutShippingAddressUpdate]
    )
  );

  const debouncedSubmit = useDebouncedSubmit(onSubmit);

  const { form, userAddressActions } = useAddressListForm({
    onSubmit,
    debouncedSubmit,
    defaultAddress: user?.defaultShippingAddress,
    checkoutAddress: checkout.shippingAddress,
  });

  return { form, userAddressActions };
};
