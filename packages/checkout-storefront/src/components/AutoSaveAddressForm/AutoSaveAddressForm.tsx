import { AddressForm, AddressFormProps } from "@/checkout-storefront/components/AddressForm";
import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import {
  useAddressForm,
  UseAddressFormProps,
} from "@/checkout-storefront/components/AddressForm/useAddressForm";
import { AddressTypeEnum } from "@/checkout-storefront/graphql";
import { useCheckoutUpdateStateActions } from "@/checkout-storefront/state/updateStateStore";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";
import { useFormDebouncedSubmit } from "@/checkout-storefront/hooks/useFormDebouncedSubmit";

type AutoSaveAddressFormProps = UseAddressFormProps &
  Omit<AddressFormProps, "formProps" | "defaultInputOptions" | "children"> & {
    type: AddressTypeEnum;
  };

export const AutoSaveAddressForm: React.FC<AutoSaveAddressFormProps> = ({
  defaultValues,
  type,
  onSubmit,
  ...addressFormRest
}) => {
  const isShippingForm = type === "SHIPPING";
  const { setCheckoutUpdateState } = useCheckoutUpdateStateActions(
    isShippingForm ? "checkoutShippingUpdate" : "checkoutBillingUpdate"
  );
  const { formProps, onSubmit: handleSubmit } = useAddressForm({
    defaultValues,
    onSubmit,
  });
  const { getValues } = formProps;

  useCheckoutFormValidationTrigger({
    formProps,
    scope: isShippingForm ? "billingAddress" : "shippingAddress",
  });

  const debouncedSubmit = useFormDebouncedSubmit<AddressFormData>({
    defaultFormData: defaultValues,
    getValues,
    onSubmit: handleSubmit,
  });

  return (
    <AddressForm
      {...addressFormRest}
      defaultInputOptions={{
        onChange: () => {
          setCheckoutUpdateState("loading");
          debouncedSubmit();
        },
      }}
      formProps={formProps}
    />
  );
};
