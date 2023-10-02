import { useMemo } from "react";
import { type CheckoutLineFragment } from "@/checkout/graphql";
import { TextInput } from "@/checkout/components/TextInput";

import { Skeleton } from "@/checkout/components";
import { SummaryItemMoneyInfo } from "@/checkout/sections/Summary/SummaryItemMoneyInfo";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
import { useSummaryItemForm } from "@/checkout/sections/Summary/useSummaryItemForm";

interface SummaryItemMoneyEditableSectionProps {
	line: CheckoutLineFragment;
}

export const SummaryItemMoneyEditableSection: React.FC<SummaryItemMoneyEditableSectionProps> = ({ line }) => {
	const { form, onLineDelete } = useSummaryItemForm({ line });

	const {
		handleBlur,
		handleChange,
		setFieldValue,
		handleSubmit,
		isSubmitting,
		values: { quantity: quantityString },
	} = form;

	const quantity = useMemo(() => parseInt(quantityString), [quantityString]);

	const handleQuantityInputBlur = (event: React.FocusEvent<any, Element>) => {
		handleBlur(event);

		if (quantity === line.quantity) {
			return;
		}

		const isQuantityValid = !Number.isNaN(quantity) && quantity >= 0;

		if (quantityString === "" || !isQuantityValid) {
			void setFieldValue("quantity", String(line.quantity));
			return;
		}

		if (quantity === 0) {
			void onLineDelete();
			return;
		}

		void handleSubmit();
	};

	return (
		<div className="relative flex h-24 flex-col items-end">
			<div className="flex flex-row items-baseline">
				<FormProvider form={form}>
					<TextInput
						required
						onChange={handleChange}
						onBlur={handleQuantityInputBlur}
						name="quantity"
						label="Quantity"
					/>
				</FormProvider>
			</div>
			{isSubmitting ? (
				<div className="mt-3 flex w-full flex-col items-end">
					<Skeleton className="w-full" />
					<Skeleton className="w-2/3" />
				</div>
			) : (
				<SummaryItemMoneyInfo {...line} />
			)}
		</div>
	);
};
