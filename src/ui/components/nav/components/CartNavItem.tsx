import { ShoppingBagIcon } from "lucide-react";
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
			className="group relative flex items-center text-base-200 transition-colors duration-200 hover:text-accent-200"
			data-testid="CartNavItem"
		>
			<ShoppingBagIcon
				className="h-6 w-6 shrink-0 transition-transform duration-200 group-hover:scale-110"
				aria-hidden="true"
			/>
			{lineCount > 0 ? (
				<div
					className={clsx(
						"animate-scale-in absolute bottom-0 right-0 -mb-2 -mr-2 flex h-5 flex-col items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-xs font-semibold text-black shadow-lg",
						lineCount > 9 ? "w-[3ch]" : "w-[2ch]",
					)}
				>
					{lineCount} <span className="sr-only">item{lineCount > 1 ? "s" : ""} in cart, view bag</span>
				</div>
			) : (
				<span className="sr-only">0 items in cart</span>
			)}
		</LinkWithChannel>
	);
};
