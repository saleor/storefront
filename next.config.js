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
		serverActions: true,
		typedRoutes: false,
	},
};

export default config;
