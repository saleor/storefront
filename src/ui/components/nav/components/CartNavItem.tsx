import { ShoppingBag } from "lucide-react";
import clsx from "clsx";
import * as Checkout from "@/lib/checkout";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export const CartNavItem = async ({ channel }: { channel: string }) => {
	const checkoutId = await Checkout.getIdFromCookies(channel);
	const checkout = checkoutId ? await Checkout.find(checkoutId) : null;

	const lineCount = checkout ? checkout.lines.reduce((result, line) => result + line.quantity, 0) : 0;

	return (
		<LinkWithChannel 
			href="/cart" 
			className="relative flex items-center text-secondary-700 hover:text-primary-600 transition-colors" 
			data-testid="CartNavItem"
		>
			<ShoppingBag className="h-6 w-6 shrink-0" aria-hidden="true" />
			{lineCount > 0 ? (
				<div
					className={clsx(
						"absolute -top-2 -right-2 flex h-5 flex-col items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white",
						lineCount > 9 ? "w-6 px-1" : "w-5",
					)}
				>
					{lineCount > 99 ? "99+" : lineCount}
					<span className="sr-only">item{lineCount > 1 ? "s" : ""} in cart, view bag</span>
				</div>
			) : (
				<span className="sr-only">0 items in cart</span>
			)}
		</LinkWithChannel>
	);
};
