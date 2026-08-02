/**
 * Storefront channel configuration.
 *
 * Saleor may have many channels (B2B, internal, regional) that should not all
 * become storefront routes. Prefer an explicit allowlist via STOREFRONT_CHANNELS.
 *
 * Resolution order (see getStorefrontChannelSlugs in channel-slugs.ts):
 * 1. STOREFRONT_CHANNELS — comma-separated allowlist (recommended for production)
 * 2. STOREFRONT_DISCOVER_CHANNELS=true + SALEOR_APP_TOKEN — fetch all active from API
 * 3. NEXT_PUBLIC_DEFAULT_CHANNEL only — single-channel storefront
 */

function getDefaultChannelSlug(): string | null {
	return process.env.NEXT_PUBLIC_DEFAULT_CHANNEL ?? null;
}

function parseEnvChannelList(raw: string | undefined): string[] | null {
	if (!raw?.trim()) return null;

	const slugs = raw
		.split(",")
		.map((slug) => slug.trim())
		.filter(Boolean);

	return slugs.length > 0 ? [...new Set(slugs)] : null;
}

/** Explicit storefront allowlist from STOREFRONT_CHANNELS, if set. */
export function getConfiguredStorefrontChannelSlugs(): string[] | null {
	return parseEnvChannelList(process.env.STOREFRONT_CHANNELS);
}

/** Opt-in API discovery — off by default to avoid exposing every Saleor channel. */
export function isStorefrontChannelDiscoveryEnabled(): boolean {
	const value = process.env.STOREFRONT_DISCOVER_CHANNELS;
	return value === "true" || value === "1";
}

/** True when channel slugs must be resolved via Saleor API (no static allowlist). */
export function needsAsyncChannelDiscovery(): boolean {
	return (
		!getConfiguredStorefrontChannelSlugs() &&
		isStorefrontChannelDiscoveryEnabled() &&
		Boolean(process.env.SALEOR_APP_TOKEN)
	);
}

function warnIfDefaultChannelMissingFromAllowlist(allowed: readonly string[]) {
	const defaultSlug = getDefaultChannelSlug();
	if (defaultSlug && allowed.length > 0 && !allowed.includes(defaultSlug)) {
		console.warn(
			`[Channels] NEXT_PUBLIC_DEFAULT_CHANNEL "${defaultSlug}" is not in STOREFRONT_CHANNELS. ` +
				"The root redirect targets a channel that is not exposed in the storefront.",
		);
	}
}

/** Sync resolution — configured allowlist or default channel only. */
export function getStaticStorefrontChannelSlugs(): string[] {
	const configured = getConfiguredStorefrontChannelSlugs();
	if (configured) {
		warnIfDefaultChannelMissingFromAllowlist(configured);
		return configured;
	}

	const defaultSlug = getDefaultChannelSlug();
	return defaultSlug ? [defaultSlug] : [];
}

export function isAllowedStorefrontChannel(slug: string, allowedSlugs: readonly string[]): boolean {
	return allowedSlugs.includes(slug);
}

export function filterToStorefrontChannels<T extends { slug: string; isActive?: boolean | null }>(
	channels: T[],
	allowedSlugs: readonly string[],
): T[] {
	const allowed = new Set(allowedSlugs);
	return channels.filter((channel) => channel.isActive !== false && allowed.has(channel.slug));
}

export type ChannelSelectOption = {
	id: string;
	name: string;
	slug: string;
	currencyCode: string;
};

/** Active storefront channels only — slim shape for the footer client selector. */
export function toChannelSelectOptions(
	channels: Array<ChannelSelectOption & { isActive?: boolean | null }>,
	allowedSlugs: readonly string[],
): ChannelSelectOption[] {
	return filterToStorefrontChannels(channels, allowedSlugs).map(({ id, name, slug, currencyCode }) => ({
		id,
		name,
		slug,
		currencyCode,
	}));
}

/** Whether the footer needs channel metadata from Saleor (multi-channel + app token). */
export function shouldFetchChannelMetadata(allowedSlugs: readonly string[]): boolean {
	return allowedSlugs.length > 1 && Boolean(process.env.SALEOR_APP_TOKEN);
}
