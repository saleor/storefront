import React from "react";
import { SummaryMoneyRow, type SummaryMoneyRowProps } from "./SummaryMoneyRow";
import { summaryLabels } from "./messages";
import { IconButton } from "@/checkout/src/components/IconButton";
import { RemoveIcon } from "@/checkout/ui-kit/icons";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { useCheckoutRemovePromoCodeMutation } from "@/checkout/src/graphql";
import { useCheckout } from "@/checkout/src/hooks/useCheckout";
import { localeToLanguageCode } from "@/checkout/src/lib/utils/locale";
import { useLocale } from "@/checkout/src/hooks/useLocale";
import { isOrderConfirmationPage } from "@/checkout/src/lib/utils/url";

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
					color="secondary"
					onClick={onDelete}
					ariaLabel={formatMessage(summaryLabels.removeDiscount)}
					variant="bare"
					icon={<RemoveIcon />}
				/>
			)}
		</SummaryMoneyRow>
	);
};
