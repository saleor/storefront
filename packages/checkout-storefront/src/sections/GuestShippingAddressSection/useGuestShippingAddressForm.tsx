import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { useAddressFormUrlChange } from "@/checkout-storefront/components/AddressForm/useAddressFormUrlChange";
import { getInitialAddresFormData } from "@/checkout-storefront/components/AddressForm/utils";
import { useCheckoutShippingAddressUpdateMutation } from "@/checkout-storefront/graphql";
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

export const useGuestShippingAddressForm = ({ initialValues }: UseAddressFormProps) => {
  const [, checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();

  const { debouncedSubmit } = useSubmit<AddressFormData, typeof checkoutShippingAddressUpdate>({
    scope: "checkoutShippingUpdate",
    onSubmit: checkoutShippingAddressUpdate,
    parse: ({ autoSave, languageCode, checkoutId, ...rest }) => ({
      languageCode,
      checkoutId,
      shippingAddress: getAddressInputData(omit(rest, "channel")),
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
    scope: "shippingAddress",
  });

  return form;
};
