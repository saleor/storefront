import { Button } from "@/checkout-storefront/components/Button";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { UseErrors } from "@/checkout-storefront/hooks/useErrors";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useGetInputProps } from "@/checkout-storefront/hooks/useGetInputProps";
import { useSetFormErrors } from "@/checkout-storefront/hooks/useSetFormErrors";
import { AddressField } from "@/checkout-storefront/lib/globalTypes";
import { TrashIcon } from "@/checkout-storefront/icons";
import { useValidationResolver } from "@/checkout-storefront/lib/utils";
import { useEffect, useRef } from "react";
import { DefaultValues, Path, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { object, string } from "yup";
import { AddressFormData } from "./types";
import { Select } from "@saleor/ui-kit";
import { Title } from "@/checkout-storefront/components/Title";
import { useAddressFormUtils } from "./useAddressFormUtils";
import { IconButton } from "@/checkout-storefront/components";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { emptyFormData } from "@/checkout-storefront/sections/Addresses/utils";
import { isEqual } from "lodash-es";
import { useCheckoutFormValidationTrigger } from "@/checkout-storefront/hooks/useCheckoutFormValidationTrigger";
import { useFormDebouncedSubmit } from "@/checkout-storefront/hooks/useFormDebouncedSubmit";
import { useCountrySelectProps } from "./useCountrySelectProps";

export interface AddressFormProps<TFormData extends AddressFormData>
  extends Omit<UseErrors<TFormData>, "setApiErrors"> {
  defaultValues?: TFormData;
  onCancel?: () => void;
  onDelete?: () => void;
  loading?: boolean;
  onSubmit: SubmitHandler<TFormData>;
  autoSave?: boolean;
  title: string;
  checkAddressAvailability: boolean;
}

export const AddressForm = <TFormData extends AddressFormData>({
  defaultValues = emptyFormData as TFormData,
  onCancel,
  onSubmit,
  errors,
  clearErrors: onClearErrors,
  autoSave = false,
  onDelete,
  loading = false,
  title,
  checkAddressAvailability,
}: AddressFormProps<TFormData>) => {
  const formatMessage = useFormattedMessages();
  const { errorMessages } = useErrorMessages();
  const defaultValuesRef = useRef<TFormData>(defaultValues);
  const { initialCountryCode, countryOptions } = useCountrySelectProps({
    defaultFormData: defaultValues,
    checkAddressAvailability,
  });

  const schema = object({
    firstName: string().required(errorMessages.required),
    lastName: string().required(errorMessages.required),
    streetAddress1: string().required(errorMessages.required),
    postalCode: string().required(errorMessages.required),
    city: string().required(errorMessages.required),
    cityArea: string(),
    countryArea: string(),
    countryCode: string(),
  });

  const resolver = useValidationResolver(schema);

  const formProps = useForm<TFormData>({
    resolver: resolver as unknown as Resolver<TFormData, any>,
    mode: "onBlur",
    defaultValues: {
      ...(defaultValues as DefaultValues<TFormData>),
      countryCode: initialCountryCode,
    },
  });

  const {
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    watch,
    trigger,
    formState: { isDirty },
  } = formProps;

  useCheckoutFormValidationTrigger(trigger);

  useSetFormErrors({ setError, errors });

  const getInputProps = useGetInputProps(formProps);

  const { orderedAddressFields, getFieldLabel, isRequiredField, countryAreaChoices } =
    useAddressFormUtils(watch("countryCode"));

  const handleCancel = () => {
    clearErrors();
    onClearErrors();

    if (typeof onCancel === "function") {
      onCancel();
    }
  };

  const hasDataChanged = (formData: TFormData) => !isEqual(formData, defaultValuesRef.current);

  const handleOnSubmit = (formData: TFormData) => {
    if (hasDataChanged(formData)) {
      onSubmit(formData);
      return;
    }

    handleCancel();
  };

  const debouncedSubmit = useFormDebouncedSubmit<TFormData>({
    autoSave,
    defaultFormData: defaultValues,
    formData: watch(),
    trigger,
    isDirty,
    onSubmit: handleOnSubmit,
  });

  const handleChange = () => {
    if (!autoSave) {
      return;
    }

    debouncedSubmit(getValues());
  };

  useEffect(() => {
    if (isEqual(defaultValues, defaultValuesRef.current)) {
      return;
    }

    const dataToSet = !Object.keys(defaultValues).length ? emptyFormData : defaultValues;

    reset(dataToSet as TFormData);

    defaultValuesRef.current = defaultValues;
  }, [defaultValues]);

  return (
    <form>
      <div className="flex flex-row justify-between items-baseline">
        <Title>{title}</Title>
        <Select
          classNames={{ container: "!w-1/2" }}
          options={countryOptions}
          {...getInputProps("countryCode", { onChange: handleChange })}
        />
      </div>
      <div className="mt-2">
        {orderedAddressFields.map((field: AddressField) => {
          const isRequired = isRequiredField(field);
          const label = getFieldLabel(field);

          if (field === "countryArea" && isRequired) {
            return (
              <Select
                {...getInputProps("countryArea", { onChange: handleChange })}
                classNames={{ container: "mb-4" }}
                placeholder={label}
                options={
                  countryAreaChoices?.map(({ verbose, raw }) => ({
                    label: verbose as string,
                    value: raw as string,
                  })) || []
                }
              />
            );
          }

          return (
            <TextInput
              key={field}
              label={label}
              {...getInputProps(field as Path<TFormData>, {
                onChange: handleChange,
              })}
              optional={!isRequired}
            />
          );
        })}
        {!autoSave && (
          <div className="flex flex-row justify-end">
            {onDelete && (
              <IconButton
                className="mr-2"
                ariaLabel={formatMessage("deleteAddressLabel")}
                onClick={onDelete}
                icon={<img src={getSvgSrc(TrashIcon)} alt="" />}
              />
            )}

            <Button
              className="mr-2"
              ariaLabel={formatMessage("cancelLabel")}
              variant="secondary"
              onClick={handleCancel}
              label={formatMessage("cancel")}
            />
            {loading ? (
              <Button
                disabled
                ariaLabel={formatMessage("saveLabel")}
                onClick={handleSubmit(handleOnSubmit)}
                label={formatMessage("processing")}
              />
            ) : (
              <Button
                ariaLabel={formatMessage("saveLabel")}
                onClick={handleSubmit(handleOnSubmit)}
                label={formatMessage("saveAddress")}
              />
            )}
          </div>
        )}
      </div>
    </form>
  );
};
