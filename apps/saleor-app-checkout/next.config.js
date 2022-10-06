const { withSentryConfig } = require("@sentry/nextjs");
const withTM = require("next-transpile-modules")([
  "@saleor/checkout-storefront",
  "checkout-common",
]);
const { localhostHttp } = require("./utils/configUtils");

const isSentryEnabled =
  process.env.SENTRY_DSN && process.env.SENTRY_ENVIRONMENT && process.env.SENTRY_RELEASE;

/** @type {import('next').NextConfig} */
const config = withTM({
  trailingSlash: true,
  i18n: {
    locales: ["en-US", "pl-PL", "fr-FR", "vi-VN"],
    defaultLocale: "en-US",
  },
  reactStrictMode: true,
  // eslint-disable-next-line require-await
  async redirects() {
    return [
      {
        source: "/",
        destination: "/channels",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/_next/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
  images: { domains: ["localhost"] },
  experimental: {
    // https://nextjs.org/docs/messages/import-esm-externals
    esmExternals: "loose",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  assetPrefix: localhostHttp(process.env.NEXT_PUBLIC_CHECKOUT_APP_URL),
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
