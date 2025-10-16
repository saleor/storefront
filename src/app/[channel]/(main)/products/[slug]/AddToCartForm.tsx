"use client";

import { useEffect, useRef, useActionState } from "react";
import { toast } from "react-toastify";
import { AddButton } from "./AddButton";

export interface AddToCartFormProps {
	action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; productName?: string }>;
	disabled?: boolean;
	children?: React.ReactNode;
}

/**
 * Client wrapper for add-to-cart form that shows toast notifications
 */
export function AddToCartForm({ action, disabled, children }: AddToCartFormProps) {
	const [state, formAction] = useActionState(action, { success: false });
	const previousSuccess = useRef(false);

	useEffect(() => {
		// Only show toast when state changes from false to true
		if (state.success && !previousSuccess.current) {
			toast.success(
				state.productName ? `Added ${state.productName} to cart` : "Product added to cart",
				{
					position: "top-right",
				},
			);
			previousSuccess.current = true;
		} else if (!state.success) {
			previousSuccess.current = false;
		}
	}, [state]);

	return (
		<form action={formAction}>
			{children}
			<div className="pt-2">
				<AddButton disabled={disabled} />
			</div>
		</form>
	);
}
