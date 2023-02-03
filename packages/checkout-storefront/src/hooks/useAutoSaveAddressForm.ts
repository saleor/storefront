import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { useDebouncedSubmit } from "@/checkout-storefront/hooks/useDebouncedSubmit";
import {
  BlurHandler,
  ChangeHandler,
  FormConfig,
  FormHelpers,
  hasErrors,
  useForm,
  UseFormReturn,
} from "@/checkout-storefront/hooks/useForm";
import {
  CheckoutUpdateStateScope,
  useCheckoutUpdateStateChange,
} from "@/checkout-storefront/state/updateStateStore";
import { pick } from "lodash-es";
import { useCallback } from "react";

export type AutoSaveAddressFormData = Partial<AddressFormData>;

export const useAutoSaveAddressForm = ({
  scope,
  ...formProps
}: FormConfig<AutoSaveAddressFormData> & {
  scope: CheckoutUpdateStateScope;
}): UseFormReturn<AutoSaveAddressFormData> & { handleSubmit: (event: any) => Promise<void> } => {
  const { setCheckoutUpdateState } = useCheckoutUpdateStateChange(scope);
  const { initialValues, onSubmit } = formProps;

  const form = useForm<AutoSaveAddressFormData>(formProps);
  const { values, validateForm, dirty, handleBlur, handleChange } = form;

  const debouncedSubmit = useDebouncedSubmit(onSubmit);

  const formHelpers = pick(form, [
    "setErrors",
    "setStatus",
    "setTouched",
    "setValues",
    "setSubmitting",
    "setFormikState",
    "setFieldValue",
    "setFieldTouched",
    "setFieldError",
    "validateForm",
    "validateField",
    "resetForm",
    "submitForm",
  ]) as FormHelpers<AutoSaveAddressFormData>;

  // it'd make sense for onSubmit prop to be optional but formik has ignored this
  // request for forever now https://github.com/jaredpalmer/formik/issues/2675
  // so we're just gonna add a partial submit for guest address form to work
  const partialSubmit = useCallback(async () => {
    const formErrors = await validateForm(values);

    if (!hasErrors(formErrors) && dirty) {
      setCheckoutUpdateState("loading");
      void debouncedSubmit(
        { ...initialValues, countryCode: values.countryCode, ...values },
        formHelpers
      );
    }
  }, [
    validateForm,
    values,
    dirty,
    setCheckoutUpdateState,
    debouncedSubmit,
    initialValues,
    formHelpers,
  ]);

  const onChange: ChangeHandler = (event) => {
    handleChange(event);
    void partialSubmit();
  };

  const onBlur: BlurHandler = (event) => {
    handleBlur(event);
    void partialSubmit();
  };

  return { ...form, handleChange: onChange, handleBlur: onBlur, handleSubmit: partialSubmit };
};
