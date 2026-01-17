import * as Checkout from "@/lib/checkout";
import { CartButton } from "@/ui/components/cart";

export const CartNavItem = async ({ channel }: { channel: string }) => {
	const checkoutId = await Checkout.getIdFromCookies(channel);
	const checkout = checkoutId ? await Checkout.find(checkoutId) : null;

	const lineCount = checkout ? checkout.lines.reduce((result, line) => result + line.quantity, 0) : 0;

	return <CartButton itemCount={lineCount} />;
};
