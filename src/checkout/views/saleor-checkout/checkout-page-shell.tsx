import { type ReactNode } from "react";
import { CheckoutHeader } from "./checkout-header";

type CheckoutPageShellProps = {
	children: ReactNode;
	/** Checkout progress step for the header. Omit to hide the step indicator row context. */
	step?: number;
	onStepClick?: (step: number) => void;
	isShippingRequired?: boolean;
};

/** Shared checkout surface layout — one header + page chrome for all checkout states. */
export function CheckoutPageShell({
	children,
	step = 1,
	onStepClick,
	isShippingRequired = true,
}: CheckoutPageShellProps) {
	return (
		<div className="min-h-screen overscroll-none bg-secondary">
			<CheckoutHeader step={step} onStepClick={onStepClick} isShippingRequired={isShippingRequired} />
			{children}
		</div>
	);
}
