import { useAddressFormUrlChange } from "@/checkout-storefront/components/AddressForm/useAddressFormUrlChange";
import { getAddressFormDataFromAddress } from "@/checkout-storefront/components/AddressForm/utils";
import { useCheckoutBillingAddressUpdateMutation } from "@/checkout-storefront/graphql";
import { useFormSubmit } from "@/checkout-storefront/hooks/useFormSubmit";
import { omit } from "lodash-es";
import {
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

interface GuestBillingAddressFormProps {
  skipValidation: boolean;
}

export const useGuestBillingAddressForm = ({ skipValidation }: GuestBillingAddressFormProps) => {
  const {
    checkout: { billingAddress },
  } = useCheckout();
  const validationSchema = useAddressFormSchema();
  const [, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();

  const onSubmit = useFormSubmit<AutoSaveAddressFormData, typeof checkoutBillingAddressUpdate>(
    useMemo(
      () => ({
        scope: "checkoutBillingUpdate",
        onSubmit: checkoutBillingAddressUpdate,
        parse: ({ languageCode, checkoutId, ...rest }) => ({
          languageCode,
          checkoutId,
          billingAddress: getAddressInputData(omit(rest, ["channel"])),
          validationRules: getAddressValidationRulesVariables({ autoSave: true }),
        }),
      }),
      [checkoutBillingAddressUpdate]
    )
  );

  const form = useAutoSaveAddressForm({
    onSubmit,
    initialValues: getAddressFormDataFromAddress(billingAddress),
    validationSchema,
    scope: "checkoutBillingUpdate",
  });

  useAddressFormUrlChange(form);

  useCheckoutFormValidationTrigger({
    form,
    scope: "billingAddress",
    skip: skipValidation,
  });

  return form;
};
