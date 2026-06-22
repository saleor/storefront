"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, RotateCcw } from "lucide-react";
import { Button, buttonClassName } from "@/ui/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetCloseButton } from "@/ui/components/ui/sheet";
import { useCart } from "./cart-context";
import type { DeleteCartLine, UpdateCartLineQuantity } from "./cart-mutations";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/utils";
import { localeConfig, resolveLocaleFromSlug } from "@/config/locale";
import { hasDiscount } from "@/lib/pricing";
import { buildCheckoutPath } from "@paper/session-bridge";
import type { CartContent, StorefrontPolicies } from "@/lib/content";
import { formatContentLabel } from "@/lib/content/format-label";

interface CartLine {
	id: string;
	quantity: number;
	totalPrice: {
		gross: {
			amount: number;
			currency: string;
		};
	};
	variant: {
		id: string;
		name: string;
		product: {
			id: string;
			name: string;
			slug: string;
			thumbnail?: {
				url: string;
				alt?: string | null;
			} | null;
		};
		pricing?: {
			price?: {
				gross: {
					amount: number;
					currency: string;
				};
			} | null;
			priceUndiscounted?: {
				gross: {
					amount: number;
					currency: string;
				};
			} | null;
		} | null;
		attributes?: Array<{
			attribute: {
				name?: string | null;
				slug?: string | null;
			};
			values: Array<{
				name?: string | null;
				value?: string | null;
			}>;
		}>;
	};
}

import { getColorHex, isColorAttribute } from "@/lib/colors";

interface VariantAttribute {
	name: string;
	value: string;
	colorHex?: string;
	isColor: boolean;
}

function getVariantDetails(variant: CartLine["variant"]): VariantAttribute[] {
	const attributes = variant.attributes || [];
	const result: VariantAttribute[] = [];

	for (const attr of attributes) {
		const slug = attr.attribute.slug || "";
		const name = attr.attribute.name || slug;
		const value = attr.values[0];

		if (!value?.name) continue;

		const isColor = isColorAttribute(slug);

		result.push({
			name,
			value: value.name,
			colorHex: isColor ? getColorHex(value) : undefined,
			isColor,
		});
	}

	// Sort: color first, then others
	return result.sort((a, b) => {
		if (a.isColor && !b.isColor) return -1;
		if (!a.isColor && b.isColor) return 1;
		return 0;
	});
}

interface CartDrawerProps {
	checkoutId: string | null;
	lines: CartLine[];
	totalPrice: {
		gross: {
			amount: number;
			currency: string;
		};
	} | null;
	channel: string;
	localeSlug: string;
	cart: CartContent;
	policies: StorefrontPolicies;
	deleteCartLine: DeleteCartLine;
	updateCartLineQuantity: UpdateCartLineQuantity;
}

