const { withSentryConfig } = require("@sentry/nextjs");
const withTM = require("next-transpile-modules")([
  "@saleor/checkout-storefront",
  "checkout-common",
]);

const isSentryEnabled = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

const checkoutEmbededInStorefrontPath = "/saleor-app-checkout";

/** @type {import('next').NextConfig} */
const config = withTM({
  trailingSlash: true,
  i18n: {
    locales: ["en-US", "pl-PL", "fr-FR", "vi-VN"],
    defaultLocale: "en-US",
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/channels/",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/_next/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
      // required for when Checkout is proxied via the Storefront
      {
        source: `${checkoutEmbededInStorefrontPath}/_next/:path*`,
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // required for when Checkout is proxied via the Storefront
        {
          source: `${checkoutEmbededInStorefrontPath}/:path*`,
          destination: `/:path*`,
        },
      ],
    };
  },
  images: { domains: ["localhost"] },
  experimental: {
    // https://nextjs.org/docs/messages/import-esm-externals
    esmExternals: "loose",
    externalDir: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  assetPrefix: `${checkoutEmbededInStorefrontPath}`,
  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: false,
  },
});

module.exports = isSentryEnabled
  ? withSentryConfig(config, {
      // Additional config options for the Sentry Webpack plugin. Keep in mind that
      // the following options are set automatically, and overriding them is not
      // recommended:
      //   release, url, org, project, authToken, configFile, stripPrefix,
      //   urlPrefix, include, ignore

      silent: true, // Suppresses all logs
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options.
    })
  : config;
