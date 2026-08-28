/**
 * Browser Cache-Control for same-origin files under `/public`.
 *
 * Next.js defaults unmatched responses to `public, max-age=0, must-revalidate`
 * (document caching). A hero video that misses this list is re-downloaded on
 * every visit and billed as Fast Data Transfer.
 *
 * Keep an allowlist — a catch-all `*.*` would also pin `/sitemap.xml` and
 * `/robots.txt` for a month if those App Router routes are added later.
 *
 * Catalog and CMS media should not live in `/public`: serve them from Saleor's
 * CDN (see the `ui-images` rule). This list is the guardrail for leftovers.
 */

export const PUBLIC_ASSET_FILE_EXTENSIONS = [
	"ico",
	"png",
	"jpg",
	"jpeg",
	"gif",
	"svg",
	"webp",
	"avif",
	"woff",
	"woff2",
	"ttf",
	"otf",
	"eot",
	"webmanifest",
	"mp3",
	"ogg",
	"wav",
	"mp4",
	"webm",
	"mov",
	"m4v",
];

/** 30 days fresh, then stale-while-revalidate for a year. */
export const PUBLIC_ASSET_CACHE_CONTROL = "public, max-age=2592000, stale-while-revalidate=31536000";

/** `headers().source` for `next.config.js` — path-to-regexp, not a JS RegExp. */
export function publicAssetCacheHeaderSource() {
	return `/(.*)\\.(${PUBLIC_ASSET_FILE_EXTENSIONS.join("|")})`;
}

/** Same membership test as the header source: last path segment's extension. */
export function isPublicAssetCachePath(pathname) {
	const base = (pathname.split("?")[0] ?? "").toLowerCase();
	const slash = base.lastIndexOf("/");
	const filename = slash === -1 ? base : base.slice(slash + 1);
	const dot = filename.lastIndexOf(".");
	if (dot <= 0 || dot === filename.length - 1) return false;
	return PUBLIC_ASSET_FILE_EXTENSIONS.includes(filename.slice(dot + 1));
}
