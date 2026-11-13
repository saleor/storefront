#!/usr/bin/env node
/**
 * Create a few paid test orders, so the pages that show orders have something to show.
 *
 * The storefront shows orders only to the signed-in customer: the account overview, the order
 * list and the order detail page. `--email <account>` puts the orders on that account. Without
 * it they are guest orders, which appear in the Dashboard and in no storefront account.
 *
 * Modes:
 * - checkout (default): the calls the storefront's own checkout makes, paid through the Dummy
 *   Payment app. Token: SALEOR_APP_TOKEN.
 * - draft: a draft order, completed and marked as paid, for an instance without the Dummy
 *   Payment app. Token: SALEOR_ADMIN_TOKEN with MANAGE_ORDERS.
 *
 * Usage:
 *   pnpm orders:seed -- --email you@example.com
 *   pnpm orders:seed -- --email you@example.com --count 25 --channel channel-pln
 *   pnpm orders:seed -- --mode draft --count 5
 *   pnpm orders:seed -- --help
 *
 * Arguments are strict: one that is not recognised stops the run before any request.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

const DUMMY_GATEWAY_IDS = ["saleor.io.dummy-payment-app", "mirumee.payments.dummy"];

const FIRST_NAMES = [
	"Alex",
	"Jordan",
	"Taylor",
	"Morgan",
	"Casey",
	"Riley",
	"Sam",
	"Jamie",
	"Quinn",
	"Avery",
];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson", "Moore"];
const STREETS = [
	"Oak St",
	"Maple Ave",
	"Pine Rd",
	"Cedar Ln",
	"Elm Dr",
	"Birch Way",
	"Willow Ct",
	"Ash Blvd",
];

/**
 * Sample addresses by country. An order's address is in the channel's default country, so that
 * the channel's shipping zones apply to it: a US address on a channel that ships only within
 * Europe has no delivery method, and the order cannot be completed.
 */
const ADDRESSES = {
	US: [
		{ city: "Boston", countryArea: "MA", postalCode: "02108" },
		{ city: "Chicago", countryArea: "IL", postalCode: "60601" },
		{ city: "Austin", countryArea: "TX", postalCode: "78701" },
		{ city: "Seattle", countryArea: "WA", postalCode: "98101" },
		{ city: "New York", countryArea: "NY", postalCode: "10001" },
	],
	DE: [
		{ city: "Berlin", postalCode: "10117" },
		{ city: "Munich", postalCode: "80331" },
		{ city: "Hamburg", postalCode: "20095" },
	],
	FR: [
		{ city: "Paris", postalCode: "75001" },
		{ city: "Lyon", postalCode: "69001" },
	],
	NL: [
		{ city: "Amsterdam", postalCode: "1012 AB" },
		{ city: "Rotterdam", postalCode: "3011 AG" },
	],
	ES: [
		{ city: "Madrid", postalCode: "28001" },
		{ city: "Barcelona", postalCode: "08001" },
	],
	PL: [
		{ city: "Warsaw", postalCode: "00-001" },
		{ city: "Krakow", postalCode: "30-001" },
		{ city: "Gdansk", postalCode: "80-001" },
	],
};

/** For a channel whose default country has no sample addresses, or could not be read. */
const COUNTRY_BY_CURRENCY = { USD: "US", EUR: "DE", PLN: "PL" };

function unquote(value) {
	const quote = value[0];
	if (value.length >= 2 && (quote === '"' || quote === "'") && value.endsWith(quote)) {
		return value.slice(1, -1);
	}
	return value;
}

function loadEnvFile(name) {
	const path = resolve(ROOT, name);
	try {
		for (const line of readFileSync(path, "utf8").split("\n")) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith("#")) continue;
			const eq = trimmed.indexOf("=");
			if (eq === -1) continue;
			const key = trimmed
				.slice(0, eq)
				.replace(/^export\s+/, "")
				.trim();
			// Quotes are how dotenv files usually write values; they are not part of the value.
			const value = unquote(trimmed.slice(eq + 1).trim());
			if (!(key in process.env)) process.env[key] = value;
		}
	} catch {
		// optional file
	}
}

/** An empty `KEY=` line (as in a copied example file) counts as not set. */
function envValue(name) {
	return process.env[name]?.trim() || null;
}

