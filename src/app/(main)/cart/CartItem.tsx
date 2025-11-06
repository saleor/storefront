"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { DeleteLineButton } from "./DeleteLineButton";
import { QuantitySelector } from "@/checkout/components/QuantitySelector";
import { formatMoney, getHrefForVariant } from "@/lib/utils";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export interface CartItemProps {
	item: {
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
		};
	};
	checkoutId: string;
	onQuantityChange: (lineId: string, quantity: number) => Promise<{ success: boolean }>;
	onDelete: (lineId: string) => Promise<void>;
	index: number;
}

export function CartItem({ item, checkoutId, onQuantityChange, onDelete, index }: CartItemProps) {
	const [isUpdating, setIsUpdating] = useState(false);

	const handleQuantityChange = useCallback(
		async (newQuantity: number) => {
			if (newQuantity === item.quantity) {
				return;
			}

			setIsUpdating(true);

			try {
				const result = await onQuantityChange(item.id, newQuantity);

				if (result.success) {
					const productName = item.variant.product.name;
					const variantName = item.variant.name !== item.variant.id ? ` (${item.variant.name})` : "";

					if (newQuantity > item.quantity) {
						toast.success(`Increased quantity of ${productName}${variantName} to ${newQuantity}`, {
							position: "top-right",
						});
					} else {
						toast.info(`Updated quantity of ${productName}${variantName} to ${newQuantity}`, {
							position: "top-right",
						});
					}
				} else {
					toast.error("Failed to update quantity. Please try again.", {
						position: "top-right",
					});
				}
			} catch (error) {
				console.error("Error updating quantity:", error);
				toast.error("Failed to update quantity. Please try again.", {
					position: "top-right",
				});
			} finally {
				setIsUpdating(false);
			}
		},
		[item, onQuantityChange],
	);

	const handleDelete = useCallback(async () => {
		setIsUpdating(true);

		try {
			await onDelete(item.id);

			const productName = item.variant.product.name;
			const variantName = item.variant.name !== item.variant.id ? ` (${item.variant.name})` : "";

			toast.info(`Removed ${productName}${variantName} from cart`, {
				position: "top-right",
			});
		} catch (error) {
			console.error("Error deleting item:", error);
			toast.error("Failed to remove item. Please try again.", {
				position: "top-right",
			});
			setIsUpdating(false);
		}
	}, [item, onDelete]);

	return (
		<li
			className="card hover-lift stagger-item group"
			style={{ animationDelay: `${index * 0.05}s` }}
		>
			<div className="flex gap-4 sm:gap-6">
				<div className="relative aspect-square h-24 w-24 flex-shrink-0 overflow-hidden bg-gradient-to-br from-base-900 to-base-950 sm:h-28 sm:w-28 md:h-36 md:w-36">
					{item.variant?.product?.thumbnail?.url && (
						<Image
							src={item.variant.product.thumbnail.url}
							alt={item.variant.product.thumbnail.alt ?? ""}
							width={144}
							height={144}
							sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 144px"
							className="h-full w-full object-contain object-center p-2 transition-transform duration-300 group-hover:scale-105"
						/>
					)}
				</div>
				<div className="relative flex min-w-0 flex-1 flex-col justify-between">
					<div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:justify-between">
						<div className="min-w-0 flex-1">
							<LinkWithChannel
								href={getHrefForVariant({
									productSlug: item.variant.product.slug,
									variantId: item.variant.id,
								})}
								className="transition-colors duration-200 group-hover:text-accent-200"
							>
								<h2 className="break-words text-base font-medium text-white sm:text-lg">{item.variant?.product?.name}</h2>
							</LinkWithChannel>
							<p className="mt-1 break-words text-sm text-base-400">{item.variant?.product?.category?.name}</p>
							{item.variant.name !== item.variant.id && Boolean(item.variant.name) && (
								<p className="mt-1 break-words text-sm text-base-500">
									<span className="text-base-600">Variant:</span> {item.variant.name}
								</p>
							)}
						</div>
						<p className="gradient-text shrink-0 text-left text-base font-semibold sm:text-right sm:text-lg">
							{formatMoney(item.totalPrice.gross.amount, item.totalPrice.gross.currency)}
						</p>
					</div>
					<div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-center gap-3">
							<span className="text-sm text-base-400">Quantity:</span>
							<QuantitySelector
								value={item.quantity}
								onChange={handleQuantityChange}
								onDelete={handleDelete}
								disabled={isUpdating}
								loading={isUpdating}
								min={0}
								max={999}
								size="sm"
								data-testid={`quantity-selector-${item.id}`}
							/>
						</div>
						<DeleteLineButton checkoutId={checkoutId} lineId={item.id} />
					</div>
				</div>
			</div>
		</li>
	);
}
