import { cookies } from "next/headers";
import { io } from "next/cache";
import { deleteCartLine, updateCartLineQuantity } from "@/app/actions";
import type { CartContent, StorefrontPolicies } from "@/lib/content";
import * as Checkout from "@/lib/checkout";
import { CartDrawer } from "./cart-drawer";

interface CartDrawerWrapperProps {
	channel: string;
	localeSlug: string;
	cart: CartContent;
	policies: StorefrontPolicies;
}

export async function CartDrawerWrapper({ channel, localeSlug, cart, policies }: CartDrawerWrapperProps) {
	await cookies();
	await io();

	const checkoutId = await Checkout.getIdFromCookies(channel);
	const checkout = checkoutId ? await Checkout.find(checkoutId, localeSlug) : null;

	return (
		<CartDrawer
			checkoutId={checkoutId || null}
			lines={checkout?.lines ?? []}
			totalPrice={checkout?.totalPrice ?? null}
			channel={channel}
			localeSlug={localeSlug}
			cart={cart}
			policies={policies}
			deleteCartLine={deleteCartLine}
			updateCartLineQuantity={updateCartLineQuantity}
		/>
	);
}