/** A bad command line: main prints the message and exits before any request. */
class UsageError extends Error {}

const toInt = (raw) => Number.parseInt(raw, 10);

const OPTIONS = new Map([
	["--count", ["count", toInt]],
	["-n", ["count", toInt]],
	["--channel", ["channel", String]],
	["--email", ["email", (raw) => raw.trim()]],
	["--mode", ["mode", String]],
	["--token", ["token", String]],
	["--delay", ["delayMs", toInt]],
]);

/** Strict: an argument that is not recognised is an error, not something to skip. */
function parseArgs(argv) {
	const options = {
		count: 10,
		channel: envValue("NEXT_PUBLIC_DEFAULT_CHANNEL") ?? "default-channel",
		email: null,
		mode: "checkout",
		token: null,
		delayMs: 250,
	};

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		// `pnpm orders:seed -- --count 5` forwards the separator itself.
		if (arg === "--") continue;
		if (arg === "--help" || arg === "-h") {
			options.help = true;
			continue;
		}

		const eq = arg.startsWith("--") ? arg.indexOf("=") : -1;
		const name = eq === -1 ? arg : arg.slice(0, eq);
		const inline = eq === -1 ? null : arg.slice(eq + 1);

		if (!OPTIONS.has(name)) throw new UsageError(`Unknown argument: ${arg}`);

		const [key, parse] = OPTIONS.get(name);
		const raw = inline ?? argv[++i];
		if (raw == null || raw === "" || (inline == null && raw.startsWith("--"))) {
			throw new UsageError(`${name} needs a value`);
		}
		options[key] = parse(raw);
	}

	return options;
}

function randomItem(list) {
	return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

function sleep(ms) {
	return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function assertNoMutationErrors(label, payload) {
	const errors = payload?.errors?.filter(Boolean) ?? [];
	if (errors.length > 0) {
		throw new Error(`${label}: ${errors.map((e) => e.message ?? JSON.stringify(e)).join("; ")}`);
	}
}

loadEnvFile(".env.local");

const API_URL = envValue("NEXT_PUBLIC_SALEOR_API_URL");

function resolveAuthToken(options) {
	if (options.token) return options.token;
	if (options.mode === "draft") {
		return envValue("SALEOR_ADMIN_TOKEN") ?? envValue("SALEOR_CONFIGURATOR_TOKEN");
	}
	return envValue("SALEOR_APP_TOKEN");
}

/**
 * No retries here on purpose: most requests are mutations that create something
 * (checkoutComplete, draftOrderComplete), and repeating one after a timeout or a 5xx can create
 * it twice.
 */
function createGqlClient(token) {
	return async function gql(query, variables) {
		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ query, variables }),
		});

		const body = await response.text();
		let json;
		try {
			json = JSON.parse(body);
		} catch {
			// A gateway error page, not GraphQL.
			throw new Error(
				`Saleor HTTP ${response.status} ${response.statusText}: ${body.trim().slice(0, 200) || "empty response"}`,
			);
		}
		if (json.errors?.length) {
			throw new Error(json.errors.map((e) => e.message).join("\n"));
		}
		if (!response.ok) {
			throw new Error(`Saleor HTTP ${response.status} ${response.statusText}`);
		}
		return json.data;
	};
}

const LIST_VARIANTS = /* GraphQL */ `
	query ListPurchasableVariants($channel: String!, $first: Int!, $after: String) {
		productVariants(first: $first, after: $after, channel: $channel) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					id
					quantityAvailable
					pricing {
						price {
							gross {
								currency
							}
						}
					}
				}
			}
		}
	}
`;

const CHANNEL_INFO = /* GraphQL */ `
	query SeedChannelInfo($slug: String!) {
		channel(slug: $slug) {
			id
			slug
			currencyCode
			defaultCountry {
				code
			}
		}
	}
`;

const CHECKOUT_CREATE = /* GraphQL */ `
	mutation SeedCheckoutCreate($channel: String!) {
		checkoutCreate(input: { channel: $channel, lines: [] }) {
			errors {
				message
				code
				field
			}
			checkout {
				id
			}
		}
	}
`;

