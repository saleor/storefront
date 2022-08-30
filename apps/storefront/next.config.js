// eslint-disable-next-line
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const apiURL = new URL(process.env.NEXT_PUBLIC_API_URI);
const allowedImageDomains = process.env.NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS
  ? process.env.NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS.split(",")
  : [];

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [apiURL.hostname, ...allowedImageDomains],
    formats: ["image/avif", "image/webp"],
  },
  trailingSlash: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "x-content-type-options",
            value: "nosniff",
          },
          { key: "x-xss-protection", value: "1" },
          { key: "x-frame-options", value: "DENY" },
          {
            key: "strict-transport-security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
  async rewrites() {
    const cloudDeploymentUrl = process.env.CLOUD_DEPLOYMENT_URL;

    return [
      {
        source: "/checkout",
        destination: `${process.env.NEXT_PUBLIC_CHECKOUT_URL}`,
      },
      {
        source: "/saleor-app-checkout",
        destination: `${process.env.NEXT_PUBLIC_CHECKOUT_APP_URL}`,
      },
      {
        source: "/saleor-app-checkout/:path*",
        destination: `${process.env.NEXT_PUBLIC_CHECKOUT_APP_URL}/:path*`,
      },
      ...(cloudDeploymentUrl
        ? [
            {
              source: "/media/:match*",
              destination: `${cloudDeploymentUrl}/media/:match*`,
            },
            {
              source: "/dashboard/:match*",
              destination: `${cloudDeploymentUrl}/dashboard/:match*`,
            },
            {
              source: "/graphql/:match*",
              destination: `${cloudDeploymentUrl}/graphql/:match*`,
            },
            {
              source: "/graphql/",
              destination: `${cloudDeploymentUrl}/graphql/`,
            },
            {
              source: "/plugins/:match*",
              destination: `${cloudDeploymentUrl}/plugins/:match*`,
            },
            {
              source: "/digital-download/:match*",
              destination: `${cloudDeploymentUrl}/digital-download/:match*`,
            },
            {
              source: "/thumbnail/:match*",
              destination: `${cloudDeploymentUrl}/thumbnail/:match*`,
            },
            {
              source: "/.well-known/jwks.json",
              destination: `${cloudDeploymentUrl}/.well-known/jwks.json`,
            },
          ]
        : []),
    ];
  },
  experimental: {},
});
