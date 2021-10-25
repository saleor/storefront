const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  reactStrictMode: true,

  images: {
    domains: ["vercel.saleor.cloud"],
  },
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
});
