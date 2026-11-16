import "server-only";

import {
	BuyAgainAvailabilityDocument,
	BuyAgainDemoCatalogDocument,
	CheckoutFindDocument,
	type CurrentUserOrdersPaginatedQuery,
} from "@/gql/graphql";
import { liveQuery } from "@/lib/saleor";
import { type BuyAgainOrder } from "@/lib/custom/buy-again";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";

export async function getBuyAgainAvailability(ids: string[], channel: string) {
	return liveQuery(BuyAgainAvailabilityDocument, { variables: { ids, channel } });
}

export async function getBuyAgainCart(id: string, locale: string) {
	return liveQuery(CheckoutFindDocument, { variables: { id, ...graphqlLanguageCodeVariables(locale) } });
}

export async function prepareBuyAgainOrders(
	orders: NonNullable<NonNullable<CurrentUserOrdersPaginatedQuery["me"]>["orders"]>["edges"],
): Promise<BuyAgainOrder[]> {
	return Promise.all(
		orders.map(async ({ node: order }) => {
			const ids = [...new Set(order.lines.flatMap((line) => (line.variant ? [line.variant.id] : [])))];
			const variants = new Map<string, { available: number; price: number | null; currency: string }>();
			for (let offset = 0; offset < ids.length; offset += 100) {
				const result = await getBuyAgainAvailability(ids.slice(offset, offset + 100), order.channel.slug);
				if (!result.ok || result.partialErrors?.length || !result.data.productVariants) {
					throw new Error("Availability could not be checked.");
				}
				for (const { node } of result.data.productVariants.edges) {
					variants.set(node.id, {
						available: node.product.isAvailable && node.pricing?.price ? (node.quantityAvailable ?? 0) : 0,
						price: node.pricing?.price?.gross.amount ?? null,
						currency: node.pricing?.price?.gross.currency ?? order.total.gross.currency,
					});
				}
			}
			return {
				id: order.id,
				number: order.number,
				date: order.created,
				status: order.statusDisplay,
				channel: order.channel.slug,
				total: order.total.gross.amount,
				currency: order.total.gross.currency,
				items: order.lines.map((line, index) => {
					const current = line.variant ? variants.get(line.variant.id) : undefined;
					return {
						key: `${order.id}-${index}`,
						variantId: line.variant?.id ?? null,
						name: line.productName,
						option: line.variantName,
						image: line.variant?.product.thumbnail?.url ?? null,
						quantity: line.quantity,
						available: current?.available ?? 0,
						price: current?.price ?? null,
						currency: current?.currency ?? order.total.gross.currency,
					};
				}),
			};
		}),
	);
}

export async function getBuyAgainDemoOrders(channel: string): Promise<BuyAgainOrder[]> {
	const result = await liveQuery(BuyAgainDemoCatalogDocument, { variables: { channel } });
	if (!result.ok || result.partialErrors?.length) throw new Error("Could not load the demo catalog.");
	const seen = new Set<string>();
	const items = (result.data.productVariants?.edges ?? [])
		.flatMap(({ node }) => {
			const price = node.pricing?.price?.gross;
			if (seen.has(node.product.id) || !node.product.isAvailable || !price || !node.quantityAvailable)
				return [];
			seen.add(node.product.id);
			return [
				{
					key: node.id,
					variantId: node.id,
					name: node.product.name,
					option: node.name,
					image: node.product.thumbnail?.url ?? null,
					quantity: 1,
					available: node.quantityAvailable,
					price: price.amount,
					currency: price.currency,
				},
			];
		})
		.slice(0, 4);
	if (items.length < 2) throw new Error("The review page needs two available catalog products.");
	const currency = items[0].currency;
	const retired = {
		key: "retired",
		variantId: null,
		name: "Limited edition tote",
		option: "Natural · Archived item",
		image: null,
		quantity: 1,
		available: 0,
		price: null,
		currency,
	};
	return [
		{
			id: "sample-1048",
			number: "1048",
			date: "2026-10-28T12:00:00Z",
			status: "Delivered",
			channel,
			total: items.slice(0, 3).reduce((sum, item) => sum + (item.price ?? 0), 24),
			currency,
			items: [...items.slice(0, 3), retired],
		},
		{
			id: "sample-1032",
			number: "1032",
			date: "2026-09-14T12:00:00Z",
			status: "Delivered",
			channel,
			total: items.slice(0, 2).reduce((sum, item) => sum + (item.price ?? 0), 0),
			currency,
			items: items.slice(0, 2),
		},
		{
			id: "sample-1006",
			number: "1006",
			date: "2026-08-03T12:00:00Z",
			status: "Delivered",
			channel,
			total: 24,
			currency,
			items: [retired],
		},
	];
}
