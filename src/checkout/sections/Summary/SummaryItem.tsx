import { type ReactNode } from "react";
import Image from "next/image";
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
		<li key={line.id} className="flex border-b border-base-800 py-4 last:border-none" data-testid="SummaryItem">
			<div className="aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-base-700 bg-base-900 md:h-24 md:w-24">
				{productImage ? (
					<Image
						src={productImage.url}
						alt={productImage.alt ?? ""}
						width={96}
						height={96}
						sizes="(max-width: 768px) 64px, 96px"
						className="h-full w-full object-contain object-center"
					/>
				) : (
					<PhotoIcon />
				)}
			</div>
			<div className="relative flex flex-1 flex-col justify-between pl-4">
				<div className="flex justify-between justify-items-start gap-4">
					<div className="flex flex-col gap-y-1">
						<p className="font-bold text-white">{productName}</p>
						<p className="text-xs text-base-400">{attributesText}</p>
					</div>
					{children}
				</div>
			</div>
		</li>
	);
};
