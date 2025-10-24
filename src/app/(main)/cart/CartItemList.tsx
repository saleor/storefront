"use client";

import { useCallback } from "react";
import { CartItem } from "./CartItem";
import { updateLineQuantity, deleteLineFromCheckout } from "./actions";

export interface CartItemListProps {
	items: Array<{
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
	}>;
	checkoutId: string;
}

export function CartItemList({ items, checkoutId }: CartItemListProps) {
	const handleQuantityChange = useCallback(
		async (lineId: string, quantity: number) => {
			return updateLineQuantity({
				lineId,
				checkoutId,
				quantity,
			});
		},
		[checkoutId],
	);

	const handleDelete = useCallback(
		async (lineId: string) => {
			await deleteLineFromCheckout({
				lineId,
				checkoutId,
			});
		},
		[checkoutId],
	);

	return (
		<ul data-testid="CartProductList" role="list" className="space-y-6">
			{items.map((item, index) => (
				<CartItem
					key={item.id}
					item={item}
					checkoutId={checkoutId}
					onQuantityChange={handleQuantityChange}
					onDelete={handleDelete}
					index={index}
				/>
			))}
		</ul>
	);
}
