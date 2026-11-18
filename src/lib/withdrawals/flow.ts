import "server-only";

import { getTranslations } from "next-intl/server";

import { resolveLocaleFromSlug } from "@/config/locale";
import { hasAuthSession } from "@/lib/auth/has-auth-session";
import { getSessionAccessToken } from "@/lib/auth/session-access-token";
import { getLegalLinks } from "@/lib/catalog/get-legal-links";
import { getSellerIdentity } from "@/lib/channels/get-seller-identity";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { isWithdrawalAvailable } from "./availability";
import { getConsumerIp } from "./consumer-ip";
import type {
	Requester,
	WithdrawableOrder,
	WithdrawalError,
	WithdrawalReceipt,
	WithdrawalScope,
} from "./types";
import type {
	WithdrawContext,
	WithdrawField,
	WithdrawFieldError,
	WithdrawMode,
	WithdrawNotice,
	WithdrawOrderView,
	WithdrawScopeInput,
	WithdrawState,
	WithdrawValues,
} from "./flow-types";
import { getStorefrontChannelSlugs } from "@/lib/channel-slugs";
import { createConfirmToken, readConfirmToken, readSnapshot, signSnapshot } from "./form-token";
import { getWithdrawalsProvider } from "./index";
import { composeWithdrawalStatement } from "./statement";

type Translate = Awaited<ReturnType<typeof getTranslations<"withdraw">>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORDER_NUMBER_PATTERN = /^#?\d{1,20}$/;
const EMPTY_VALUES: WithdrawValues = { name: "", email: "", orderNumber: "", orderId: "" };

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/** The calendar date of an ISO timestamp in its own offset (the store's), formatted. */
function formatIsoDate(iso: string, bcp47: string): string {
	const day = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
	if (!day) return "";
	const date = new Date(Date.UTC(Number(day[1]), Number(day[2]) - 1, Number(day[3]), 12));
	return new Intl.DateTimeFormat(bcp47, { dateStyle: "long", timeZone: "UTC" }).format(date);
}

function formatReceivedAt(receipt: WithdrawalReceipt, bcp47: string) {
	const at = new Date(receipt.receivedAt);
	const timeZone = receipt.timeZone;
	try {
		const zone =
			new Intl.DateTimeFormat(bcp47, { timeZone, timeZoneName: "short" })
				.formatToParts(at)
				.find((part) => part.type === "timeZoneName")?.value ?? timeZone;
		return {
			date: new Intl.DateTimeFormat(bcp47, { dateStyle: "long", timeZone }).format(at),
			time: new Intl.DateTimeFormat(bcp47, { timeStyle: "short", timeZone }).format(at),
			zone,
		};
	} catch {
		return {
			date: formatIsoDate(receipt.receivedAt, bcp47),
			time: receipt.receivedAt.slice(11, 16),
			zone: "",
		};
	}
}

function maskEmail(email: string): string {
	const [user, domain] = email.split("@");
	if (!user || !domain) return email;
	return `${user[0]}…@${domain}`;
}

function scopeItemsLabel(scope: WithdrawalScope, order: WithdrawableOrder, t: Translate): string {
	if (scope.kind === "wholeOrder") return t("receipt.scopeWhole");
	if (scope.kind === "itemsDescription") return scope.text;
	return scope.lines
		.map((line) => {
			const found = order.lines.find((candidate) => candidate.id === line.lineId);
			return found ? t("statement.item", { name: found.productName, quantity: line.quantity }) : null;
		})
		.filter(Boolean)
		.join(", ");
}

