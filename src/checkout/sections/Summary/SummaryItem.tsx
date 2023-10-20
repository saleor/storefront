import { type ReactNode } from "react";
import { useSummaryLineLineAttributesText, getSummaryLineProps } from "./utils";
import { type CheckoutLineFragment, type OrderLineFragment } from "@/checkout/graphql";
import { PhotoIcon } from "@/checkout/ui-kit/icons";

export type SummaryLine = CheckoutLineFragment | OrderLineFragment;

interface SummaryItemProps {
	line: SummaryLine;
	children: ReactNode;
}

export const SummaryItem = ({ line, children }: SummaryItemProps) => {
	const { productName, productImage } = getSummaryLineProps(line);

	const attributesText = useSummaryLineLineAttributesText(line);

	return (
		<li className="relative mb-6 flex flex-row items-start last-of-type:mb-0">
			<div className="relative flex flex-row">
				<div className="z-1 mr-4 flex h-24 w-20 items-center justify-start">
					{productImage ? (
						<img className="object-contain" alt={productImage.alt ?? ""} src={productImage.url} />
					) : (
						<PhotoIcon />
					)}
				</div>
			</div>
			<div className="flex w-full flex-row items-center justify-between">
				<div className="flex flex-col">
					<p aria-label="summary item name" className="mb-3 font-bold">
						{productName}
					</p>
					<p aria-label="variant name" className="text-xs">
						{attributesText}
					</p>
				</div>
				{children}
			</div>
		</li>
	);
};
