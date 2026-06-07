"use client";

import { buttonClassName } from "@/ui/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
	disabled?: boolean;
	checkoutId?: string;
	className?: string;
};

export const CheckoutLink = ({ disabled, checkoutId, className }: Props) => {
	return (
		<a
			data-testid="CheckoutLink"
			aria-disabled={disabled}
			onClick={(e) => disabled && e.preventDefault()}
			href={`/checkout?checkout=${checkoutId}`}
			className={buttonClassName({
				className: cn(
					"max-w-full sm:px-16",
					"aria-disabled:pointer-events-none aria-disabled:opacity-50",
					className,
				),
			})}
		>
			Checkout
		</a>
	);
};
