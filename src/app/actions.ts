"use server";

import { getServerAuthClient } from "@/app/config.server";
import * as Checkout from "@/lib/checkout";

export async function logout() {
	"use server";
	(await getServerAuthClient()).signOut();
}

/**
 * Clear the checkout cookie after a successful order.
 * Call this after checkoutComplete succeeds.
 */
export async function clearCheckout(channel: string) {
	"use server";
	await Checkout.clearCheckoutCookie(channel);
}
