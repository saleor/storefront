/** @type {import('next').NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{
				hostname: "*",
			},
		],
		// Disable image optimization to prevent IPv6 localhost resolution issues in Docker
		unoptimized: true,
	},
	experimental: {
		typedRoutes: false,
	},
	// used in the Dockerfile
	output:
		process.env.NEXT_OUTPUT === "standalone"
			? "standalone"
			: process.env.NEXT_OUTPUT === "export"
				? "export"
				: undefined,
	// Disable minification and show detailed errors for debugging
	swcMinify: false,
	productionBrowserSourceMaps: true,
	compiler: {
		removeConsole: false,
	},
	// Force development-like error reporting in production
	env: {
		NODE_ENV: "development",
	},
	// Override webpack config to disable minification
	webpack: (config, { dev, isServer }) => {
		if (!dev) {
			// Disable minification in production
			config.optimization.minimize = false;
		}
		return config;
	},
};

export default config;
