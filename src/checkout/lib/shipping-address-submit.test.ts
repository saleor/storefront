import { describe, expect, it } from "vitest";
import {
	getBillingSaveAddressFlag,
	getCheckoutSaveAddressFlag,
	isUsingSavedShippingAddress,
} from "./shipping-address-submit";

describe("isUsingSavedShippingAddress", () => {
	it("returns false for guests", () => {
		expect(
			isUsingSavedShippingAddress({
				isAuthenticated: false,
				savedAddressCount: 2,
				showNewAddressForm: false,
				isEnteringNewAddress: false,
				selectedAddressId: "addr-1",
			}),
		).toBe(false);
	});

	it("returns false when the user has no saved addresses", () => {
		expect(
			isUsingSavedShippingAddress({
				isAuthenticated: true,
				savedAddressCount: 0,
				showNewAddressForm: false,
				isEnteringNewAddress: false,
				selectedAddressId: null,
			}),
		).toBe(false);
	});

	it("returns false when entering a new address via the form", () => {
		expect(
			isUsingSavedShippingAddress({
				isAuthenticated: true,
				savedAddressCount: 2,
				showNewAddressForm: true,
				isEnteringNewAddress: true,
				selectedAddressId: null,
			}),
		).toBe(false);
	});

	it("returns true when picking from the saved address list", () => {
		expect(
			isUsingSavedShippingAddress({
				isAuthenticated: true,
				savedAddressCount: 2,
				showNewAddressForm: false,
				isEnteringNewAddress: false,
				selectedAddressId: "addr-1",
			}),
		).toBe(true);
	});
});

describe("getCheckoutSaveAddressFlag", () => {
	it("returns true for a new address when logged in", () => {
		expect(
			getCheckoutSaveAddressFlag({
				isAuthenticated: true,
				isUsingSavedAddress: false,
			}),
		).toBe(true);
	});

	it("returns false when reusing a saved address", () => {
		expect(
			getCheckoutSaveAddressFlag({
				isAuthenticated: true,
				isUsingSavedAddress: true,
			}),
		).toBe(false);
	});

	it("returns false for guests", () => {
		expect(
			getCheckoutSaveAddressFlag({
				isAuthenticated: false,
				isUsingSavedAddress: false,
			}),
		).toBe(false);
	});
});

describe("getBillingSaveAddressFlag", () => {
	it("returns true for a new billing form entry", () => {
		expect(
			getBillingSaveAddressFlag({
				isAuthenticated: true,
				selectedAddressId: null,
				savedAddressIds: new Set(["addr-1"]),
			}),
		).toBe(true);
	});

	it("returns false when selecting an existing account address", () => {
		expect(
			getBillingSaveAddressFlag({
				isAuthenticated: true,
				selectedAddressId: "addr-1",
				savedAddressIds: new Set(["addr-1"]),
			}),
		).toBe(false);
	});

	it("returns true when selecting checkout shipping (not yet in account)", () => {
		expect(
			getBillingSaveAddressFlag({
				isAuthenticated: true,
				selectedAddressId: "checkout-addr",
				savedAddressIds: new Set(["addr-1"]),
			}),
		).toBe(true);
	});
});
