import clsx from "clsx";
import React, { type FC } from "react";
import { summaryLabels, summaryMessages } from "./messages";
import { Button } from "@/checkout/components/Button";
import { TextInput } from "@/checkout/components/TextInput";
import { useCheckoutAddPromoCodeMutation } from "@/checkout/graphql";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { type Classes } from "@/checkout/lib/globalTypes";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
import { useForm } from "@/checkout/hooks/useForm";

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
			<div className={clsx("relative my-4", className)}>
				<TextInput required={false} name="promoCode" label={formatMessage(summaryMessages.addDiscount)} />
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