function toOrderView(order: WithdrawableOrder, bcp47: string, t: Translate): WithdrawOrderView {
	const lines = order.lines.map((line) => ({
		id: line.id,
		productName: line.productName,
		variantName: line.variantName,
		quantity: line.quantity,
		quantityWithdrawable: line.quantityWithdrawable,
		thumbnailUrl: line.thumbnail?.url ?? null,
		thumbnailAlt: line.thumbnail?.alt ?? null,
	}));
	return {
		id: order.id,
		number: order.number,
		createdAtLabel: formatIsoDate(order.createdAt, bcp47),
		// withinPeriod is true before anything has shipped; both are null when the store has not
		// set when the period ends.
		period:
			order.withinPeriod === false
				? { kind: "mayHaveEnded" }
				: order.periodEndsAt
					? { kind: "endsOn", date: formatIsoDate(order.periodEndsAt, bcp47) }
					: order.withinPeriod === true
						? { kind: "notStarted" }
						: { kind: "unknown" },
		lines,
		earlier: order.withdrawals.map((receipt) => {
			const at = formatReceivedAt(receipt, bcp47);
			return { date: at.date, time: at.time, items: scopeItemsLabel(receipt.scope, order, t) };
		}),
		fullyWithdrawn: lines.length > 0 && lines.every((line) => line.quantityWithdrawable === 0),
	};
}

// ---------------------------------------------------------------------------
// Statement
// ---------------------------------------------------------------------------

