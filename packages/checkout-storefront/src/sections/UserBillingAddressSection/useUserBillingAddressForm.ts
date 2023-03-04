import {
  getAddressInputDataFromAddress,
  getAddressValidationRulesVariables,
  getByMatchingAddress,
  isMatchingAddress,
} from "@/checkout-storefront/components/AddressForm/utils";
import {
  AddressFragment,
  useCheckoutBillingAddressUpdateMutation,
} from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { useUser } from "@/checkout-storefront/hooks/useUser";
import { getById } from "@/checkout-storefront/lib/utils/common";
import {
  AddressListFormData,
  useAddressListForm,
} from "@/checkout-storefront/sections/AddressList/useAddressListForm";

export const useUserBillingAddressForm = () => {
  const { checkout } = useCheckout();
  const { billingAddress } = checkout;
  const { user } = useUser();
  const [, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();

  const onSubmit = useFormSubmit<AddressListFormData, typeof checkoutBillingAddressUpdate>({
    scope: "checkoutBillingUpdate",
    onSubmit: checkoutBillingAddressUpdate,
    shouldAbort: ({ formData: { addressList, selectedAddressId } }) =>
      isMatchingAddress(billingAddress, addressList.find(getById(selectedAddressId))),
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
    defaultAddress: user?.defaultBillingAddress,
    checkoutAddress: checkout.billingAddress,
  });

  return { form, userAddressActions };
};