const CHECKOUT_LINES_ADD = /* GraphQL */ `
	mutation SeedCheckoutLinesAdd($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {
		checkoutLinesAdd(id: $checkoutId, lines: $lines) {
			errors {
				message
				code
				field
			}
			checkout {
				id
				isShippingRequired
				totalPrice {
					gross {
						amount
						currency
					}
				}
				availablePaymentGateways {
					id
					name
				}
			}
		}
	}
`;

const CHECKOUT_EMAIL_UPDATE = /* GraphQL */ `
	mutation SeedCheckoutEmailUpdate($checkoutId: ID!, $email: String!) {
		checkoutEmailUpdate(id: $checkoutId, email: $email) {
			errors {
				message
				code
				field
			}
			checkout {
				id
			}
		}
	}
`;

// saveAddress: false — completing a checkout for an account otherwise adds the address to that
// account's address book, and a dozen sample addresses would show on its Addresses page.
const CHECKOUT_SHIPPING_ADDRESS_UPDATE = /* GraphQL */ `
	mutation SeedCheckoutShippingAddressUpdate($checkoutId: ID!, $shippingAddress: AddressInput!) {
		checkoutShippingAddressUpdate(id: $checkoutId, shippingAddress: $shippingAddress, saveAddress: false) {
			errors {
				message
				code
				field
			}
			checkout {
				id
			}
		}
	}
`;

const CHECKOUT_BILLING_ADDRESS_UPDATE = /* GraphQL */ `
	mutation SeedCheckoutBillingAddressUpdate($checkoutId: ID!, $billingAddress: AddressInput!) {
		checkoutBillingAddressUpdate(id: $checkoutId, billingAddress: $billingAddress, saveAddress: false) {
			errors {
				message
				code
				field
			}
			checkout {
				id
			}
		}
	}
`;

const DELIVERY_OPTIONS_CALCULATE = /* GraphQL */ `
	mutation SeedDeliveryOptionsCalculate($checkoutId: ID!) {
		deliveryOptionsCalculate(id: $checkoutId) {
			deliveries {
				id
				shippingMethod {
					id
					name
					active
				}
			}
			errors {
				message
				code
				field
			}
		}
	}
`;

const CHECKOUT_DELIVERY_METHOD_UPDATE = /* GraphQL */ `
	mutation SeedCheckoutDeliveryMethodUpdate($checkoutId: ID!, $deliveryMethodId: ID!) {
		checkoutDeliveryMethodUpdate(id: $checkoutId, deliveryMethodId: $deliveryMethodId) {
			errors {
				message
				code
				field
			}
			checkout {
				id
				totalPrice {
					gross {
						amount
						currency
					}
				}
			}
		}
	}
`;

const TRANSACTION_INITIALIZE = /* GraphQL */ `
	mutation SeedTransactionInitialize(
		$checkoutId: ID!
		$amount: PositiveDecimal!
		$paymentGateway: PaymentGatewayToInitialize!
	) {
		transactionInitialize(id: $checkoutId, amount: $amount, paymentGateway: $paymentGateway) {
			errors {
				message
				code
				field
			}
			transaction {
				id
			}
		}
	}
`;

const CHECKOUT_COMPLETE = /* GraphQL */ `
	mutation SeedCheckoutComplete($checkoutId: ID!) {
		checkoutComplete(id: $checkoutId) {
			errors {
				message
				code
				field
			}
			order {
				id
				number
				total {
					gross {
						amount
						currency
					}
				}
			}
		}
	}
`;

const DRAFT_ORDER_DELETE = /* GraphQL */ `
	mutation SeedDraftOrderDelete($id: ID!) {
		draftOrderDelete(id: $id) {
			errors {
				message
				code
				field
			}
		}
	}
`;

const DRAFT_ORDER_CREATE = /* GraphQL */ `
	mutation SeedDraftOrderCreate($input: DraftOrderCreateInput!) {
		draftOrderCreate(input: $input) {
			errors {
				message
				code
				field
			}
			order {
				id
				isShippingRequired
				shippingMethods {
					id
					active
				}
			}
		}
	}
`;

const ORDER_UPDATE_SHIPPING = /* GraphQL */ `
	mutation SeedOrderUpdateShipping($orderId: ID!, $shippingMethodId: ID!) {
		orderUpdateShipping(order: $orderId, input: { shippingMethod: $shippingMethodId }) {
			errors {
				message
				code
				field
			}
			order {
				id
			}
		}
	}
`;

