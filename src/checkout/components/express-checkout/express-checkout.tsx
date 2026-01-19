"use client";

import { Button } from "@/ui/components/ui/button";
import { cn } from "@/lib/utils";
import { ApplePayIcon, GooglePayIcon } from "@/checkout/ui-kit/icons";

interface ExpressCheckoutProps {
	/** Callback when Apple Pay is clicked */
	onApplePay?: () => void;
	/** Callback when Google Pay is clicked */
	onGooglePay?: () => void;
	/** Custom class name */
	className?: string;
}

/**
 * Express checkout section with Apple Pay and Google Pay buttons.
 *
 * Currently decorative - signals that express checkout is possible.
 * Future implementation would use Stripe's PaymentRequestButton or
 * ExpressCheckoutElement to handle actual wallet payments.
 */
export function ExpressCheckout({ onApplePay, onGooglePay, className }: ExpressCheckoutProps) {
	return (
		<div className={cn("space-y-4", className)}>
			{/* Top divider with label */}
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t border-border" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-card px-4 font-medium text-muted-foreground">Express checkout</span>
				</div>
			</div>

			{/* Payment buttons */}
			<div className="grid grid-cols-2 gap-3">
				{/* Apple Pay - Black button with white logo */}
				<Button
					variant="outline-solid"
					onClick={onApplePay}
					className="h-12 border-black bg-black text-white hover:bg-black/90 focus-visible:ring-offset-0"
					aria-label="Pay with Apple Pay"
				>
					<ApplePayIcon className="h-5 w-auto" />
				</Button>

				{/* Google Pay - White button with colored logo */}
				<Button
					variant="outline-solid"
					onClick={onGooglePay}
					className="h-12 border border-neutral-300 bg-white hover:bg-neutral-50"
					aria-label="Pay with Google Pay"
				>
					<GooglePayIcon className="h-5 w-auto" />
				</Button>
			</div>

			{/* Bottom divider with label */}
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t border-border" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-card px-4 font-medium text-muted-foreground">Or continue below</span>
				</div>
			</div>
		</div>
	);
}
