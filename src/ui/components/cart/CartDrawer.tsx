"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/ui/components/ui/Button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetCloseButton } from "@/ui/components/ui/Sheet";
import { useCart } from "./CartContext";
import { deleteCartLine, updateCartLineQuantity } from "./actions";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/utils";

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

// Color name to hex mapping for display
const COLOR_NAME_TO_HEX: Record<string, string> = {
	black: "#1a1a1a",
	white: "#fafafa",
	red: "#dc2626",
	blue: "#2563eb",
	green: "#16a34a",
	yellow: "#eab308",
	orange: "#ea580c",
	purple: "#9333ea",
	pink: "#ec4899",
	gray: "#6b7280",
	grey: "#6b7280",
	brown: "#78350f",
	navy: "#1e3a5a",
	beige: "#d4c4a8",
	cream: "#fffdd0",
};

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
		const slug = attr.attribute.slug?.toLowerCase() || "";
		const name = attr.attribute.name || slug;
		const value = attr.values[0];

		if (!value?.name) continue;

		const isColor = slug === "color" || slug === "colour";
		let colorHex: string | undefined;

		if (isColor) {
			// Try to get hex from value field (swatch) or name lookup
			if (value.value?.startsWith("#")) {
				colorHex = value.value;
			} else if (value.value && /^[0-9A-Fa-f]{6}$/.test(value.value)) {
				colorHex = `#${value.value}`;
			} else {
				colorHex = COLOR_NAME_TO_HEX[value.name.toLowerCase()] || undefined;
			}
		}

		result.push({
			name,
			value: value.name,
			colorHex,
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
}

export function CartDrawer({ checkoutId, lines, totalPrice, channel }: CartDrawerProps) {
	const { isOpen, closeCart } = useCart();
	const [isPending, startTransition] = useTransition();

	const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
	const subtotal = totalPrice?.gross.amount ?? 0;
	const currency = totalPrice?.gross.currency ?? "USD";

	const handleRemove = (lineId: string) => {
		if (!checkoutId) return;
		startTransition(() => {
			deleteCartLine(checkoutId, lineId);
		});
	};

	const handleUpdateQuantity = (lineId: string, newQuantity: number) => {
		if (!checkoutId || newQuantity < 1) return;
		startTransition(() => {
			updateCartLineQuantity(checkoutId, lineId, newQuantity);
		});
	};

	const freeShippingThreshold = 100;
	const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);
	const amountToFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent side="right" className="flex flex-col p-0">
				{/* Header */}
				<SheetHeader className="justify-between border-b border-border px-6 py-4">
					<div className="flex items-center gap-3">
						<ShoppingBag className="h-5 w-5" />
						<SheetTitle>Your Bag</SheetTitle>
						<span className="text-sm text-muted-foreground">({itemCount} items)</span>
					</div>
					<SheetCloseButton className="static" />
				</SheetHeader>

				{/* Free Shipping Progress */}
				{lines.length > 0 && (
					<div className="bg-secondary/50 border-b border-border px-6 py-4">
						<div className="mb-2 flex items-center gap-2 text-sm">
							<Truck className={cn("h-4 w-4", amountToFreeShipping <= 0 && "text-success")} />
							{amountToFreeShipping > 0 ? (
								<span>
									Add <strong>{formatMoney(amountToFreeShipping, currency)}</strong> more for free shipping
								</span>
							) : (
								<span className="font-medium text-success">You qualify for free shipping!</span>
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
							<h3 className="mb-2 text-lg font-medium">Your bag is empty</h3>
							<p className="mb-6 text-sm text-muted-foreground">
								Looks like you haven&apos;t added anything to your bag yet.
							</p>
							<Link
								href={`/${channel}/products`}
								onClick={closeCart}
								className="hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors"
							>
								Start Shopping
							</Link>
						</div>
					) : (
						<ul className="divide-y divide-border">
							{lines.map((line) => {
								const variantAttributes = getVariantDetails(line.variant);
								const hasDiscount =
									line.variant.pricing?.priceUndiscounted?.gross.amount &&
									line.variant.pricing.priceUndiscounted.gross.amount >
										line.variant.pricing?.price?.gross.amount!;

								return (
									<li key={line.id} className="px-6 py-4">
										<div className="flex gap-4">
											{/* Product Image */}
											<Link
												href={`/${channel}/products/${line.variant.product.slug}?variant=${line.variant.id}`}
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
											</Link>

											{/* Product Details */}
											<div className="min-w-0 flex-1">
												<div className="flex items-start justify-between gap-2">
													<div>
														<Link
															href={`/${channel}/products/${line.variant.product.slug}?variant=${line.variant.id}`}
															onClick={closeCart}
															className="line-clamp-1 text-sm font-medium hover:underline"
														>
															{line.variant.product.name}
														</Link>
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
														disabled={isPending}
													>
														<Trash2 className="h-4 w-4" />
														<span className="sr-only">Remove {line.variant.product.name}</span>
													</Button>
												</div>

												{/* Quantity & Price */}
												<div className="mt-3 flex items-center justify-between">
													{/* Quantity Selector */}
													<div className="flex items-center rounded-lg border border-border">
														<button
															type="button"
															onClick={() => handleUpdateQuantity(line.id, line.quantity - 1)}
															disabled={line.quantity <= 1 || isPending}
															className="p-2 transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
														>
															<Minus className="h-3 w-3" />
															<span className="sr-only">Decrease quantity</span>
														</button>
														<span className="w-8 text-center text-sm font-medium">{line.quantity}</span>
														<button
															type="button"
															onClick={() => handleUpdateQuantity(line.id, line.quantity + 1)}
															disabled={isPending}
															className="p-2 transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
														>
															<Plus className="h-3 w-3" />
															<span className="sr-only">Increase quantity</span>
														</button>
													</div>

													{/* Price */}
													<div className="text-right">
														<span className="text-sm font-medium">
															{formatMoney(line.totalPrice.gross.amount, line.totalPrice.gross.currency)}
														</span>
														{hasDiscount && line.variant.pricing?.priceUndiscounted && (
															<span className="block text-xs text-muted-foreground line-through">
																{formatMoney(
																	line.variant.pricing.priceUndiscounted.gross.amount * line.quantity,
																	line.variant.pricing.priceUndiscounted.gross.currency,
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
								<span className="text-muted-foreground">Subtotal</span>
								<span>{formatMoney(subtotal, currency)}</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Shipping</span>
								<span>{subtotal >= freeShippingThreshold ? "Free" : "Calculated at checkout"}</span>
							</div>
							<div className="flex items-center justify-between border-t border-border pt-2 text-base font-semibold">
								<span>Total</span>
								<span>{formatMoney(subtotal, currency)}</span>
							</div>
						</div>

						{/* Actions */}
						<div className="space-y-3 px-6 pb-6">
							<Link
								href={`/checkout?checkout=${checkoutId}`}
								onClick={closeCart}
								className="hover:bg-primary/90 group inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-base font-medium text-primary-foreground transition-colors"
							>
								<span>Checkout</span>
								<ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
							</Link>
							<Link
								href={`/${channel}/products`}
								onClick={closeCart}
								className="inline-flex h-12 w-full items-center justify-center rounded-md border border-border bg-transparent text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
							>
								Continue Shopping
							</Link>
						</div>

						{/* Trust Signals */}
						<div className="flex items-center justify-center gap-6 border-t border-border px-6 pb-4 pt-4 text-xs text-muted-foreground">
							<span className="flex items-center gap-1.5">
								<Truck className="h-4 w-4" />
								Free delivery over {formatMoney(freeShippingThreshold, currency)}
							</span>
							<span className="flex items-center gap-1.5">
								<RotateCcw className="h-4 w-4" />
								30-day returns
							</span>
						</div>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
