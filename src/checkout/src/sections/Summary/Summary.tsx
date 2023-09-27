import React, { type FC, useState } from "react";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { SummaryItem, type SummaryLine } from "./SummaryItem";
import { PromoCodeAdd } from "./PromoCodeAdd";
import { SummaryMoneyRow } from "./SummaryMoneyRow";
import { SummaryPromoCodeRow } from "./SummaryPromoCodeRow";
import { SummaryItemMoneyEditableSection } from "./SummaryItemMoneyEditableSection";
import { summaryLabels, summaryMessages } from "./messages";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { ChevronDownIcon } from "@/checkout/ui-kit/icons";

import { getFormattedMoney } from "@/checkout/src/lib/utils/money";
import { Divider, Money, Title } from "@/checkout/src/components";
import {
	type CheckoutLineFragment,
	type GiftCardFragment,
	type Money as MoneyType,
	type OrderLineFragment,
} from "@/checkout/src/graphql";
import { SummaryItemMoneySection } from "@/checkout/src/sections/Summary/SummaryItemMoneySection";
import { type GrossMoney, type GrossMoneyWithTax } from "@/checkout/src/lib/globalTypes";
import { useSummaryHeightCalc } from "@/checkout/src/sections/Summary/useSummaryHeightCalc";

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
	const [isOpen, setOpen] = useState(true);

	const { maxSummaryHeight, allItemsHeight } = useSummaryHeightCalc({
		linesCount: lines.length,
		onBreakpointChange: (breakpoint: "lg" | "md") => {
			setOpen(breakpoint === "lg");
		},
	});

	return (
		<div className="flex h-fit w-full flex-col overflow-hidden rounded-lg border border-slate-400 lg:w-1/2 lg:overflow-visible">
			<div
				className={clsx(
					"z-50 flex flex-row items-baseline justify-between px-6 py-4 lg:pointer-events-none",
					isOpen && "open",
				)}
			>
				<div className="flex w-full flex-row items-center" onClick={() => setOpen(!isOpen)}>
					<Title className="mb-0">{formatMessage(summaryMessages.title)}</Title>
					<ChevronDownIcon />
				</div>
				{!isOpen && <Money ariaLabel={formatMessage(summaryLabels.totalPrice)} money={totalPrice?.gross} />}
			</div>
			<Transition
				show={isOpen}
				unmount={false}
				enter="transition duration-300 ease-out"
				enterFrom="transform scale-95 opacity-0"
				enterTo="transform scale-100 opacity-100"
				leave="transition duration-75 ease-out"
				leaveFrom="transform scale-100 opacity-100"
				leaveTo="transform scale-95 opacity-0"
			>
				<ul
					style={{ maxHeight: maxSummaryHeight ? `${maxSummaryHeight}px` : "" }}
					className={clsx(
						"overflow-visible px-4 lg:pt-2",
						allItemsHeight > maxSummaryHeight ? "border-b border-slate-400 lg:overflow-y-scroll" : "",
					)}
				>
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
					<div className="flex flex-row items-center items-baseline justify-between pb-4">
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
			</Transition>
		</div>
	);
};
