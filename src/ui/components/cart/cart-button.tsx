"use client";

import { ShoppingBagIcon } from "lucide-react";
import { useCart } from "./cart-context";

interface CartButtonProps {
	itemCount: number;
}

export function CartButton({ itemCount }: CartButtonProps) {
	const { openCart } = useCart();

	return (
		<button
			type="button"
			onClick={openCart}
			data-testid="CartNavItem"
			className="relative inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
		>
			<ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />
			{itemCount > 0 && (
				<span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
					{itemCount > 9 ? "9+" : itemCount}
				</span>
			)}
			<span className="sr-only">
				{itemCount} item{itemCount !== 1 ? "s" : ""} in cart, view bag
			</span>
		</button>
	);
}
