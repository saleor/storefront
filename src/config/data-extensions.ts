/**
 * Fork-owned data-layer extensions.
 *
 * Add cache profiles, webhook scopes, and operation registry entries here.
 * Do not edit `src/lib/saleor/`. Upstream Paper replaces that directory wholesale.
 *
 * GraphQL fields belong in `src/graphql/extensions/*.graphql`, spread by the
 * core documents. Loaders that are yours alone belong in `src/lib/custom/`.
 */

export type DataExtensionCacheProfile = {
	readonly id: string;
	readonly label: string;
	readonly cacheProfile: "catalog" | "menus" | "channels";
	readonly tagPattern: string;
	readonly pathPattern: string | null;
	readonly sharedTag?: string;
	readonly sharedTagPattern?: string;
};

export type DataExtensionWebhookScope = {
	entity: "product" | "category" | "collection" | "page" | "menu" | "channel";
	affectsListing: boolean;
};

export type DataExtensionOperation = {
	access: "cached" | "live" | "session" | "mutate";
	auth: "none" | "session" | "app";
	scope?: "channel-locale" | "locale" | "global";
};

export const dataExtensions: {
	profiles: Record<string, DataExtensionCacheProfile>;
	webhookScopes: Record<string, DataExtensionWebhookScope>;
	operations: Record<string, DataExtensionOperation>;
} = {
	profiles: {},
	webhookScopes: {},
	operations: {},
};
