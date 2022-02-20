const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["vercel.saleor.cloud", "img.youtube.com"],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/",
        // TODO: Investigate why constants from project cannot be imported
        // User should be redirected to the defaults defined in @lib/regions
        destination: "/default-channel/en-US",
        permanent: false,
      },
    ];
  },
  experimental: {
    reactRoot: true
  },
});
