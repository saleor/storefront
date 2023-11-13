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
		<div className="flex flex-row justify-end gap-2">
			{onDelete && (
				<div className="flex">
					<IconButton ariaLabel="Delete address" onClick={onDelete} icon={<TrashIcon aria-hidden />} />
				</div>
			)}

			<Button ariaLabel="Cancel editing" variant="secondary" onClick={onCancel} label="Cancel" />
			{loading ? (
				<Button
					ariaDisabled
					ariaLabel="Save address"
					onClick={(e) => e.preventDefault()}
					label="Processing…"
				/>
			) : (
				<Button ariaLabel="Save address" onClick={onSubmit} label="Save address" />
			)}
		</div>
	);
};
