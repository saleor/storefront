import clsx from "clsx";
import * as Checkout from "@/lib/checkout";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export const CartNavItem = async ({ channel }: { channel: string }) => {
	const checkoutId = await Checkout.getIdFromCookies(channel);
	const checkout = checkoutId ? await Checkout.find(checkoutId) : null;

	const lineCount = checkout ? checkout.lines.reduce((result, line) => result + line.quantity, 0) : 0;

	return (
		<LinkWithChannel href="/cart" className="header-action-btn" data-testid="CartNavItem">
			<i className="bi bi-cart3" aria-hidden="true" />
			{lineCount > 0 ? (
				<span className={clsx("badge", lineCount > 9 ? "w-[3ch]" : "w-[2ch]")}>
					{lineCount} <span className="sr-only">item{lineCount > 1 ? "s" : ""} in cart, view bag</span>
				</span>
			) : (
				<span className="sr-only">0 items in cart</span>
			)}
		</LinkWithChannel>
	);
};
