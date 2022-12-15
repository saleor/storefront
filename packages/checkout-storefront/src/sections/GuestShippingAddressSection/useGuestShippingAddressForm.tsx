import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { useAddressFormUrlChange } from "@/checkout-storefront/components/AddressForm/useAddressFormUrlChange";
import { useCheckoutShippingAddressUpdateMutation } from "@/checkout-storefront/graphql";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { omit } from "lodash-es";
import {
  getAddressFormDataFromAddress,
  getAddressInputData,
  getAddressValidationRulesVariables,
} from "@/checkout-storefront/components/AddressForm/utils";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";

export const useGuestShippingAddressForm = () => {
  const {
    checkout: { shippingAddress },
  } = useCheckout();
  const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();

  const { debouncedSubmit } = useSubmit<AddressFormData, typeof checkoutShippingAddressUpdate>({
    scope: "checkoutShippingUpdate",
    onSubmit: checkoutShippingAddressUpdate,
    parse: ({ languageCode, checkoutId, ...rest }) => ({
      languageCode,
      checkoutId,
      shippingAddress: getAddressInputData(omit(rest, "channel")),
      validationRules: getAddressValidationRulesVariables({ autoSave: true }),
    }),
  });

  const form = useForm<AddressFormData>({
    onSubmit: debouncedSubmit,
    initialValues: getAddressFormDataFromAddress(shippingAddress),
  });

  useAddressFormUrlChange(form);

  useCheckoutFormValidationTrigger({
    form,
    scope: "shippingAddress",
  });

  return form;
};
