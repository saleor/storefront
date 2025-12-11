"use client";

import { useState, useTransition } from "react";
import { Minus, Plus, Loader2 } from "lucide-react";
import { updateLineQuantity } from "./actions";

interface QuantitySelectorProps {
	checkoutId: string;
	lineId: string;
	quantity: number;
}

export function QuantitySelector({ checkoutId, lineId, quantity: initialQuantity }: QuantitySelectorProps) {
	const [quantity, setQuantity] = useState(initialQuantity);
	const [isPending, startTransition] = useTransition();

	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity < 1 || newQuantity > 99) return;
		
		setQuantity(newQuantity);
		startTransition(async () => {
			await updateLineQuantity({ checkoutId, lineId, quantity: newQuantity });
		});
	};

	return (
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
	);
}
