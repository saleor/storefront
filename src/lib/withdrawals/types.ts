/**
 * What a withdrawal provider takes and answers: how the /withdraw screens look up orders and
 * record a withdrawal, whatever backend does it. Paper ships only the `stub` provider (the email
 * route); a backend that records withdrawals and sends the receipt implements
 * `WithdrawalsProvider` with these types.
 */

export type CustomerRequester = { mode: "customer"; customerAccessToken: string; orderId?: string };
export type OrderLinkRequester = { mode: "orderLink"; orderId: string };
export type LookupRequester = { mode: "lookup"; orderNumber: string; orderEmail: string };
export type Requester = CustomerRequester | OrderLinkRequester | LookupRequester;

export type WithdrawalScope =
	| { kind: "wholeOrder" }
	| { kind: "lines"; lines: { lineId: string; quantity: number }[] }
	| { kind: "itemsDescription"; text: string };

export type WithdrawableLine = {
	id: string;
	productName: string;
	variantName: string | null;
	quantity: number;
	/** The quantity minus what earlier withdrawals already cover. */
	quantityWithdrawable: number;
	thumbnail: { url: string; alt: string | null } | null;
};

export type WithdrawalReceipt = {
	withdrawalId: string;
	orderNumber: string;
	/** ISO 8601 with the store's offset: the legal time of receipt. */
	receivedAt: string;
	/** IANA time zone of the store. */
	timeZone: string;
	scope: WithdrawalScope;
	statementText: string;
	late: boolean;
};

export type WithdrawableOrder = {
	id: string;
	number: string;
	createdAt: string;
	/** `null` while nothing has shipped. */
	periodEndsAt: string | null;
	withinPeriod: boolean | null;
	prefill: { name: string | null; email: string | null };
	lines: WithdrawableLine[];
	withdrawals: WithdrawalReceipt[];
};

export type LookupRequest = {
	channel: string;
	languageCode: string;
	requester: CustomerRequester | OrderLinkRequester;
};

export type LookupResponse = { orders: WithdrawableOrder[] };

export type SubmitRequest = {
	channel: string;
	languageCode: string;
	requester: Requester;
	consumerName: string;
	confirmationEmail: string;
	scope: WithdrawalScope;
	statementText: string;
	idempotencyKey: string;
	antiAbuse?: { honeypot?: string; formElapsedMs?: number };
};

export type SubmitResponse = WithdrawalReceipt & { duplicate: boolean; acknowledgement: "queued" };

export const WITHDRAWAL_ERROR_CODES = [
	"INVALID_INPUT",
	"UNAUTHORIZED",
	"CUSTOMER_TOKEN_INVALID",
	"NOT_ENABLED",
	"NOT_MATCHED",
	"IDEMPOTENCY_CONFLICT",
	"SUSPECTED_AUTOMATION",
	"RATE_LIMITED",
	"UNAVAILABLE",
] as const;
export type WithdrawalErrorCode = (typeof WITHDRAWAL_ERROR_CODES)[number];

export type WithdrawalError = {
	code: WithdrawalErrorCode;
	/** English, for logs only. */
	message?: string;
	fields?: { path: string; code: string }[];
	retryAfterSeconds?: number;
};
