import { extensionOperations } from "./extensions";

/**
 * One entry per Saleor operation Paper ships.
 *
 * `cached` operations may also be read with `liveQuery` (filtered listings).
 * The reverse is rejected: a session read or a mutation cannot be cached.
 */

export type OperationAccess = "cached" | "live" | "session" | "mutate";
export type OperationAuth = "none" | "session" | "app";
export type CacheScope = "channel-locale" | "locale" | "global";

export type OperationSpec = {
	access: OperationAccess;
	auth: OperationAuth;
	scope?: CacheScope;
};

const cached = (scope: CacheScope, auth: OperationAuth = "none"): OperationSpec => ({
	access: "cached",
	auth,
	scope,
});
const live = (auth: OperationAuth = "none"): OperationSpec => ({ access: "live", auth });
const session = (): OperationSpec => ({ access: "session", auth: "session" });
const mutate = (auth: OperationAuth = "session"): OperationSpec => ({ access: "mutate", auth });

const CORE_OPERATIONS = {
	// Storefront catalog — cached, and readable live for the uncached long tail.
	ProductDetails: cached("channel-locale"),
	ProductVariantForPdp: cached("channel-locale"),
	ProductVariantsForPdp: cached("channel-locale"),
	ProductList: cached("channel-locale"),
	ProductListPaginated: cached("channel-locale"),
	ProductListByCategory: cached("channel-locale"),
	ProductListByCollection: cached("channel-locale"),
	PageGetBySlug: cached("locale"),
	MenuGetBySlug: cached("channel-locale"),
	StorefrontContentPages: cached("channel-locale"),
	CategoriesBySlug: cached("global"),
	ChannelsList: cached("global", "app"),
	SearchProducts: live(),

	// Storefront session reads.
	CurrentUser: session(),
	CurrentUserProfile: session(),
	CurrentUserOrderList: session(),
	CurrentUserOrdersPaginated: session(),
	OrderByNumber: session(),

	// Storefront cart and account mutations.
	CheckoutFind: live(),
	CheckoutCreate: mutate(),
	CheckoutAddLine: mutate(),
	CheckoutDeleteLines: mutate(),
	CheckoutLinesUpdate: mutate(),
	CheckoutCustomerDetach: mutate(),
	AccountUpdate: mutate(),
	PasswordChange: mutate(),
	AccountAddressCreate: mutate(),
	AccountAddressUpdate: mutate(),
	AccountAddressDelete: mutate(),
	AccountSetDefaultAddress: mutate(),
	AccountRequestDeletion: mutate(),

	// Checkout surface (operation names are the GraphQL names, not the TS exports).
	checkout: live(),
	checkoutCommerceContext: live(),
	channel: live(),
	addressValidationRules: live(),
	order: live(),
	ordersByNumber: live("app"),
	user: session(),
	checkoutLinesUpdate: mutate(),
	checkoutLineDelete: mutate(),
	checkoutEmailUpdate: mutate(),
	checkoutMetadataUpdate: mutate(),
	checkoutCustomerAttach: mutate(),
	checkoutCustomerDetach: mutate(),
	checkoutCreate: mutate(),
	checkoutLinesAdd: mutate(),
	checkoutShippingAddressUpdate: mutate(),
	checkoutBillingAddressUpdate: mutate(),
	checkoutDeliveryMethodUpdate: mutate(),
	checkoutAddPromoCode: mutate(),
	checkoutRemovePromoCode: mutate(),
	checkoutComplete: mutate(),
	deliveryOptionsCalculate: mutate(),
	paymentGatewaysInitialize: mutate(),
	transactionInitialize: mutate(),
	transactionProcess: mutate(),
	userRegister: mutate("none"),
	requestPasswordReset: mutate("none"),
	userAddressDelete: mutate(),
	userAddressUpdate: mutate(),
	userAddressCreate: mutate(),
	userSetDefaultAddress: mutate(),
} as const satisfies Record<string, OperationSpec>;

export type CoreOperationName = keyof typeof CORE_OPERATIONS;

export function getOperation(name: string): OperationSpec | undefined {
	const extension = extensionOperations[name];
	if (extension) return extension;
	return CORE_OPERATIONS[name as CoreOperationName];
}

export function listCoreOperations(): Readonly<Record<string, OperationSpec>> {
	return CORE_OPERATIONS;
}

export function operationNameFromDocument(operation: { toString(): string }): string {
	const name = operation.toString().match(/(?:query|mutation|subscription)\s+(\w+)/)?.[1];
	if (!name) {
		throw new Error(
			"[saleor] Could not read an operation name. Name the query or mutation in the .graphql document.",
		);
	}
	return name;
}

/**
 * Reject the calls that poison the cache. A cached catalog query may still be
 * read live (filter permutations). A session read or a mutation may not be cached.
 */
export function resolveOperationCall(name: string, via: OperationAccess): OperationSpec {
	const spec = getOperation(name);
	if (!spec) {
		throw new Error(
			`[saleor] "${name}" is not in the operation registry. Add it to src/lib/saleor/operations.ts ` +
				`(core) or src/config/data-extensions.ts (fork). See rules/data-access.md.`,
		);
	}

	const allowed =
		via === "cached"
			? spec.access === "cached"
			: via === "live"
				? spec.access === "live" || spec.access === "cached"
				: spec.access === via;

	if (!allowed) {
		throw new Error(
			`[saleor] "${name}" is registered as ${spec.access}/${spec.auth}. ` +
				`Do not call it via ${via}. ` +
				(spec.access === "mutate"
					? "Use mutate() from a server action."
					: spec.access === "session"
						? 'Use sessionQuery() — session reads must not enter "use cache".'
						: 'Use cachedQuery() inside "use cache", or liveQuery() for an uncached read.'),
		);
	}

	return spec;
}
