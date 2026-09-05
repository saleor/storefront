import { describe, expect, it } from "vitest";

import { classifyOrdersByNumberQuery } from "./classify-orders-by-number";

describe("classifyOrdersByNumberQuery", () => {
	it("treats a failed GraphQL request as unavailable, not a miss", () => {
		expect(classifyOrdersByNumberQuery({ ok: false })).toEqual({ status: "unavailable" });
	});

	it("treats a null orders connection as unavailable", () => {
		expect(classifyOrdersByNumberQuery({ ok: true, data: { orders: null } })).toEqual({
			status: "unavailable",
		});
	});

	it("treats a missing orders field as unavailable", () => {
		expect(classifyOrdersByNumberQuery({ ok: true, data: {} })).toEqual({ status: "unavailable" });
	});

	it("treats an empty connection as a miss", () => {
		expect(classifyOrdersByNumberQuery({ ok: true, data: { orders: { edges: [] } } })).toEqual({
			status: "miss",
		});
	});

	it("returns the first edge when present", () => {
		const order = { id: "T3JkZXI6MQ==" };
		expect(
			classifyOrdersByNumberQuery({
				ok: true,
				data: { orders: { edges: [{ node: order }] } },
			}),
		).toEqual({ status: "found", order });
	});
});
