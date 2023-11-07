import React from "react";
import clsx from "clsx";
import { Money } from "@/checkout/components";
import { type Money as MoneyType } from "@/checkout/graphql";
import { getFormattedMoney } from "@/checkout/lib/utils/money";
import { type GrossMoney } from "@/checkout/lib/globalTypes";

interface SummaryItemMoneyInfoProps {
	unitPrice: GrossMoney;
	undiscountedUnitPrice: MoneyType;
	quantity: number;
}

export const SummaryItemMoneyInfo: React.FC<SummaryItemMoneyInfoProps> = ({
	unitPrice,
	quantity,
	undiscountedUnitPrice,
}) => {
	const multiplePieces = quantity > 1;
	const piecePrice = unitPrice.gross;
	const onSale = undiscountedUnitPrice.amount !== unitPrice.gross.amount;

	return (
		<>
			<div className="mt-1 flex flex-row">
				{onSale && (
					<Money
						ariaLabel="undiscounted price"
						money={{
							currency: undiscountedUnitPrice.currency,
							amount: undiscountedUnitPrice.amount * quantity,
						}}
						className="mr-1 line-through"
					/>
				)}
				<Money
					ariaLabel="total price"
					money={{
						currency: piecePrice?.currency,
						amount: (piecePrice?.amount || 0) * quantity,
					}}
					className={clsx({
						"!text-text-error": onSale,
					})}
				/>
			</div>

			{multiplePieces && (
				<p aria-label="single piece price" color="secondary" className="ml-4 text-sm">
					{getFormattedMoney(piecePrice)} each
				</p>
			)}
		</>
	);
};
