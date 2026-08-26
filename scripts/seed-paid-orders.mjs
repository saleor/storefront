#!/usr/bin/env node
/**
 * Create random paid orders with 1–3 product lines each.
 *
 * Modes:
 * - checkout (default): guest checkout + Dummy Payment app (needs SALEOR_APP_TOKEN)
 * - draft: dashboard draft order + orderMarkAsPaid (needs admin token with MANAGE_ORDERS)
 * - bulk: historical import via orderBulkCreate (needs SALEOR_ADMIN_TOKEN with MANAGE_ORDERS_IMPORT)
 *
 * Usage:
 *   pnpm orders:seed
 *   pnpm orders:seed -- --count 25 --customer-ratio 0.6
 *   pnpm orders:seed -- --mode bulk --profile marketing --count 250 --markets auto
 *   pnpm orders:seed -- --mode bulk --profile marketing --anomalies --count 900 --days-back 90
 *   pnpm orders:seed -- --mode draft --token "$SALEOR_ADMIN_TOKEN" --count 10
 *
 * Customer accounts (optional): set SALEOR_ADMIN_TOKEN (MANAGE_USERS) to load existing
 * customers and their saved addresses. Roughly half of orders use real accounts by default.
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
const LAST_NAMES = [
	"Smith",
	"Johnson",
	"Williams",
	"Brown",
	"Jones",
	"Miller",
	"Davis",
	"Wilson",
	"Moore",
	"Taylor",
];
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
const US_ADDRESSES = [
	{ city: "Boston", countryArea: "MA", postalCode: "02108" },
	{ city: "Chicago", countryArea: "IL", postalCode: "60601" },
	{ city: "Austin", countryArea: "TX", postalCode: "78701" },
	{ city: "Seattle", countryArea: "WA", postalCode: "98101" },
	{ city: "Denver", countryArea: "CO", postalCode: "80202" },
	{ city: "Portland", countryArea: "OR", postalCode: "97201" },
	{ city: "San Francisco", countryArea: "CA", postalCode: "94103" },
	{ city: "Miami", countryArea: "FL", postalCode: "33130" },
	{ city: "Phoenix", countryArea: "AZ", postalCode: "85004" },
	{ city: "New York", countryArea: "NY", postalCode: "10001" },
];

/** Bulk import markets — channel slug, currency, address pools, dashboard weight. */
const MARKET_PROFILES = [
	{
		slug: "default-channel",
		currency: "USD",
		languageCode: "EN_US",
		weight: 0.52,
		countries: [{ code: "US", addresses: US_ADDRESSES, countryAreaKey: "countryArea" }],
	},
	{
		slug: "channel-eur",
		currency: "EUR",
		languageCode: "DE",
		weight: 0.28,
		countries: [
			{
				code: "DE",
				addresses: [
					{ city: "Berlin", postalCode: "10117" },
					{ city: "Munich", postalCode: "80331" },
					{ city: "Hamburg", postalCode: "20095" },
					{ city: "Frankfurt", postalCode: "60311" },
				],
			},
			{
				code: "FR",
				addresses: [
					{ city: "Paris", postalCode: "75001" },
					{ city: "Lyon", postalCode: "69001" },
					{ city: "Marseille", postalCode: "13001" },
				],
			},
			{
				code: "NL",
				addresses: [
					{ city: "Amsterdam", postalCode: "1012 AB" },
					{ city: "Rotterdam", postalCode: "3011 AG" },
				],
			},
			{
				code: "ES",
				addresses: [
					{ city: "Madrid", postalCode: "28001" },
					{ city: "Barcelona", postalCode: "08001" },
				],
			},
		],
	},
	{
		slug: "channel-pln",
		currency: "PLN",
		languageCode: "PL_PL",
		weight: 0.2,
		countries: [
			{
				code: "PL",
				addresses: [
					{ city: "Warsaw", postalCode: "00-001" },
					{ city: "Krakow", postalCode: "30-001" },
					{ city: "Gdansk", postalCode: "80-001" },
					{ city: "Wroclaw", postalCode: "50-001" },
					{ city: "Poznan", postalCode: "60-001" },
				],
			},
		],
	},
];

const CUSTOMER_CREATE = /* GraphQL */ `
	mutation SeedCustomerCreate($input: UserCreateInput!) {
		customerCreate(input: $input) {
			errors {
				message
				code
			}
			user {
				id
				email
			}
		}
	}
`;

function loadEnvFile(name) {
	const path = resolve(ROOT, name);
	try {
		for (const line of readFileSync(path, "utf8").split("\n")) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith("#")) continue;
			const eq = trimmed.indexOf("=");
			if (eq === -1) continue;
			const key = trimmed.slice(0, eq).trim();
			const value = trimmed.slice(eq + 1).trim();
			if (!(key in process.env)) process.env[key] = value;
		}
	} catch {
		// optional file
	}
}

function parseArgs(argv) {
	const options = {
		count: 10,
		channel: process.env.NEXT_PUBLIC_DEFAULT_CHANNEL ?? "default-channel",
		delayMs: 250,
		mode: "checkout",
		token: null,
		adminToken: null,
		customerRatio: 0.5,
		daysBack: 180,
		batchSize: 10,
		profile: "marketing",
		markets: "auto",
		lifecycle: true,
		anomalies: false,
	};

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === "--count" || arg === "-n") {
			options.count = Number.parseInt(argv[++i] ?? "", 10);
		} else if (arg.startsWith("--count=")) {
			options.count = Number.parseInt(arg.slice("--count=".length), 10);
		} else if (arg === "--channel") {
			options.channel = argv[++i] ?? options.channel;
		} else if (arg.startsWith("--channel=")) {
			options.channel = arg.slice("--channel=".length);
		} else if (arg === "--delay") {
			options.delayMs = Number.parseInt(argv[++i] ?? "", 10);
		} else if (arg.startsWith("--delay=")) {
			options.delayMs = Number.parseInt(arg.slice("--delay=".length), 10);
		} else if (arg === "--mode") {
			options.mode = argv[++i] ?? options.mode;
		} else if (arg.startsWith("--mode=")) {
			options.mode = arg.slice("--mode=".length);
		} else if (arg === "--token") {
			options.token = argv[++i] ?? null;
		} else if (arg.startsWith("--token=")) {
			options.token = arg.slice("--token=".length);
		} else if (arg === "--admin-token") {
			options.adminToken = argv[++i] ?? null;
		} else if (arg.startsWith("--admin-token=")) {
			options.adminToken = arg.slice("--admin-token=".length);
		} else if (arg === "--customer-ratio") {
			options.customerRatio = Number.parseFloat(argv[++i] ?? "");
		} else if (arg.startsWith("--customer-ratio=")) {
			options.customerRatio = Number.parseFloat(arg.slice("--customer-ratio=".length));
		} else if (arg === "--days-back") {
			options.daysBack = Number.parseInt(argv[++i] ?? "", 10);
		} else if (arg.startsWith("--days-back=")) {
			options.daysBack = Number.parseInt(arg.slice("--days-back=".length), 10);
		} else if (arg === "--batch-size") {
			options.batchSize = Number.parseInt(argv[++i] ?? "", 10);
		} else if (arg.startsWith("--batch-size=")) {
			options.batchSize = Number.parseInt(arg.slice("--batch-size=".length), 10);
		} else if (arg === "--profile") {
			options.profile = argv[++i] ?? options.profile;
		} else if (arg.startsWith("--profile=")) {
			options.profile = arg.slice("--profile=".length);
		} else if (arg === "--markets") {
			options.markets = argv[++i] ?? options.markets;
		} else if (arg.startsWith("--markets=")) {
			options.markets = arg.slice("--markets=".length);
		} else if (arg === "--lifecycle") {
			options.lifecycle = (argv[++i] ?? "true") !== "false";
		} else if (arg.startsWith("--lifecycle=")) {
			options.lifecycle = arg.slice("--lifecycle=".length) !== "false";
		} else if (arg === "--no-lifecycle") {
			options.lifecycle = false;
		} else if (arg === "--anomalies") {
			options.anomalies = (argv[++i] ?? "true") !== "false";
		} else if (arg.startsWith("--anomalies=")) {
			options.anomalies = arg.slice("--anomalies=".length) !== "false";
		} else if (arg === "--no-anomalies") {
			options.anomalies = false;
		} else if (arg === "--help" || arg === "-h") {
			options.help = true;
		}
	}

	return options;
}

