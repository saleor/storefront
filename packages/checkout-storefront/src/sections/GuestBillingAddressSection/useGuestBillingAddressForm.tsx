import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { useAddressFormUrlChange } from "@/checkout-storefront/components/AddressForm/useAddressFormUrlChange";
import { getAddressFormDataFromAddress } from "@/checkout-storefront/components/AddressForm/utils";
import { useCheckoutBillingAddressUpdateMutation } from "@/checkout-storefront/graphql";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { omit } from "lodash-es";
import {
  getAddressInputData,
  getAddressValidationRulesVariables,
} from "@/checkout-storefront/components/AddressForm/utils";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";

export const useGuestBillingAddressForm = () => {
  const {
    checkout: { billingAddress },
  } = useCheckout();
  const [, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();

  const { debouncedSubmit } = useSubmit<AddressFormData, typeof checkoutBillingAddressUpdate>({
    scope: "checkoutBillingUpdate",
    onSubmit: checkoutBillingAddressUpdate,
    parse: ({ languageCode, checkoutId, ...rest }) => ({
      languageCode,
      checkoutId,
      billingAddress: getAddressInputData(omit(rest, "channel")),
      validationRules: getAddressValidationRulesVariables({ autoSave: true }),
    }),
  });

  const form = useForm<AddressFormData>({
    onSubmit: debouncedSubmit,
    initialValues: getAddressFormDataFromAddress(billingAddress),
  });

  useAddressFormUrlChange(form);

  useCheckoutFormValidationTrigger({
    form,
    scope: "shippingAddress",
  });

  return form;
};
