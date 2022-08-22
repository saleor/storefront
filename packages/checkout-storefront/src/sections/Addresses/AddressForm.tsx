import { Button } from "@/checkout-storefront/components/Button";
import { TextInput } from "@/checkout-storefront/components/TextInput";
import {
  AddressValidationData,
  useAddressValidationRulesQuery,
} from "@/checkout-storefront/graphql";
import { useErrorMessages } from "@/checkout-storefront/hooks/useErrorMessages";
import { UseErrors } from "@/checkout-storefront/hooks/useErrors";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useGetInputProps } from "@/checkout-storefront/hooks/useGetInputProps";
import { useSetFormErrors } from "@/checkout-storefront/hooks/useSetFormErrors";
import { AddressField } from "@/checkout-storefront/lib/globalTypes";
import { TrashIcon } from "@/checkout-storefront/icons";
import { useValidationResolver } from "@/checkout-storefront/lib/utils";
import { useEffect, useRef, useState } from "react";
import { DefaultValues, Path, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { object, string } from "yup";
import { AddressFormData } from "./types";
import { Select } from "@saleor/ui-kit";
import { Title } from "@/checkout-storefront/components/Title";
import { UseCountrySelect } from "@/checkout-storefront/hooks/useErrors/useCountrySelect";
import { useAddressFormUtils } from "./useAddressFormUtils";
import { IconButton } from "@/checkout-storefront/components";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import {
  emptyFormData,
  isMatchingAddressFormData,
} from "@/checkout-storefront/sections/Addresses/utils";
import { isEqual } from "lodash-es";

export interface AddressFormProps<TFormData extends AddressFormData>
  extends Omit<UseErrors<TFormData>, "setApiErrors">,
    Pick<UseCountrySelect, "countryCode" | "setCountryCode" | "countryOptions"> {
  defaultValues?: Partial<TFormData>;
  onCancel?: () => void;
  onDelete?: () => void;
  loading?: boolean;
  onSubmit: SubmitHandler<TFormData>;
  autoSave?: boolean;
  title: string;
}

export const AddressForm = <TFormData extends AddressFormData>({
  defaultValues = {},
  onCancel,
  onSubmit,
  errors,
  clearErrors: onClearErrors,
  autoSave = false,
  countryOptions,
  countryCode,
  setCountryCode,
  onDelete,
  loading = false,
  title,
}: AddressFormProps<TFormData>) => {
  const formatMessage = useFormattedMessages();
  const { errorMessages } = useErrorMessages();
  const [countryArea, setCountryArea] = useState<string>(defaultValues.countryArea || "");
  const defaultValuesRef = useRef<Partial<TFormData> | undefined>(defaultValues);

  const schema = object({
    firstName: string().required(errorMessages.required),
    lastName: string().required(errorMessages.required),
    streetAddress1: string().required(errorMessages.required),
    postalCode: string().required(errorMessages.required),
    city: string().required(errorMessages.required),
  });

  const resolver = useValidationResolver(schema);

  const formProps = useForm<TFormData>({
    resolver: resolver as unknown as Resolver<TFormData, any>,
    mode: "onBlur",
    defaultValues: defaultValues as DefaultValues<TFormData>,
  });

  const { handleSubmit, getValues, setError, clearErrors, reset } = formProps;

  useSetFormErrors({ setError, errors });

  const getInputProps = useGetInputProps(formProps);

  const [{ data }] = useAddressValidationRulesQuery({
    variables: { countryCode },
  });

  const validationRules = data?.addressValidationRules;

  const { sortedAddressFields, getFieldLabel, isRequiredField } = useAddressFormUtils(
    validationRules as AddressValidationData
  );

  const handleCancel = () => {
    clearErrors();
    onClearErrors();

    if (onCancel) {
      onCancel();
    }
  };

  const handleSave = (address: TFormData) => {
    onClearErrors();
    onSubmit(countryArea ? { ...address, countryCode, countryArea } : { ...address, countryCode });
  };

  const handleAutoSave = () => {
    if (!autoSave) {
      return;
    }

    const formData = getValues();
    onSubmit({ ...formData, countryCode });
  };

  useEffect(() => {
    const formData = getValues();
    const submitData = { ...formData, countryCode };
    if (autoSave && !isMatchingAddressFormData(submitData, defaultValues)) {
      onSubmit(submitData);
    }
  }, [countryCode]);

  useEffect(() => {
    if (!Object.keys(defaultValues).length && !isEqual(defaultValues, defaultValuesRef.current)) {
      reset(emptyFormData as TFormData);

      defaultValuesRef.current = defaultValues;
    }
  }, [defaultValues]);

  return (
    <>
      <div className="flex flex-row justify-between items-baseline">
        <Title>{title}</Title>
        <Select
          classNames={{ container: "!w-1/2" }}
          onChange={setCountryCode}
          selectedValue={countryCode}
          options={countryOptions}
        />
      </div>
      <div className="mt-2">
        {sortedAddressFields.map((field: AddressField) => {
          const isRequired = isRequiredField(field);
          const label = getFieldLabel(field);

          if (field === "countryArea" && isRequired) {
            return (
              <Select
                classNames={{ container: "mb-4" }}
                placeholder={label}
                onChange={setCountryArea}
                selectedValue={countryArea}
                options={
                  validationRules?.countryAreaChoices.map(({ verbose, raw }) => ({
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
                onBlur: handleAutoSave,
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
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={handleSubmit(handleSave)}
                label={formatMessage("processing")}
              />
            ) : (
              <Button
                ariaLabel={formatMessage("saveLabel")}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={handleSubmit(handleSave)}
                label={formatMessage("saveAddress")}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};
