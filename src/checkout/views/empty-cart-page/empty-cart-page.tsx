"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft, ShoppingBag } from "lucide-react";
import { CheckoutPageShell } from "@/checkout/views/saleor-checkout/checkout-page-shell";
import { useCheckoutContent } from "@/lib/content";
import { buttonClassName } from "@/ui/components/ui/button";

export const EmptyCartPage = () => {
	const { emptyCart } = useCheckoutContent();

	return (
		<CheckoutPageShell>
			<main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-md">
					<div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
						<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
							<ShoppingCart className="h-8 w-8 text-muted-foreground" />
						</div>

						<h1 className="mb-2 text-xl font-semibold text-foreground">{emptyCart.title}</h1>
						<p className="mb-8 text-muted-foreground">{emptyCart.body}</p>

						<div className="flex flex-col gap-3">
							<Link
								href="/"
								className={buttonClassName({ asLink: true, size: "lg", className: "h-12 w-full" })}
							>
								<ShoppingBag className="h-4 w-4" />
								{emptyCart.startShoppingLabel}
							</Link>
							<button
								onClick={() => history.back()}
								className="flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								<ArrowLeft className="h-4 w-4" />
								{emptyCart.goBackLabel}
							</button>
						</div>
					</div>
				</div>
			</main>
		</CheckoutPageShell>
	);
};
