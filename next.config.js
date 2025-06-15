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
};

export default config;