function composeStatement(
	scope: WithdrawScopeInput,
	order: WithdrawableOrder | null,
	values: WithdrawValues,
	bcp47: string,
	t: Translate,
): string {
	const orderNumber = order?.number ?? values.orderNumber.trim().replace(/^#/, "");
	const orderDate = order ? formatIsoDate(order.createdAt, bcp47) : "";
	const name = values.name.trim();
	if (scope.kind === "lines" && order && !Object.values(scope.quantities).some((quantity) => quantity > 0)) {
		return "";
	}
	const items =
		scope.kind === "lines" && order
			? order.lines
					.filter((line) => (scope.quantities[line.id] ?? 0) > 0)
					.map((line) => ({
						productName: line.productName,
						variantName: line.variantName,
						quantity: scope.quantities[line.id] ?? 0,
					}))
			: [];
	return composeWithdrawalStatement({
		scope:
			scope.kind === "lines" && order
				? { kind: "lines", items }
				: scope.kind === "itemsDescription"
					? { kind: "itemsDescription", text: scope.text }
					: { kind: "wholeOrder" },
		orderNumber,
		orderDate,
		consumerName: name,
		bcp47,
		messages: {
			wholeOrder: (input) =>
				input.date ? t("statement.wholeOrder", input) : t("statement.wholeOrderNoDate", input),
			lines: (input) => t("statement.lines", input),
			itemsDescription: (input) => t("statement.itemsDescription", input),
			item: (input) => t("statement.item", input),
		},
	});
}

function toContractScope(scope: WithdrawScopeInput): WithdrawalScope {
	if (scope.kind === "lines") {
		return {
			kind: "lines",
			lines: Object.entries(scope.quantities)
				.filter(([, quantity]) => quantity > 0)
				.map(([lineId, quantity]) => ({ lineId, quantity })),
		};
	}
	if (scope.kind === "itemsDescription") return { kind: "itemsDescription", text: scope.text.trim() };
	return { kind: "wholeOrder" };
}

// ---------------------------------------------------------------------------
// Form parsing and validation
// ---------------------------------------------------------------------------

function readString(formData: FormData, key: string): string {
	const value = formData.get(key);
	return typeof value === "string" ? value : "";
}

function readValues(formData: FormData): WithdrawValues {
	return {
		name: readString(formData, "name").slice(0, 400),
		email: readString(formData, "email").trim().slice(0, 300),
		orderNumber: readString(formData, "orderNumber").trim().slice(0, 30),
		orderId: readString(formData, "orderId").trim().slice(0, 200),
	};
}

function readScope(formData: FormData, order: WithdrawableOrder | null): WithdrawScopeInput {
	const kind = readString(formData, "scopeKind");
	const quantities: Record<string, number> = {};
	for (const line of order?.lines ?? []) {
		const selected = formData.get(`line:${line.id}`) === "on";
		const quantity = Number.parseInt(readString(formData, `quantity:${line.id}`) || "0", 10);
		if (selected) {
			quantities[line.id] = Math.min(
				Math.max(Number.isFinite(quantity) ? quantity : 1, 1),
				line.quantityWithdrawable,
			);
		}
	}
	return {
		kind:
			kind === "lines" && order
				? "lines"
				: kind === "itemsDescription" && !order
					? "itemsDescription"
					: "wholeOrder",
		quantities,
		text: readString(formData, "itemsText").slice(0, 1200),
	};
}

function validateDetails(
	mode: WithdrawMode,
	values: WithdrawValues,
	orderCount: number,
): Partial<Record<WithdrawField, WithdrawFieldError>> {
	const errors: Partial<Record<WithdrawField, WithdrawFieldError>> = {};
	const name = values.name.trim();
	if (!name) errors.name = "nameRequired";
	else if (name.length > 200) errors.name = "nameTooLong";
	if (!EMAIL_PATTERN.test(values.email)) errors.email = "emailInvalid";
	if (mode === "lookup" && !ORDER_NUMBER_PATTERN.test(values.orderNumber))
		errors.orderNumber = "orderNumberInvalid";
	if (mode !== "lookup" && orderCount > 1 && !values.orderId) errors.orderId = "orderRequired";
	return errors;
}

function validateScope(scope: WithdrawScopeInput): Partial<Record<WithdrawField, WithdrawFieldError>> {
	if (scope.kind === "lines" && !Object.values(scope.quantities).some((quantity) => quantity > 0)) {
		return { lines: "linesRequired" };
	}
	if (scope.kind === "itemsDescription") {
		const text = scope.text.trim();
		if (!text) return { itemsText: "itemsTextRequired" };
		if (text.length > 1000) return { itemsText: "itemsTextTooLong" };
	}
	return {};
}

// ---------------------------------------------------------------------------
// Provider calls
// ---------------------------------------------------------------------------

async function customerToken(): Promise<string | null> {
	return (await hasAuthSession()) ? getSessionAccessToken() : null;
}

/** Order-mode lookup: as the customer when signed in, else by the order link's ID. */
async function lookupOrders(
	context: WithdrawContext,
	orderId: string | null,
	bcp47: string,
): Promise<
	{ ok: true; mode: WithdrawMode; orders: WithdrawableOrder[] } | { ok: false; error: WithdrawalError }
> {
	const provider = getWithdrawalsProvider();
	const consumerIp = await getConsumerIp();
	const token = context.mode === "lookup" && !orderId ? null : await customerToken();

	if (token) {
		const result = await provider.lookup(
			{
				channel: context.channel,
				languageCode: bcp47,
				requester: { mode: "customer", customerAccessToken: token, ...(orderId ? { orderId } : {}) },
			},
			{ consumerIp },
		);
		if (result.ok) return { ok: true, mode: "customer", orders: result.value.orders };
		// A stale token, or an order from another account or a guest checkout: the link still works.
		const fallBack = result.error.code === "CUSTOMER_TOKEN_INVALID" || result.error.code === "NOT_MATCHED";
		if (!fallBack || !orderId) return result;
	}
	if (!orderId) return { ok: false, error: { code: "NOT_MATCHED" } };

	const result = await provider.lookup(
		{ channel: context.channel, languageCode: bcp47, requester: { mode: "orderLink", orderId } },
		{ consumerIp },
	);
	return result.ok ? { ok: true, mode: "orderLink", orders: result.value.orders } : result;
}

/** Errors that mean the integration is broken for this storefront: end in the email fallback. */
function isIntegrationError(error: WithdrawalError): boolean {
	return error.code === "UNAUTHORIZED" || error.code === "NOT_ENABLED";
}

function noticeFor(error: WithdrawalError): WithdrawNotice {
	switch (error.code) {
		case "NOT_MATCHED":
			return "notMatched";
		case "RATE_LIMITED":
			return "rateLimited";
		case "SUSPECTED_AUTOMATION":
			return "automation";
		case "IDEMPOTENCY_CONFLICT":
			return "conflict";
		case "INVALID_INPUT":
			return "invalid";
		default:
			return "unavailable";
	}
}

function fieldErrorsFromContract(error: WithdrawalError): Partial<Record<WithdrawField, WithdrawFieldError>> {
	const errors: Partial<Record<WithdrawField, WithdrawFieldError>> = {};
	for (const field of error.fields ?? []) {
		if (field.path.startsWith("consumerName")) errors.name = "nameRequired";
		else if (field.path.startsWith("confirmationEmail")) errors.email = "emailInvalid";
		else if (field.path.includes("orderNumber")) errors.orderNumber = "orderNumberInvalid";
		else if (field.path.startsWith("scope.text")) errors.itemsText = "itemsTextRequired";
		else if (field.path.startsWith("scope.lines")) errors.lines = "linesRequired";
	}
	return errors;
}

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

async function emailState(
	context: WithdrawContext,
	statement: string,
	orderNumber: string,
	t: Translate,
	notice: WithdrawNotice | null,
): Promise<WithdrawState> {
	const seller = await getSellerIdentity().catch(() => null);
	const sellerEmail = seller?.email ?? null;
	const subject = orderNumber ? t("email.subject", { number: orderNumber }) : t("email.subjectNoNumber");
	return {
		step: "email",
		context: { ...context, provider: "stub" },
		statement,
		sellerEmail,
		mailtoHref: sellerEmail
			? `mailto:${sellerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(statement)}`
			: null,
		notice,
	};
}

function detailsState(
	context: WithdrawContext,
	values: WithdrawValues,
	orders: WithdrawOrderView[],
	notice: WithdrawNotice | null = null,
	fieldErrors: Partial<Record<WithdrawField, WithdrawFieldError>> = {},
	carried: { ordersToken?: string; token?: string } = {},
): WithdrawState {
	return {
		step: "details",
		context,
		values,
		orders,
		ordersToken: carried.ordersToken ?? "",
		token: carried.token ?? "",
		fieldErrors,
		notice,
	};
}

/** "#1042" as printed in order emails is order 1042. */
const normalizeOrderNumber = (value: string) => value.trim().replace(/^#/, "");

/**
 * The first screen: the order from the email link or the account, the signed-in customer's
 * orders still in their period, or the order-number form. Lookups that fail fall back to the
 * order-number form; a broken integration falls back to the email route.
 */
export async function buildInitialWithdrawState(input: {
	locale: string;
	channel: string;
	orderId: string | null;
}): Promise<WithdrawState> {
	const { bcp47 } = resolveLocaleFromSlug(input.locale);
	const t = await getTranslations({ locale: input.locale, namespace: "withdraw" });
	const provider = getWithdrawalsProvider();
	const lookupContext: WithdrawContext = {
		locale: input.locale,
		channel: input.channel,
		mode: "lookup",
		provider: provider.kind,
	};
	if (provider.kind === "stub") return detailsState(lookupContext, EMPTY_VALUES, []);

	const signedIn = await hasAuthSession();
	if (!input.orderId && !signedIn) return detailsState(lookupContext, EMPTY_VALUES, []);

	const result = await lookupOrders({ ...lookupContext, mode: "customer" }, input.orderId, bcp47);
	if (!result.ok) {
		if (isIntegrationError(result.error))
			return detailsState({ ...lookupContext, provider: "stub" }, EMPTY_VALUES, []);
		const notice = result.error.code === "NOT_MATCHED" ? null : noticeFor(result.error);
		return detailsState(lookupContext, EMPTY_VALUES, [], notice);
	}
	if (result.orders.length === 0) {
		return detailsState(lookupContext, EMPTY_VALUES, [], signedIn ? "noOrders" : null);
	}

	const first = result.orders[0];
	return detailsState(
		{ ...lookupContext, mode: result.mode },
		{
			name: first.prefill.name ?? "",
			email: first.prefill.email ?? "",
			orderNumber: "",
			orderId: result.orders.length === 1 ? first.id : "",
		},
		result.orders.map((order) => toOrderView(order, bcp47, t)),
		null,
		{},
		{ ordersToken: signSnapshot(result.orders) },
	);
}

function readContext(formData: FormData): WithdrawContext | null {
	const locale = readString(formData, "locale");
	const channel = readString(formData, "channel");
	const mode = readString(formData, "mode");
	if (!locale || !channel || !["lookup", "orderLink", "customer"].includes(mode)) return null;
	return { locale, channel, mode: mode as WithdrawMode, provider: getWithdrawalsProvider().kind };
}

/**
 * One step of the flow. `intent`: `details` (step 1 → 2), `update` (recompose the statement),
 * `confirm` (record it), `back`, `email` (the email route).
 */
export async function advanceWithdrawal(formData: FormData): Promise<WithdrawState> {
	const parsed = readContext(formData);
	const channels = await getStorefrontChannelSlugs();
	if (!parsed || !channels.includes(parsed.channel) || !(await isWithdrawalAvailable(parsed.channel))) {
		throw new Error("Withdrawal is not available here");
	}
	let context = parsed;
	if (formData.get("integration") === "stub") context = { ...context, provider: "stub" };
	const { bcp47 } = resolveLocaleFromSlug(context.locale);
	const t = await getTranslations({ locale: context.locale, namespace: "withdraw" });
	const intent = readString(formData, "intent");
	const values = readValues(formData);

	// Order modes use the orders signed into the form at step 1; only without them (a tampered or
	// missing field) are they looked up again.
	let order: WithdrawableOrder | null = null;
	let orders: WithdrawableOrder[] = [];
	let ordersToken = readString(formData, "ordersToken");
	const snapshot = context.mode === "lookup" ? null : readSnapshot<WithdrawableOrder[]>(ordersToken);
	if (snapshot) {
		orders = snapshot;
		order =
			orders.find((candidate) => candidate.id === values.orderId) ?? (orders.length === 1 ? orders[0] : null);
	} else if (context.mode !== "lookup" && context.provider === "backend") {
		const orderId = values.orderId || null;
		const result = await lookupOrders(context, orderId, bcp47);
		if (!result.ok) {
			if (isIntegrationError(result.error)) {
				return detailsState({ ...context, mode: "lookup", provider: "stub" }, { ...values, orderId: "" }, []);
			}
			return detailsState(
				{ ...context, mode: "lookup" },
				{ ...values, orderId: "" },
				[],
				noticeFor(result.error),
			);
		}
		context = { ...context, mode: result.mode };
		orders = result.orders;
		ordersToken = signSnapshot(orders);
		order = orders.find((candidate) => candidate.id === orderId) ?? (orders.length === 1 ? orders[0] : null);
	} else {
		ordersToken = "";
	}
	const orderViews = orders.map((candidate) => toOrderView(candidate, bcp47, t));
	const postedToken = readString(formData, "token");
	const carried = { ordersToken, token: postedToken };

	if (intent === "back") return detailsState(context, values, orderViews, null, {}, carried);

	const detailErrors = validateDetails(context.mode, values, orders.length);
	if (Object.keys(detailErrors).length > 0) {
		return detailsState(context, values, orderViews, null, detailErrors, carried);
	}

	const scope =
		intent === "details"
			? { kind: "wholeOrder" as const, quantities: {}, text: "" }
			: readScope(formData, order);
	const statement = composeStatement(scope, order, values, bcp47, t);
	const orderView = order ? toOrderView(order, bcp47, t) : null;
	const review = (
		notice: WithdrawNotice | null = null,
		fieldErrors: Partial<Record<WithdrawField, WithdrawFieldError>> = {},
		token = readString(formData, "token") || createConfirmToken(),
		quiet = false,
	): WithdrawState => ({
		step: "review",
		context,
		values,
		order: orderView,
		ordersToken,
		scope,
		statement,
		token,
		fieldErrors,
		notice,
		quiet,
	});

	// Back and Continue keep the key: a retry after a lost response must not record twice.
	if (intent === "details")
		return review(null, {}, readConfirmToken(postedToken) ? postedToken : createConfirmToken());
	// Choosing items: refresh the statement, no errors yet, focus stays put.
	if (intent === "update") return review(null, {}, undefined, true);

	const scopeErrors = validateScope(scope);
	if (Object.keys(scopeErrors).length > 0) return review(null, scopeErrors);

	if (intent === "email" || context.provider === "stub") {
		return emailState(context, statement, order?.number ?? normalizeOrderNumber(values.orderNumber), t, null);
	}

	// Without JavaScript the statement is recomposed only on submit: record it only once shown.
	if (statement !== readString(formData, "statement")) return review("statementUpdated");

	const confirm = readConfirmToken(readString(formData, "token"));
	if (!confirm) return review("conflict", {}, createConfirmToken());

	let requester: Requester;
	if (context.mode === "lookup") {
		requester = {
			mode: "lookup",
			orderNumber: normalizeOrderNumber(values.orderNumber),
			orderEmail: values.email,
		};
	} else if (!order) {
		return detailsState(context, values, orderViews, null, { orderId: "orderRequired" }, carried);
	} else {
		const token = context.mode === "customer" ? await customerToken() : null;
		requester = token
			? { mode: "customer", customerAccessToken: token, orderId: order.id }
			: { mode: "orderLink", orderId: order.id };
	}

	const provider = getWithdrawalsProvider();
	const consumerIp = await getConsumerIp();
	const submit = (withRequester: Requester) =>
		provider.submit(
			{
				channel: context.channel,
				languageCode: bcp47,
				requester: withRequester,
				consumerName: values.name.trim(),
				confirmationEmail: values.email,
				scope: toContractScope(scope),
				statementText: statement,
				idempotencyKey: confirm.idempotencyKey,
				antiAbuse: { honeypot: readString(formData, "website"), formElapsedMs: confirm.elapsedMs },
			},
			{ consumerIp },
		);

	let result = await submit(requester);
	if (!result.ok && result.error.code === "CUSTOMER_TOKEN_INVALID" && order) {
		result = await submit({ mode: "orderLink", orderId: order.id });
	}

	if (result.ok) {
		const at = formatReceivedAt(result.value, bcp47);
		const links = await getLegalLinks(context.locale).catch(
			() => ({}) as Awaited<ReturnType<typeof getLegalLinks>>,
		);
		const page = links.withdrawal;
		const receiptScope = result.value.scope;
		return {
			step: "receipt",
			receivedDate: at.date,
			receivedTime: at.time,
			receivedZone: at.zone,
			orderNumber: result.value.orderNumber,
			scope:
				receiptScope.kind === "lines"
					? { kind: "lines", count: receiptScope.lines.reduce((sum, line) => sum + line.quantity, 0) }
					: { kind: receiptScope.kind },
			maskedEmail: maskEmail(values.email),
			late: result.value.late,
			withdrawalPage: page
				? { href: buildStorefrontPath(context.locale, context.channel, page.path), title: page.title }
				: null,
		};
	}

	const error = result.error;
	if (isIntegrationError(error)) {
		return emailState(
			context,
			statement,
			order?.number ?? normalizeOrderNumber(values.orderNumber),
			t,
			"unavailable",
		);
	}
	if (error.code === "NOT_MATCHED") {
		return detailsState(
			context,
			values,
			orderViews,
			"notMatched",
			{ orderNumber: "notMatched", email: "notMatched" },
			carried,
		);
	}
	if (error.code === "INVALID_INPUT") {
		const fieldErrors = fieldErrorsFromContract(error);
		const onDetails = fieldErrors.name || fieldErrors.email || fieldErrors.orderNumber;
		return onDetails
			? detailsState(context, values, orderViews, "invalid", fieldErrors, carried)
			: review("invalid", fieldErrors);
	}
	// Automation and conflicts start a fresh confirm step; others keep the key for "Try again".
	const freshToken = error.code === "SUSPECTED_AUTOMATION" || error.code === "IDEMPOTENCY_CONFLICT";
	return review(noticeFor(error), {}, freshToken ? createConfirmToken() : undefined);
}
