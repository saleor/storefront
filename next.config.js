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
	// Override webpack config to disable minification and show detailed errors
	webpack: (config, { dev, isServer }) => {
		if (!dev) {
			// Disable minification in production
			config.optimization.minimize = false;
			// Disable mangling to keep function names readable
			if (config.optimization.minimizer) {
				config.optimization.minimizer = [];
			}
		}
		return config;
	},
};

export default config;
