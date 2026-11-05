/** Opt-in for existing deployments; new storefronts enable this in .env.example. */
export function isStorefrontAgentsEnabled(): boolean {
	return process.env.STOREFRONT_AGENTS_ENABLED === "true";
}
