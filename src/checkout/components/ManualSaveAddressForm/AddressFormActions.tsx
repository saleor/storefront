import { manualSaveAddressFormMessages, manualSaveAddressFormLabels } from "./messages";
import { Button } from "@/checkout/components/Button";
import { IconButton } from "@/checkout/components/IconButton";
import { TrashIcon } from "@/checkout/ui-kit/icons";
import { commonMessages } from "@/checkout/lib/commonMessages";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";

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
					ariaLabel={formatMessage(manualSaveAddressFormLabels.delete)}
					onClick={onDelete}
					icon={<TrashIcon />}
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