const SHIPPING_METHODS = /* GraphQL */ `
	query SeedShippingMethods($channel: String!) {
		shop {
			availableShippingMethods(channel: $channel) {
				id
				active
			}
		}
	}
`;

const DRAFT_ORDER_COMPLETE = /* GraphQL */ `
	mutation SeedDraftOrderComplete($id: ID!) {
		draftOrderComplete(id: $id) {
			errors {
				message
				code
				field
			}
			order {
				id
			}
		}
	}
`;

const ORDER_MARK_AS_PAID = /* GraphQL */ `
	mutation SeedOrderMarkAsPaid($id: ID!) {
		orderMarkAsPaid(id: $id) {
			errors {
				message
				code
				field
			}
			order {
				id
				number
				total {
					gross {
						amount
						currency
					}
				}
			}
		}
	}
`;

const ORDER_ACCOUNT = /* GraphQL */ `
	query SeedOrderAccount($id: ID!) {
		order(id: $id) {
			id
			user {
				email
			}
		}
	}
`;

async function fetchPurchasableVariants(gql, channel) {
	const variants = [];
	let after = null;

	for (;;) {
		const data = await gql(LIST_VARIANTS, { channel, first: 100, after });
		for (const edge of data.productVariants.edges) {
			const node = edge.node;
			if (node.quantityAvailable !== null && node.quantityAvailable <= 0) continue;
			variants.push(node);
		}
		if (!data.productVariants.pageInfo.hasNextPage) break;
		after = data.productVariants.pageInfo.endCursor;
	}

	return variants;
}

/** One to three different variants, one or two of each. */
function pickRandomLines(variants) {
	const pool = [...variants];
	const lines = [];
	const lineCount = randomInt(1, 3);

	for (let i = 0; i < lineCount && pool.length > 0; i++) {
		const variant = pool.splice(randomInt(0, pool.length - 1), 1)[0];
		lines.push({ variantId: variant.id, quantity: randomInt(1, 2) });
	}

	return lines;
}

/** The country the sample addresses are in: `fallback` is true when it is not the channel's own. */
function resolveAddressCountry(channelInfo, currency) {
	const code = channelInfo?.defaultCountry?.code;
	if (ADDRESSES[code]) return { code, fallback: false };
	return { code: COUNTRY_BY_CURRENCY[channelInfo?.currencyCode ?? currency] ?? "US", fallback: true };
}

function buildAddress(countryCode) {
	const location = randomItem(ADDRESSES[countryCode]);
	const address = {
		firstName: randomItem(FIRST_NAMES),
		lastName: randomItem(LAST_NAMES),
		streetAddress1: `${randomInt(1, 120)} ${randomItem(STREETS)}`,
		city: location.city,
		postalCode: location.postalCode,
		country: countryCode,
	};
	if (location.countryArea) address.countryArea = location.countryArea;
	return address;
}

function resolveDummyGatewayId(gateways) {
	return DUMMY_GATEWAY_IDS.find((id) => gateways.some((gateway) => gateway.id === id)) ?? null;
}

function formatOrderResult(order, lineCount) {
	return { orderId: order.id, orderNumber: order.number, lineCount, total: order.total?.gross };
}

/** Sets the shipping address and the first active delivery method; returns the new total. */
async function applyCheckoutShipping(gql, { checkoutId, address }) {
	const shippingData = await gql(CHECKOUT_SHIPPING_ADDRESS_UPDATE, { checkoutId, shippingAddress: address });
	assertNoMutationErrors("checkoutShippingAddressUpdate", shippingData.checkoutShippingAddressUpdate);

	const deliveryData = await gql(DELIVERY_OPTIONS_CALCULATE, { checkoutId });
	assertNoMutationErrors("deliveryOptionsCalculate", deliveryData.deliveryOptionsCalculate);

	const deliveries = deliveryData.deliveryOptionsCalculate.deliveries ?? [];
	const delivery = deliveries.find((entry) => entry.shippingMethod?.active) ?? deliveries[0];
	if (!delivery?.id) {
		throw new Error(
			`No delivery method for an address in ${address.country} — check the channel's shipping zones`,
		);
	}

	const deliveryMethodData = await gql(CHECKOUT_DELIVERY_METHOD_UPDATE, {
		checkoutId,
		deliveryMethodId: delivery.id,
	});
	assertNoMutationErrors("checkoutDeliveryMethodUpdate", deliveryMethodData.checkoutDeliveryMethodUpdate);
	return deliveryMethodData.checkoutDeliveryMethodUpdate.checkout.totalPrice?.gross?.amount;
}

