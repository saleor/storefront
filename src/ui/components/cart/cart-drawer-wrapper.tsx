import { deleteCartLine, updateCartLineQuantity } from "@/app/actions";
import type { CartContent } from "@/lib/content";
import * as Checkout from "@/lib/checkout";
import { CartDrawer } from "./cart-drawer";

interface CartDrawerWrapperProps {
	channel: string;
	cart: CartContent;
}

export async function CartDrawerWrapper({ channel, cart }: CartDrawerWrapperProps) {
	const checkoutId = await Checkout.getIdFromCookies(channel);
	const checkout = checkoutId ? await Checkout.find(checkoutId) : null;

	return (
		<CartDrawer
			checkoutId={checkoutId || null}
			lines={checkout?.lines ?? []}
			totalPrice={checkout?.totalPrice ?? null}
			channel={channel}
			cart={cart}
			deleteCartLine={deleteCartLine}
			updateCartLineQuantity={updateCartLineQuantity}
		/>
	);
}
