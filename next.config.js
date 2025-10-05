/** @type {import('next').NextConfig} */
const config = {


	images: {
		domains: [
			'media.20pack.ir', // اضافه به عنوان fallback سریع‌تر
		],

		remotePatterns: [
			{
				protocol: 'https',
				hostname: '20pack.ir',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'saleor.20pack.ir',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'media.20pack.ir',
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
