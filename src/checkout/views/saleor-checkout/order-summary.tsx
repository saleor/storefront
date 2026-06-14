"use client";

import { useState, type FC, type FormEvent } from "react";
import Image from "next/image";
import { Tag, ShieldCheck, RotateCcw, Truck, ChevronDown, ShoppingBag, X } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { cn } from "@/lib/utils";
import { applyCheckoutPromoCode, removeCheckoutPromoCode } from "@/app/(checkout)/actions";
import { type CheckoutErrorFragment, type CheckoutFragment, type OrderFragment } from "@/checkout/graphql";
import { useCheckoutData } from "@/checkout/providers/checkout-data";
import { useTranslations } from "next-intl";
import { useCheckoutBrowseLocale } from "@/checkout/providers/checkout-browse";
import { getLocaleDefinition } from "@/config/locale";
import { localeConfig } from "@/config/locale";
import { contactFieldAttributes } from "@/checkout/lib/consts/input-attributes";
import { pickTranslatedName } from "@/lib/saleor-translations";

// ============================================================================
// Types
// ============================================================================

interface LineItem {
	id: string;
	quantity: number;
	name: string;
	attributes: string[];
	imageUrl?: string | null;
	imageAlt?: string | null;
	totalAmount: number;
}

interface OrderSummaryData {
	lines: LineItem[];
	currency: string;
	subtotal: number;
	shipping: number;
	tax: number;
	discount: number;
	total: number;
	editable?: boolean;
}

interface OrderSummaryProps {
	checkout?: CheckoutFragment;
	order?: OrderFragment;
	editable?: boolean;
	onCheckoutChange?: () => void;
}

// ============================================================================
// Data Adapters
// ============================================================================

function translatedAttributeLabels(
	attributes:
		| ReadonlyArray<{
				values: ReadonlyArray<{ name?: string | null; translation?: { name?: string | null } | null }>;
		  }>
		| null
		| undefined,
): string[] {
	return (
		attributes
			?.map((attr) => {
				const value = attr.values[0];
				if (!value) return null;
				const label = pickTranslatedName({ name: value.name ?? "", translation: value.translation });
				return label || null;
			})
			.filter((name): name is string => Boolean(name)) ?? []
	);
}

function checkoutLineDisplayName(line: CheckoutFragment["lines"][number]): string {
	const product = line.variant?.product;
	if (product) {
		return pickTranslatedName(product);
	}

	const variant = line.variant;
	if (variant) {
		return pickTranslatedName(variant);
	}

	return "";
}

function orderLineDisplayName(line: OrderFragment["lines"][number]): string {
	const product = line.variant?.product;
	if (product) {
		return pickTranslatedName(product);
	}

	if (line.productName) {
		return line.productName;
	}

	const variant = line.variant;
	if (variant) {
		return pickTranslatedName(variant);
	}

	return "";
}

function extractCheckoutData(checkout: CheckoutFragment): OrderSummaryData {
	const lines: LineItem[] = checkout.lines.map((line) => {
		const variantImage = line.variant?.media?.find((m) => m.type === "IMAGE");
		const productImage = line.variant?.product?.media?.find((m) => m.type === "IMAGE");
		const image = variantImage || productImage;

		return {
			id: line.id,
			quantity: line.quantity,
			name: checkoutLineDisplayName(line),
			attributes: translatedAttributeLabels(line.variant?.attributes),
			imageUrl: image?.url,
			imageAlt: image?.alt,
			totalAmount: line.totalPrice?.gross?.amount || 0,
		};
	});

	return {
		lines,
		currency: checkout.totalPrice?.gross?.currency || localeConfig.fallbackCurrency,
		subtotal: checkout.subtotalPrice?.gross?.amount || 0,
		shipping: checkout.shippingPrice?.gross?.amount || 0,
		tax: checkout.totalPrice?.tax?.amount || 0,
		discount: checkout.discount?.amount || 0,
		total: checkout.totalPrice?.gross?.amount || 0,
		editable: true,
	};
}

