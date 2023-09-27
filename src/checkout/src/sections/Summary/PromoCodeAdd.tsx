import clsx from "clsx";
import React, { type FC } from "react";
import { summaryLabels, summaryMessages } from "./messages";
import { Button } from "@/checkout/src/components/Button";
import { TextInput } from "@/checkout/src/components/TextInput";
import { useCheckoutAddPromoCodeMutation } from "@/checkout/src/graphql";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { type Classes } from "@/checkout/src/lib/globalTypes";
import { useFormSubmit } from "@/checkout/src/hooks/useFormSubmit";
import { FormProvider } from "@/checkout/src/hooks/useForm/FormProvider";
import { useForm } from "@/checkout/src/hooks/useForm";

interface PromoCodeFormData {
	promoCode: string;
}

export const PromoCodeAdd: FC<Classes> = ({ className }) => {
	const formatMessage = useFormattedMessages();
	const [, checkoutAddPromoCode] = useCheckoutAddPromoCodeMutation();

	const onSubmit = useFormSubmit<PromoCodeFormData, typeof checkoutAddPromoCode>({
		scope: "checkoutAddPromoCode",
		onSubmit: checkoutAddPromoCode,
		parse: ({ promoCode, languageCode, checkoutId }) => ({
			promoCode,
			checkoutId,
			languageCode,
		}),
		onSuccess: ({ formHelpers: { resetForm } }) => resetForm(),
	});

	const form = useForm<PromoCodeFormData>({
		onSubmit,
		initialValues: { promoCode: "" },
	});
	const {
		values: { promoCode },
	} = form;

	const showApplyButton = promoCode.length > 0;

	return (
		<FormProvider form={form}>
			<div className={clsx("relative mb-4 mt-4 px-4", className)}>
				<TextInput optional name="promoCode" label={formatMessage(summaryMessages.addDiscount)} />
				{showApplyButton && (
					<Button
						className="absolute right-7 top-7"
						variant="tertiary"
						ariaLabel={formatMessage(summaryLabels.apply)}
						label={formatMessage(summaryMessages.apply)}
						type="submit"
					/>
				)}
			</div>
		</FormProvider>
	);
};
