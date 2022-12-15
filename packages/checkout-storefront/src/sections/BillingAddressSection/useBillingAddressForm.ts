import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { useAddressFormUrlChange } from "@/checkout-storefront/components/AddressForm/useAddressFormUrlChange";
import { getInitialAddresFormData } from "@/checkout-storefront/components/AddressForm/utils";
import { useCheckoutBillingAddressUpdateMutation } from "@/checkout-storefront/graphql";
import { useForm } from "@/checkout-storefront/hooks/useForm";
import { useSubmit } from "@/checkout-storefront/hooks/useSubmit";
import { omit } from "lodash-es";
import {
  getAddressInputData,
  getAddressValidationRulesVariables,
} from "@/checkout-storefront/components/AddressForm/utils";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";

export interface UseAddressFormProps {
  initialValues?: AddressFormData;
}

export const useGuestBillingAddressForm = ({ initialValues }: UseAddressFormProps) => {
  const [, checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();

  const { debouncedSubmit } = useSubmit<AddressFormData, typeof checkoutBillingAddressUpdate>({
    scope: "checkoutBillingUpdate",
    onSubmit: checkoutBillingAddressUpdate,
    parse: ({ autoSave, languageCode, checkoutId, ...rest }) => ({
      languageCode,
      checkoutId,
      billingAddress: getAddressInputData(omit(rest, "channel")),
      validationRules: getAddressValidationRulesVariables(autoSave),
    }),
  });

  const form = useForm<AddressFormData>({
    onSubmit: debouncedSubmit,
    initialValues: getInitialAddresFormData(initialValues),
  });

  useAddressFormUrlChange(form);

  useCheckoutFormValidationTrigger({
    form,
    scope: "billingAddress",
  });

  return form;
};
