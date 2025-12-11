"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "../atoms/Button";

export interface AddToCartProps {
	disabled?: boolean;
	maxQuantity?: number;
	showQuantitySelector?: boolean;
	onQuantityChange?: (quantity: number) => void;
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
	const { pending } = useFormStatus();
	const isButtonDisabled = disabled || pending;

	return (
		<Button
			type="submit"
			variant="primary"
			size="lg"
			disabled={isButtonDisabled}
			loading={pending}
			className="flex-1"
		>
			<ShoppingCart className="h-5 w-5 mr-2" />
			{pending ? "Adding..." : "Add to Cart"}
		</Button>
	);
}

export function AddToCart({ 
	disabled = false, 
	maxQuantity = 10,
	showQuantitySelector = true,
	onQuantityChange,
}: AddToCartProps) {
	const [quantity, setQuantity] = useState(1);

	const handleQuantityChange = (newQuantity: number) => {
		const clampedQuantity = Math.max(1, Math.min(newQuantity, maxQuantity));
		setQuantity(clampedQuantity);
		onQuantityChange?.(clampedQuantity);
	};

	const incrementQuantity = () => handleQuantityChange(quantity + 1);
	const decrementQuantity = () => handleQuantityChange(quantity - 1);

	return (
		<div className="space-y-4">
			{showQuantitySelector && (
				<div className="flex items-center gap-4">
					<label className="text-sm font-medium text-secondary-700">
						Quantity
					</label>
					<div className="flex items-center border border-secondary-300 rounded-md">
						<button
							type="button"
							onClick={decrementQuantity}
							disabled={quantity <= 1 || disabled}
							className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							aria-label="Decrease quantity"
						>
							<Minus className="h-4 w-4" />
						</button>
						<input
							type="number"
							name="quantity"
							value={quantity}
							onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
							min={1}
							max={maxQuantity}
							disabled={disabled}
							className="w-12 text-center border-x border-secondary-300 py-2 text-sm font-medium text-secondary-900 focus:outline-none disabled:bg-secondary-50"
							aria-label="Quantity"
						/>
						<button
							type="button"
							onClick={incrementQuantity}
							disabled={quantity >= maxQuantity || disabled}
							className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							aria-label="Increase quantity"
						>
							<Plus className="h-4 w-4" />
						</button>
					</div>
					{maxQuantity < 10 && (
						<span className="text-xs text-secondary-500">
							{maxQuantity} available
						</span>
					)}
				</div>
			)}

			<div className="flex gap-3">
				<SubmitButton disabled={disabled} />
			</div>

			{disabled && (
				<p className="text-sm text-red-600">
					Please select a variant to add to cart
				</p>
			)}
		</div>
	);
}

// Simple version for backward compatibility
export function AddButton({ disabled }: { disabled?: boolean }) {
	const { pending } = useFormStatus();
	const isButtonDisabled = disabled || pending;

	return (
		<button
			type="submit"
			aria-disabled={isButtonDisabled}
			aria-busy={pending}
			onClick={(e) => isButtonDisabled && e.preventDefault()}
			className="h-12 w-full items-center rounded-md bg-primary-600 px-6 py-3 text-base font-medium leading-6 text-white shadow hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-primary-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-primary-600 transition-colors"
		>
			{pending ? (
				<div className="inline-flex items-center justify-center">
					<Loader2 className="h-5 w-5 animate-spin mr-2" />
					<span>Adding...</span>
				</div>
			) : (
				<span className="inline-flex items-center justify-center">
					<ShoppingCart className="h-5 w-5 mr-2" />
					Add to Cart
				</span>
			)}
		</button>
	);
}