function extractOrderData(order: OrderFragment): OrderSummaryData {
	const lines: LineItem[] = order.lines.map((line) => {
		return {
			id: line.id,
			quantity: line.quantity,
			name: orderLineDisplayName(line),
			attributes: translatedAttributeLabels(line.variant?.attributes),
			imageUrl: line.thumbnail?.url,
			imageAlt: line.thumbnail?.alt,
			totalAmount: line.totalPrice?.gross?.amount || 0,
		};
	});

	const discount = order.discounts?.reduce((sum, d) => sum + (d.amount?.amount || 0), 0) || 0;

	return {
		lines,
		currency: order.total?.gross?.currency || localeConfig.fallbackCurrency,
		subtotal: order.subtotal?.gross?.amount || 0,
		shipping: order.shippingPrice?.gross?.amount || 0,
		tax: order.total?.tax?.amount || 0,
		discount,
		total: order.total?.gross?.amount || 0,
		editable: false,
	};
}

function getCheckoutErrorMessage(errors: readonly CheckoutErrorFragment[] | undefined) {
	return errors?.[0]?.message ?? null;
}

// ============================================================================
// Component
// ============================================================================

export const OrderSummary: FC<OrderSummaryProps> = ({ checkout, order, editable, onCheckoutChange }) => {
	const t = useTranslations("checkout.summary");
	const tCommon = useTranslations("account.common");
	const localeSlug = useCheckoutBrowseLocale();
	const localeBcp47 = getLocaleDefinition(localeSlug)?.bcp47 ?? localeConfig.default;
	// Collapsed by default on mobile
	const [isExpanded, setIsExpanded] = useState(false);

	// Extract data from either checkout or order
	const data = checkout ? extractCheckoutData(checkout) : order ? extractOrderData(order) : null;

	if (!data) {
		return null;
	}

	const { lines, currency, subtotal, shipping, tax, discount, total } = data;
	const isEditable = editable ?? data.editable;
	const itemCount = lines.reduce((acc, line) => acc + line.quantity, 0);

	const formatMoney = (amount: number) => {
		return new Intl.NumberFormat(localeBcp47, {
			style: "currency",
			currency,
		}).format(amount);
	};

	// Product thumbnails for collapsed state (show max 2 for cleaner look)
	const thumbnails = lines.slice(0, 2);
	const remainingCount = Math.max(0, lines.length - 2);

	return (
		<article>
			{/* Mobile Collapsible Header - Only visible on mobile */}
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="flex w-full flex-col gap-1.5 px-4 py-3 text-left md:hidden"
				aria-expanded={isExpanded}
				aria-controls="order-summary-content"
				aria-label={t("toggleOrderSummary", { action: isExpanded ? t("hide") : t("show") })}
			>
				<div className="flex w-full items-center gap-3">
					<p className="min-w-0 flex-1 truncate text-sm font-medium">
						{t("title")}
						<span className="font-normal text-muted-foreground">
							{" · "}
							{t("itemCount", { count: itemCount })}
						</span>
					</p>
					<ChevronDown
						aria-hidden
						className={cn(
							"h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
							isExpanded && "rotate-180",
						)}
					/>
				</div>
				<div className="flex w-full items-center justify-between gap-3">
					{/* Stacked product thumbnails - last image on top */}
					<div className="flex shrink-0">
						{thumbnails.length > 0 ? (
							thumbnails.map((line, idx) => (
								<div
									key={line.id}
									className={cn(
										"relative h-8 w-8 shrink-0 overflow-hidden rounded-md border-2 border-card bg-secondary",
										idx === 0 && "z-[1]",
										idx === 1 && "z-[2] -ml-3",
									)}
								>
									{line.imageUrl ? (
										<Image
											src={line.imageUrl}
											alt={line.imageAlt || line.name}
											width={32}
											height={32}
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
											<Tag className="h-3 w-3" />
										</div>
									)}
								</div>
							))
						) : (
							<div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary">
								<ShoppingBag className="h-4 w-4 text-muted-foreground" />
							</div>
						)}
						{remainingCount > 0 && (
							<div className="z-[3] -ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-2 border-card bg-muted text-[10px] font-semibold text-muted-foreground">
								+{remainingCount}
							</div>
						)}
					</div>
					<span className="text-base font-semibold tabular-nums">{formatMoney(total)}</span>
				</div>
			</button>

			{/* Desktop Header - Only visible on desktop */}
			<header className="bg-secondary/30 hidden items-center gap-2 px-5 py-4 md:flex">
				<h2 className="text-base font-semibold">{t("title")}</h2>
				<span className="text-sm text-muted-foreground">({t("itemCount", { count: itemCount })})</span>
			</header>

			{/* Collapsible Content - animated on mobile, always visible on desktop */}
			<div id="order-summary-content" className="order-summary-content" data-expanded={isExpanded}>
				<div className="order-summary-inner">
					{/* Products */}
					<section className="border-t border-border">
						<ul className="max-h-[280px] space-y-1 overflow-y-auto px-5 py-4 [scrollbar-gutter:stable]">
							{lines.map((line) => (
								<li key={line.id} className="flex gap-4 py-2">
									{/* Product image with quantity badge */}
									<figure className="relative shrink-0">
										<span className="shadow-xs absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
											{line.quantity}
										</span>
										<div className="h-14 w-14 overflow-hidden rounded-lg border border-border bg-secondary">
											{line.imageUrl ? (
												<Image
													src={line.imageUrl}
													alt={line.imageAlt || line.name}
													width={56}
													height={56}
													className="h-full w-full object-contain object-center"
												/>
											) : (
												<div className="flex h-full w-full items-center justify-center text-muted-foreground">
													<Tag className="h-5 w-5" />
												</div>
											)}
										</div>
									</figure>

									{/* Product details */}
									<div className="flex min-w-0 flex-1 flex-col justify-center">
										<p className="truncate text-sm font-medium leading-tight">
											{line.name || t("productFallback")}
										</p>
										{line.attributes.length > 0 && (
											<p className="mt-0.5 truncate text-xs text-muted-foreground">
												{line.attributes.join(" / ")}
											</p>
										)}
									</div>

									{/* Price */}
									<data
										value={line.totalAmount}
										className="flex flex-col justify-center text-sm font-medium tabular-nums"
									>
										{formatMoney(line.totalAmount)}
									</data>
								</li>
							))}
						</ul>
					</section>

					{/* Discounts - only for editable checkout (requires CheckoutDataProvider) */}
					{isEditable && checkout ? (
						<CheckoutPromoSection checkout={checkout} onCheckoutChange={onCheckoutChange} />
					) : null}

					{/* Amounts */}
					<section className="border-t border-border px-5 py-4">
						<dl className="space-y-2 text-sm tabular-nums">
							<div className="flex justify-between">
								<dt className="text-muted-foreground">{t("subtotal")}</dt>
								<dd>{formatMoney(subtotal)}</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-muted-foreground">{t("shipping")}</dt>
								<dd className={cn(shipping === 0 && "text-green-600")}>
									{shipping === 0 ? tCommon("free") : formatMoney(shipping)}
								</dd>
							</div>
							{tax > 0 && (
								<div className="flex justify-between">
									<dt className="text-muted-foreground">{t("taxVat")}</dt>
									<dd>{formatMoney(tax)}</dd>
								</div>
							)}
							{discount > 0 && (
								<div className="flex justify-between text-green-600">
									<dt>{t("discount")}</dt>
									<dd>-{formatMoney(discount)}</dd>
								</div>
							)}
						</dl>

						{/* Total */}
						<div className="border-border/50 mt-4 flex items-baseline justify-between border-t pt-4">
							<div className="flex flex-col">
								<span className="text-base font-semibold">{t("total")}</span>
								{tax > 0 && <span className="text-xs text-muted-foreground">{t("includingVat")}</span>}
							</div>
							<data value={total} className="text-xl font-semibold tabular-nums">
								{formatMoney(total)}
							</data>
						</div>
					</section>

					{/* Trust/Social proof */}
					<footer className="bg-secondary/30 grid grid-cols-3 gap-2 border-t border-border px-5 py-4">
						<div className="flex flex-col items-center rounded-lg bg-secondary p-2.5 text-center">
							<ShieldCheck className="mb-1 h-4 w-4 text-muted-foreground" />
							<span className="text-[10px] leading-tight text-muted-foreground">
								Secure
								<br />
								checkout
							</span>
						</div>
						<div className="flex flex-col items-center rounded-lg bg-secondary p-2.5 text-center">
							<RotateCcw className="mb-1 h-4 w-4 text-muted-foreground" />
							<span className="text-[10px] leading-tight text-muted-foreground">
								30-day
								<br />
								returns
							</span>
						</div>
						<div className="flex flex-col items-center rounded-lg bg-secondary p-2.5 text-center">
							<Truck className="mb-1 h-4 w-4 text-muted-foreground" />
							<span className="text-[10px] leading-tight text-muted-foreground">
								Free
								<br />
								shipping
							</span>
						</div>
					</footer>
				</div>
			</div>
		</article>
	);
};

