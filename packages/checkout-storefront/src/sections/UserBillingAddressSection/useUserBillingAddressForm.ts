import {
  getAddressInputData,
  getAddressInputDataFromAddress,
  getAddressValidationRulesVariables,
  getByMatchingAddress,
} from "@/checkout-storefront/components/AddressForm/utils";
import {
  AddressFragment,
  useCheckoutBillingAddressUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import {
  AddressListFormData,
  useAddressListForm,
} from "@/checkout-storefront/sections/AddressList/useAddressListForm";
import { useAuthState } from "@saleor/sdk";

export const useUserBillingAddressForm = () => {
  const { checkout } = useCheckout();
  const { user } = useAuthState();
  const [, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();

  const { onSubmit, debouncedSubmit } = useSubmit<
    AddressListFormData,
    typeof checkoutBillingAddressUpdate
  >({
    scope: "checkoutBillingUpdate",
    onSubmit: checkoutBillingAddressUpdate,
    parse: ({ languageCode, checkoutId, selectedAddressId, addressList }) => ({
      languageCode,
      checkoutId,
      validationRules: getAddressValidationRulesVariables(),
      billingAddress: getAddressInputDataFromAddress(
        addressList.find(getByMatchingAddress({ id: selectedAddressId })) as AddressFragment
      ),
    }),
  });

  const { form, userAddressActions } = useAddressListForm({
    onSubmit,
    debouncedSubmit,
    defaultAddress: user?.defaultBillingAddress,
    checkoutAddress: checkout.shippingAddress,
  });

  return { form, userAddressActions };
};
