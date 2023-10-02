import { useMemo } from "react";
import { type CheckoutLineFragment } from "@/checkout/src/graphql";
import { TextInput } from "@/checkout/src/components/TextInput";

import { Skeleton } from "@/checkout/src/components";
import { SummaryItemMoneyInfo } from "@/checkout/src/sections/Summary/SummaryItemMoneyInfo";
import { FormProvider } from "@/checkout/src/hooks/useForm/FormProvider";
import { useSummaryItemForm } from "@/checkout/src/sections/Summary/useSummaryItemForm";

interface SummaryItemMoneyEditableSectionProps {
	line: CheckoutLineFragment;
}

export const SummaryItemMoneyEditableSection: React.FC<SummaryItemMoneyEditableSectionProps> = ({ line }) => {
	const { form, onLineDelete } = useSummaryItemForm({ line });

	const {
		handleBlur,
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
					<TextInput required onBlur={handleQuantityInputBlur} name="quantity" label="Quantity" />
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
