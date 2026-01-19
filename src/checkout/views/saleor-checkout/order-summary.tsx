"use client";

import { useState, type FC } from "react";
import Image from "next/image";
import { Tag, ShieldCheck, RotateCcw, Truck, ChevronDown, ShoppingBag } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { cn } from "@/lib/utils";
import { type CheckoutFragment, type OrderFragment } from "@/checkout/graphql";
import { localeConfig } from "@/config/locale";

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
}

// ============================================================================
// Data Adapters
// ============================================================================

function extractCheckoutData(checkout: CheckoutFragment): OrderSummaryData {
	const lines: LineItem[] = checkout.lines.map((line) => {
		const variantImage = line.variant?.media?.find((m) => m.type === "IMAGE");
		const productImage = line.variant?.product?.media?.find((m) => m.type === "IMAGE");
		const image = variantImage || productImage;
		const attributes =
			line.variant?.attributes
				?.map((attr) => attr.values[0]?.name)
				.filter((name): name is string => Boolean(name)) || [];

		return {
			id: line.id,
			quantity: line.quantity,
			name: line.variant?.product?.name || "Product",
			attributes,
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
		const attributes =
			line.variant?.attributes
				?.map((attr) => attr.values[0]?.name)
				.filter((name): name is string => Boolean(name)) || [];

		return {
			id: line.id,
			quantity: line.quantity,
			name: line.productName || "Product",
			attributes,
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

// ============================================================================
// Component
// ============================================================================

export const OrderSummary: FC<OrderSummaryProps> = ({ checkout, order, editable }) => {
	const [promoCode, setPromoCode] = useState("");
	const [promoApplied, setPromoApplied] = useState(false);
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
		return new Intl.NumberFormat(localeConfig.default, {
			style: "currency",
			currency,
		}).format(amount);
	};

	const handleApplyPromo = () => {
		// TODO: Call Saleor mutation to apply promo code
		if (promoCode.toLowerCase() === "saleor10") {
			setPromoApplied(true);
		}
	};

	// Product thumbnails for collapsed state (show max 2 for cleaner look)
	const thumbnails = lines.slice(0, 2);
	const remainingCount = Math.max(0, lines.length - 2);

	return (
		<article>
			{/* Mobile Collapsible Header - Only visible on mobile */}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="flex w-full items-center justify-between px-4 py-3 md:hidden"
				aria-expanded={isExpanded}
				aria-controls="order-summary-content"
			>
				<div className="flex items-center gap-3">
					{/* Stacked product thumbnails - last image on top */}
					<div className="flex">
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
					{/* Text */}
					<div className="flex flex-col items-start">
						<span className="text-sm font-medium">{isExpanded ? "Hide" : "Show"} order summary</span>
						<span className="text-xs text-muted-foreground">
							{itemCount} {itemCount === 1 ? "item" : "items"}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-base font-semibold">{formatMoney(total)}</span>
					<ChevronDown
						className={cn(
							"h-5 w-5 text-muted-foreground transition-transform duration-200",
							isExpanded && "rotate-180",
						)}
					/>
				</div>
			</button>

			{/* Desktop Header - Only visible on desktop */}
			<header className="bg-secondary/30 hidden items-center gap-2 px-5 py-4 md:flex">
				<h2 className="text-base font-semibold">Order Summary</h2>
				<span className="text-sm text-muted-foreground">
					({itemCount} {itemCount === 1 ? "item" : "items"})
				</span>
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
										<p className="truncate text-sm font-medium leading-tight">{line.name}</p>
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

					{/* Discounts - only for editable checkout */}
					{isEditable && (
						<section className="border-t border-border px-5 py-4">
							<form
								className="flex gap-2"
								onSubmit={(e) => {
									e.preventDefault();
									handleApplyPromo();
								}}
							>
								<div className="relative flex-1">
									<Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										placeholder="Discount code"
										value={promoCode}
										onChange={(e) => setPromoCode(e.target.value)}
										className="h-10 bg-white pl-10 text-sm"
										disabled={promoApplied}
									/>
								</div>
								<Button
									type="submit"
									variant="outline-solid"
									disabled={!promoCode || promoApplied}
									className="h-10 bg-white px-4 text-sm"
								>
									{promoApplied ? "Applied" : "Apply"}
								</Button>
							</form>
							{promoApplied && (
								<p className="mt-2 text-sm font-medium text-green-600">SALEOR10 - 10% discount applied</p>
							)}
						</section>
					)}

					{/* Amounts */}
					<section className="border-t border-border px-5 py-4">
						<dl className="space-y-2 text-sm tabular-nums">
							<div className="flex justify-between">
								<dt className="text-muted-foreground">Subtotal</dt>
								<dd>{formatMoney(subtotal)}</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-muted-foreground">Shipping</dt>
								<dd className={cn(shipping === 0 && "text-green-600")}>
									{shipping === 0 ? "Free" : formatMoney(shipping)}
								</dd>
							</div>
							{tax > 0 && (
								<div className="flex justify-between">
									<dt className="text-muted-foreground">Tax (VAT)</dt>
									<dd>{formatMoney(tax)}</dd>
								</div>
							)}
							{discount > 0 && (
								<div className="flex justify-between text-green-600">
									<dt>Discount</dt>
									<dd>-{formatMoney(discount)}</dd>
								</div>
							)}
						</dl>

						{/* Total */}
						<div className="border-border/50 mt-4 flex items-baseline justify-between border-t pt-4">
							<div className="flex flex-col">
								<span className="text-base font-semibold">Total</span>
								{tax > 0 && <span className="text-xs text-muted-foreground">Including VAT</span>}
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
