/** @type {import('next').NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{
				hostname: "*",
			},
		],
		formats: ["image/avif", "image/webp"],
		// Optimized for actual image sizes used in the storefront
		deviceSizes: [640, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 112, 128, 144, 256, 384],
		qualities: [75, 85],
		minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
	},
	experimental: {
		optimizePackageImports: ["lucide-react", "@headlessui/react", "react-toastify"],
		cacheComponents: true, // ✅ Enabled with Next.js canary for NextFaster-style performance (PPR)
		optimizeCss: true, // Optimize CSS output and reduce chunks
	},
	// Modern browser target - reduces polyfills significantly
	compiler: {
		removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
	},
	// Configure transpilation to target modern browsers only
	// This tells Next.js to skip unnecessary polyfills
	transpilePackages: [],
	// Better tree shaking for common libraries
	modularizeImports: {
		lodash: {
			transform: "lodash/{{member}}",
		},
		"lodash-es": {
			transform: "lodash-es/{{member}}",
		},
	},
	typedRoutes: false,
	compress: true,
	poweredByHeader: false,
	reactStrictMode: true,
	// used in the Dockerfile
	output:
		process.env.NEXT_OUTPUT === "standalone"
			? "standalone"
			: process.env.NEXT_OUTPUT === "export"
				? "export"
				: undefined,
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
					},
					// CSP removed - managed by proxy/CDN
					// {
					// 	key: "Content-Security-Policy",
					// 	value: [
					// 		"default-src 'self'",
					// 		"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://challenges.cloudflare.com",
					// 		"style-src 'self' 'unsafe-inline'",
					// 		"img-src 'self' data: https: blob:",
					// 		"font-src 'self' data:",
					// 		"connect-src 'self' https://api.stripe.com https://saleor-api.sonicdrivestudio.com https://*.saleor.cloud wss://*.saleor.cloud",
					// 		"frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com",
					// 		"worker-src 'self' blob:",
					// 		"object-src 'none'",
					// 		"base-uri 'self'",
					// 		"form-action 'self'",
					// 		"frame-ancestors 'self'",
					// 		"upgrade-insecure-requests",
					// 	].join("; "),
					// },
				],
			},
			// Cache static assets aggressively
			{
				source: "/fonts/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/_next/static/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/site.webmanifest",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=86400, stale-while-revalidate=604800",
					},
				],
			},
			// Cache optimized images from Next.js
			{
				source: "/_next/image(.*)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, stale-while-revalidate",
					},
				],
			},
			// Ensure proper MIME types for CSS
			{
				source: "/_next/static/css/:path*",
				headers: [
					{
						key: "Content-Type",
						value: "text/css; charset=utf-8",
					},
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			// Ensure proper MIME types for CSS chunks
			{
				source: "/_next/static/chunks/:path*.css",
				headers: [
					{
						key: "Content-Type",
						value: "text/css; charset=utf-8",
					},
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			// Ensure proper MIME types for JavaScript (only .js files to avoid overriding CSS)
			{
				source: "/_next/static/chunks/:path*.js",
				headers: [
					{
						key: "Content-Type",
						value: "application/javascript; charset=utf-8",
					},
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},
};

export default config;
