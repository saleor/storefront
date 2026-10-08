/**
 * Browse root the specs run against. It needs products (more than one page) in that channel.
 * `E2E_BROWSE_PATH=/en/channel-pln` overrides it; otherwise it follows NEXT_PUBLIC_DEFAULT_CHANNEL.
 */
export const browsePath =
	process.env.E2E_BROWSE_PATH || `/en/${process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "default-channel"}`;
