"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { formatMoney, getHrefForVariant } from "@/lib/utils";

export interface CartItemData {
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
			category?: {
				name: string;
			} | null;
		};
		pricing?: {
			price?: {
				gross: {
					amount: number;
					currency: string;
				};
			} | null;
		} | null;
	};
}

export interface CartItemProps {
	item: CartItemData;
	checkoutId: string;
	onQuantityChange?: (lineId: string, quantity: number) => Promise<void>;
	onRemove?: (lineId: string) => Promise<void>;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
	const [quantity, setQuantity] = useState(item.quantity);
	const [isPending, startTransition] = useTransition();
	const [isRemoving, setIsRemoving] = useState(false);

	const unitPrice = item.variant.pricing?.price?.gross;
	const productHref = getHrefForVariant({
		productSlug: item.variant.product.slug,
		variantId: item.variant.id,
	});

	const handleQuantityChange = async (newQuantity: number) => {
		if (newQuantity < 1 || newQuantity > 99 || !onQuantityChange) return;
		
		setQuantity(newQuantity);
		startTransition(async () => {
			await onQuantityChange(item.id, newQuantity);
		});
	};

	const handleRemove = async () => {
		if (!onRemove) return;
		setIsRemoving(true);
		await onRemove(item.id);
	};

	return (
		<li className="flex py-6 border-b border-secondary-200 last:border-b-0">
			{/* Product Image */}
			<div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-secondary-200 bg-secondary-50 sm:h-32 sm:w-32">
				{item.variant.product.thumbnail?.url ? (
					<Image
						src={item.variant.product.thumbnail.url}
						alt={item.variant.product.thumbnail.alt ?? item.variant.product.name}
						fill
						className="object-cover object-center"
						sizes="(max-width: 640px) 96px, 128px"
					/>
				) : (
					<div className="flex h-full items-center justify-center text-secondary-400">
						No image
					</div>
				)}
			</div>

			{/* Product Details */}
			<div className="ml-4 flex flex-1 flex-col sm:ml-6">
				<div className="flex justify-between">
					<div className="flex-1 pr-4">
						<LinkWithChannel href={productHref}>
							<h3 className="text-base font-medium text-secondary-900 hover:text-primary-600 transition-colors">
								{item.variant.product.name}
							</h3>
						</LinkWithChannel>
						
						{item.variant.product.category && (
							<p className="mt-1 text-sm text-secondary-500">
								{item.variant.product.category.name}
							</p>
						)}
						
						{item.variant.name !== item.variant.id && item.variant.name && (
							<p className="mt-1 text-sm text-secondary-500">
								{item.variant.name}
							</p>
						)}

						{unitPrice && (
							<p className="mt-1 text-sm text-secondary-600">
								{formatMoney(unitPrice.amount, unitPrice.currency)} each
							</p>
						)}
					</div>

					{/* Price */}
					<p className="text-base font-semibold text-secondary-900">
						{formatMoney(item.totalPrice.gross.amount, item.totalPrice.gross.currency)}
					</p>
				</div>

				{/* Quantity and Remove */}
				<div className="mt-4 flex items-center justify-between">
					{/* Quantity Selector */}
					<div className="flex items-center border border-secondary-300 rounded-md">
						<button
							type="button"
							onClick={() => handleQuantityChange(quantity - 1)}
							disabled={quantity <= 1 || isPending}
							className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							aria-label="Decrease quantity"
						>
							<Minus className="h-4 w-4" />
						</button>
						<span className="w-10 text-center text-sm font-medium text-secondary-900">
							{isPending ? (
								<Loader2 className="h-4 w-4 animate-spin mx-auto" />
							) : (
								quantity
							)}
						</span>
						<button
							type="button"
							onClick={() => handleQuantityChange(quantity + 1)}
							disabled={quantity >= 99 || isPending}
							className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							aria-label="Increase quantity"
						>
							<Plus className="h-4 w-4" />
						</button>
					</div>

					{/* Remove Button */}
					<button
						type="button"
						onClick={handleRemove}
						disabled={isRemoving}
						className="flex items-center gap-1 text-sm text-secondary-500 hover:text-red-600 transition-colors disabled:opacity-50"
					>
						{isRemoving ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Trash2 className="h-4 w-4" />
						)}
						<span className="hidden sm:inline">Remove</span>
					</button>
				</div>
			</div>
		</li>
	);
}
