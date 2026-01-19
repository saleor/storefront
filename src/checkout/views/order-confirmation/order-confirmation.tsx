"use client";

import Link from "next/link";
import { CheckCircle, Mail, MapPin, Package, CreditCard } from "lucide-react";
import { useOrder } from "@/checkout/hooks/use-order";
import { OrderSummary } from "@/checkout/views/saleor-checkout/order-summary";
import { CheckoutHeader } from "@/checkout/views/saleor-checkout/checkout-header";
import { DefaultChannelSlug } from "@/app/config";
import { localeConfig } from "@/config/locale";

/** Format address for display */
function formatAddress(address: {
	streetAddress1?: string | null;
	city?: string | null;
	postalCode?: string | null;
	country?: { country?: string | null } | null;
}) {
	return [address.streetAddress1, address.city, address.postalCode, address.country?.country]
		.filter(Boolean)
		.join(", ");
}

/**
 * Order confirmation page - uses the same layout as SaleorCheckout
 * Renders after successful order creation with real order data.
 */
export const OrderConfirmation = () => {
	const { order } = useOrder();
	const channel = DefaultChannelSlug;

	// Calculate estimated delivery (7 days from now)
	// Using a static calculation - this component only renders once after order creation
	const estimatedDelivery = new Date();
	estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
	const formattedDelivery = estimatedDelivery.toLocaleDateString(localeConfig.default, {
		weekday: "long",
		month: "long",
		day: "numeric",
	});

	const shippingAddress = order.shippingAddress;
	const billingAddress = order.billingAddress;
	const email = order.userEmail || "";

	return (
		<div className="min-h-screen bg-secondary">
			{/* Header - same as checkout */}
			<CheckoutHeader step={4} onStepClick={() => {}} />

			{/* Main content - same layout as checkout */}
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Two column layout: ~70% Content + ~30% Summary */}
				<div className="flex flex-col gap-8 md:flex-row">
					{/* Left column: Confirmation content (~70%) */}
					<div className="order-2 min-w-0 flex-1 md:order-1">
						<div className="rounded-lg border border-border bg-card p-6 md:p-8">
							{/* Same content as ConfirmationStep */}
							<div className="space-y-8">
								{/* Success Header */}
								<div className="space-y-4 text-center">
									<div className="flex justify-center">
										<div className="relative">
											<div className="absolute inset-0 animate-ping rounded-full bg-green-400/30" />
											<CheckCircle className="relative h-16 w-16 text-green-500" />
										</div>
									</div>
									<div>
										<p className="text-muted-foreground">Order #{order.number}</p>
										<h1 className="mt-1 text-2xl font-semibold">Thank you for your order!</h1>
									</div>
								</div>

								{/* Order Confirmation Card */}
								<div className="overflow-hidden rounded-lg border border-border">
									<div className="bg-secondary/50 border-b border-border p-4">
										<h2 className="font-semibold">Your order is confirmed</h2>
										<p className="mt-1 text-sm text-muted-foreground">
											You&apos;ll receive a confirmation email at {email}
										</p>
									</div>

									{/* Order Details */}
									<div className="space-y-4 p-4">
										<div className="flex items-start gap-3">
											<Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
											<div>
												<p className="text-sm font-medium">Confirmation email sent</p>
												<p className="text-sm text-muted-foreground">{email}</p>
											</div>
										</div>
										{shippingAddress && (
											<div className="flex items-start gap-3">
												<MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
												<div>
													<p className="text-sm font-medium">Shipping address</p>
													<p className="text-sm text-muted-foreground">{formatAddress(shippingAddress)}</p>
												</div>
											</div>
										)}
										{billingAddress && (
											<div className="flex items-start gap-3">
												<CreditCard className="mt-0.5 h-5 w-5 text-muted-foreground" />
												<div>
													<p className="text-sm font-medium">Billing address</p>
													<p className="text-sm text-muted-foreground">{formatAddress(billingAddress)}</p>
												</div>
											</div>
										)}
										<div className="flex items-start gap-3">
											<Package className="mt-0.5 h-5 w-5 text-muted-foreground" />
											<div>
												<p className="text-sm font-medium">Estimated delivery</p>
												<p className="text-sm text-muted-foreground">{formattedDelivery}</p>
											</div>
										</div>
									</div>
								</div>

								{/* Actions */}
								<div className="flex flex-col gap-4 sm:flex-row">
									<Link
										href={`/${channel}`}
										className="inline-flex h-12 flex-1 items-center justify-center rounded-md border border-input bg-transparent px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
									>
										Continue shopping
									</Link>
								</div>
							</div>
						</div>
					</div>

					{/* Right column: Summary (~30%, max 380px) */}
					<div className="order-1 md:order-2 md:shrink-0 md:basis-[30%]">
						<div className="overflow-hidden rounded-lg border border-border bg-card md:sticky md:top-8">
							<OrderSummary order={order} editable={false} />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};
