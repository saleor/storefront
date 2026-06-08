"use client";

import { type FallbackProps } from "react-error-boundary";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, AlertCircle } from "lucide-react";
import { CheckoutPageShell } from "@/checkout/views/saleor-checkout/checkout-page-shell";
import { buttonClassName } from "@/ui/components/ui/button";

interface PageNotFoundProps extends Partial<FallbackProps> {
	title?: string;
	message?: string;
}

export const PageNotFound = ({
	title = "Checkout not found",
	message = "We couldn't find your checkout session. It may have expired or been completed.",
}: PageNotFoundProps) => {
	return (
		<CheckoutPageShell>
			<main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-md">
					<div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
						<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
							<AlertCircle className="h-8 w-8 text-muted-foreground" />
						</div>

						<h1 className="mb-2 text-xl font-semibold text-foreground">{title}</h1>
						<p className="mb-8 text-muted-foreground">{message}</p>

						<div className="flex flex-col gap-3">
							<Link
								href="/"
								className={buttonClassName({ asLink: true, size: "lg", className: "h-12 w-full" })}
							>
								<ShoppingBag className="h-4 w-4" />
								Continue Shopping
							</Link>
							<button
								onClick={() => history.back()}
								className="flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								<ArrowLeft className="h-4 w-4" />
								Go back
							</button>
						</div>
					</div>

					<p className="mt-6 text-center text-sm text-muted-foreground">
						If you believe this is an error, please try adding items to your cart again or contact support.
					</p>
				</div>
			</main>
		</CheckoutPageShell>
	);
};
