export const ProductsPerPage = 12;

/**
 * Default channel slug - REQUIRED for the storefront to work.
 *
 * Set via NEXT_PUBLIC_DEFAULT_CHANNEL environment variable.
 * Example: NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel
 */
export const DefaultChannelSlug = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL ?? null;
