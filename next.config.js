/** @type {import('next').NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{
				hostname: "*",
			},
		],
	},
	experimental: {
		typedRoutes: false,
		skipTrailingSlashRedirect: true,
	},
	// used in the Dockerfile
	output:
		process.env.NEXT_OUTPUT === "standalone"
			? "standalone"
			: process.env.NEXT_OUTPUT === "export"
			  ? "export"
			  : undefined,
	// Skip static generation during build for dynamic routes
	generateBuildId: async () => {
		return 'build-' + Date.now()
	},
	// Disable static optimization for dynamic routes during build
	trailingSlash: false,
};

export default config;
