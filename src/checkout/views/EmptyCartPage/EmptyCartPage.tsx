"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft, ShoppingBag } from "lucide-react";
import { Logo } from "@/ui/components/shared/Logo";

export const EmptyCartPage = () => {
	return (
		<div className="min-h-screen bg-secondary">
			{/* Header */}
			<header className="border-b border-border bg-background">
				<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
					<Link href="/" className="flex items-center">
						<Logo className="h-5 w-auto text-foreground" />
					</Link>
				</div>
			</header>

			{/* Main content */}
			<main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-md">
					<div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
						{/* Icon */}
						<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
							<ShoppingCart className="h-8 w-8 text-muted-foreground" />
						</div>

						{/* Title */}
						<h1 className="mb-2 text-xl font-semibold text-foreground">Your cart is empty</h1>

						{/* Message */}
						<p className="mb-8 text-muted-foreground">
							Looks like you haven&apos;t added anything to your cart yet.
						</p>

						{/* Actions */}
						<div className="flex flex-col gap-3">
							<Link
								href="/"
								className="shadow-xs hover:bg-primary/90 focus-visible:outline-hidden inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary font-medium text-primary-foreground transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							>
								<ShoppingBag className="h-4 w-4" />
								Start Shopping
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
				</div>
			</main>
		</div>
	);
};
