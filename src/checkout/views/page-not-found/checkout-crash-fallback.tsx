"use client";

import { type FallbackProps } from "react-error-boundary";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";
import { CheckoutPageShell } from "@/checkout/views/saleor-checkout/checkout-page-shell";
import { Button } from "@/ui/components/ui/button";

/**
 * Shown when checkout UI crashes — distinct from missing/invalid checkout sessions.
 */
export function CheckoutCrashFallback({ error, resetErrorBoundary }: FallbackProps) {
	const message =
		process.env.NODE_ENV === "development" && error instanceof Error
			? error.message
			: "Something went wrong loading checkout. Please try again.";

	return (
		<CheckoutPageShell>
			<main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-md">
					<div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
						<div className="bg-destructive/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
							<AlertCircle className="h-8 w-8 text-destructive" />
						</div>

						<h1 className="mb-2 text-xl font-semibold text-foreground">Checkout error</h1>
						<p className="mb-8 text-muted-foreground">{message}</p>

						<div className="flex flex-col gap-3">
							<Button type="button" className="h-12 w-full" onClick={resetErrorBoundary}>
								<RefreshCw className="h-4 w-4" />
								Try again
							</Button>
							<Link
								href="/"
								className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
							>
								Continue shopping
							</Link>
						</div>
					</div>
				</div>
			</main>
		</CheckoutPageShell>
	);
}
