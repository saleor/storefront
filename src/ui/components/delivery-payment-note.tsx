import Link from "next/link";
import { CreditCard, Truck } from "lucide-react";

import type { DeliveryPaymentSummary } from "@/lib/delivery-payment";
import { cn } from "@/lib/utils";

/**
 * Two quiet lines above the cart's checkout button: where the shop delivers (and, when the
 * store names them, where not) and which payment methods it accepts. The law asks for both
 * "at the latest at the beginning of the ordering process" (Consumer Rights Directive Art. 8(3)).
 */
export function DeliveryPaymentNote({
	summary,
	className,
}: {
	summary: DeliveryPaymentSummary | null;
	className?: string;
}) {
	if (!summary) {
		return null;
	}

	return (
		<div
			className={cn(
				"grid grid-cols-[1rem_minmax(0,1fr)] gap-x-2 gap-y-1.5 text-xs text-muted-foreground",
				className,
			)}
		>
			<Truck aria-hidden className="mt-0.5 h-4 w-4" />
			<p>
				{summary.deliverTo}
				{summary.exclusionsShort ? ` ${summary.exclusionsShort}` : null}
				{summary.shippingPage ? (
					<>
						{" "}
						<Link
							href={summary.shippingPage.href}
							prefetch={false}
							className="underline underline-offset-2 hover:text-foreground"
						>
							{summary.toggleLabel}
						</Link>
					</>
				) : null}
			</p>
			{summary.payment ? (
				<>
					<CreditCard aria-hidden className="mt-0.5 h-4 w-4" />
					<p>{summary.payment}</p>
				</>
			) : null}
		</div>
	);
}
