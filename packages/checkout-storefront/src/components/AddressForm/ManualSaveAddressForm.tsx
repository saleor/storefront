import { AddressForm, AddressFormProps } from "@/checkout-storefront/components/AddressForm";
import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import {
  useAddressForm,
  UseAddressFormProps,
} from "@/checkout-storefront/components/AddressForm/useAddressForm";
import { Button } from "@/checkout-storefront/components/Button";
import { IconButton } from "@/checkout-storefront/components/IconButton";
import { UseErrors } from "@/checkout-storefront/hooks";
import { TrashIcon } from "@/checkout-storefront/icons";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";

interface ManualSaveAddressFormProps
  extends UseAddressFormProps,
    Omit<AddressFormProps, "formProps" | "defaultInputOptions" | "children">,
    Pick<UseErrors<AddressFormData>, "clearErrors"> {
  onDelete?: () => void;
  onCancel: () => void;
  onSubmit: (formData: AddressFormData) => void;
  loading: boolean;
}

export const ManualSaveAddressForm: React.FC<ManualSaveAddressFormProps> = ({
  defaultValues,
  onSubmit,
  clearErrors: onClearErrors,
  onDelete,
  loading,
  onCancel,
  ...addressFormRest
}) => {
  const intl = useIntl();

  const { formProps, onSubmit: handleOnSubmit } = useAddressForm({ defaultValues, onSubmit });
  const { handleSubmit, clearErrors } = formProps;

  const handleCancel = useCallback(() => {
    clearErrors();
    onClearErrors();

    onCancel();
  }, [clearErrors, onClearErrors, onCancel]);

  return (
    <AddressForm {...addressFormRest} formProps={formProps}>
      <div className="flex flex-row justify-end">
        {onDelete && (
          <IconButton
            className="mr-2"
            ariaLabel={intl.formatMessage({
              defaultMessage: "delete address",
              id: "AddressForm/ManualSaveAddressForm/RDNzW4",
            })}
            onClick={onDelete}
            icon={<img src={getSvgSrc(TrashIcon)} alt="" />}
          />
        )}

        <Button
          className="mr-2"
          ariaLabel={intl.formatMessage({
            defaultMessage: "cancel",
            id: "AddressForm/ManualSaveAddressForm/cqZqGK",
          })}
          variant="secondary"
          onClick={handleCancel}
          label={intl.formatMessage({
            defaultMessage: "cancel",
            id: "AddressForm/ManualSaveAddressForm/cqZqGK",
          })}
        />
        {loading ? (
          <Button
            disabled
            ariaLabel={intl.formatMessage({
              defaultMessage: "save",
              id: "AddressForm/ManualSaveAddressForm/EjXcOc",
            })}
            onClick={handleSubmit(handleOnSubmit)}
            label={intl.formatMessage({
              defaultMessage: "Processing...",
              id: "AddressForm/ManualSaveAddressForm/6OWS4p",
            })}
          />
        ) : (
          <Button
            ariaLabel={intl.formatMessage({
              defaultMessage: "save",
              id: "AddressForm/ManualSaveAddressForm/EjXcOc",
            })}
            onClick={handleSubmit(handleOnSubmit)}
            label={intl.formatMessage({
              defaultMessage: "Save address",
              id: "AddressForm/ManualSaveAddressForm/Y6cXqV",
            })}
          />
        )}
      </div>
    </AddressForm>
  );
};
