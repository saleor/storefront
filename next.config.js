/** @type {import('next').NextConfig} */
const config = {
  images: {
    domains: ["zaiste.saleor.cloud"],
  },
  experimental: {
    serverActions: true,
    typedRoutes: false,
  },
};

export default config;
