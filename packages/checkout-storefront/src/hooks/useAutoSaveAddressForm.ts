import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import { useAddressFormSchema } from "@/checkout-storefront/components/AddressForm/useAddressFormSchema";
import { CountryCode } from "@/checkout-storefront/graphql";
import { useDebouncedSubmit } from "@/checkout-storefront/hooks/useDebouncedSubmit";
import {
  BlurHandler,
  ChangeHandler,
  FormHelpers,
  FormProps,
  hasErrors,
  useForm,
  UseFormReturn,
} from "@/checkout-storefront/hooks/useForm";
import {
  CheckoutUpdateStateScope,
  useCheckoutUpdateStateChange,
} from "@/checkout-storefront/state/updateStateStore";
import { pick } from "lodash-es";
import { useCallback, useMemo } from "react";

export type AutoSaveAddressFormData = Partial<AddressFormData>;

export const useAutoSaveAddressForm = ({
  scope,
  ...formProps
}: FormProps<AutoSaveAddressFormData> & {
  scope: CheckoutUpdateStateScope;
}): UseFormReturn<AutoSaveAddressFormData> & { handleSubmit: (event: any) => Promise<void> } => {
  const { setCheckoutUpdateState } = useCheckoutUpdateStateChange(scope);
  const { initialValues, onSubmit } = formProps;
  const { setCountryCode, validationSchema } = useAddressFormSchema(initialValues.countryCode);

  const form = useForm<AutoSaveAddressFormData>({ ...formProps, validationSchema });
  const { values, validateForm, dirty, handleBlur, handleChange } = form;

  const debouncedSubmit = useDebouncedSubmit(onSubmit);

  const formHelpers = useMemo(() => {
    const formHelpersRaw = pick(form, [
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
    ]);

    return {
      ...formHelpersRaw,
      setFieldValue: (...args: Parameters<typeof form.setFieldValue>) => {
        form.setFieldValue(...args);
        return Promise.resolve();
      },
    } as FormHelpers<Partial<AddressFormData>>;
  }, [form]);

  // it'd make sense for onSubmit prop to be optional but formik has ignored this
  // request for forever now https://github.com/jaredpalmer/formik/issues/2675
  // so we're just gonna add a partial submit for guest address form to work
  const partialSubmit = useCallback(async () => {
    const formErrors = validateForm(values);

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
    const { name, value } = event.target;

    if (name === "countryCode") {
      setCountryCode(value as CountryCode);
    }

    handleChange(event);
    void partialSubmit();
  };

  const onBlur: BlurHandler = (event) => {
    handleBlur(event);
    void partialSubmit();
  };

  return { ...form, handleChange: onChange, handleBlur: onBlur, handleSubmit: partialSubmit };
};
