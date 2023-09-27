import { useMemo } from "react";
import { summaryMessages } from "./messages";
import { type CheckoutLineFragment } from "@/checkout/src/graphql";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { TextInput } from "@/checkout/src/components/TextInput";

import { Skeleton } from "@/checkout/src/components";
import { SummaryItemMoneyInfo } from "@/checkout/src/sections/Summary/SummaryItemMoneyInfo";
import { FormProvider } from "@/checkout/src/hooks/useForm/FormProvider";
import { useSummaryItemForm } from "@/checkout/src/sections/Summary/useSummaryItemForm";

interface SummaryItemMoneyEditableSectionProps {
	line: CheckoutLineFragment;
}

export const SummaryItemMoneyEditableSection: React.FC<SummaryItemMoneyEditableSectionProps> = ({ line }) => {
	const formatMessage = useFormattedMessages();
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
		<div className="relative -top-2 flex h-20 flex-col items-end">
			<div className="flex flex-row items-baseline">
				<p className="mr-2 text-xs">{formatMessage(summaryMessages.quantity)}:</p>
				<FormProvider form={form}>
					<TextInput
						onBlur={handleQuantityInputBlur}
						name="quantity"
						classNames={{ container: "!w-13 !mb-0", input: "text-center !h-8" }}
						label=""
					/>
				</FormProvider>
			</div>
			{isSubmitting ? (
				<div className="mt-3 flex w-full flex-col items-end">
					<Skeleton className="w-full" />
					<Skeleton className="w-2/3" />
				</div>
			) : (
				<SummaryItemMoneyInfo {...line} classNames={{ container: "mt-1" }} />
			)}
		</div>
	);
};