type CheckoutPromoSectionProps = {
	checkout: CheckoutFragment;
	onCheckoutChange?: () => void;
};

/** Promo editor — isolated so read-only order summaries skip CheckoutDataProvider. */
function CheckoutPromoSection({ checkout, onCheckoutChange }: CheckoutPromoSectionProps) {
	const tPromo = useTranslations("checkout.promo");
	const tErrors = useTranslations("checkout.errors");
	const [promoCode, setPromoCode] = useState("");
	const [promoError, setPromoError] = useState<string | null>(null);
	const [isPromoBusy, setIsPromoBusy] = useState(false);
	const { setCheckout } = useCheckoutData();

	const appliedPromoCode = checkout.voucherCode;
	const appliedDiscountName = checkout.translatedDiscountName || checkout.discountName;

	const handleApplyPromo = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (isPromoBusy) return;

		const trimmedCode = promoCode.trim();
		if (!trimmedCode) return;

		setPromoError(null);
		setIsPromoBusy(true);

		try {
			const result = await applyCheckoutPromoCode(checkout.id, trimmedCode);

			if (!result.ok) {
				const errorMessage =
					result.error ?? getCheckoutErrorMessage(result.fieldErrors) ?? tErrors("discountApplyFailed");
				setPromoError(errorMessage);
				return;
			}

			setCheckout(result.checkout);
			setPromoCode("");
			onCheckoutChange?.();
		} finally {
			setIsPromoBusy(false);
		}
	};

	const handleRemovePromo = async () => {
		if (!appliedPromoCode || isPromoBusy) return;

		setPromoError(null);
		setIsPromoBusy(true);

		try {
			const result = await removeCheckoutPromoCode(checkout.id, appliedPromoCode);

			if (!result.ok) {
				const errorMessage =
					result.error ?? getCheckoutErrorMessage(result.fieldErrors) ?? tErrors("discountRemoveFailed");
				setPromoError(errorMessage);
				return;
			}

			setCheckout(result.checkout);
			onCheckoutChange?.();
		} finally {
			setIsPromoBusy(false);
		}
	};

	return (
		<section className="border-t border-border px-5 py-4">
			{appliedPromoCode ? (
				<div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
					<Tag className="h-4 w-4 shrink-0 text-green-700" />
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium text-green-800">{appliedPromoCode}</p>
						{appliedDiscountName ? (
							<p className="truncate text-xs text-green-700">{appliedDiscountName}</p>
						) : null}
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						disabled={isPromoBusy}
						onClick={() => void handleRemovePromo()}
						aria-label={tPromo("removeAriaLabel")}
						className="h-8 w-8 shrink-0 text-green-700 hover:bg-green-100 hover:text-green-800"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			) : (
				<form className="flex gap-2" onSubmit={handleApplyPromo}>
					<div className="relative flex-1">
						<Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							name={contactFieldAttributes.promoCode.name}
							inputMode={contactFieldAttributes.promoCode.inputMode}
							autoComplete={contactFieldAttributes.promoCode.autoComplete}
							placeholder={tPromo("placeholder")}
							value={promoCode}
							onChange={(e) => {
								setPromoCode(e.target.value);
								setPromoError(null);
							}}
							aria-invalid={Boolean(promoError)}
							className="h-10 bg-white pl-10 text-sm"
							disabled={isPromoBusy}
						/>
					</div>
					<Button
						type="submit"
						variant="outline-solid"
						disabled={!promoCode.trim() || isPromoBusy}
						className="h-10 bg-white px-4 text-sm"
					>
						{isPromoBusy ? tPromo("applying") : tPromo("apply")}
					</Button>
				</form>
			)}
			{promoError ? (
				<p className="mt-2 text-sm text-destructive" role="alert">
					{promoError}
				</p>
			) : null}
		</section>
	);
}
