import { copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { connection, runScript, startFakeSaleor } from "./test-support/saleor-script-harness.mjs";

const SCRIPT = "seed-paid-orders.mjs";
const TIMEOUT = 30_000;
const ACCOUNT = "ada@example.com";
const DUMMY_GATEWAY = { id: "saleor.io.dummy-payment-app", name: "Dummy Payment" };

let fake;
afterEach(async () => {
	await fake?.close();
	fake = undefined;
});

/**
 * A Saleor with one channel that records the checkouts, drafts and orders it is sent.
 *
 * `accounts` are the emails of its active customer accounts. Like Saleor, it puts an order on an
 * account by the order's email alone: any letter case for a checkout, the exact email for a draft.
 * `accountReadable: false` answers like a token that may not see whose order it is.
 */
async function startStore({
	currency = "USD",
	defaultCountry = "US",
	accounts = [],
	accountReadable = true,
	gateways = [DUMMY_GATEWAY],
} = {}) {
	const checkouts = [];
	const drafts = [];
	const orders = [];

	const placeOrder = (email, account) => {
		const order = {
			id: `O${orders.length + 1}`,
			number: String(orders.length + 1),
			email,
			user: account ? { email: account } : null,
			total: { gross: { amount: 25, currency } },
		};
		orders.push(order);
		return order;
	};
	const current = () => checkouts[checkouts.length - 1];

	fake = await startFakeSaleor(({ operation, variables }) => {
		switch (operation) {
			case "ListPurchasableVariants":
				return {
					productVariants: connection(
						[1, 2, 3, 4].map((n) => ({
							id: `V${n}`,
							quantityAvailable: 50,
							pricing: { price: { gross: { currency } } },
						})),
					),
				};
			case "SeedChannelInfo":
				return {
					channel: {
						id: "CH1",
						slug: variables.slug,
						currencyCode: currency,
						defaultCountry: { code: defaultCountry },
					},
				};
			case "SeedCheckoutCreate":
				checkouts.push({ id: `C${checkouts.length + 1}` });
				return { checkoutCreate: { errors: [], checkout: { id: current().id } } };
			case "SeedCheckoutLinesAdd":
				current().lines = variables.lines;
				return {
					checkoutLinesAdd: {
						errors: [],
						checkout: {
							id: current().id,
							isShippingRequired: true,
							totalPrice: { gross: { amount: 20, currency } },
							availablePaymentGateways: gateways,
						},
					},
				};
			case "SeedCheckoutEmailUpdate":
				current().email = variables.email;
				return { checkoutEmailUpdate: { errors: [], checkout: { id: current().id } } };
			case "SeedCheckoutShippingAddressUpdate":
				current().shippingAddress = variables.shippingAddress;
				return { checkoutShippingAddressUpdate: { errors: [], checkout: { id: current().id } } };
			case "SeedDeliveryOptionsCalculate":
				return {
					deliveryOptionsCalculate: {
						errors: [],
						deliveries: [{ id: "DEL1", shippingMethod: { id: "SM1", name: "Standard", active: true } }],
					},
				};
			case "SeedCheckoutDeliveryMethodUpdate":
				return {
					checkoutDeliveryMethodUpdate: {
						errors: [],
						checkout: { id: current().id, totalPrice: { gross: { amount: 25, currency } } },
					},
				};
			case "SeedCheckoutBillingAddressUpdate":
				current().billingAddress = variables.billingAddress;
				return { checkoutBillingAddressUpdate: { errors: [], checkout: { id: current().id } } };
			case "SeedTransactionInitialize":
				current().paid = { amount: variables.amount, gateway: variables.paymentGateway.id };
				return { transactionInitialize: { errors: [], transaction: { id: "T1" } } };
			case "SeedCheckoutComplete": {
				const email = current().email;
				const account = accounts.find((entry) => entry.toLowerCase() === email.toLowerCase());
				return { checkoutComplete: { errors: [], order: placeOrder(email, account) } };
			}
			case "SeedShippingMethods":
				return { shop: { availableShippingMethods: [{ id: "SM-channel-wide", active: true }] } };
			case "SeedDraftOrderCreate":
				drafts.push(variables.input);
				return {
					draftOrderCreate: {
						errors: [],
						order: {
							id: `D${drafts.length}`,
							isShippingRequired: true,
							shippingMethods: [
								{ id: "SM-other-zone", active: false },
								{ id: "SM-for-this-order", active: true },
							],
						},
					},
				};
			case "SeedOrderUpdateShipping":
				return { orderUpdateShipping: { errors: [], order: { id: variables.orderId } } };
			case "SeedDraftOrderComplete":
				return { draftOrderComplete: { errors: [], order: { id: variables.id } } };
			case "SeedOrderMarkAsPaid": {
				const email = drafts[drafts.length - 1].userEmail;
				return {
					orderMarkAsPaid: {
						errors: [],
						order: placeOrder(
							email,
							accounts.find((a) => a === email),
						),
					},
				};
			}
			case "SeedOrderAccount": {
				const order = orders.find((entry) => entry.id === variables.id);
				if (order.user && !accountReadable) {
					throw new Error("You need one of the following permissions: MANAGE_USERS, MANAGE_ORDERS");
				}
				return { order: { id: order.id, user: order.user } };
			}
			default:
				throw new Error(`The fake has no answer for ${operation}`);
		}
	});

	return { checkouts, drafts, orders, requests: fake.requests };
}

const checkout = (args, env = {}) =>
	runScript(SCRIPT, ["--delay", "0", ...args], {
		apiUrl: fake.url,
		env: { SALEOR_APP_TOKEN: "app-token", ...env },
	});

const draft = (args, env = {}) =>
	runScript(SCRIPT, ["--mode", "draft", "--delay", "0", ...args], {
		apiUrl: fake.url,
		env: { SALEOR_ADMIN_TOKEN: "admin-token", ...env },
	});

const requestsFor = (store, operation) => store.requests.filter((request) => request.operation === operation);

describe("seed-paid-orders arguments", () => {
	it(
		"stops on an argument it does not know, before any request",
		async () => {
			const store = await startStore();
			const result = await checkout(["--count", "5", "--dryrun"]);

			expect(result.code).toBe(1);
			expect(result.stderr).toContain("Unknown argument: --dryrun");
			expect(store.requests).toHaveLength(0);
		},
		TIMEOUT,
	);

	it(
		"rejects a value option that has no value",
		async () => {
			const store = await startStore();
			const result = await checkout(["--count", "--email", ACCOUNT]);

			expect(result.code).toBe(1);
			expect(result.stderr).toContain("--count needs a value");
			expect(store.requests).toHaveLength(0);
		},
		TIMEOUT,
	);

	it(
		"has no bulk mode",
		async () => {
			const store = await startStore();
			const result = await checkout(["--mode", "bulk"]);

			expect(result.code).toBe(1);
			expect(result.stderr).toContain('--mode must be "checkout" or "draft"');
			expect(store.requests).toHaveLength(0);
		},
		TIMEOUT,
	);

	it(
		"rejects an --email that is not an email address",
		async () => {
			const store = await startStore();
			const result = await checkout(["--email", "ada"]);

			expect(result.code).toBe(1);
			expect(result.stderr).toContain("--email must be an email address");
			expect(store.requests).toHaveLength(0);
		},
		TIMEOUT,
	);

	it(
		"says which token is missing",
		async () => {
			const store = await startStore();
			const result = await checkout([], { SALEOR_APP_TOKEN: "" });

			expect(result.code).toBe(1);
			expect(result.stderr).toContain("set SALEOR_APP_TOKEN in .env.local");
			expect(store.requests).toHaveLength(0);
		},
		TIMEOUT,
	);
});

describe("seed-paid-orders checkout mode", () => {
	it(
		"creates guest orders through the checkout, paid with the dummy gateway",
		async () => {
			const store = await startStore({ currency: "PLN", defaultCountry: "PL" });
			// The separator is what `pnpm orders:seed -- ...` forwards.
			const result = await checkout(["--", "--count", "3"]);

			expect(result.code).toBe(0);
			expect(result.stdout).toContain("created 3/3 order(s)");
			expect(result.stdout).toContain("guest orders");
			expect(store.orders).toHaveLength(3);

			// A different guest each time, living in the channel's default country.
			expect(new Set(store.checkouts.map((entry) => entry.email)).size).toBe(3);
			for (const entry of store.checkouts) {
				expect(entry.email).toMatch(/^seed-guest-\d+-\d@example\.com$/);
				expect(entry.shippingAddress.country).toBe("PL");
				expect(entry.billingAddress).toEqual(entry.shippingAddress);
				// The total after the delivery method was set, not the one before it.
				expect(entry.paid).toEqual({ amount: 25, gateway: DUMMY_GATEWAY.id });
			}
			// Nobody's account to look for.
			expect(requestsFor(store, "SeedOrderAccount")).toHaveLength(0);
		},
		TIMEOUT,
	);

	it(
		"puts the orders on the account named with --email",
		async () => {
			const store = await startStore({ accounts: [ACCOUNT] });
			const result = await checkout(["--count", "3", "--email", "Ada@Example.com"]);

			expect(result.code).toBe(0);
			expect(result.stdout).toContain("created 3/3 order(s)");
			expect(result.stdout).toContain("Sign in as Ada@Example.com and open /account/orders");
			expect(store.orders.map((order) => order.user?.email)).toEqual([ACCOUNT, ACCOUNT, ACCOUNT]);
			// The first order is checked, the rest are not.
			expect(requestsFor(store, "SeedOrderAccount")).toHaveLength(1);
		},
		TIMEOUT,
	);

	it(
		"keeps the sample addresses out of the account's address book",
		async () => {
			const store = await startStore({ accounts: [ACCOUNT] });
			await checkout(["--count", "1", "--email", ACCOUNT]);

			for (const operation of ["SeedCheckoutShippingAddressUpdate", "SeedCheckoutBillingAddressUpdate"]) {
				const [request] = requestsFor(store, operation);
				expect(request.query).toContain("saveAddress: false");
			}
		},
		TIMEOUT,
	);

	it(
		"stops after one order when no account has the email",
		async () => {
			const store = await startStore({ accounts: [ACCOUNT] });
			const result = await checkout(["--count", "5", "--email", "typo@example.com"]);

			expect(result.code).toBe(1);
			expect(result.stderr).toContain("Order #1 is a guest order");
			expect(result.stderr).toContain("no active customer account with the email typo@example.com");
			expect(result.stderr).toContain("Stopped after one order");
			expect(store.orders).toHaveLength(1);
		},
		TIMEOUT,
	);

	it(
		"carries on with a warning when the token may not see whose order it is",
		async () => {
			const store = await startStore({ accounts: [ACCOUNT], accountReadable: false });
			const result = await checkout(["--count", "3", "--email", ACCOUNT]);

			expect(result.code).toBe(0);
			expect(result.stderr).toContain("Could not read which account order #1 is on");
			expect(store.orders).toHaveLength(3);
		},
		TIMEOUT,
	);

	it(
		"points to draft mode when the Dummy Payment app is not installed",
		async () => {
			const store = await startStore({ gateways: [{ id: "app.stripe", name: "Stripe" }] });
			const result = await checkout(["--count", "2"]);

			expect(result.code).toBe(1);
			expect(result.stderr).toContain("Dummy Payment gateway not found (available: app.stripe)");
			expect(result.stderr).toContain("--mode draft");
			expect(result.stdout).toContain("created 0/2 order(s)");
			expect(store.orders).toHaveLength(0);
		},
		TIMEOUT,
	);

	it(
		"says so when the channel's country has no sample addresses",
		async () => {
			const store = await startStore({ currency: "EUR", defaultCountry: "SE" });
			const result = await checkout(["--count", "1"]);

			expect(result.code).toBe(0);
			expect(result.stderr).toContain("No sample addresses for the channel's default country (SE)");
			expect(store.checkouts[0].shippingAddress.country).toBe("DE");
		},
		TIMEOUT,
	);
});

describe("seed-paid-orders draft mode", () => {
	it(
		"sets shipping with the arguments Saleor's schema has, from the order's own methods",
		async () => {
			const store = await startStore({ defaultCountry: "PL", accounts: [ACCOUNT] });
			const result = await draft(["--count", "2", "--email", ACCOUNT]);

			expect(result.code).toBe(0);
			expect(result.stdout).toContain("created 2/2 order(s)");

			const shipping = requestsFor(store, "SeedOrderUpdateShipping");
			expect(shipping).toHaveLength(2);
			// orderUpdateShipping(order: ID!, input: OrderUpdateShippingInput!)
			expect(shipping[0].query).toMatch(
				/orderUpdateShipping\(\s*order: \$orderId,\s*input: \{\s*shippingMethod: \$shippingMethodId\s*\}\s*\)/,
			);
			expect(shipping[0].variables.shippingMethodId).toBe("SM-for-this-order");

			// The account is named by its email; the address is in the channel's default country.
			expect(store.drafts.map((entry) => entry.userEmail)).toEqual([ACCOUNT, ACCOUNT]);
			expect(store.drafts.map((entry) => entry.shippingAddress.country)).toEqual(["PL", "PL"]);
			expect(store.orders.map((order) => order.user?.email)).toEqual([ACCOUNT, ACCOUNT]);
		},
		TIMEOUT,
	);

	it(
		"tells that a draft needs the email exactly as the account has it",
		async () => {
			const store = await startStore({ accounts: [ACCOUNT] });
			const result = await draft(["--count", "3", "--email", "Ada@Example.com"]);

			expect(result.code).toBe(1);
			expect(result.stderr).toContain("draft mode needs it exactly as the account has it");
			expect(store.orders).toHaveLength(1);
		},
		TIMEOUT,
	);
});

describe("seed-paid-orders tokens and env file", () => {
	it(
		"treats an empty SALEOR_ADMIN_TOKEN as not set",
		async () => {
			const store = await startStore();
			const result = await draft(["--count", "1"], {
				SALEOR_ADMIN_TOKEN: "",
				SALEOR_CONFIGURATOR_TOKEN: "configurator-token",
			});

			expect(result.code).toBe(0);
			expect(new Set(store.requests.map((request) => request.token))).toEqual(
				new Set(["configurator-token"]),
			);
		},
		TIMEOUT,
	);

	it(
		"reads quoted values from .env.local without the quotes",
		async () => {
			const store = await startStore();
			// A copy of the script has its own repo root, so it reads this .env.local and no other.
			const root = mkdtempSync(join(tmpdir(), "seed-paid-orders-"));
			mkdirSync(join(root, "scripts"));
			copyFileSync(resolve(import.meta.dirname, SCRIPT), join(root, "scripts", SCRIPT));
			writeFileSync(
				join(root, ".env.local"),
				[
					`NEXT_PUBLIC_SALEOR_API_URL="${fake.url}"`,
					"export SALEOR_APP_TOKEN='quoted-token'",
					"SALEOR_ADMIN_TOKEN=",
				].join("\n"),
			);

			const result = await runScript(join(root, "scripts", SCRIPT), ["--count", "2", "--delay", "0"], {
				cleanEnv: true,
			});

			expect(result.code).toBe(0);
			expect(store.orders).toHaveLength(2);
			expect(new Set(store.requests.map((request) => request.token))).toEqual(new Set(["quoted-token"]));
		},
		TIMEOUT,
	);
});
