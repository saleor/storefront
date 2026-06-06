import { afterEach, describe, expect, it } from "vitest";

import {
	PENDING_ORDER_STORAGE_KEY,
	clearPendingOrderId,
	getPendingOrderId,
	setPendingOrderId,
} from "./checkout-completion-storage";

describe("checkout-completion-storage", () => {
	afterEach(() => {
		sessionStorage.clear();
	});

	it("stores and reads pending order id", () => {
		setPendingOrderId("order-abc");
		expect(sessionStorage.getItem(PENDING_ORDER_STORAGE_KEY)).toBe("order-abc");
		expect(getPendingOrderId()).toBe("order-abc");
	});

	it("clears pending order id", () => {
		setPendingOrderId("order-abc");
		clearPendingOrderId();
		expect(getPendingOrderId()).toBeNull();
	});
});
