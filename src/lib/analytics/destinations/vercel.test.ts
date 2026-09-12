import { describe, expect, it } from "vitest";
import type { PaperCommerceEvent } from "@/lib/analytics/catalog";
import { projectVercel } from "./vercel";

function propCount(event: PaperCommerceEvent): number {
	const projected = projectVercel(event);
	if (!projected) throw new Error("expected a projection");
	return Object.keys(projected.props).length;
}

describe("projectVercel", () => {
	it("keeps every phase-1 event at the Pro budget of two properties", () => {
		const events: PaperCommerceEvent[] = [
			{ name: "product_added_to_cart", channel: "us", value: 49, currency: "USD" },
			{ name: "checkout_started", channel: "us", value: 49, currency: "USD" },
			{ name: "checkout_step_viewed", channel: "us", step: "shipping" },
			{
				name: "checkout_completed",
				channel: "us",
				value: 59,
				currency: "USD",
				transactionId: "T3JkZXI6MQ==",
			},
			{ name: "search_submitted", channel: "us", zero: true },
		];
		for (const event of events) {
			expect(propCount(event)).toBe(2);
		}
	});

	it("uses short slugs and never sends order id or search text", () => {
		const purchase = projectVercel({
			name: "checkout_completed",
			channel: "us",
			value: 59,
			currency: "USD",
			transactionId: "T3JkZXI6MQ==",
		});
		expect(purchase).toEqual({ name: "purchase", props: { currency: "USD", value: 59 } });

		const search = projectVercel({ name: "search_submitted", channel: "pl", zero: false });
		expect(search).toEqual({ name: "search", props: { zero: false, channel: "pl" } });
	});

	it("maps checkout_started to begin_checkout {channel, value}", () => {
		expect(projectVercel({ name: "checkout_started", channel: "uk", value: 12.5, currency: "GBP" })).toEqual({
			name: "begin_checkout",
			props: { channel: "uk", value: 12.5 },
		});
	});

	it("drops events that would write an empty dimension", () => {
		expect(
			projectVercel({ name: "product_added_to_cart", channel: "", value: 10, currency: "USD" }),
		).toBeNull();
		expect(
			projectVercel({
				name: "checkout_completed",
				channel: "us",
				value: 10,
				currency: "",
				transactionId: "x",
			}),
		).toBeNull();
	});
});
