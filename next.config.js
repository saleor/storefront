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
	},
	// Add detailed logging
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	// used in the Dockerfile
	output:
		process.env.NEXT_OUTPUT === "standalone"
			? "standalone"
			: process.env.NEXT_OUTPUT === "export"
				? "export"
				: undefined,
	reactStrictMode: true,
	// Force Next.js to listen on all interfaces (0.0.0.0)
	webServerConfig: {
		hostname: "0.0.0.0",
	},
};

export default config;
