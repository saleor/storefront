import { type FC } from "react";
import { SummaryItem, type SummaryLine } from "./SummaryItem";
import { PromoCodeAdd } from "./PromoCodeAdd";
import { SummaryMoneyRow } from "./SummaryMoneyRow";
import { SummaryPromoCodeRow } from "./SummaryPromoCodeRow";
import { SummaryItemMoneyEditableSection } from "./SummaryItemMoneyEditableSection";
import { summaryLabels, summaryMessages } from "./messages";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { ChevronDownIcon } from "@/checkout/ui-kit/icons";

import { getFormattedMoney } from "@/checkout/lib/utils/money";
import { Divider, Money, Title } from "@/checkout/components";
import {
	type CheckoutLineFragment,
	type GiftCardFragment,
	type Money as MoneyType,
	type OrderLineFragment,
} from "@/checkout/graphql";
import { SummaryItemMoneySection } from "@/checkout/sections/Summary/SummaryItemMoneySection";
import { type GrossMoney, type GrossMoneyWithTax } from "@/checkout/lib/globalTypes";

interface SummaryProps {
	editable?: boolean;
	lines: SummaryLine[];
	totalPrice?: GrossMoneyWithTax;
	subtotalPrice?: GrossMoney;
	giftCards?: GiftCardFragment[];
	voucherCode?: string | null;
	discount?: MoneyType | null;
	shippingPrice: GrossMoney;
}

export const Summary: FC<SummaryProps> = ({
	editable = true,
	lines,
	totalPrice,
	subtotalPrice,
	giftCards = [],
	voucherCode,
	shippingPrice,
	discount,
}) => {
	const formatMessage = useFormattedMessages();

	return (
		<div className="flex h-fit w-full flex-col overflow-hidden rounded lg:overflow-visible">
			<details open className="group">
				<summary className="-mb-2 flex cursor-pointer flex-row items-center pt-4">
					<Title>{formatMessage(summaryMessages.title)}</Title>
					<ChevronDownIcon className="mb-2 group-open:rotate-180" />
				</summary>
				<ul className="pb-4 pt-2">
					{lines.map((line) => (
						<SummaryItem line={line} key={line?.id}>
							{editable ? (
								<SummaryItemMoneyEditableSection line={line as CheckoutLineFragment} />
							) : (
								<SummaryItemMoneySection line={line as OrderLineFragment} />
							)}
						</SummaryItem>
					))}
				</ul>
			</details>
			{editable && (
				<>
					<PromoCodeAdd />
					<Divider />
				</>
			)}
			<div className="mt-4 flex max-w-full flex-col">
				<SummaryMoneyRow
					label={formatMessage(summaryMessages.subtotalPrice)}
					money={subtotalPrice?.gross}
					ariaLabel={formatMessage(summaryLabels.subtotalPrice)}
				/>
				{voucherCode && (
					<SummaryPromoCodeRow
						editable={editable}
						promoCode={voucherCode}
						ariaLabel={formatMessage(summaryLabels.voucher)}
						label={formatMessage(summaryMessages.voucher, { voucherCode })}
						money={discount}
						negative
					/>
				)}
				{giftCards.map(({ currentBalance, displayCode, id }) => (
					<SummaryPromoCodeRow
						key={id}
						editable={editable}
						promoCodeId={id}
						ariaLabel={formatMessage(summaryLabels.giftCard)}
						label={formatMessage(summaryMessages.giftCard, {
							giftCardCode: `•••• •••• ${displayCode}`,
						})}
						money={currentBalance}
						negative
					/>
				))}
				<SummaryMoneyRow
					label={formatMessage(summaryMessages.shippingCost)}
					ariaLabel={formatMessage(summaryLabels.shippingCost)}
					money={shippingPrice?.gross}
				/>
				<Divider className="my-4" />
				<div className="flex flex-row items-baseline justify-between pb-4">
					<div className="flex flex-row items-baseline">
						<p className="font-bold">{formatMessage(summaryMessages.totalPrice)}</p>
						<p color="secondary" className="ml-2">
							{formatMessage(summaryMessages.taxCost, {
								taxCost: getFormattedMoney(totalPrice?.tax),
							})}
						</p>
					</div>
					<Money
						ariaLabel={formatMessage(summaryLabels.totalPrice)}
						money={totalPrice?.gross}
						data-testid="totalOrderPrice"
					/>
				</div>
			</div>
		</div>
	);
};
