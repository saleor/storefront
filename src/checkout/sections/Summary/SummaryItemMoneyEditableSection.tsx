import { useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { type CheckoutLineFragment } from "@/checkout/graphql";
import { Skeleton } from "@/checkout/components";
import { QuantitySelector } from "@/checkout/components/QuantitySelector";
import { SummaryItemMoneyInfo } from "@/checkout/sections/Summary/SummaryItemMoneyInfo";
import { useSummaryItemForm } from "@/checkout/sections/Summary/useSummaryItemForm";

interface SummaryItemMoneyEditableSectionProps {
	line: CheckoutLineFragment;
}

export const SummaryItemMoneyEditableSection: React.FC<SummaryItemMoneyEditableSectionProps> = ({ line }) => {
	const { form, onLineDelete } = useSummaryItemForm({ line });

	const {
		setFieldValue,
		handleSubmit,
		isSubmitting,
		values: { quantity: quantityString },
	} = form;

	const quantity = useMemo(() => parseInt(quantityString), [quantityString]);

	const handleQuantityChange = useCallback(
		async (newQuantity: number) => {
			if (newQuantity === line.quantity) {
				return;
			}

			// Update form value
			setFieldValue("quantity", String(newQuantity));

			// Submit the form
			try {
				handleSubmit();

				// Show success toast
				const productName = line.variant.product.name;
				const variantName = line.variant.name !== productName ? ` (${line.variant.name})` : "";

				if (newQuantity > line.quantity) {
					toast.success(`Increased quantity of ${productName}${variantName} to ${newQuantity}`, {
						position: "top-right",
					});
				} else {
					toast.info(`Updated quantity of ${productName}${variantName} to ${newQuantity}`, {
						position: "top-right",
					});
				}
			} catch (error) {
				// Error handling is done in the form hook
				toast.error("Failed to update quantity. Please try again.", {
					position: "top-right",
				});

				// Revert to original quantity
				setFieldValue("quantity", String(line.quantity));
			}
		},
		[line, setFieldValue, handleSubmit],
	);

	const handleDelete = useCallback(async () => {
		try {
			await onLineDelete();

			// Show success toast
			const productName = line.variant.product.name;
			const variantName = line.variant.name !== productName ? ` (${line.variant.name})` : "";

			toast.info(`Removed ${productName}${variantName} from cart`, {
				position: "top-right",
			});
		} catch (error) {
			toast.error("Failed to remove item. Please try again.", {
				position: "top-right",
			});
		}
	}, [onLineDelete, line]);

	return (
		<div className="flex flex-col items-end gap-3">
			<QuantitySelector
				value={quantity}
				onChange={handleQuantityChange}
				onDelete={handleDelete}
				disabled={isSubmitting}
				loading={isSubmitting}
				min={0}
				max={999}
				size="sm"
				data-testid={`quantity-selector-${line.id}`}
			/>
			{isSubmitting ? (
				<div className="flex flex-col gap-1">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-4 w-20" />
				</div>
			) : (
				<SummaryItemMoneyInfo {...line} />
			)}
		</div>
	);
};
