"use client";

import { type FC } from "react";
import { Lock } from "lucide-react";
import { useCheckoutContent } from "@/lib/content";
import { cn } from "@/lib/utils";

export type PaymentTrustProvider = "stripe" | "default";

export type PaymentTrustSignalsProps = {
	/** `compact` for the mobile sticky pay bar; `default` above inline pay buttons. */
	variant?: "default" | "compact";
	/** When `stripe`, includes processor reassurance copy. */
	provider?: PaymentTrustProvider;
	className?: string;
};

/**
 * Contextual trust cues at the payment moment — lock copy near the pay CTA.
 * See checkout-design-principles.md §8.
 */
export const PaymentTrustSignals: FC<PaymentTrustSignalsProps> = ({
	variant = "default",
	provider = "default",
	className,
}) => {
	const { trust } = useCheckoutContent();
	const isCompact = variant === "compact";

	return (
		<p
			className={cn(
				"text-muted-foreground/80 flex items-center justify-center gap-1.5 text-center text-xs leading-tight",
				isCompact && "flex-wrap",
				className,
			)}
			role="note"
		>
			<Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
			<span>{trust.secureCheckout}</span>
			{provider === "stripe" ? (
				<>
					<span aria-hidden className="text-muted-foreground/50">
						·
					</span>
					<span>{trust.stripeProcessor}</span>
				</>
			) : null}
		</p>
	);
};
