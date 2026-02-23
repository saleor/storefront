/** @type {import('next').NextConfig} */
const config = {
	// Cache Components (Partial Prerendering)
	// Enables mixing static, cached, and dynamic content in a single route.
	// See: https://nextjs.org/docs/app/getting-started/cache-components
	cacheComponents: true,

	// Optimize barrel file imports for better bundle size and cold start performance
	// See: https://vercel.com/blog/how-we-optimized-package-imports-in-next-js
	experimental: {
		optimizePackageImports: ["lucide-react", "lodash-es"],
		// Note: API rate limiting is handled by RequestQueue in src/lib/graphql.ts
		// (max 3 concurrent requests + 200ms delay between requests)
	},
	images: {
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
			{
				// Static assets - cache for 1 year (immutable with hash in filename)
				source: "/_next/static/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
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

export default config;
