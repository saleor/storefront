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

import { useState } from "react";
import { useCheckoutComplete } from "@/checkout/hooks/useCheckoutComplete";
import { useCheckout } from "@/checkout/hooks/useCheckout";

export const ZeroAmountCheckout = () => {
	const { checkout } = useCheckout();
	const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
			<div className="rounded-md border border-green-700 bg-green-950 p-4">
				<div className="flex items-start gap-3">
					<svg
						className="h-5 w-5 flex-shrink-0 text-green-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
					<div className="flex-1">
						<h3 className="text-sm font-semibold text-white">Order Fully Covered</h3>
						<p className="mt-1 text-sm text-green-100">
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
				onClick={() => setShowConfirmDialog(true)}
			>
				<span className="button-text">Review and Complete Order</span>
			</button>

			{/* Confirmation Dialog */}
			{showConfirmDialog && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
					onClick={() => !completingCheckout && setShowConfirmDialog(false)}
					role="dialog"
					aria-modal="true"
					aria-labelledby="confirm-order-title"
				>
					<div
						className="relative mx-4 w-full max-w-md rounded-lg bg-neutral-800 p-6 shadow-2xl ring-1 ring-white/10"
						onClick={(e) => e.stopPropagation()}
					>
						<h2 id="confirm-order-title" className="mb-4 text-xl font-semibold text-white">
							Confirm Your Order
						</h2>

						<div className="mb-6 space-y-4">
							{/* Order Items Summary */}
							<div className="rounded-md border border-neutral-600 bg-neutral-900 p-4">
								<h3 className="mb-3 text-sm font-semibold text-white">Order Items</h3>
								<div className="space-y-2">
									{checkout?.lines?.map((line) => (
										<div key={line.id} className="flex justify-between gap-3 text-sm">
											<span className="text-neutral-200">
												{line.variant.product.name} x {line.quantity}
											</span>
											<span className="font-medium text-white">
												{line.totalPrice?.gross.currency}{" "}
												{line.totalPrice?.gross.amount.toFixed(2)}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* Discounts & Gift Cards */}
							{(checkout?.discount || checkout?.giftCards?.length > 0) && (
								<div className="rounded-md border border-green-700 bg-green-950 p-4">
									<h3 className="mb-3 text-sm font-semibold text-green-100">Applied Discounts</h3>
									<div className="space-y-2">
										{checkout.discount && (
											<div className="flex justify-between gap-3 text-sm">
												<span className="text-green-200">
													Voucher: {checkout.voucherCode || "Discount"}
												</span>
												<span className="font-medium text-green-100">
													-{checkout.discount.currency}{" "}
													{checkout.discount.amount.toFixed(2)}
												</span>
											</div>
										)}
										{checkout.giftCards?.map((giftCard) => (
											<div key={giftCard.id} className="flex justify-between gap-3 text-sm">
												<span className="text-green-200">
													Gift Card: {giftCard.displayCode}
												</span>
												<span className="font-medium text-green-100">
													-{giftCard.currentBalance.currency}{" "}
													{giftCard.currentBalance.amount.toFixed(2)}
												</span>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Total */}
							<div className="flex justify-between border-t border-neutral-600 pt-4 text-lg font-semibold">
								<span className="text-white">Total</span>
								<span className="text-white">
									{checkout?.totalPrice?.gross.currency} {totalAmount.toFixed(2)}
								</span>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3">
							<button
								type="button"
								className="flex-1 rounded-md border border-neutral-600 bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
								onClick={() => setShowConfirmDialog(false)}
								disabled={completingCheckout}
								aria-label="Cancel order"
							>
								Cancel
							</button>
							<button
								type="button"
								className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
								onClick={handleCompleteOrder}
								disabled={completingCheckout}
								aria-label="Confirm and complete order"
							>
								{completingCheckout ? <Loader /> : "Confirm Order"}
							</button>
						</div>
					</div>
				</div>
			)}
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
