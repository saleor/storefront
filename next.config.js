const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const apiURL = new URL(process.env.NEXT_PUBLIC_API_URI);

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [apiURL.hostname, "img.youtube.com"],
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
    reactRoot: true,
  },
});
