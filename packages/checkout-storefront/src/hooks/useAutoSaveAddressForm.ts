import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { FormHelpers, useForm, UseFormReturn } from "@/checkout-storefront/hooks/useForm";
import { FormikConfig } from "formik";
import { pick } from "lodash-es";
import { useCallback } from "react";

export type AutoSaveAddressFormData = Partial<AddressFormData>;

export const useAutoSaveAddressForm = (
  formProps: FormikConfig<AutoSaveAddressFormData>
): UseFormReturn<AutoSaveAddressFormData> & { handleSubmit: (event: any) => Promise<void> } => {
  const { onSubmit } = formProps;

  const form = useForm<AutoSaveAddressFormData>(formProps);
  const { touched, values, validateForm, dirty } = form;

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
  const handleSubmit = useCallback(async () => {
    const touchedValues = pick(values, Object.keys(touched));

    const formErrors = await validateForm(values);

    const hasTouchedFieldsErrors = !!Object.keys(formErrors).filter((field) =>
      Object.keys(touchedValues).includes(field)
    ).length;

    if (!hasTouchedFieldsErrors && dirty) {
      void onSubmit(values, formHelpers);
    }
  }, [values, touched, validateForm, dirty, onSubmit, formHelpers]);

  return { ...form, handleSubmit };
};
