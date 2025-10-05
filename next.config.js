/** @type {import('next').NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{
				hostname: "*",
			},
			{
				protocol: 'https',
				hostname: '20pack.ir',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'saleor.20pack.ir', // It's a good idea to add this too
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'media.20pack.ir', // And the media subdomain
				port: '',
				pathname: '/**',
			},
		],
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
