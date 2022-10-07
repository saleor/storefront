import { AddressForm, AddressFormProps } from "@/checkout-storefront/components/AddressForm";
import { AddressFormData } from "@/checkout-storefront/components/AddressForm/types";
import {
  useAddressForm,
  UseAddressFormProps,
} from "@/checkout-storefront/components/AddressForm/useAddressForm";
import { Button } from "@/checkout-storefront/components/Button";
import { IconButton } from "@/checkout-storefront/components/IconButton";
import { manualSaveAddressFormMessages, manualSaveAddressFormLabels } from "./messages";
import { UseErrors, useFormattedMessages } from "@/checkout-storefront/hooks";
import { TrashIcon } from "@/checkout-storefront/icons";
import { commonMessages } from "@/checkout-storefront/lib/commonMessages";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import React, { useCallback } from "react";

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
  const formatMessage = useFormattedMessages();

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
            ariaLabel={formatMessage(manualSaveAddressFormLabels.delete)}
            onClick={onDelete}
            icon={<img src={getSvgSrc(TrashIcon)} alt="" />}
          />
        )}

        <Button
          className="mr-2"
          ariaLabel={formatMessage(manualSaveAddressFormLabels.cancel)}
          variant="secondary"
          onClick={handleCancel}
          label={formatMessage(manualSaveAddressFormMessages.cancel)}
        />
        {loading ? (
          <Button
            disabled
            ariaLabel={formatMessage(manualSaveAddressFormLabels.save)}
            onClick={handleSubmit(handleOnSubmit)}
            label={formatMessage(commonMessages.processing)}
          />
        ) : (
          <Button
            ariaLabel={formatMessage(manualSaveAddressFormLabels.save)}
            onClick={handleSubmit(handleOnSubmit)}
            label={formatMessage(manualSaveAddressFormMessages.save)}
          />
        )}
      </div>
    </AddressForm>
  );
};
