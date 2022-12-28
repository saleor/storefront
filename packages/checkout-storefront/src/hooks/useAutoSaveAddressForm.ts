import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { useDebouncedSubmit } from "@/checkout-storefront/hooks/useDebouncedSubmit";
import { FormHelpers, useForm, UseFormReturn } from "@/checkout-storefront/hooks/useForm";
import { FormikConfig } from "formik";
import { pick } from "lodash-es";
import { ChangeEvent, useCallback } from "react";

export type AutoSaveAddressFormData = Partial<AddressFormData>;

export const useAutoSaveAddressForm = (
  formProps: FormikConfig<AutoSaveAddressFormData>
): UseFormReturn<AutoSaveAddressFormData> & { handleSubmit: (event: any) => Promise<void> } => {
  const { initialValues } = formProps;
  const { onSubmit } = formProps;

  const form = useForm<AutoSaveAddressFormData>(formProps);
  const { touched, values, validateForm, dirty, setFieldTouched, setFieldValue } = form;

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
    console.log("ENTERIN", touched);
    if (!Object.keys(touched).length) {
      return;
    }

    const touchedValues = pick(values, Object.keys(touched));

    console.log({ touched, touchedValues, dirty });

    const formErrors = await validateForm(values);

    const hasTouchedFieldsErrors = !!Object.keys(formErrors).filter((field) =>
      Object.keys(touchedValues).includes(field)
    ).length;

    if (!hasTouchedFieldsErrors && dirty) {
      console.log("SUBMITEN");
      void debouncedSubmit(
        { ...initialValues, countryCode: values.countryCode, ...touchedValues },
        formHelpers
      );
    }
  }, [values, touched, dirty, validateForm, debouncedSubmit, initialValues, formHelpers]);

  return { ...form, handleSubmit: partialSubmit };
};
