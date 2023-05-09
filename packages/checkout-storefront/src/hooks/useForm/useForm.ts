import {
  ChangeHandler,
  FormDataBase,
  FormDataField,
  FormProps,
  UseFormReturn,
} from "@/checkout-storefront/hooks/useForm/types";
import { useFormik, useFormikContext } from "formik";
import { isEqual } from "lodash-es";
import { useCallback, useState } from "react";
import { ValidationError } from "yup";

export const useForm = <TData extends FormDataBase>({
  initialDirty = false,
  ...formProps
}: FormProps<TData>): UseFormReturn<TData> => {
  const { validationSchema } = formProps;
  // @ts-expect-error because the props we pass and overwrite here don't
  // always match what formik wants like e.g validateForm
  const form = useFormik<TData>(formProps);
  // we do this because in some cases it's not updated properly
  // https://github.com/jaredpalmer/formik/issues/3165
  const [dirty, setDirty] = useState(initialDirty);
  const [formValues, setFormValues] = useState(formProps.initialValues);

  const {
    handleSubmit: handleFormikSubmit,
    handleChange: formikHandleChange,
    setErrors: setFormikErrors,
    setFieldValue: setFormikFieldValue,
  } = form;

  const handleSubmit = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      // we do it here because formik doesn't pass props like dirty to onSubmit
      if (dirty) {
        handleFormikSubmit(event);
      }
    },
    [dirty, handleFormikSubmit]
  );

  const setValues = useCallback(
    (newValues: Partial<TData>) => {
      const updatedValues = { ...formValues, ...newValues };
      setDirty(!isEqual(formProps.initialValues, updatedValues));
      setFormValues(updatedValues);
    },
    [formProps.initialValues, formValues]
  );

  const handleChange: ChangeHandler = useCallback(
    (event) => {
      const { name, value } = event.target;

      setValues({ [name]: value } as Partial<TData>);

      formikHandleChange(event);
    },
    [setValues, formikHandleChange]
  );

  const setFieldValue = async (field: FormDataField<TData>, value: TData[FormDataField<TData>]) => {
    if (formValues[field] === value) {
      return;
    }

    await setFormikFieldValue(field, value);
    setFormValues({ ...formValues, [field]: value });
  };

  const validateForm = (values: TData) => {
    if (!validationSchema) {
      return {};
    }

    try {
      //  formik also has this types to "any"
      // will be fixed along with adding proper type to schema
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      validationSchema.validateSync(values, { abortEarly: false });
      return {};
    } catch (e) {
      const errors: ValidationError = { ...(e as ValidationError) };

      if (!errors?.inner) {
        return {};
      }

      const parsedErrors = errors.inner.reduce(
        (result, { path, message }) => (path ? { ...result, [path]: message } : result),
        {}
      );
      setFormikErrors(parsedErrors);
      return parsedErrors;
    }
  };

  return {
    ...form,
    handleSubmit,
    handleChange,
    values: formValues,
    dirty,
    setFieldValue,
    validateForm,
    setValues,
  };
};

export const useFormContext = useFormikContext;
