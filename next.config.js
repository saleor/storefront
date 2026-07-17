/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";
import { paperCacheLifeProfiles } from "./src/lib/cache-life-profiles.data.mjs";

/** Hostnames for mobile/tunnel dev (ngrok, LAN). See ALLOWED_DEV_ORIGINS in .env.example */
const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS?.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const config = {
	...(allowedDevOrigins?.length ? { allowedDevOrigins } : {}),
	// Cache Components (Partial Prerendering)
	// Enables mixing static, cached, and dynamic content in a single route.
	// See: https://nextjs.org/docs/app/getting-started/cache-components
	cacheComponents: true,

	// Next.js 16.3 — prefetch one reusable loading shell per route (not per link).
	// See: https://nextjs.org/blog/next-16-3-instant-navigations
	partialPrefetching: true,

	// Named cacheLife tiers for `"use cache"` — see src/lib/cache-life-profiles.ts
	cacheLife: paperCacheLifeProfiles,

	// Optimize barrel file imports for better bundle size and cold start performance
	// See: https://vercel.com/blog/how-we-optimized-package-imports-in-next-js
	experimental: {
		optimizePackageImports: ["lucide-react", "lodash-es"],
		// Note: API rate limiting is handled by RequestQueue in src/lib/graphql.ts
		// (max 3 concurrent requests + 200ms delay between requests)
	},
	images: {
		// WebP only: AVIF cold-encodes add ~500ms+ to first /_next/image hit on Vercel (hurts LCP).
		formats: ["image/webp"],
		remotePatterns: [
			{
				// Saleor Cloud CDN
				hostname: "*.saleor.cloud",
			},
			{
				// Saleor Media (common pattern)
				hostname: "*.media.saleor.cloud",
			},
			{
				// Allow all hostnames in development (restrict in production)
				hostname: "*",
			},
		],
	},
	typedRoutes: false,

	// Used in the Dockerfile
	output:
		process.env.NEXT_OUTPUT === "standalone"
			? "standalone"
			: process.env.NEXT_OUTPUT === "export"
				? "export"
				: undefined,

	// Cache headers for static assets and API routes
	async headers() {
		const isDev = process.env.NODE_ENV === "development";
		return [
			// In development, prevent aggressive caching of dynamic chunks
			...(isDev
				? [
						{
							source: "/_next/static/chunks/:path*",
							headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
						},
					]
				: []),
			// Production only — immutable breaks Turbopack HMR when applied in dev
			// (stale action/chunk stubs → "module factory is not available").
			...(!isDev
				? [
						{
							source: "/_next/static/:path*",
							headers: [
								{
									key: "Cache-Control",
									value: "public, max-age=31536000, immutable",
								},
							],
						},
					]
				: []),
			{
				// Public folder assets - cache for 1 month (logos, favicons, etc.)
				source: "/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|webmanifest)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=2592000, stale-while-revalidate=31536000",
					},
				],
			},
			{
				// OG Image API - cache for 1 day
				source: "/api/og",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=86400, stale-while-revalidate=604800",
					},
				],
			},
		];
	},

	// Logging configuration
	logging: {
		fetches: {
			fullUrl: process.env.NODE_ENV === "development",
		},
	},
};

// next-intl powers code-owned UI/functional strings (messages/*.json). It does NOT own
// routing — our locale lives in the `[locale]` URL segment (ADR 0001). The request config
// resolves the locale we pass explicitly; see src/i18n/request.ts.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(config);