/**
 * The storefront's checkout, call for call. Nothing attaches the order to an account here:
 * Saleor does that itself on completion when an active account has the checkout's email.
 */
async function createCheckoutPaidOrder(gql, { channel, variants, email, address }) {
	const lines = pickRandomLines(variants);

	const createData = await gql(CHECKOUT_CREATE, { channel });
	assertNoMutationErrors("checkoutCreate", createData.checkoutCreate);
	const checkoutId = createData.checkoutCreate.checkout.id;

	const linesData = await gql(CHECKOUT_LINES_ADD, { checkoutId, lines });
	assertNoMutationErrors("checkoutLinesAdd", linesData.checkoutLinesAdd);
	const checkout = linesData.checkoutLinesAdd.checkout;

	const emailData = await gql(CHECKOUT_EMAIL_UPDATE, { checkoutId, email });
	assertNoMutationErrors("checkoutEmailUpdate", emailData.checkoutEmailUpdate);

	let payAmount = checkout.totalPrice?.gross?.amount ?? 0;
	if (checkout.isShippingRequired) {
		payAmount = (await applyCheckoutShipping(gql, { checkoutId, address })) ?? payAmount;
	}

	const billingData = await gql(CHECKOUT_BILLING_ADDRESS_UPDATE, { checkoutId, billingAddress: address });
	assertNoMutationErrors("checkoutBillingAddressUpdate", billingData.checkoutBillingAddressUpdate);

	const gateways = checkout.availablePaymentGateways ?? [];
	const dummyGatewayId = resolveDummyGatewayId(gateways);
	if (!dummyGatewayId) {
		throw new Error(
			`Dummy Payment gateway not found (available: ${gateways.map((gateway) => gateway.id).join(", ") || "none"}). Install the Dummy Payment app, or rerun with --mode draft and an admin token (MANAGE_ORDERS).`,
		);
	}

	const paymentData = await gql(TRANSACTION_INITIALIZE, {
		checkoutId,
		amount: payAmount,
		paymentGateway: {
			id: dummyGatewayId,
			data: { event: { includePspReference: true, type: "CHARGE_SUCCESS" } },
		},
	});
	assertNoMutationErrors("transactionInitialize", paymentData.transactionInitialize);

	const completeData = await gql(CHECKOUT_COMPLETE, { checkoutId });
	assertNoMutationErrors("checkoutComplete", completeData.checkoutComplete);

	return formatOrderResult(completeData.checkoutComplete.order, lines.length);
}

/** `userEmail` is enough for an account's order: Saleor looks the active account up by it. */
async function createDraftPaidOrder(gql, { channelId, variants, email, address, shippingMethods }) {
	const lines = pickRandomLines(variants);

	const draftData = await gql(DRAFT_ORDER_CREATE, {
		input: { channelId, userEmail: email, lines, shippingAddress: address, billingAddress: address },
	});
	assertNoMutationErrors("draftOrderCreate", draftData.draftOrderCreate);
	const draftOrder = draftData.draftOrderCreate.order;

	let completeData;
	try {
		if (draftOrder.isShippingRequired) {
			// Saleor lists the channel's methods on the order and marks the ones that apply to its
			// shipping address as active; it refuses an inactive one. The channel-wide list is the
			// fallback when the order lists none.
			const candidates =
				draftOrder.shippingMethods?.length > 0 ? draftOrder.shippingMethods : shippingMethods;
			const shippingMethod = candidates.find((method) => method.active);
			if (!shippingMethod?.id) {
				throw new Error(
					`No shipping method applies to an address in ${address.country} — check the channel's shipping zones`,
				);
			}

			const shippingData = await gql(ORDER_UPDATE_SHIPPING, {
				orderId: draftOrder.id,
				shippingMethodId: shippingMethod.id,
			});
			assertNoMutationErrors("orderUpdateShipping", shippingData.orderUpdateShipping);
		}

		completeData = await gql(DRAFT_ORDER_COMPLETE, { id: draftOrder.id });
		assertNoMutationErrors("draftOrderComplete", completeData.draftOrderComplete);
	} catch (error) {
		// A draft that cannot be completed is deleted rather than left in the Dashboard. Saleor
		// refuses to delete one that did get completed, so this cannot remove an order.
		await gql(DRAFT_ORDER_DELETE, { id: draftOrder.id }).catch(() => {});
		throw error;
	}

	const paidData = await gql(ORDER_MARK_AS_PAID, { id: completeData.draftOrderComplete.order.id });
	assertNoMutationErrors("orderMarkAsPaid", paidData.orderMarkAsPaid);

	return formatOrderResult(paidData.orderMarkAsPaid.order, lines.length);
}

