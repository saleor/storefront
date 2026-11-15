import { cookies } from "next/headers";
import { io } from "next/cache";
import { deleteCartLine, updateCartLineQuantity } from "@/app/actions";
import type { CartContent, StorefrontPolicies } from "@/lib/content";
import * as Checkout from "@/lib/checkout";
import { getPriceReductionReference } from "@/lib/channels/get-price-display";
import { withPriceReference } from "@/lib/pricing";
import { getDeliveryPaymentSummary } from "@/lib/channels/get-delivery-payment";
import { DeliveryPaymentNote } from "@/ui/components/delivery-payment-note";
import { PriceNote } from "@/ui/components/price-note";
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
	const [checkout, priceReference, deliveryPayment] = await Promise.all([
		checkoutId ? Checkout.find(checkoutId, localeSlug) : null,
		getPriceReductionReference(channel),
		// Cached per channel; the cart names payment methods only when the store states them.
		checkoutId ? getDeliveryPaymentSummary({ channel, localeSlug }) : null,
	]);
	// Settle what each line's reduction is measured against; the drawer only reads the result.
	const lines = (checkout?.lines ?? []).map((line) => ({
		...line,
		variant: withPriceReference(line.variant, priceReference),
	}));

	return (
		<CartDrawer
			checkoutId={checkoutId || null}
			lines={lines}
			totalPrice={checkout?.totalPrice ?? null}
			localeSlug={localeSlug}
			cart={cart}
			policies={policies}
			deleteCartLine={deleteCartLine}
			updateCartLineQuantity={updateCartLineQuantity}
			totalNote={<PriceNote channel={channel} locale={localeSlug} variant="total" className="text-right" />}
			deliveryNote={<DeliveryPaymentNote summary={checkout?.lines.length ? deliveryPayment : null} />}
		/>
	);
}
