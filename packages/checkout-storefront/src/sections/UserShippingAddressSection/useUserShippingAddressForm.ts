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
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import {
  AddressListFormData,
  useAddressListForm,
} from "@/checkout-storefront/sections/AddressList/useAddressListForm";
import { useAuthState } from "@saleor/sdk";

export const useUserShippingAddressForm = () => {
  const { checkout } = useCheckout();
  const { user } = useAuthState();
  const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();

  const { onSubmit, debouncedSubmit } = useSubmit<
    AddressListFormData,
    typeof checkoutShippingAddressUpdate
  >({
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
  });

  const { form, userAddressActions } = useAddressListForm({
    onSubmit,
    debouncedSubmit,
    defaultAddress: user?.defaultShippingAddress,
    checkoutAddress: checkout.shippingAddress,
  });

  return { form, userAddressActions };
};