function randomItem(list) {
	return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

function randomFloat(min, max) {
	return min + Math.random() * (max - min);
}

function sleep(ms) {
	return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function mutationErrors(payload) {
	return payload?.errors?.filter(Boolean) ?? [];
}

function assertNoMutationErrors(label, payload) {
	const errors = mutationErrors(payload);
	if (errors.length > 0) {
		throw new Error(`${label}: ${errors.map((e) => e.message ?? JSON.stringify(e)).join("; ")}`);
	}
}

loadEnvFile(".env.local");

const API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL;

function resolveAuthToken(options) {
	if (options.token) return options.token;
	if (options.mode === "bulk") {
		return process.env.SALEOR_ADMIN_TOKEN ?? null;
	}
	if (options.mode === "draft") {
		return process.env.SALEOR_ADMIN_TOKEN ?? process.env.SALEOR_CONFIGURATOR_TOKEN ?? null;
	}
	return process.env.SALEOR_APP_TOKEN ?? null;
}

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

		const json = await response.json();
		if (json.errors?.length) {
			throw new Error(json.errors.map((e) => e.message).join("\n"));
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
					name
					sku
					quantityAvailable
					pricing {
						price {
							gross {
								amount
								currency
							}
							net {
								amount
							}
						}
					}
					product {
						name
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
		}
	}
`;

const CUSTOMER_ADDRESS_FIELDS = /* GraphQL */ `
	fragment SeedCustomerAddress on Address {
		id
		firstName
		lastName
		streetAddress1
		streetAddress2
		city
		postalCode
		countryArea
		phone
		companyName
		country {
			code
		}
	}
`;

const LIST_CUSTOMERS = /* GraphQL */ `
	query ListSeedCustomers($first: Int!, $after: String) {
		customers(first: $first, after: $after) {
			pageInfo {
				hasNextPage
				endCursor
			}
			edges {
				node {
					id
					email
					isActive
					firstName
					lastName
					addresses {
						...SeedCustomerAddress
					}
					defaultShippingAddress {
						...SeedCustomerAddress
					}
					defaultBillingAddress {
						...SeedCustomerAddress
					}
				}
			}
		}
	}
	${CUSTOMER_ADDRESS_FIELDS}
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

const CHECKOUT_SHIPPING_ADDRESS_UPDATE = /* GraphQL */ `
	mutation SeedCheckoutShippingAddressUpdate($checkoutId: ID!, $shippingAddress: AddressInput!) {
		checkoutShippingAddressUpdate(id: $checkoutId, shippingAddress: $shippingAddress) {
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
		checkoutBillingAddressUpdate(id: $checkoutId, billingAddress: $billingAddress) {
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
				status
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
				number
				isShippingRequired
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

const ORDER_UPDATE_SHIPPING = /* GraphQL */ `
	mutation SeedOrderUpdateShipping($orderId: ID!, $shippingMethodId: ID!) {
		orderUpdateShipping(orderId: $orderId, shippingMethodId: $shippingMethodId) {
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
				name
				active
				price {
					amount
					currency
				}
			}
		}
	}
`;

const LIST_WAREHOUSES = /* GraphQL */ `
	query SeedWarehouses {
		warehouses(first: 10) {
			edges {
				node {
					id
					name
				}
			}
		}
	}
`;

const ORDER_BULK_CREATE = /* GraphQL */ `
	mutation SeedOrderBulkCreate($orders: [OrderBulkCreateInput!]!, $stockUpdatePolicy: StockUpdatePolicyEnum) {
		orderBulkCreate(orders: $orders, stockUpdatePolicy: $stockUpdatePolicy, errorPolicy: IGNORE_FAILED) {
			count
			results {
				order {
					id
					number
					created
					status
					total {
						gross {
							amount
							currency
						}
					}
					user {
						email
					}
				}
				errors {
					message
					code
					path
				}
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
				number
				status
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
				status
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

function pickRandomLines(variants, lineCount) {
	const pool = [...variants];
	const lines = [];

	for (let i = 0; i < lineCount && pool.length > 0; i++) {
		const index = randomInt(0, pool.length - 1);
		const variant = pool.splice(index, 1)[0];
		lines.push({
			variantId: variant.id,
			quantity: randomInt(1, 2),
		});
	}

	return lines;
}

function buildGuestAddress() {
	const firstName = randomItem(FIRST_NAMES);
	const lastName = randomItem(LAST_NAMES);
	const location = randomItem(US_ADDRESSES);

	return {
		firstName,
		lastName,
		streetAddress1: `${randomInt(100, 9999)} ${randomItem(STREETS)}`,
		city: location.city,
		postalCode: location.postalCode,
		countryArea: location.countryArea,
		country: "US",
	};
}

function addressToInput(address) {
	if (!address) return null;

	const input = {
		firstName: address.firstName || "Guest",
		lastName: address.lastName || "Customer",
		streetAddress1: address.streetAddress1,
		city: address.city,
		postalCode: address.postalCode,
		country: address.country?.code ?? address.country,
	};

	if (address.streetAddress2) input.streetAddress2 = address.streetAddress2;
	if (address.countryArea) input.countryArea = address.countryArea;
	if (address.phone) input.phone = address.phone;
	if (address.companyName) input.companyName = address.companyName;

	return input;
}

function collectCustomerAddresses(customer) {
	const seen = new Set();
	const addresses = [];

	for (const address of [
		customer.defaultShippingAddress,
		customer.defaultBillingAddress,
		...(customer.addresses ?? []),
	]) {
		if (!address?.id || seen.has(address.id)) continue;
		seen.add(address.id);
		addresses.push(address);
	}

	return addresses;
}

async function fetchCustomers(gql) {
	const customers = [];
	let after = null;

	for (;;) {
		const data = await gql(LIST_CUSTOMERS, { first: 100, after });
		for (const edge of data.customers.edges) {
			const customer = edge.node;
			if (!customer.isActive || !customer.email) continue;
			customers.push(customer);
		}
		if (!data.customers.pageInfo.hasNextPage) break;
		after = data.customers.pageInfo.endCursor;
	}

	return customers;
}

function pickBuyer(customers, customerRatio, orderIndex, uniqueSeed = Date.now()) {
	const useCustomer = customers.length > 0 && Math.random() < customerRatio;

	if (!useCustomer) {
		return {
			kind: "guest",
			email: `seed-guest-${uniqueSeed}-${orderIndex}@example.com`,
			address: buildGuestAddress(),
		};
	}

	const customer = randomItem(customers);
	const savedAddresses = collectCustomerAddresses(customer);
	const savedAddress = savedAddresses.length > 0 ? randomItem(savedAddresses) : null;

	return {
		kind: "customer",
		customer,
		email: customer.email,
		address: addressToInput(savedAddress) ?? buildGuestAddress(),
		usedSavedAddress: Boolean(savedAddress),
	};
}

/** Sun–Sat — weekend-heavy B2C pattern. */
const DAY_OF_WEEK_WEIGHTS = [0.88, 0.92, 0.98, 1.02, 1.12, 1.34, 1.28];

/** Hour-of-day weights (0–23) — lunch + evening peaks. */
const HOUR_WEIGHTS = [
	0.08, 0.05, 0.04, 0.04, 0.05, 0.12, 0.28, 0.48, 0.72, 0.95, 1.12, 1.28, 1.42, 1.32, 1.18, 1.08, 1.05, 1.12,
	1.28, 1.38, 1.22, 0.95, 0.55, 0.22,
];

function weightedRandomIndex(weights) {
	const total = weights.reduce((sum, weight) => sum + weight, 0);
	let roll = Math.random() * total;
	for (let i = 0; i < weights.length; i++) {
		roll -= weights[i];
		if (roll <= 0) return i;
	}
	return weights.length - 1;
}

function sampleBusinessHour() {
	return weightedRandomIndex(HOUR_WEIGHTS);
}

function clampDate(date, minMs, maxMs) {
	const ms = Math.min(Math.max(date.getTime(), minMs), maxMs);
	return new Date(ms);
}

/**
 * Spread orders across the lookback window with ecommerce-like patterns:
 * - more orders in recent months (growth)
 * - weekend lift
 * - business-hour peaks
 */
function generateRealisticOrderDates(count, daysBack) {
	const now = Date.now();
	const msPerDay = 86_400_000;
	const oldestMs = now - daysBack * msPerDay;
	const months = 6;
	const monthDays = daysBack / months;
	const monthWeights = [1.0, 1.12, 1.24, 1.38, 1.52, 1.72];
	const totalMonthWeight = monthWeights.reduce((sum, weight) => sum + weight, 0);
	const dates = [];
	let remaining = count;

	for (let month = 0; month < months; month++) {
		const monthCount =
			month === months - 1
				? remaining
				: Math.max(0, Math.round((count * monthWeights[month]) / totalMonthWeight));
		remaining -= monthCount;

		const newestDaysAgo = month * monthDays;
		const oldestDaysAgo = (month + 1) * monthDays;

		for (let i = 0; i < monthCount; i++) {
			const dayProgress = Math.pow(Math.random(), 0.75);
			const daysAgo = oldestDaysAgo - dayProgress * (oldestDaysAgo - newestDaysAgo);

			let date = new Date(now - daysAgo * msPerDay);

			for (let attempt = 0; attempt < 10; attempt++) {
				const dow = date.getDay();
				if (Math.random() <= DAY_OF_WEEK_WEIGHTS[dow] / 1.34) break;
				date = new Date(now - (daysAgo + (Math.random() - 0.5) * 4) * msPerDay);
			}

			date.setHours(sampleBusinessHour(), randomInt(0, 59), randomInt(0, 59), 0);
			date = clampDate(date, oldestMs, now - 60_000);
			dates.push(date);
		}
	}

	while (dates.length < count) {
		const daysAgo = Math.pow(Math.random(), 1.6) * daysBack;
		let date = new Date(now - daysAgo * msPerDay);
		date.setHours(sampleBusinessHour(), randomInt(0, 59), randomInt(0, 59), 0);
		dates.push(clampDate(date, oldestMs, now - 60_000));
	}

	return dates.sort((a, b) => a.getTime() - b.getTime()).slice(0, count);
}

/** Marketing profile: ~72% of orders in the last 90 days, skewed toward very recent. */
function generateMarketingOrderDates(count, daysBack) {
	const now = Date.now();
	const msPerDay = 86_400_000;
	const oldestMs = now - daysBack * msPerDay;
	const recentWindow = Math.min(90, daysBack * 0.5);
	const recentCount = Math.round(count * 0.72);
	const olderCount = count - recentCount;

	function sampleInRange(n, newestDaysAgo, oldestDaysAgo, exponent) {
		const dates = [];
		for (let i = 0; i < n; i++) {
			const dayProgress = Math.pow(Math.random(), exponent);
			const daysAgo = newestDaysAgo + (1 - dayProgress) * (oldestDaysAgo - newestDaysAgo);

			let date = new Date(now - daysAgo * msPerDay);
			for (let attempt = 0; attempt < 10; attempt++) {
				const dow = date.getDay();
				if (Math.random() <= DAY_OF_WEEK_WEIGHTS[dow] / 1.34) break;
				date = new Date(now - (daysAgo + (Math.random() - 0.5) * 4) * msPerDay);
			}

			date.setHours(sampleBusinessHour(), randomInt(0, 59), randomInt(0, 59), 0);
			dates.push(clampDate(date, oldestMs, now - 60_000));
		}
		return dates;
	}

	const recent = sampleInRange(recentCount, 0, recentWindow, 0.42);
	const older = sampleInRange(olderCount, recentWindow + 1, daysBack, 1.1);
	return [...older, ...recent].sort((a, b) => a.getTime() - b.getTime()).slice(0, count);
}

function generateOrderDates(count, daysBack, profile) {
	if (profile === "marketing") return generateMarketingOrderDates(count, daysBack);
	return generateRealisticOrderDates(count, daysBack);
}

function pickMarket(profiles = MARKET_PROFILES) {
	const roll = Math.random();
	let cumulative = 0;
	for (const market of profiles) {
		cumulative += market.weight;
		if (roll <= cumulative) return market;
	}
	return profiles[profiles.length - 1];
}

function pickCountryForMarket(market) {
	const country = randomItem(market.countries);
	const location = randomItem(country.addresses);
	return { country, location };
}

function buildGuestAddressForMarket(market) {
	const { country, location } = pickCountryForMarket(market);
	const firstName = randomItem(FIRST_NAMES);
	const lastName = randomItem(LAST_NAMES);
	const address = {
		firstName,
		lastName,
		streetAddress1: `${randomInt(1, 120)} ${randomItem(STREETS)}`,
		city: location.city,
		postalCode: location.postalCode,
		country: country.code,
	};

	if (location.countryArea) address.countryArea = location.countryArea;
	if (country.countryAreaKey && location[country.countryAreaKey]) {
		address.countryArea = location[country.countryAreaKey];
	}

	return address;
}

function allocateOrdersByMarket(count, profiles = MARKET_PROFILES) {
	const allocations = profiles.map((market) => ({
		market,
		count: Math.round(count * market.weight),
	}));

	let total = allocations.reduce((sum, entry) => sum + entry.count, 0);
	while (total < count) {
		allocations[0].count += 1;
		total += 1;
	}
	while (total > count) {
		const index = allocations.findIndex((entry) => entry.count > 0);
		allocations[index].count -= 1;
		total -= 1;
	}

	return allocations.filter((entry) => entry.count > 0);
}

function pickLineCountForRecency(createdAt, daysBack, profile) {
	if (profile !== "marketing") return randomInt(1, 3);

	const daysAgo = (Date.now() - createdAt.getTime()) / 86_400_000;
	const recency = 1 - daysAgo / daysBack;

	if (recency > 0.55) return randomInt(2, 3);
	if (recency > 0.25) return randomInt(1, 3);
	return randomInt(1, 2);
}

const SHIPPING_CURRENCY_SCALE = { USD: 1, EUR: 0.92, PLN: 4.0 };

function resolveShippingMethodForMarket(market, shippingByChannel) {
	const methods =
		shippingByChannel[market.slug]?.length > 0
			? shippingByChannel[market.slug]
			: (shippingByChannel["default-channel"] ?? []);
	if (methods.length === 0) {
		throw new Error(`No shipping methods available for ${market.slug}`);
	}

	const picked = pickBulkShippingMethod(methods);
	if (picked.price?.currency === market.currency) return picked;

	const scale = SHIPPING_CURRENCY_SCALE[market.currency] ?? 1;
	return {
		...picked,
		price: {
			amount: Number((picked.price.amount * scale).toFixed(2)),
			currency: market.currency,
		},
	};
}

async function createGrowthCustomer(adminGql, market, orderIndex, createdAt) {
	const slug = market.slug === "default-channel" ? "usd" : market.slug.replace(/^channel-/, "");
	const email = `pulse-${slug}-${createdAt.getTime()}-${orderIndex}@demo.pulse.saleor.cloud`;
	const address = buildGuestAddressForMarket(market);

	const data = await adminGql(CUSTOMER_CREATE, {
		input: {
			email,
			firstName: address.firstName,
			lastName: address.lastName,
			isActive: true,
		},
	});

	const user = data.customerCreate?.user;
	if (!user?.id) return null;

	return {
		kind: "customer",
		customer: user,
		email: user.email,
		address,
		usedSavedAddress: false,
		isNewCustomer: true,
	};
}

async function pickBuyerForMarket(
	adminGql,
	market,
	customers,
	customerRatio,
	orderIndex,
	createdAt,
	profile,
) {
	const daysAgo = (Date.now() - createdAt.getTime()) / 86_400_000;
	const isRecent = daysAgo <= 90;
	const newCustomerRate = profile === "marketing" ? 0.38 : 0.15;

	if (isRecent && adminGql && Math.random() < newCustomerRate) {
		const created = await createGrowthCustomer(adminGql, market, orderIndex, createdAt);
		if (created) return created;
	}

	if (market.slug === "default-channel" && customers.length > 0 && Math.random() < customerRatio) {
		const customer = randomItem(customers);
		const savedAddresses = collectCustomerAddresses(customer);
		const savedAddress = savedAddresses.length > 0 ? randomItem(savedAddresses) : null;

		return {
			kind: "customer",
			customer,
			email: customer.email,
			address: addressToInput(savedAddress) ?? buildGuestAddressForMarket(market),
			usedSavedAddress: Boolean(savedAddress),
		};
	}

	return {
		kind: "guest",
		email: `seed-guest-${market.slug}-${createdAt.getTime()}-${orderIndex}@example.com`,
		address: buildGuestAddressForMarket(market),
	};
}

function resolveLanguageCode() {
	const locale = (process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en").split(/[-_]/)[0].toUpperCase();
	const map = {
		EN: "EN_US",
		PL: "PL_PL",
		DE: "DE",
		FR: "FR",
		FI: "FI",
		NB: "NB",
	};
	return map[locale] ?? "EN_US";
}

function moneyValue(amount, currency) {
	return { amount: Number(amount.toFixed(2)), currency };
}

function taxedMoney(gross, net) {
	return {
		gross: Number(gross.toFixed(2)),
		net: Number(net.toFixed(2)),
	};
}

function addressToBulkInput(address) {
	return {
		...addressToInput(address),
		skipValidation: true,
	};
}

function pickBulkLines(variants, lineCount) {
	const pool = variants.filter(
		(variant) =>
			variant.pricing?.price?.gross?.amount != null &&
			!variant.product?.name?.toLowerCase().includes("gift card"),
	);
	const lines = [];

	for (let i = 0; i < lineCount && pool.length > 0; i++) {
		const index = randomInt(0, pool.length - 1);
		const variant = pool.splice(index, 1)[0];
		const quantity = randomInt(1, 2);
		const unitGross = variant.pricing.price.gross.amount;
		const unitNet = variant.pricing.price.net?.amount ?? unitGross;
		const lineGross = unitGross * quantity;
		const lineNet = unitNet * quantity;

		lines.push({
			variant,
			quantity,
			lineGross,
			lineNet,
		});
	}

	return lines;
}

function pickBulkShippingMethod(shippingMethods) {
	const active = shippingMethods.filter((method) => method.active !== false);
	const pool = active.length > 0 ? active : shippingMethods;
	return randomItem(pool);
}

/** Pulse Operations lifecycle buckets — see saleor-analytics rollup-builder + anomalies. */
function pickLifecycleKind(createdAt, { lifecycleEnabled, lifecycleOverride, anomalyKind }) {
	if (lifecycleOverride) return lifecycleOverride;
	if (!lifecycleEnabled) return "open";

	if (anomalyKind === "cancellation-spike") {
		return Math.random() < 0.1 ? "cancelled" : "fulfilled";
	}
	if (anomalyKind === "zero-total-spike") {
		return "zeroTotal";
	}
	if (anomalyKind === "unpaid-fulfilled-spike") {
		return "unpaidFulfilled";
	}

	const daysAgo = (Date.now() - createdAt.getTime()) / 86_400_000;
	const roll = Math.random();

	if (roll < 0.015) return "zeroTotal";
	if (roll < 0.075) return "cancelled";
	if (roll < 0.135) return "refunded";

	if (daysAgo < 21) {
		return roll < 0.48 ? "open" : "fulfilled";
	}

	return roll < 0.82 ? "fulfilled" : "open";
}

function buildBulkFulfillments(pickedLines, warehouseId) {
	return [
		{
			trackingCode: `TRK${randomInt(100_000, 999_999)}`,
			lines: pickedLines.map((line, index) => ({
				orderLineIndex: index,
				quantity: line.quantity,
				warehouse: warehouseId,
				variantId: line.variant.id,
			})),
		},
	];
}

/**
 * Extra dense batches on specific days so Pulse anomaly detection can fire
 * (needs ≥20 orders/day; spikes calibrated from anomalies.test.ts).
 */
function planAnomalySpikes(daysBack) {
	const spikes = [
		{ kind: "cancellation-spike", daysAgo: Math.min(32, daysBack - 14), count: 85 },
		{ kind: "zero-total-spike", daysAgo: Math.min(24, daysBack - 10), count: 32 },
		{ kind: "unpaid-fulfilled-spike", daysAgo: Math.min(9, daysBack - 3), count: 5 },
	];

	return spikes.filter((spike) => spike.daysAgo >= 3);
}

function createdAtOnDay(daysAgo, index, totalOnDay) {
	const now = Date.now();
	const msPerDay = 86_400_000;
	const dayStart = now - daysAgo * msPerDay;
	const spreadMs = Math.floor((msPerDay * 0.85 * index) / Math.max(totalOnDay, 1));
	const date = new Date(dayStart + spreadMs);
	date.setHours(10 + (index % 8), randomInt(0, 59), randomInt(0, 59), 0);
	return date;
}

function buildAnomalyJobs(profiles, daysBack) {
	const jobs = [];

	for (const spike of planAnomalySpikes(daysBack)) {
		for (let i = 0; i < spike.count; i++) {
			jobs.push({
				market: pickMarket(profiles),
				createdAt: createdAtOnDay(spike.daysAgo, i, spike.count),
				anomalyKind: spike.kind,
			});
		}
	}

	return jobs;
}

function buildBulkOrderInput({
	channel,
	currency,
	languageCode,
	warehouseId,
	shippingMethod,
	createdAt,
	buyer,
	variants,
	taxClass,
	lineCount: lineCountOverride,
	profile = "steady",
	daysBack = 180,
	lifecycleEnabled = false,
	lifecycleOverride = null,
	anomalyKind = null,
}) {
	const createdIso = createdAt.toISOString();
	const lineCount = lineCountOverride ?? pickLineCountForRecency(createdAt, daysBack, profile);
	const pickedLines = pickBulkLines(variants, lineCount);
	if (pickedLines.length === 0) {
		throw new Error("No bulk order lines selected");
	}

	const lifecycleKind = pickLifecycleKind(createdAt, {
		lifecycleEnabled,
		lifecycleOverride,
		anomalyKind,
	});

	const shippingAmount = shippingMethod?.price?.amount ?? 0;
	const linesTotal = pickedLines.reduce((sum, line) => sum + line.lineGross, 0);
	let orderTotal = linesTotal + shippingAmount;

	const user =
		buyer.kind === "customer" && buyer.customer?.id ? { id: buyer.customer.id } : { email: buyer.email };

	const lines = pickedLines.map((line) => {
		const isZeroTotal = lifecycleKind === "zeroTotal";
		const lineGross = isZeroTotal ? 0 : line.lineGross;
		const lineNet = isZeroTotal ? 0 : line.lineNet;

		return {
			variantId: line.variant.id,
			productName: line.variant.product.name,
			variantName: line.variant.name,
			quantity: line.quantity,
			createdAt: createdIso,
			isShippingRequired: true,
			isGiftCard: false,
			warehouse: warehouseId,
			taxClassId: taxClass.id,
			taxClassName: taxClass.name,
			totalPrice: taxedMoney(lineGross, lineNet),
			undiscountedTotalPrice: taxedMoney(line.lineGross, line.lineNet),
		};
	});

	const shippingForOrder = lifecycleKind === "zeroTotal" ? 0 : shippingAmount;
	if (lifecycleKind === "zeroTotal") orderTotal = 0;

	let status = "UNFULFILLED";
	let fulfillments;
	let transactions;

	switch (lifecycleKind) {
		case "fulfilled":
			status = "FULFILLED";
			fulfillments = buildBulkFulfillments(pickedLines, warehouseId);
			transactions = [
				{
					name: "Historical import",
					message: "Seeded paid order",
					pspReference: `seed-${createdAt.getTime()}-${randomInt(1000, 9999)}`,
					amountCharged: moneyValue(orderTotal, currency),
				},
			];
			break;
		case "cancelled":
			status = "CANCELED";
			transactions = [];
			break;
		case "refunded": {
			const refundAmount = Number((orderTotal * randomFloat(0.25, 0.55)).toFixed(2));
			transactions = [
				{
					name: "Historical import",
					message: "Seeded paid order",
					pspReference: `seed-${createdAt.getTime()}-${randomInt(1000, 9999)}`,
					amountCharged: moneyValue(orderTotal, currency),
					amountRefunded: moneyValue(refundAmount, currency),
				},
			];
			break;
		}
		case "zeroTotal":
			transactions = [
				{
					name: "Historical import",
					message: "Seeded zero-total order",
					pspReference: `seed-zero-${createdAt.getTime()}-${randomInt(1000, 9999)}`,
					amountCharged: moneyValue(0, currency),
				},
			];
			break;
		case "unpaidFulfilled":
			status = "FULFILLED";
			fulfillments = buildBulkFulfillments(pickedLines, warehouseId);
			transactions = [];
			break;
		default:
			transactions = [
				{
					name: "Historical import",
					message: "Seeded paid order",
					pspReference: `seed-${createdAt.getTime()}-${randomInt(1000, 9999)}`,
					amountCharged: moneyValue(orderTotal, currency),
				},
			];
			break;
	}

	const orderInput = {
		channel,
		createdAt: createdIso,
		status,
		user,
		billingAddress: addressToBulkInput(buyer.address),
		shippingAddress: addressToBulkInput(buyer.address),
		currency,
		languageCode: languageCode ?? resolveLanguageCode(),
		displayGrossPrices: true,
		lines,
		deliveryMethod: {
			shippingMethodId: shippingMethod.id,
			shippingPrice: taxedMoney(shippingForOrder, shippingForOrder),
			shippingTaxClassId: taxClass.id,
			shippingTaxClassName: taxClass.name,
		},
		metadata: [
			{ key: "seed.source", value: "seed-paid-orders" },
			{ key: "seed.lifecycle", value: lifecycleKind },
		],
	};

	if (fulfillments) orderInput.fulfillments = fulfillments;
	if (transactions.length > 0) orderInput.transactions = transactions;

	return {
		order: orderInput,
		buyer,
		lineCount: pickedLines.length,
		lifecycleKind,
	};
}

async function fetchWarehouse(gql) {
	const data = await gql(LIST_WAREHOUSES);
	const warehouse = data.warehouses?.edges?.[0]?.node;
	if (!warehouse?.id) {
		throw new Error("No warehouse found — required for orderBulkCreate line allocation");
	}
	return warehouse;
}

async function fetchTaxClass(gql) {
	const data = await gql(`query SeedTaxClasses { taxClasses(first: 20) { edges { node { id name } } } }`);
	const classes = data.taxClasses?.edges?.map((edge) => edge.node) ?? [];
	return (
		classes.find((taxClass) => taxClass.name.toLowerCase().includes("no tax")) ??
		classes.find((taxClass) => taxClass.name.toLowerCase() === "no taxes") ??
		classes[0] ??
		null
	);
}

async function importBulkPaidOrders(
	gql,
	{
		channel,
		currency,
		variants,
		customers,
		customerRatio,
		daysBack,
		count,
		batchSize,
		profile = "steady",
		lifecycle = false,
		anomalies = false,
	},
) {
	const [warehouse, shippingData, taxClass] = await Promise.all([
		fetchWarehouse(gql),
		gql(SHIPPING_METHODS, { channel }),
		fetchTaxClass(gql),
	]);

	if (!taxClass?.id) {
		throw new Error("No tax class found — required for orderBulkCreate on this instance");
	}

	const shippingMethods = shippingData.shop?.availableShippingMethods ?? [];
	if (shippingMethods.length === 0) {
		throw new Error("No shipping methods available for channel");
	}

	const orderDates = generateOrderDates(count, daysBack, profile);
	const jobs = orderDates.map((createdAt) => ({ createdAt, channel, currency }));

	if (anomalies) {
		const spikes = planAnomalySpikes(daysBack);
		for (const spike of spikes) {
			for (let i = 0; i < spike.count; i++) {
				jobs.push({
					createdAt: createdAtOnDay(spike.daysAgo, i, spike.count),
					channel,
					currency,
					anomalyKind: spike.kind,
				});
			}
		}
		console.log(
			`[seed-paid-orders] Anomaly batches (+${spikes.reduce((sum, spike) => sum + spike.count, 0)}): ${spikes.map((spike) => `${spike.kind}=${spike.count}`).join(", ")}`,
		);
	}

	jobs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
	const totalTarget = jobs.length;

	const builtOrders = jobs.map((job, index) =>
		buildBulkOrderInput({
			channel: job.channel,
			currency: job.currency,
			warehouseId: warehouse.id,
			shippingMethod: pickBulkShippingMethod(shippingMethods),
			createdAt: job.createdAt,
			buyer: pickBuyer(customers, customerRatio, index + 1, job.createdAt.getTime()),
			variants,
			taxClass,
			profile,
			daysBack,
			lifecycleEnabled: lifecycle,
			anomalyKind: job.anomalyKind ?? null,
		}),
	);

	const created = [];
	const safeBatchSize = Math.max(1, batchSize);

	for (let offset = 0; offset < builtOrders.length; offset += safeBatchSize) {
		const batch = builtOrders.slice(offset, offset + safeBatchSize);
		const data = await gql(ORDER_BULK_CREATE, {
			orders: batch.map((entry) => entry.order),
			stockUpdatePolicy: "SKIP",
		});

		for (let i = 0; i < (data.orderBulkCreate?.results ?? []).length; i++) {
			const result = data.orderBulkCreate.results[i];
			const source = batch[i];

			if (result.errors?.length) {
				console.error(
					`[seed-paid-orders] Bulk row ${offset + i + 1}/${totalTarget} failed:`,
					result.errors.map((error) => error.message).join("; "),
				);
				continue;
			}

			if (!result.order) continue;

			created.push({
				...formatOrderResult(result.order, source.lineCount, source.buyer),
				createdAt: result.order.created,
			});

			const totalLabel = result.order.total?.gross
				? `${result.order.total.gross.amount} ${result.order.total.gross.currency}`
				: "n/a";
			const buyerLabel =
				source.buyer.kind === "customer"
					? `customer ${source.buyer.email}${source.buyer.usedSavedAddress ? " (saved address)" : ""}`
					: "guest";
			console.log(
				`[seed-paid-orders] ${created.length}/${totalTarget} order #${result.order.number} (${source.lineCount} line(s), ${source.lifecycleKind}, ${totalLabel}, ${buyerLabel}, ${result.order.created})`,
			);
		}
	}

	return created;
}

async function importBulkPaidOrdersMultiMarket(
	gql,
	adminGql,
	{
		profiles,
		customers,
		customerRatio,
		daysBack,
		count,
		batchSize,
		profile,
		lifecycle = false,
		anomalies = false,
	},
) {
	const [warehouse, taxClass] = await Promise.all([fetchWarehouse(gql), fetchTaxClass(gql)]);

	if (!taxClass?.id) {
		throw new Error("No tax class found — required for orderBulkCreate on this instance");
	}

	const marketSlugs = [...new Set(profiles.map((entry) => entry.slug))];
	const [variantsByChannel, shippingByChannel] = await Promise.all([
		Promise.all(
			marketSlugs.map(async (slug) => ({
				slug,
				variants: await fetchPurchasableVariants(gql, slug),
			})),
		).then((entries) => Object.fromEntries(entries.map((entry) => [entry.slug, entry.variants]))),
		Promise.all(
			marketSlugs.map(async (slug) => {
				const data = await gql(SHIPPING_METHODS, { channel: slug });
				return [slug, data.shop?.availableShippingMethods ?? []];
			}),
		).then(Object.fromEntries),
	]);

	for (const market of profiles) {
		const variants = variantsByChannel[market.slug] ?? [];
		if (variants.length === 0) {
			throw new Error(`No purchasable variants found for ${market.slug}`);
		}
		console.log(`[seed-paid-orders] ${market.slug}: ${variants.length} variant(s), ${market.currency}`);
	}

	const allocations = allocateOrdersByMarket(count, profiles);
	const orderDates = generateOrderDates(count, daysBack, profile);
	const jobs = [];

	for (const { market, count: marketCount } of allocations) {
		for (let i = 0; i < marketCount; i++) {
			jobs.push({ market });
		}
	}

	for (let i = 0; i < jobs.length; i++) {
		jobs[i].createdAt = orderDates[i];
	}

	if (anomalies) {
		const anomalyJobs = buildAnomalyJobs(profiles, daysBack);
		jobs.push(...anomalyJobs);
		const spikes = planAnomalySpikes(daysBack);
		console.log(
			`[seed-paid-orders] Anomaly batches (+${spikes.reduce((sum, spike) => sum + spike.count, 0)}): ${spikes.map((spike) => `${spike.kind}=${spike.count} (~${spike.daysAgo}d ago)`).join(", ")}`,
		);
	}

	jobs.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
	const totalTarget = jobs.length;

	console.log(
		`[seed-paid-orders] Market split: ${allocations.map((entry) => `${entry.market.slug}=${entry.count}`).join(", ")}`,
	);
	if (profile === "marketing") {
		const recent = jobs.filter((job) => (Date.now() - job.createdAt.getTime()) / 86_400_000 <= 90).length;
		console.log(`[seed-paid-orders] Marketing profile: ${recent}/${totalTarget} orders in last 90 days`);
	}
	if (lifecycle) {
		console.log(
			"[seed-paid-orders] Operations lifecycle: fulfill / cancel / refund / zero-total mix enabled",
		);
	}

	const builtOrders = [];
	for (let index = 0; index < jobs.length; index++) {
		const { market, createdAt, anomalyKind } = jobs[index];
		const buyer = await pickBuyerForMarket(
			adminGql,
			market,
			customers,
			customerRatio,
			index + 1,
			createdAt,
			profile,
		);

		builtOrders.push(
			buildBulkOrderInput({
				channel: market.slug,
				currency: market.currency,
				languageCode: market.languageCode,
				warehouseId: warehouse.id,
				shippingMethod: resolveShippingMethodForMarket(market, shippingByChannel),
				createdAt,
				buyer,
				variants: variantsByChannel[market.slug],
				taxClass,
				profile,
				daysBack,
				lifecycleEnabled: lifecycle,
				anomalyKind: anomalyKind ?? null,
			}),
		);
	}

	const created = [];
	const safeBatchSize = Math.max(1, batchSize);

	for (let offset = 0; offset < builtOrders.length; offset += safeBatchSize) {
		const batch = builtOrders.slice(offset, offset + safeBatchSize);
		const data = await gql(ORDER_BULK_CREATE, {
			orders: batch.map((entry) => entry.order),
			stockUpdatePolicy: "SKIP",
		});

		for (let i = 0; i < (data.orderBulkCreate?.results ?? []).length; i++) {
			const result = data.orderBulkCreate.results[i];
			const source = batch[i];

			if (result.errors?.length) {
				console.error(
					`[seed-paid-orders] Bulk row ${offset + i + 1}/${totalTarget} failed:`,
					result.errors.map((error) => error.message).join("; "),
				);
				continue;
			}

			if (!result.order) continue;

			created.push({
				...formatOrderResult(result.order, source.lineCount, source.buyer),
				createdAt: result.order.created,
				channel: source.order.channel,
			});

			const totalLabel = result.order.total?.gross
				? `${result.order.total.gross.amount} ${result.order.total.gross.currency}`
				: "n/a";
			const buyerLabel =
				source.buyer.kind === "customer"
					? `customer ${source.buyer.email}${source.buyer.isNewCustomer ? " (new)" : source.buyer.usedSavedAddress ? " (saved address)" : ""}`
					: "guest";
			console.log(
				`[seed-paid-orders] ${created.length}/${totalTarget} #${result.order.number} ${source.order.channel} (${source.lineCount} line(s), ${source.lifecycleKind}, ${totalLabel}, ${buyerLabel}, ${result.order.created})`,
			);
		}
	}

	return created;
}

function resolveDummyGatewayId(gateways) {
	for (const id of DUMMY_GATEWAY_IDS) {
		if (gateways.some((gateway) => gateway.id === id)) {
			return id;
		}
	}
	return null;
}

function formatOrderResult(order, lineCount, buyer) {
	return {
		orderId: order.id,
		orderNumber: order.number,
		lineCount,
		total: order.total?.gross,
		email: buyer.email,
		buyerKind: buyer.kind,
		customerId: buyer.customer?.id ?? null,
		usedSavedAddress: buyer.usedSavedAddress ?? false,
	};
}

async function applyCheckoutShippingAndPayment(
	gql,
	{ checkoutId, checkout, address, payAmount: initialPayAmount },
) {
	let payAmount = initialPayAmount;

	if (checkout.isShippingRequired) {
		const shippingData = await gql(CHECKOUT_SHIPPING_ADDRESS_UPDATE, {
			checkoutId,
			shippingAddress: address,
		});
		assertNoMutationErrors("checkoutShippingAddressUpdate", shippingData.checkoutShippingAddressUpdate);

		const deliveryData = await gql(DELIVERY_OPTIONS_CALCULATE, { checkoutId });
		assertNoMutationErrors("deliveryOptionsCalculate", deliveryData.deliveryOptionsCalculate);

		const delivery =
			deliveryData.deliveryOptionsCalculate.deliveries?.find((entry) => entry.shippingMethod?.active) ??
			deliveryData.deliveryOptionsCalculate.deliveries?.[0];

		if (!delivery?.id) {
			throw new Error("No delivery method available for shippable checkout");
		}

		const deliveryMethodData = await gql(CHECKOUT_DELIVERY_METHOD_UPDATE, {
			checkoutId,
			deliveryMethodId: delivery.id,
		});
		assertNoMutationErrors("checkoutDeliveryMethodUpdate", deliveryMethodData.checkoutDeliveryMethodUpdate);
		payAmount =
			deliveryMethodData.checkoutDeliveryMethodUpdate.checkout.totalPrice?.gross?.amount ?? payAmount;
	}

	return payAmount;
}

async function createCheckoutPaidOrder(gql, { channel, variants, orderIndex, customers, customerRatio }) {
	const lineCount = randomInt(1, 3);
	const lines = pickRandomLines(variants, lineCount);
	if (lines.length === 0) {
		throw new Error("No checkout lines selected");
	}

	const buyer = pickBuyer(customers, customerRatio, orderIndex);

	const createData = await gql(CHECKOUT_CREATE, { channel });
	assertNoMutationErrors("checkoutCreate", createData.checkoutCreate);
	const checkoutId = createData.checkoutCreate.checkout.id;

	const linesData = await gql(CHECKOUT_LINES_ADD, { checkoutId, lines });
	assertNoMutationErrors("checkoutLinesAdd", linesData.checkoutLinesAdd);
	const checkout = linesData.checkoutLinesAdd.checkout;

	const emailData = await gql(CHECKOUT_EMAIL_UPDATE, { checkoutId, email: buyer.email });
	assertNoMutationErrors("checkoutEmailUpdate", emailData.checkoutEmailUpdate);

	let payAmount = checkout.totalPrice?.gross?.amount ?? 0;
	payAmount = await applyCheckoutShippingAndPayment(gql, {
		checkoutId,
		checkout,
		address: buyer.address,
		payAmount,
	});

	const billingData = await gql(CHECKOUT_BILLING_ADDRESS_UPDATE, {
		checkoutId,
		billingAddress: buyer.address,
	});
	assertNoMutationErrors("checkoutBillingAddressUpdate", billingData.checkoutBillingAddressUpdate);

	const dummyGatewayId = resolveDummyGatewayId(checkout.availablePaymentGateways ?? []);
	if (!dummyGatewayId) {
		const available =
			(checkout.availablePaymentGateways ?? []).map((gateway) => gateway.id).join(", ") || "none";
		throw new Error(
			`Dummy Payment gateway not found (available: ${available}). Install the Dummy Payment app, or rerun with --mode draft and an admin token (MANAGE_ORDERS).`,
		);
	}

	const paymentData = await gql(TRANSACTION_INITIALIZE, {
		checkoutId,
		amount: payAmount,
		paymentGateway: {
			id: dummyGatewayId,
			data: {
				event: {
					includePspReference: true,
					type: "CHARGE_SUCCESS",
				},
			},
		},
	});
	assertNoMutationErrors("transactionInitialize", paymentData.transactionInitialize);

	const completeData = await gql(CHECKOUT_COMPLETE, { checkoutId });
	assertNoMutationErrors("checkoutComplete", completeData.checkoutComplete);

	return formatOrderResult(completeData.checkoutComplete.order, lines.length, buyer);
}

async function createDraftPaidOrder(
	gql,
	{ channelId, variants, orderIndex, shippingMethods, customers, customerRatio },
) {
	const lineCount = randomInt(1, 3);
	const lines = pickRandomLines(variants, lineCount);
	if (lines.length === 0) {
		throw new Error("No order lines selected");
	}

	const buyer = pickBuyer(customers, customerRatio, orderIndex);

	const draftInput = {
		channelId,
		userEmail: buyer.email,
		lines,
		shippingAddress: buyer.address,
		billingAddress: buyer.address,
	};

	if (buyer.kind === "customer") {
		draftInput.user = buyer.customer.id;
	}

	const draftData = await gql(DRAFT_ORDER_CREATE, { input: draftInput });
	assertNoMutationErrors("draftOrderCreate", draftData.draftOrderCreate);
	const draftOrder = draftData.draftOrderCreate.order;

	if (draftOrder.isShippingRequired) {
		const shippingMethod = shippingMethods.find((method) => method.active) ?? shippingMethods[0] ?? null;
		if (!shippingMethod?.id) {
			throw new Error("No shipping method configured for channel");
		}

		const shippingData = await gql(ORDER_UPDATE_SHIPPING, {
			orderId: draftOrder.id,
			shippingMethodId: shippingMethod.id,
		});
		assertNoMutationErrors("orderUpdateShipping", shippingData.orderUpdateShipping);
	}

	const completeData = await gql(DRAFT_ORDER_COMPLETE, { id: draftOrder.id });
	assertNoMutationErrors("draftOrderComplete", completeData.draftOrderComplete);

	const paidData = await gql(ORDER_MARK_AS_PAID, { id: completeData.draftOrderComplete.order.id });
	assertNoMutationErrors("orderMarkAsPaid", paidData.orderMarkAsPaid);

	return formatOrderResult(paidData.orderMarkAsPaid.order, lines.length, buyer);
}

async function main() {
	const options = parseArgs(process.argv.slice(2));

	if (options.help) {
		console.log(`Usage: node scripts/seed-paid-orders.mjs [options]

Options:
  --count, -n <n>     Number of orders to create (default: 10)
  --channel <slug>    Saleor channel slug (default: NEXT_PUBLIC_DEFAULT_CHANNEL or default-channel)
  --mode <mode>       checkout (default), draft, or bulk
  --token <token>     Override API token
  --admin-token <t>   Token with MANAGE_USERS to load customer accounts (or set SALEOR_ADMIN_TOKEN)
  --customer-ratio <n> Fraction of orders using existing customers, 0–1 (default: 0.5)
  --days-back <n>     Historical window for bulk mode in days (default: 180)
  --batch-size <n>    Orders per orderBulkCreate call in bulk mode (default: 10)
  --profile <name>    steady or marketing (default) — growth curve for Pulse KPIs
  --markets <mode>    auto (default, USD+EUR+PLN) or single (use --channel only)
  --lifecycle         Mix fulfilled/cancelled/refunded orders (default: on for bulk)
  --no-lifecycle      Import all orders as UNFULFILLED paid
  --anomalies         Inject Pulse anomaly spike days (auto with --profile marketing)
  --no-anomalies      Skip zero-total / cancellation / unpaid-fulfilled spikes
  --delay <ms>        Pause between orders in checkout/draft mode (default: 250)
  --help, -h          Show this help

Environment:
  checkout mode: NEXT_PUBLIC_SALEOR_API_URL + SALEOR_APP_TOKEN + Dummy Payment app
  draft mode:    SALEOR_ADMIN_TOKEN with MANAGE_ORDERS (or --token)
  bulk mode:     SALEOR_ADMIN_TOKEN with MANAGE_ORDERS_IMPORT (or --token)
  customers:     SALEOR_ADMIN_TOKEN or --admin-token (MANAGE_USERS)

Examples:
  pnpm orders:seed -- --mode bulk --count 150 --days-back 180
  pnpm orders:seed -- --mode bulk --profile marketing --count 250 --markets auto
  pnpm orders:seed -- --mode bulk --profile marketing --anomalies --count 900 --days-back 90
  pnpm orders:seed -- --mode bulk --count 200 --customer-ratio 0.65

After bulk seeding, run Sync Now in Pulse so Operations KPIs and anomaly alerts refresh.
`);
		return;
	}

	if (!API_URL) {
		console.error("[seed-paid-orders] Missing NEXT_PUBLIC_SALEOR_API_URL (set in .env.local)");
		process.exit(1);
	}

	if (options.mode !== "checkout" && options.mode !== "draft" && options.mode !== "bulk") {
		console.error('[seed-paid-orders] --mode must be "checkout", "draft", or "bulk"');
		process.exit(1);
	}

	const token = resolveAuthToken(options);
	if (!token) {
		const envHint = options.mode === "checkout" ? "SALEOR_APP_TOKEN" : "SALEOR_ADMIN_TOKEN (or pass --token)";
		console.error(`[seed-paid-orders] Missing API token — set ${envHint} in .env.local`);
		process.exit(1);
	}

	const gql = createGqlClient(token);

	if (!Number.isFinite(options.count) || options.count < 1) {
		console.error("[seed-paid-orders] --count must be a positive integer");
		process.exit(1);
	}

	if (!Number.isFinite(options.customerRatio) || options.customerRatio < 0 || options.customerRatio > 1) {
		console.error("[seed-paid-orders] --customer-ratio must be between 0 and 1");
		process.exit(1);
	}

	if (!Number.isFinite(options.daysBack) || options.daysBack < 1) {
		console.error("[seed-paid-orders] --days-back must be a positive integer");
		process.exit(1);
	}

	if (!Number.isFinite(options.batchSize) || options.batchSize < 1) {
		console.error("[seed-paid-orders] --batch-size must be a positive integer");
		process.exit(1);
	}

	const adminToken =
		options.adminToken ??
		process.env.SALEOR_ADMIN_TOKEN ??
		(options.mode === "draft" || options.mode === "bulk" ? token : null);
	let customers = [];

	if (adminToken && options.customerRatio > 0) {
		try {
			customers = await fetchCustomers(createGqlClient(adminToken));
			console.log(`[seed-paid-orders] Loaded ${customers.length} active customer account(s)`);
		} catch (error) {
			console.warn(`[seed-paid-orders] Could not load customers (${error.message}) — guest checkouts only`);
		}
	} else if (options.customerRatio > 0) {
		console.warn(
			"[seed-paid-orders] No SALEOR_ADMIN_TOKEN — set it (MANAGE_USERS) to mix in existing customer accounts",
		);
	}

	console.log(
		`[seed-paid-orders] Creating ${options.count} paid order(s) via ${options.mode} on ${API_URL} (channel: ${options.channel})`,
	);

	if (options.mode === "bulk") {
		if (options.profile === "marketing" && !process.argv.slice(2).includes("--no-anomalies")) {
			options.anomalies = true;
		}
		console.log(
			`[seed-paid-orders] Bulk window: last ${options.daysBack} days (~${Math.round(options.daysBack / 30)} months), batch size ${options.batchSize}, profile ${options.profile}, lifecycle ${options.lifecycle ? "on" : "off"}, anomalies ${options.anomalies ? "on" : "off"}`,
		);
		if (options.markets === "auto") {
			console.log("[seed-paid-orders] Multi-market bulk: USD + EUR + PLN");
		}
	}

	const adminGql = adminToken ? createGqlClient(adminToken) : null;

	if (options.mode === "bulk" && options.markets === "auto") {
		const created = await importBulkPaidOrdersMultiMarket(gql, adminGql, {
			profiles: MARKET_PROFILES,
			customers,
			customerRatio: customers.length > 0 ? options.customerRatio : 0,
			daysBack: options.daysBack,
			count: options.count,
			batchSize: options.batchSize,
			profile: options.profile,
			lifecycle: options.lifecycle,
			anomalies: options.anomalies,
		});

		const expected =
			options.count +
			(options.anomalies
				? planAnomalySpikes(options.daysBack).reduce((sum, spike) => sum + spike.count, 0)
				: 0);
		console.log(`[seed-paid-orders] Done — created ${created.length}/${expected} order(s)`);
		if (created.length < expected) {
			process.exitCode = 1;
		}
		return;
	}

	const variants = await fetchPurchasableVariants(gql, options.channel);
	if (variants.length === 0) {
		console.error("[seed-paid-orders] No purchasable variants found for channel");
		process.exit(1);
	}

	console.log(`[seed-paid-orders] Found ${variants.length} purchasable variant(s)`);

	if (options.mode === "bulk") {
		let currency = variants.find((variant) => variant.pricing?.price?.gross?.currency)?.pricing.price.gross
			.currency;

		try {
			const channelData = await gql(CHANNEL_INFO, { slug: options.channel });
			currency = channelData.channel?.currencyCode ?? currency;
		} catch {
			// app token may lack channel.currencyCode — fall back to variant pricing currency
		}

		if (!currency) {
			console.error("[seed-paid-orders] Could not resolve channel currency for bulk import");
			process.exit(1);
		}

		const created = await importBulkPaidOrders(gql, {
			channel: options.channel,
			currency,
			variants,
			customers,
			customerRatio: customers.length > 0 ? options.customerRatio : 0,
			daysBack: options.daysBack,
			count: options.count,
			batchSize: options.batchSize,
			profile: options.profile,
			lifecycle: options.lifecycle,
			anomalies: options.anomalies,
		});

		const expected =
			options.count +
			(options.anomalies
				? planAnomalySpikes(options.daysBack).reduce((sum, spike) => sum + spike.count, 0)
				: 0);
		console.log(`[seed-paid-orders] Done — created ${created.length}/${expected} order(s)`);
		if (created.length < expected) {
			process.exitCode = 1;
		}
		return;
	}

	let channelId = null;
	let shippingMethods = [];

	if (options.mode === "draft") {
		const channelData = await gql(CHANNEL_INFO, { slug: options.channel });
		channelId = channelData.channel?.id;
		if (!channelId) {
			console.error(`[seed-paid-orders] Channel not found: ${options.channel}`);
			process.exit(1);
		}

		const shippingData = await gql(SHIPPING_METHODS, { channel: options.channel });
		shippingMethods = shippingData.shop?.availableShippingMethods ?? [];
	}

	const orderContext = {
		channel: options.channel,
		variants,
		customers,
		customerRatio: customers.length > 0 ? options.customerRatio : 0,
	};

	const createOrder =
		options.mode === "draft"
			? (context) => createDraftPaidOrder(gql, { ...orderContext, ...context, channelId, shippingMethods })
			: (context) => createCheckoutPaidOrder(gql, { ...orderContext, ...context });

	const created = [];

	for (let i = 0; i < options.count; i++) {
		try {
			const order = await createOrder({ orderIndex: i + 1 });
			created.push(order);
			const totalLabel = order.total ? `${order.total.amount} ${order.total.currency}` : "n/a";
			const buyerLabel =
				order.buyerKind === "customer"
					? `customer ${order.email}${order.usedSavedAddress ? " (saved address)" : ""}`
					: "guest";
			console.log(
				`[seed-paid-orders] ${i + 1}/${options.count} order #${order.orderNumber} (${order.lineCount} line(s), ${totalLabel}, ${buyerLabel})`,
			);
		} catch (error) {
			console.error(`[seed-paid-orders] Failed on order ${i + 1}/${options.count}:`, error.message);
		}

		if (i + 1 < options.count && options.delayMs > 0) {
			await sleep(options.delayMs);
		}
	}

	console.log(`[seed-paid-orders] Done — created ${created.length}/${options.count} order(s)`);
	if (created.length < options.count) {
		process.exitCode = 1;
	}
}

main().catch((error) => {
	const message = error.message ?? String(error);
	if (message.includes("MANAGE_ORDERS_IMPORT") || message.includes("MANAGE_ORDERS")) {
		console.error(
			"[seed-paid-orders] Bulk mode needs SALEOR_ADMIN_TOKEN with MANAGE_ORDERS_IMPORT (and MANAGE_USERS for customer mix-in).",
		);
	}
	console.error("[seed-paid-orders] Fatal:", message);
	process.exit(1);
});
