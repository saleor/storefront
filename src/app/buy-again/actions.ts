"use server";

import { refresh } from "next/cache";
import { BuyAgainAddLinesDocument } from "@/gql/graphql";
import { mutate } from "@/lib/saleor";
import * as Checkout from "@/lib/checkout";
import { getBuyAgainAvailability, getBuyAgainCart } from "@/lib/custom/get-buy-again";
import { planBuyAgain, type ReorderLine } from "@/lib/custom/buy-again";

export async function buyAgain(input: { channel: string; locale: string; lines: ReorderLine[] }) {
	if (
		!input ||
		typeof input.channel !== "string" ||
		!/^[a-z0-9-]{1,100}$/.test(input.channel) ||
		typeof input.locale !== "string" ||
		!Array.isArray(input.lines) ||
		!input.lines.length ||
		input.lines.length > 50 ||
		input.lines.some(
			(line) =>
				!line ||
				typeof line.variantId !== "string" ||
				!line.variantId ||
				!Number.isInteger(line.quantity) ||
				line.quantity < 1 ||
				line.quantity > 50,
		)
	) {
		return { ok: false as const, message: "Choose between 1 and 50 items to add." };
	}

	const stock = await getBuyAgainAvailability(
		input.lines.map((line) => line.variantId),
		input.channel,
	);
	if (!stock.ok || stock.partialErrors?.length || !stock.data.productVariants) {
		return { ok: false as const, message: "Availability could not be checked. Please try again." };
	}
	const checkoutId = await Checkout.getIdFromCookies(input.channel);
	const cartResult = checkoutId ? await getBuyAgainCart(checkoutId, input.locale) : null;
	if (cartResult && (!cartResult.ok || cartResult.partialErrors?.length)) {
		return {
			ok: false as const,
			message: "Your cart could not be checked. Please try again; your existing items have not been changed.",
		};
	}
	const existing = cartResult?.ok ? cartResult.data.checkout : null;
	if (existing && existing.channel.slug !== input.channel) {
		return {
			ok: false as const,
			message: "Your cart belongs to another market. Open that market to continue.",
		};
	}
	const plan = planBuyAgain(
		input.lines,
		stock.data.productVariants.edges.map(({ node }) => ({
			id: node.id,
			available: node.product.isAvailable && node.pricing?.price ? (node.quantityAvailable ?? 0) : 0,
		})),
		existing?.lines.map((line) => ({ variantId: line.variant.id, quantity: line.quantity })) ?? [],
	);
	if (!plan.lines.length) {
		return {
			ok: false as const,
			message: "No more items are available to add. Check your cart or try another order.",
		};
	}
	const checkout =
		existing ?? (await Checkout.findOrCreate({ channel: input.channel, localeSlug: input.locale }));
	if (!checkout) return { ok: false as const, message: "Your cart could not be opened. Please try again." };
	await Checkout.saveIdToCookie(input.channel, checkout.id);
	const result = await mutate(BuyAgainAddLinesDocument, {
		variables: { id: checkout.id, lines: plan.lines },
	});
	if (!result.ok || result.partialErrors?.length) {
		refresh();
		return {
			ok: false as const,
			message: "We could not confirm the update. Check your cart before trying again.",
		};
	}
	if (!result.data.checkoutLinesAdd?.checkout || result.data.checkoutLinesAdd.errors.length) {
		return {
			ok: false as const,
			message: "Availability changed. Refresh this page and try again; nothing was added.",
		};
	}
	refresh();
	return {
		ok: true as const,
		added: plan.lines.reduce((sum, line) => sum + line.quantity, 0),
		skipped: plan.skipped,
	};
}
