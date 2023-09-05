/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['zaiste.saleor.cloud'],
  },
  experimental: {
    serverActions: true,
    mdxRs: true,
  }
}

module.exports = nextConfig
