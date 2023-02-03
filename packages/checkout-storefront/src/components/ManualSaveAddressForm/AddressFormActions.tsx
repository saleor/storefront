import { Button } from "@/checkout-storefront/components/Button";
import { IconButton } from "@/checkout-storefront/components/IconButton";
import { manualSaveAddressFormMessages, manualSaveAddressFormLabels } from "./messages";
import { TrashIcon } from "@/checkout-storefront/icons";
import { commonMessages } from "@/checkout-storefront/lib/commonMessages";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";

interface AddressFormActionsProps {
  onDelete?: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  loading: boolean;
}

export const AddressFormActions: React.FC<AddressFormActionsProps> = ({
  onSubmit,
  onDelete,
  onCancel,
  loading,
}) => {
  const formatMessage = useFormattedMessages();

  return (
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
        onClick={onCancel}
        label={formatMessage(manualSaveAddressFormMessages.cancel)}
      />
      {loading ? (
        <Button
          disabled
          ariaLabel={formatMessage(manualSaveAddressFormLabels.save)}
          onClick={onSubmit}
          label={formatMessage(commonMessages.processing)}
        />
      ) : (
        <Button
          ariaLabel={formatMessage(manualSaveAddressFormLabels.save)}
          onClick={onSubmit}
          label={formatMessage(manualSaveAddressFormMessages.save)}
        />
      )}
    </div>
  );
};
