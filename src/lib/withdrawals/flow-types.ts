/**
 * State of the /withdraw screens, shared by the server (page and action) and the client form.
 * Everything a step needs travels in the form's fields, so the flow works without JavaScript:
 * the action never relies on the previous state.
 */

export type WithdrawMode = "lookup" | "orderLink" | "customer";
export type WithdrawField = "name" | "email" | "orderNumber" | "orderId" | "lines" | "itemsText";
export type WithdrawFieldError =
	| "nameRequired"
	| "nameTooLong"
	| "emailInvalid"
	| "orderNumberInvalid"
	| "orderRequired"
	| "linesRequired"
	| "itemsTextRequired"
	| "itemsTextTooLong"
	| "notMatched";
export type WithdrawNotice =
	| "notMatched"
	| "rateLimited"
	| "unavailable"
	| "automation"
	| "conflict"
	| "statementUpdated"
	| "noOrders"
	| "invalid";

export type WithdrawContext = {
	locale: string;
	channel: string;
	mode: WithdrawMode;
	/** `stub` when no backend records withdrawals (or it refused this storefront). */
	provider: "backend" | "stub";
};

export type WithdrawValues = { name: string; email: string; orderNumber: string; orderId: string };

export type WithdrawLineView = {
	id: string;
	productName: string;
	variantName: string | null;
	quantity: number;
	quantityWithdrawable: number;
	thumbnailUrl: string | null;
	thumbnailAlt: string | null;
};

export type WithdrawOrderView = {
	id: string;
	number: string;
	createdAtLabel: string;
	/** `unknown`: the store has not set when the period ends; nothing is said. */
	period:
		| { kind: "endsOn"; date: string }
		| { kind: "notStarted" }
		| { kind: "mayHaveEnded" }
		| { kind: "unknown" };
	lines: WithdrawLineView[];
	/** Earlier withdrawals, one formatted line each. */
	earlier: { date: string; time: string; items: string }[];
	fullyWithdrawn: boolean;
};

export type WithdrawScopeInput = {
	kind: "wholeOrder" | "lines" | "itemsDescription";
	quantities: Record<string, number>;
	text: string;
};

export type WithdrawState =
	| {
			step: "details";
			context: WithdrawContext;
			values: WithdrawValues;
			orders: WithdrawOrderView[];
			/** The looked-up orders, signed; later steps read them instead of looking them up again. */
			ordersToken: string;
			/** The confirm step's token, kept across Back so a retry reuses the idempotency key. */
			token: string;
			fieldErrors: Partial<Record<WithdrawField, WithdrawFieldError>>;
			notice: WithdrawNotice | null;
	  }
	| {
			step: "review";
			context: WithdrawContext;
			values: WithdrawValues;
			order: WithdrawOrderView | null;
			ordersToken: string;
			scope: WithdrawScopeInput;
			statement: string;
			token: string;
			fieldErrors: Partial<Record<WithdrawField, WithdrawFieldError>>;
			notice: WithdrawNotice | null;
			/** A statement refresh while choosing: the screen keeps focus where it is. */
			quiet: boolean;
	  }
	| {
			step: "receipt";
			receivedDate: string;
			receivedTime: string;
			receivedZone: string;
			orderNumber: string;
			scope: { kind: "wholeOrder" } | { kind: "lines"; count: number } | { kind: "itemsDescription" };
			maskedEmail: string;
			late: boolean;
			withdrawalPage: { href: string; title: string } | null;
	  }
	| {
			step: "email";
			context: WithdrawContext;
			statement: string;
			sellerEmail: string | null;
			mailtoHref: string | null;
			notice: WithdrawNotice | null;
	  };
