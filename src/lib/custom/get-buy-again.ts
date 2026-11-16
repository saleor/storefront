import "server-only";

import { BuyAgainHistoryDocument, BuyAgainVariantsDocument, type BuyAgainVariantsQuery } from "@/gql/graphql";
import { liveQuery, sessionQuery } from "@/lib/saleor";
import type { RepeatOrder } from "@/lib/custom/buy-again";

export type RepeatVariant = NonNullable<BuyAgainVariantsQuery["productVariants"]>["edges"][number]["node"];

export function availableQuantity(variant: RepeatVariant) {
	return variant.product.isAvailable && variant.pricing?.price ? (variant.quantityAvailable ?? 0) : 0;
}

export async function getRepeatVariants(channel: string, ids: string[]) {
	const variants: RepeatVariant[] = [];
	for (let offset = 0; offset < ids.length; offset += 100) {
		const result = await liveQuery(BuyAgainVariantsDocument, {
			variables: { channel, ids: ids.slice(offset, offset + 100) },
		});
		if (!result.ok || result.partialErrors?.length || !result.data.productVariants) {
			throw new Error("Unable to check item availability");
		}
		variants.push(...result.data.productVariants.edges.map(({ node }) => node));
	}
	return variants;
}

export async function getBuyAgainHistory(channel: string, first: number, after?: string) {
	const result = await sessionQuery(BuyAgainHistoryDocument, { variables: { first, after } });
	if (!result.ok || result.partialErrors?.length || !result.data.me) return null;
	const connection = result.data.me.orders;
	const nodes = connection?.edges.map(({ node }) => node) ?? [];
	const ids = [
		...new Set(
			nodes.flatMap((order) => order.lines.flatMap((line) => (line.variant ? [line.variant.id] : []))),
		),
	];
	const variants = await getRepeatVariants(channel, ids);
	const stock = new Map(variants.map((variant) => [variant.id, availableQuantity(variant)]));
	const orders: RepeatOrder[] = nodes.map((order) => ({
		id: order.id,
		number: order.number,
		created: order.created,
		status: order.statusDisplay,
		channel: order.channel.slug,
		total: order.total.gross.amount,
		currency: order.total.gross.currency,
		lines: order.lines.map((line) => ({
			variantId: line.variant?.id ?? null,
			quantity: line.quantity,
			name: line.productName,
			variant: line.variantName,
			image: line.thumbnail?.url ?? null,
			available: line.variant ? (stock.get(line.variant.id) ?? 0) : 0,
		})),
	}));
	return { orders, pageInfo: connection?.pageInfo, totalCount: connection?.totalCount ?? 0 };
}

export async function getBuyAgainPreview(channel: string): Promise<RepeatOrder[]> {
	if (process.env.NODE_ENV !== "development") return [];
	const result = await liveQuery(BuyAgainVariantsDocument, { variables: { channel } });
	if (!result.ok || result.partialErrors?.length) throw new Error("Unable to load preview products");
	const unique = new Map<string, RepeatVariant>();
	for (const { node } of result.data.productVariants?.edges ?? []) {
		if (availableQuantity(node) > 0 && !unique.has(node.product.id)) unique.set(node.product.id, node);
	}
	const products = [...unique.values()].slice(0, 6);
	if (products.length < 3) throw new Error("Preview needs three available products");
	const lines = products.map((variant) => ({
		variantId: variant.id,
		quantity: 1,
		name: variant.product.name,
		variant: variant.name,
		image: variant.product.thumbnail?.url ?? null,
		available: availableQuantity(variant),
	}));
	const removed = {
		variantId: null,
		quantity: 1,
		name: "Archive edition",
		variant: "Discontinued sample item",
		image: null,
		available: 0,
	};
	return [
		{
			id: "demo-1048",
			number: "1048",
			created: "2026-11-02T12:00:00Z",
			status: "Fulfilled",
			channel,
			total: products.slice(0, 2).reduce((sum, v) => sum + (v.pricing?.price?.gross.amount ?? 0), 0),
			currency: products[0].pricing!.price!.gross.currency,
			lines: [lines[0], lines[1], removed],
		},
		{
			id: "demo-1026",
			number: "1026",
			created: "2026-10-12T12:00:00Z",
			status: "Fulfilled",
			channel,
			total: products[2].pricing!.price!.gross.amount * 2,
			currency: products[2].pricing!.price!.gross.currency,
			lines: [{ ...lines[2], quantity: 2 }],
		},
		{
			id: "demo-0991",
			number: "0991",
			created: "2026-09-18T12:00:00Z",
			status: "Fulfilled",
			channel,
			total: 0,
			currency: products[0].pricing!.price!.gross.currency,
			lines: [removed],
		},
	];
}