export function CartDrawer({
	checkoutId,
	lines,
	totalPrice,
	channel,
	localeSlug,
	cart,
	policies,
	deleteCartLine,
	updateCartLineQuantity,
}: CartDrawerProps) {
	const { isOpen, closeCart } = useCart();
	const [isCartBusy, setIsCartBusy] = useState(false);
	// Functional drawer chrome (totals, buttons, a11y labels) — code-owned i18n (ADR 0002).
	const t = useTranslations("cart.drawer");

	const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
	const subtotal = totalPrice?.gross.amount ?? 0;
	const currency = totalPrice?.gross.currency ?? localeConfig.fallbackCurrency;
	const intlLocale = resolveLocaleFromSlug(localeSlug).bcp47;

	const runCartMutation = (mutation: () => Promise<void>) => {
		setIsCartBusy(true);
		void mutation().finally(() => {
			setIsCartBusy(false);
		});
	};

	const handleRemove = (lineId: string) => {
		if (!checkoutId) return;
		runCartMutation(() => deleteCartLine(checkoutId, lineId, channel));
	};

	const handleUpdateQuantity = (lineId: string, newQuantity: number) => {
		if (!checkoutId || newQuantity < 1) return;
		runCartMutation(() => updateCartLineQuantity(checkoutId, lineId, newQuantity, channel));
	};

	const checkoutHref = checkoutId
		? buildCheckoutPath({ checkoutId, step: "contact", browseLocale: localeSlug })
		: "/checkout";
	const { drawer } = cart;

	// Single source of truth: the same threshold drives the progress bar, the summary
	// shipping row, and the trust signal — and matches the announcement bar copy.
	const freeShippingThreshold = policies.shipping.freeShippingThreshold;
	const freeShippingEnabled = freeShippingThreshold != null;
	const qualifiesForFreeShipping = freeShippingEnabled && subtotal >= freeShippingThreshold;
	const progressToFreeShipping =
		freeShippingEnabled && freeShippingThreshold > 0
			? Math.min((subtotal / freeShippingThreshold) * 100, 100)
			: 100;
	const amountToFreeShipping = freeShippingEnabled ? Math.max(freeShippingThreshold - subtotal, 0) : 0;
	const returnsLabel = formatContentLabel(cart.trust.returnsLabel, {
		returnsWindowDays: policies.returns.windowDays,
	});

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent side="right" className="flex flex-col p-0">
				{/* Header */}
				<SheetHeader className="justify-between border-b border-border px-6 py-4">
					<div className="flex items-center gap-3">
						<ShoppingBag className="h-5 w-5" />
						<SheetTitle>{drawer.title}</SheetTitle>
						<span className="text-sm text-muted-foreground">({t("itemCount", { count: itemCount })})</span>
					</div>
					<SheetCloseButton className="static" />
				</SheetHeader>

				{/* Free Shipping Progress */}
				{lines.length > 0 && freeShippingEnabled && (
					<div className="bg-secondary/50 border-b border-border px-6 py-4">
						<div className="mb-2 flex items-center gap-2 text-sm">
							<Truck className={cn("h-4 w-4", amountToFreeShipping <= 0 && "text-success")} />
							{amountToFreeShipping > 0 ? (
								<span>
									{formatContentLabel(drawer.addForFreeShipping, {
										amount: formatMoney(amountToFreeShipping, currency, intlLocale),
									})}
								</span>
							) : (
								<span className="font-medium text-success">{drawer.freeShippingQualified}</span>
							)}
						</div>
						<div className="h-1.5 overflow-hidden rounded-full bg-border">
							<div
								className={cn(
									"h-full rounded-full transition-all duration-500 ease-out",
									amountToFreeShipping <= 0 ? "bg-success" : "bg-foreground",
								)}
								style={{ width: `${progressToFreeShipping}%` }}
							/>
						</div>
					</div>
				)}

				{/* Cart Items */}
				<div className="flex-1 overflow-y-auto">
					{lines.length === 0 ? (
						<div className="flex h-full flex-col items-center justify-center px-6 text-center">
							<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
								<ShoppingBag className="h-8 w-8 text-muted-foreground" />
							</div>
							<h3 className="mb-2 text-lg font-medium">{cart.empty.title}</h3>
							<p className="mb-6 text-sm text-muted-foreground">{cart.empty.body}</p>
							<LinkWithChannel
								href="/products"
								onClick={closeCart}
								className={buttonClassName({ asLink: true })}
							>
								{cart.empty.ctaLabel}
							</LinkWithChannel>
						</div>
					) : (
						<ul className="divide-y divide-border">
							{lines.map((line) => {
								const variantAttributes = getVariantDetails(line.variant);
								const isDiscounted = hasDiscount(
									line.variant.pricing?.price?.gross.amount,
									line.variant.pricing?.priceUndiscounted?.gross.amount,
								);

								return (
									<li key={line.id} className="px-6 py-4">
										<div className="flex gap-4">
											{/* Product Image */}
											<LinkWithChannel
												href={`/products/${line.variant.product.slug}?variant=${line.variant.id}`}
												onClick={closeCart}
												className="group relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary"
											>
												{line.variant.product.thumbnail?.url && (
													<Image
														src={line.variant.product.thumbnail.url}
														alt={line.variant.product.thumbnail.alt ?? line.variant.product.name}
														fill
														className="object-cover transition-transform duration-300 group-hover:scale-105"
													/>
												)}
											</LinkWithChannel>

											{/* Product Details */}
											<div className="min-w-0 flex-1">
												<div className="flex items-start justify-between gap-2">
													<div>
														<LinkWithChannel
															href={`/products/${line.variant.product.slug}?variant=${line.variant.id}`}
															onClick={closeCart}
															className="line-clamp-1 text-sm font-medium hover:underline"
														>
															{line.variant.product.name}
														</LinkWithChannel>
														{/* Variant attributes: Color swatch + values separated by | */}
														{variantAttributes.length > 0 ? (
															<div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
																{variantAttributes.map((attr, index) => (
																	<span key={attr.name} className="flex items-center gap-1.5">
																		{index > 0 && <span className="text-border">|</span>}
																		{attr.colorHex && (
																			<span
																				className="h-3 w-3 rounded-full border border-border"
																				style={{ backgroundColor: attr.colorHex }}
																			/>
																		)}
																		{/* Show "Size X" for size attributes, just value for colors */}
																		<span>{attr.isColor ? attr.value : `${attr.name} ${attr.value}`}</span>
																	</span>
																))}
															</div>
														) : line.variant.name && line.variant.name !== line.variant.id ? (
															<p className="mt-1 text-xs text-muted-foreground">{line.variant.name}</p>
														) : null}
													</div>
													<Button
														variant="ghost"
														size="icon"
														className="-mr-2 -mt-1 h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
														onClick={() => handleRemove(line.id)}
														disabled={isCartBusy}
													>
														<Trash2 className="h-4 w-4" />
														<span className="sr-only">
															{t("removeItem", { product: line.variant.product.name })}
														</span>
													</Button>
												</div>

												{/* Quantity & Price */}
												<div className="mt-3 flex items-center justify-between">
													{/* Quantity Selector */}
													<div className="flex items-center rounded-lg border border-border">
														<button
															type="button"
															onClick={() => handleUpdateQuantity(line.id, line.quantity - 1)}
															disabled={line.quantity <= 1 || isCartBusy}
															className="p-2 transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
														>
															<Minus className="h-3 w-3" />
															<span className="sr-only">{t("decreaseQuantity")}</span>
														</button>
														<span className="w-8 text-center text-sm font-medium">{line.quantity}</span>
														<button
															type="button"
															onClick={() => handleUpdateQuantity(line.id, line.quantity + 1)}
															disabled={isCartBusy}
															className="p-2 transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
														>
															<Plus className="h-3 w-3" />
															<span className="sr-only">{t("increaseQuantity")}</span>
														</button>
													</div>

													{/* Price */}
													<div className="text-right">
														<span className="text-sm font-medium">
															{formatMoney(
																line.totalPrice.gross.amount,
																line.totalPrice.gross.currency,
																intlLocale,
															)}
														</span>
														{isDiscounted && line.variant.pricing?.priceUndiscounted && (
															<span className="block text-xs text-muted-foreground line-through">
																{formatMoney(
																	line.variant.pricing.priceUndiscounted.gross.amount * line.quantity,
																	line.variant.pricing.priceUndiscounted.gross.currency,
																	intlLocale,
																)}
															</span>
														)}
													</div>
												</div>
											</div>
										</div>
									</li>
								);
							})}
						</ul>
					)}
				</div>

				{/* Footer */}
				{lines.length > 0 && (
					<div className="border-t border-border bg-background">
						{/* Order Summary */}
						<div className="space-y-2 px-6 py-4">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">{t("subtotal")}</span>
								<span>{formatMoney(subtotal, currency, intlLocale)}</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">{t("shipping")}</span>
								<span>{qualifiesForFreeShipping ? t("shippingFree") : t("shippingCalculated")}</span>
							</div>
							<div className="flex items-center justify-between border-t border-border pt-2 text-base font-semibold">
								<span>{t("total")}</span>
								<span>{formatMoney(subtotal, currency, intlLocale)}</span>
							</div>
						</div>

						{/* Actions */}
						<div className="space-y-3 px-6 pb-6">
							<Link
								href={checkoutHref}
								prefetch={false}
								onClick={(event) => {
									if (isCartBusy) {
										event.preventDefault();
										return;
									}
									closeCart();
								}}
								aria-disabled={isCartBusy}
								className={buttonClassName({
									asLink: true,
									size: "lg",
									className: "group h-12 w-full",
								})}
							>
								<span>{t("checkout")}</span>
								<ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
							</Link>
							<LinkWithChannel
								href="/products"
								onClick={closeCart}
								className={buttonClassName({
									asLink: true,
									variant: "outline-solid",
									size: "lg",
									className: "h-12 w-full",
								})}
							>
								{t("continueShopping")}
							</LinkWithChannel>
						</div>

						{/* Trust Signals */}
						<div className="flex items-center justify-center gap-6 border-t border-border px-6 pb-4 pt-4 text-xs text-muted-foreground">
							{freeShippingEnabled && (
								<span className="flex items-center gap-1.5">
									<Truck className="h-4 w-4" />
									{cart.trust.freeShippingPrefix} {formatMoney(freeShippingThreshold, currency, intlLocale)}
								</span>
							)}
							<span className="flex items-center gap-1.5">
								<RotateCcw className="h-4 w-4" />
								{returnsLabel}
							</span>
						</div>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