/**
 * Which account Saleor put an order on: its email, `null` for a guest order, or `undefined` when
 * that could not be read (an order's account is visible only to a token that may manage orders
 * or customers).
 */
async function readOrderAccount(gql, orderId) {
	try {
		const data = await gql(ORDER_ACCOUNT, { id: orderId });
		return data.order ? (data.order.user?.email ?? null) : undefined;
	} catch {
		return undefined;
	}
}

const USAGE = `Usage: node scripts/seed-paid-orders.mjs [options]

Creates paid test orders with 1–3 lines each. The storefront shows orders only to the signed-in
customer, so name the account with --email to see them under /account/orders.

Options:
  --email <account>   Put the orders on the customer account with this email. The account must
                      exist and be active. Without --email the orders are guest orders
  --count, -n <n>     Number of orders to create (default: 10)
  --channel <slug>    Saleor channel slug (default: NEXT_PUBLIC_DEFAULT_CHANNEL or default-channel)
  --mode <mode>       checkout (default) or draft
  --token <token>     Override the API token
  --delay <ms>        Pause between orders (default: 250)
  --help, -h          Show this help

An argument that is not listed here stops the run.

Environment (.env.local):
  NEXT_PUBLIC_SALEOR_API_URL  the instance the orders are created in
  checkout mode: SALEOR_APP_TOKEN, and the Dummy Payment app installed
  draft mode:    SALEOR_ADMIN_TOKEN with MANAGE_ORDERS

Good to know:
  - Addresses are samples in the channel's default country; the account's address book is not
    changed.
  - Every order arrives paid and unfulfilled. Fulfil or cancel one in the Dashboard to see the
    other statuses.
  - Saleor sends its usual order confirmation to the email when the instance has email set up.

Examples:
  pnpm orders:seed -- --email you@example.com
  pnpm orders:seed -- --email you@example.com --count 25 --channel channel-pln
  pnpm orders:seed -- --mode draft --count 5
`;

function fail(message) {
	console.error(`[seed-paid-orders] ${message}`);
	process.exit(1);
}

