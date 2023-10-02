import React from "react";
import { SummaryMoneyRow, type SummaryMoneyRowProps } from "./SummaryMoneyRow";
import { summaryLabels } from "./messages";
import { IconButton } from "@/checkout/components/IconButton";
import { RemoveIcon } from "@/checkout/ui-kit/icons";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { useCheckoutRemovePromoCodeMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { localeToLanguageCode } from "@/checkout/lib/utils/locale";
import { useLocale } from "@/checkout/hooks/useLocale";
import { isOrderConfirmationPage } from "@/checkout/lib/utils/url";

interface SummaryPromoCodeRowProps extends SummaryMoneyRowProps {
	promoCode?: string;
	promoCodeId?: string;
	editable: boolean;
}

export const SummaryPromoCodeRow: React.FC<SummaryPromoCodeRowProps> = ({
	promoCode,
	promoCodeId,
	editable,
	...rest
}) => {
	const { checkout } = useCheckout({ pause: isOrderConfirmationPage() });
	const formatMessage = useFormattedMessages();
	const { locale } = useLocale();
	const [, checkoutRemovePromoCode] = useCheckoutRemovePromoCodeMutation();

	const onDelete = () => {
		const variables = promoCode ? { promoCode: promoCode } : { promoCodeId: promoCodeId as string };

		void checkoutRemovePromoCode({
			languageCode: localeToLanguageCode(locale),
			checkoutId: checkout.id,
			...variables,
		});
	};

	return (
		<SummaryMoneyRow {...rest}>
			{editable && (
				<IconButton
					onClick={onDelete}
					ariaLabel={formatMessage(summaryLabels.removeDiscount)}
					icon={<RemoveIcon />}
				/>
			)}
		</SummaryMoneyRow>
	);
};
