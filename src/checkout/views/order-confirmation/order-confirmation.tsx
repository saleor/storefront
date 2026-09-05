"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Mail, MapPin, Package, CreditCard, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

import { clearPaymentCompleting } from "@/checkout/lib/payment/checkout-payment-completion";
import { navigateToStorefrontHome } from "@/lib/auth";
import { useCheckoutBrowseLocale } from "@/checkout/providers/checkout-browse";
import { useCheckoutUser } from "@/checkout/providers/checkout-user";
import { Button } from "@/ui/components/ui/button";
import { useOrder } from "@/checkout/hooks/use-order";
import { OrderSummary } from "@/checkout/views/saleor-checkout/order-summary";
import { OrderConfirmationPageShell } from "./order-confirmation-page-shell";
import { PageNotFound } from "@/checkout/views/page-not-found";
import { getCustomerOrderStatusLabel } from "@/lib/order-status";
import { billingCityCountry } from "@/lib/order-view/sanitize";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { OrderEmailGate } from "./order-email-gate";

function formatAddress(address: {
	firstName?: string | null;
	lastName?: string | null;
	streetAddress1?: string | null;
	streetAddress2?: string | null;
	city?: string | null;
	postalCode?: string | null;
	country?: { country?: string | null } | null;
}) {
	const name = [address.firstName, address.lastName].filter(Boolean).join(" ");
	return [
		name,
		address.streetAddress1,
		address.streetAddress2,
		[address.postalCode, address.city].filter(Boolean).join(" "),
		address.country?.country,
	]
		.filter(Boolean)
		.join(", ");
}

function deliveryWindow(
	method: {
		minimumDeliveryDays?: number | null;
		maximumDeliveryDays?: number | null;
	} | null,
): string | null {
	if (!method) {
		return null;
	}
	const min = method.minimumDeliveryDays;
	const max = method.maximumDeliveryDays;
	if (min != null && max != null && min !== max) {
		return `${min}–${max}`;
	}
	if (min != null) {
		return String(min);
	}
	if (max != null) {
		return String(max);
	}
	return null;
}

export const OrderConfirmation = () => {
	const { order, access } = useOrder();
	const { authenticated } = useCheckoutUser();
	const storefrontLocale = useCheckoutBrowseLocale();
	const t = useTranslations("checkout.confirmation");
	const tStatus = useTranslations("account.orderStatus");
	const tFind = useTranslations("checkout.orderFind");
	const tErrors = useTranslations("checkout.errors");
	const tActions = useTranslations("checkout.actions");

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
	const verified = access === "verified";
	const shippingAddress = order.shippingAddress;
	const billingLabel = billingCityCountry(order.billingAddress ?? null);
	const email = order.userEmail || "";
	const statusLabel = getCustomerOrderStatusLabel(tStatus, order.status, order.statusDisplay);
	const method = order.deliveryMethod && "name" in order.deliveryMethod ? order.deliveryMethod : null;
	const days = deliveryWindow(method);
	const trackingNumbers =
		order.fulfillments
			?.map((fulfillment) => fulfillment.trackingNumber)
			.filter((value): value is string => Boolean(value)) ?? [];

	return (
		<OrderConfirmationPageShell storefrontChannel={channel}>
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-8 md:flex-row">
					<div className="order-2 min-w-0 flex-1 md:order-1">
						<div className="rounded-lg border border-border bg-card p-6 md:p-8">
							<div className="space-y-8">
								<div className="space-y-4 text-center">
									<div className="flex justify-center">
										<CheckCircle className="h-16 w-16 text-foreground" />
									</div>
									<div>
										<p className="text-muted-foreground">{t("orderNumber", { number: order.number })}</p>
										<h1 className="mt-1 text-balance text-h1">
											{verified ? t("thankYou") : t("statusTitle")}
										</h1>
										<p className="mt-2 text-sm font-medium">{statusLabel}</p>
									</div>
								</div>

								<div className="overflow-hidden rounded-lg border border-border">
									<div className="border-b border-border bg-secondary/50 p-4">
										<h2 className="font-semibold">{verified ? t("confirmedTitle") : t("publicTitle")}</h2>
										<p className="mt-1 text-sm text-muted-foreground">
											{verified ? t("confirmedEmail", { email }) : t("publicBody")}
										</p>
									</div>

									<div className="space-y-4 p-4">
										{verified ? (
											<>
												<div className="flex items-start gap-3">
													<Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
													<div>
														<p className="text-sm font-medium">{t("emailSent")}</p>
														<p className="text-sm text-muted-foreground">{email}</p>
													</div>
												</div>
												{shippingAddress ? (
													<div className="flex items-start gap-3">
														<MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
														<div>
															<p className="text-sm font-medium">{t("shippingAddress")}</p>
															<p className="text-sm text-muted-foreground">
																{formatAddress(shippingAddress)}
															</p>
														</div>
													</div>
												) : null}
												{billingLabel ? (
													<div className="flex items-start gap-3">
														<CreditCard className="mt-0.5 h-5 w-5 text-muted-foreground" />
														<div>
															<p className="text-sm font-medium">{t("billingAddress")}</p>
															<p className="text-sm text-muted-foreground">{billingLabel}</p>
														</div>
													</div>
												) : null}
												{method?.name ? (
													<div className="flex items-start gap-3">
														<Package className="mt-0.5 h-5 w-5 text-muted-foreground" />
														<div>
															<p className="text-sm font-medium">{t("shippingMethod")}</p>
															<p className="text-sm text-muted-foreground">
																{method.name}
																{days ? ` · ${t("deliveryDays", { days })}` : ""}
															</p>
														</div>
													</div>
												) : null}
												{trackingNumbers.length > 0 ? (
													<div className="flex items-start gap-3">
														<Truck className="mt-0.5 h-5 w-5 text-muted-foreground" />
														<div>
															<p className="text-sm font-medium">{t("tracking")}</p>
															<ul className="text-sm text-muted-foreground">
																{trackingNumbers.map((number) => (
																	<li key={number}>
																		<a
																			href={`https://www.google.com/search?q=${encodeURIComponent(number)}`}
																			rel="noopener noreferrer"
																			target="_blank"
																			className="underline underline-offset-2"
																		>
																			{number}
																		</a>
																	</li>
																))}
															</ul>
														</div>
													</div>
												) : null}
											</>
										) : (
											<OrderEmailGate orderId={order.id} />
										)}
									</div>
								</div>

								<div className="flex flex-col items-center gap-3">
									<Button
										type="button"
										className="min-w-[200px] px-8"
										onClick={() => navigateToStorefrontHome(channel, storefrontLocale)}
									>
										{tActions("continueShopping")}
									</Button>
									{verified && channel && !authenticated ? (
										<a
											href={buildStorefrontPath(storefrontLocale, channel, "/signup")}
											className="text-sm text-muted-foreground underline underline-offset-2"
										>
											{t("createAccount")}
										</a>
									) : null}
									<Link
										href={`/order/find?locale=${encodeURIComponent(storefrontLocale)}`}
										className="text-sm text-muted-foreground underline underline-offset-2"
									>
										{tFind("findAnother")}
									</Link>
									{!verified && channel && !authenticated ? (
										<a
											href={buildStorefrontPath(storefrontLocale, channel, "/login")}
											className="text-sm text-muted-foreground underline underline-offset-2"
										>
											{t("signIn")}
										</a>
									) : null}
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
