import { useAddressFormUrlChange } from "@/checkout-storefront/components/AddressForm/useAddressFormUrlChange";
import { useCheckoutShippingAddressUpdateMutation } from "@/checkout-storefront/graphql";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { omit } from "lodash-es";
import {
  getAddressFormDataFromAddress,
  getAddressInputData,
  getAddressValidationRulesVariables,
} from "@/checkout-storefront/components/AddressForm/utils";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { useAddressFormSchema } from "@/checkout-storefront/components/AddressForm/useAddressFormSchema";
import {
  AutoSaveAddressFormData,
  useAutoSaveAddressForm,
} from "@/checkout-storefront/hooks/useAutoSaveAddressForm";
import { useMemo } from "react";

export const useGuestShippingAddressForm = () => {
  const {
    checkout: { shippingAddress },
  } = useCheckout();
  const validationSchema = useAddressFormSchema();
  const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();

  const onSubmit = useFormSubmit<AutoSaveAddressFormData, typeof checkoutShippingAddressUpdate>(
    useMemo(
      () => ({
        scope: "checkoutShippingUpdate",
        onSubmit: checkoutShippingAddressUpdate,
        parse: ({ languageCode, checkoutId, ...rest }) => ({
          languageCode,
          checkoutId,
          shippingAddress: getAddressInputData(omit(rest, "channel")),
          validationRules: getAddressValidationRulesVariables({ autoSave: true }),
        }),
      }),
      [checkoutShippingAddressUpdate]
    )
  );

  const form = useAutoSaveAddressForm({
    onSubmit,
    initialValues: getAddressFormDataFromAddress(shippingAddress),
    validationSchema,
    scope: "checkoutShippingUpdate",
  });

  useAddressFormUrlChange(form);

  useCheckoutFormValidationTrigger({
    form,
    scope: "shippingAddress",
  });

  return form;
};
