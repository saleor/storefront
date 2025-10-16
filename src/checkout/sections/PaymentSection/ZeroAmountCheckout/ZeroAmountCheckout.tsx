/**
 * Zero Amount Checkout Component
 *
 * Handles checkout completion for orders with zero total amount
 * (e.g., fully covered by gift cards or promotional discounts)
 *
 * Note: This component relies on the Saleor channel having `allowUnpaidOrders` enabled.
 * When enabled, checkoutComplete succeeds for $0 totals without requiring payment transactions.
 */

"use client";

import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";
import { useCheckout } from "@/checkout/hooks/useCheckout";

export const ZeroAmountCheckout = () => {
	const { checkout } = useCheckout();
	const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();

	const handleCompleteOrder = async () => {
		try {
			const result = await onCheckoutComplete();

			if (result?.hasErrors) {
				throw new Error(`Checkout completion failed: ${JSON.stringify(result.apiErrors)}`);
			}
		} catch (error) {
			console.error("[ZeroAmountCheckout] Checkout failed:", error);
			alert("Failed to complete checkout. Please try again or contact support.");
		}
	};

	const totalAmount = checkout?.totalPrice?.gross?.amount || 0;

	return (
		<div className="my-8 flex flex-col gap-y-6">
			<div className="rounded-md border border-green-200 bg-green-50 p-4">
				<div className="flex items-start gap-3">
					<svg
						className="h-5 w-5 flex-shrink-0 text-green-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
					<div className="flex-1">
						<h3 className="text-sm font-semibold text-green-900">Order Fully Covered</h3>
						<p className="mt-1 text-sm text-green-800">
							{totalAmount === 0
								? "Your order total is $0.00. No payment is required."
								: "Your order is fully covered by gift cards and discounts. No additional payment is required."}
						</p>
					</div>
				</div>
			</div>

			<button
				type="button"
				className="h-12 w-full items-center justify-center rounded-md bg-neutral-900 px-6 py-3 text-base font-medium leading-6 text-white shadow transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 hover:disabled:bg-neutral-700 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700"
				disabled={completingCheckout}
				aria-disabled={completingCheckout}
				onClick={handleCompleteOrder}
			>
				<span className="button-text">{completingCheckout ? <Loader /> : "Complete Order"}</span>
			</button>
		</div>
	);
};

function Loader() {
	return (
		<div className="text-center" aria-busy="true" role="status">
			<div>
				<svg
					aria-hidden="true"
					className="mr-2 inline h-6 w-6 animate-spin fill-neutral-600 text-neutral-100 dark:text-neutral-600"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C0 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	);
}
