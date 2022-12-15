import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import {
  getAddressInputData,
  getAddressValidationRulesVariables,
} from "@/checkout-storefront/components/AddressForm/utils";
import { useCheckoutShippingAddressUpdateMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { useAddressListForm } from "@/checkout-storefront/sections/AddressList/useAddressListForm";
import { useAuthState } from "@saleor/sdk";
import { omit } from "lodash-es";

export const useUserShippingAddressForm = () => {
  const { checkout } = useCheckout();
  const { user } = useAuthState();
  const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();

  const { onSubmit, debouncedSubmit } = useSubmit<
    AddressFormData,
    typeof checkoutShippingAddressUpdate
  >({
    scope: "checkoutShippingUpdate",
    onSubmit: checkoutShippingAddressUpdate,
    parse: ({ autoSave, languageCode, checkoutId, ...rest }) => ({
      languageCode,
      checkoutId,
      shippingAddress: getAddressInputData(omit(rest, "channel")),
      validationRules: getAddressValidationRulesVariables(autoSave),
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
