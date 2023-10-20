import { Button } from "@/checkout/components/Button";
import { IconButton } from "@/checkout/components/IconButton";
import { TrashIcon } from "@/checkout/ui-kit/icons";

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
	return (
		<div className="flex flex-row justify-end">
			{onDelete && <IconButton ariaLabel="Delete address" onClick={onDelete} icon={<TrashIcon />} />}

			<Button
				className="mr-2"
				ariaLabel="Cancel editing"
				variant="secondary"
				onClick={onCancel}
				label="Cancel"
			/>
			{loading ? (
				<Button disabled ariaLabel="Save address" onClick={onSubmit} label="Processing…" />
			) : (
				<Button ariaLabel="Save address" onClick={onSubmit} label="Save address" />
			)}
		</div>
	);
};
