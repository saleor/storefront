"use client";

import { buildCheckoutPath } from "@paper/session-bridge";
import { buttonClassName } from "@/ui/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
	disabled?: boolean;
	checkoutId?: string;
	className?: string;
	label?: string;
};

export const CheckoutLink = ({ disabled, checkoutId, className, label = "Checkout" }: Props) => {
	return (
		<a
			data-testid="CheckoutLink"
			aria-disabled={disabled}
			onClick={(e) => disabled && e.preventDefault()}
			href={checkoutId ? buildCheckoutPath({ checkoutId, step: "contact" }) : "/checkout"}
			className={buttonClassName({
				asLink: true,
				className: cn("max-w-full sm:px-16", className),
			})}
		>
			{label}
		</a>
	);
};