async function main() {
	let options;
	try {
		options = parseArgs(process.argv.slice(2));
	} catch (error) {
		if (!(error instanceof UsageError)) throw error;
		fail(`${error.message} (--help lists the options)`);
	}

	if (options.help) {
		console.log(USAGE);
		return;
	}

	// Everything about the command line is checked before the first request.
	if (!API_URL) {
		fail("Missing NEXT_PUBLIC_SALEOR_API_URL (set in .env.local)");
	}

	if (options.mode !== "checkout" && options.mode !== "draft") {
		fail('--mode must be "checkout" or "draft"');
	}

	if (!Number.isFinite(options.count) || options.count < 1) {
		fail("--count must be a positive integer");
	}

	if (!Number.isFinite(options.delayMs) || options.delayMs < 0) {
		fail("--delay must be zero or a positive number of milliseconds");
	}

	if (options.email !== null && !/^[^\s@]+@[^\s@]+$/.test(options.email)) {
		fail(`--email must be an email address, got "${options.email}"`);
	}

	const token = resolveAuthToken(options);
	if (!token) {
		const envHint = options.mode === "checkout" ? "SALEOR_APP_TOKEN" : "SALEOR_ADMIN_TOKEN";
		fail(`Missing API token — set ${envHint} in .env.local, or pass --token`);
	}

	const gql = createGqlClient(token);

	console.log(
		`[seed-paid-orders] Creating ${options.count} paid order(s) via ${options.mode} on ${API_URL} (channel: ${options.channel}, ${
			options.email ? `account: ${options.email}` : "guest orders"
		})`,
	);

	const variants = await fetchPurchasableVariants(gql, options.channel);
	if (variants.length === 0) {
		fail(`No purchasable variants found for channel ${options.channel}`);
	}

	// Channel details: the id for draft mode, the default country for the addresses. A token that
	// may not read them keeps the fallbacks.
	let channelInfo = null;
	let channelError = null;
	try {
		channelInfo = (await gql(CHANNEL_INFO, { slug: options.channel })).channel ?? null;
	} catch (error) {
		channelError = error;
	}

	const currency = variants.find((variant) => variant.pricing?.price?.gross?.currency)?.pricing.price.gross
		.currency;
	const country = resolveAddressCountry(channelInfo, currency);
	if (country.fallback) {
		console.warn(
			`[seed-paid-orders] No sample addresses for the channel's default country (${
				channelInfo?.defaultCountry?.code ?? "not readable"
			}) — using ${country.code}. Orders fail if the channel does not ship there.`,
		);
	}

	let createOrder;
	if (options.mode === "draft") {
		const channelId = channelInfo?.id;
		if (!channelId) {
			fail(`Channel not found: ${options.channel}${channelError ? ` (${channelError.message})` : ""}`);
		}
		const shippingData = await gql(SHIPPING_METHODS, { channel: options.channel });
		const shippingMethods = shippingData.shop?.availableShippingMethods ?? [];
		createOrder = (order) => createDraftPaidOrder(gql, { ...order, channelId, shippingMethods });
	} else {
		createOrder = (order) => createCheckoutPaidOrder(gql, { ...order, channel: options.channel });
	}

	const runId = Date.now();
	let created = 0;
	let accountChecked = options.email === null;

	for (let i = 0; i < options.count; i++) {
		try {
			const order = await createOrder({
				variants,
				email: options.email ?? `seed-guest-${runId}-${i + 1}@example.com`,
				address: buildAddress(country.code),
			});
			created++;
			const totalLabel = order.total ? `${order.total.amount} ${order.total.currency}` : "n/a";
			console.log(
				`[seed-paid-orders] ${i + 1}/${options.count} order #${order.orderNumber} (${order.lineCount} line(s), ${totalLabel})`,
			);

			// One look at the first order tells whether the rest will reach the account.
			if (!accountChecked) {
				accountChecked = true;
				const account = await readOrderAccount(gql, order.orderId);
				if (account === undefined) {
					console.warn(
						`[seed-paid-orders] Could not read which account order #${order.orderNumber} is on. Sign in as ${options.email} and check /account/orders.`,
					);
				} else if (account?.toLowerCase() !== options.email.toLowerCase()) {
					fail(
						account === null
							? `Order #${order.orderNumber} is a guest order: ${API_URL} has no active customer account with the email ${options.email}${
									options.mode === "draft" ? " (draft mode needs it exactly as the account has it)" : ""
								}. Register it in the storefront (and confirm it, if the channel asks for that), then run again. Stopped after one order.`
							: `Order #${order.orderNumber} went to the account ${account}, not ${options.email}. That happens when the token is a user's own; use an app token. Stopped after one order.`,
					);
				}
			}
		} catch (error) {
			console.error(`[seed-paid-orders] Failed on order ${i + 1}/${options.count}:`, error.message);
		}

		if (i + 1 < options.count && options.delayMs > 0) {
			await sleep(options.delayMs);
		}
	}

	console.log(
		`[seed-paid-orders] Done — created ${created}/${options.count} order(s). ${
			options.email
				? `Sign in as ${options.email} and open /account/orders in channel ${options.channel}.`
				: "They are guest orders: visible in the Dashboard, in no storefront account (--email <account> puts them on one)."
		}`,
	);
	if (created < options.count) {
		process.exitCode = 1;
	}
}

main().catch((error) => {
	console.error("[seed-paid-orders] Fatal:", error.message ?? String(error));
	process.exit(1);
});
