"use client";

import { useId, useState } from "react";
import { ChevronDown, CreditCard, Truck } from "lucide-react";

import { useCheckoutDeliveryPayment } from "@/checkout/providers/checkout-delivery-payment";
import { cn } from "@/lib/utils";

/**
 * "Delivery and payment" at the top of the information step: the start of the ordering
 * process, the latest point at which the law wants delivery restrictions and payment methods
 * stated (Consumer Rights Directive Art. 8(3)). Collapsed by default; the disclosure lists the
 * countries, the excluded areas the store names, and its shipping page.
 */
export function DeliveryPaymentPanel() {
	const summary = useCheckoutDeliveryPayment();
	const [open, setOpen] = useState(false);
	const id = useId();

	if (!summary) {
		return null;
	}

	const titleId = `${id}-title`;
	const detailsId = `${id}-details`;

	return (
		<section aria-labelledby={titleId} className="rounded-lg bg-secondary p-4 text-sm">
			<div className="flex items-start justify-between gap-3">
				<h2 id={titleId} className="text-sm font-medium text-foreground">
					{summary.title}
				</h2>
				<button
					type="button"
					aria-expanded={open}
					aria-controls={detailsId}
					onClick={() => setOpen((value) => !value)}
					className="focus-visible:outline-hidden -my-1 inline-flex min-h-6 shrink-0 items-center gap-1 rounded-sm text-xs font-medium text-foreground underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring"
				>
					{summary.toggleLabel}
					<ChevronDown aria-hidden className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
				</button>
			</div>

			<div className="mt-2 grid grid-cols-[1rem_minmax(0,1fr)] gap-x-2 gap-y-1.5 text-muted-foreground">
				<Truck aria-hidden className="mt-0.5 h-4 w-4" />
				<p>
					{summary.deliverTo}
					{summary.exclusionsShort ? ` ${summary.exclusionsShort}` : null}
				</p>
				{summary.payment ? (
					<>
						<CreditCard aria-hidden className="mt-0.5 h-4 w-4" />
						<p>{summary.payment}</p>
					</>
				) : null}
			</div>

			<div id={detailsId} hidden={!open} className="mt-3 space-y-3 border-t border-border pt-3">
				<div>
					<h3 className="text-xs font-medium text-foreground">{summary.countriesHeading}</h3>
					<ul className="mt-1 columns-2 gap-4 text-xs text-muted-foreground sm:columns-3">
						{summary.countries.map((country) => (
							<li key={country}>{country}</li>
						))}
					</ul>
				</div>
				{summary.exclusions.length > 0 ? (
					<div>
						<h3 className="text-xs font-medium text-foreground">{summary.exclusionsHeading}</h3>
						<ul className="mt-1 columns-2 gap-4 text-xs text-muted-foreground sm:columns-3">
							{summary.exclusions.map((area) => (
								<li key={area}>{area}</li>
							))}
						</ul>
					</div>
				) : null}
				{summary.shippingPage ? (
					<p className="text-xs">
						{/* New tab: the shopper keeps the checkout. */}
						<a
							href={summary.shippingPage.href}
							target="_blank"
							rel="noopener noreferrer"
							className="text-foreground underline underline-offset-2 hover:no-underline"
						>
							{summary.shippingPage.title}
						</a>
					</p>
				) : null}
			</div>
		</section>
	);
}
