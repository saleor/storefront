"use client";

import { useEffect } from "react";
import { clearPaymentCompleting } from "@/checkout/lib/payment/checkout-payment-completion";
import { navigateToStorefrontHome } from "@/lib/auth";
import { useCheckoutBrowseLocale } from "@/checkout/providers/checkout-browse";
import { CheckCircle, Mail, MapPin, Package, CreditCard } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { useOrder } from "@/checkout/hooks/use-order";
import { OrderSummary } from "@/checkout/views/saleor-checkout/order-summary";
import { OrderConfirmationPageShell } from "./order-confirmation-page-shell";
import { PageNotFound } from "@/checkout/views/page-not-found";
import { useTranslations } from "next-intl";
import { getLocaleDefinition } from "@/config/locale";

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
 * Order confirmation — rendered at `/checkout/complete?order=…` after successful payment.
 */
export const OrderConfirmation = () => {
	const { order } = useOrder();
	const storefrontLocale = useCheckoutBrowseLocale();
	const t = useTranslations("checkout.confirmation");
	const tErrors = useTranslations("checkout.errors");
	const tActions = useTranslations("checkout.actions");
	const localeBcp47 = getLocaleDefinition(storefrontLocale)?.bcp47 ?? "en-US";

	useEffect(() => {
		if (!order?.id) {
			return;
		}

		clearPaymentCompleting();
	}, [order?.id]);

	if (!order) {
		return <PageNotFound title={tErrors("orderNotFoundTitle")} message={tErrors("orderNotFoundMessage")} />;
	}

	const channel = order.channel?.slug ?? "";

	const estimatedDelivery = new Date();
	estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
	const formattedDelivery = estimatedDelivery.toLocaleDateString(localeBcp47, {
		weekday: "long",
		month: "long",
		day: "numeric",
	});

	const shippingAddress = order.shippingAddress;
	const billingAddress = order.billingAddress;
	const email = order.userEmail || "";

	return (
		<OrderConfirmationPageShell storefrontChannel={channel}>
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-8 md:flex-row">
					<div className="order-2 min-w-0 flex-1 md:order-1">
						<div className="rounded-lg border border-border bg-card p-6 md:p-8">
							<div className="space-y-8">
								<div className="space-y-4 text-center">
									<div className="flex justify-center">
										<div className="relative">
											<div className="absolute inset-0 animate-ping rounded-full bg-green-400/30" />
											<CheckCircle className="relative h-16 w-16 text-green-500" />
										</div>
									</div>
									<div>
										<p className="text-muted-foreground">{t("orderNumber", { number: order.number })}</p>
										<h1 className="mt-1 text-balance text-h1">{t("thankYou")}</h1>
									</div>
								</div>

								<div className="overflow-hidden rounded-lg border border-border">
									<div className="bg-secondary/50 border-b border-border p-4">
										<h2 className="font-semibold">{t("confirmedTitle")}</h2>
										<p className="mt-1 text-sm text-muted-foreground">{t("confirmedEmail", { email })}</p>
									</div>

									<div className="space-y-4 p-4">
										<div className="flex items-start gap-3">
											<Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
											<div>
												<p className="text-sm font-medium">{t("emailSent")}</p>
												<p className="text-sm text-muted-foreground">{email}</p>
											</div>
										</div>
										{shippingAddress && (
											<div className="flex items-start gap-3">
												<MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
												<div>
													<p className="text-sm font-medium">{t("shippingAddress")}</p>
													<p className="text-sm text-muted-foreground">{formatAddress(shippingAddress)}</p>
												</div>
											</div>
										)}
										{billingAddress && (
											<div className="flex items-start gap-3">
												<CreditCard className="mt-0.5 h-5 w-5 text-muted-foreground" />
												<div>
													<p className="text-sm font-medium">{t("billingAddress")}</p>
													<p className="text-sm text-muted-foreground">{formatAddress(billingAddress)}</p>
												</div>
											</div>
										)}
										<div className="flex items-start gap-3">
											<Package className="mt-0.5 h-5 w-5 text-muted-foreground" />
											<div>
												<p className="text-sm font-medium">{t("estimatedDelivery")}</p>
												<p className="text-sm text-muted-foreground">{formattedDelivery}</p>
											</div>
										</div>
									</div>
								</div>

								<div className="flex justify-center">
									<Button
										type="button"
										className="min-w-[200px] px-8"
										onClick={() => navigateToStorefrontHome(channel, storefrontLocale)}
									>
										{tActions("continueShopping")}
									</Button>
								</div>
							</div>
						</div>
					</div>

					<div className="order-1 md:order-2 md:shrink-0 md:basis-[30%]">
						<div className="overflow-hidden rounded-lg border border-border bg-card md:sticky md:top-8">
							<OrderSummary order={order} editable={false} />
						</div>
					</div>
				</div>
			</main>
		</OrderConfirmationPageShell>
	);
};
