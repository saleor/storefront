const { withSentryConfig } = require("@sentry/nextjs");
const withTM = require("next-transpile-modules")();

/** @type {import('next').NextConfig} */
module.exports = withSentryConfig(
  withTM({
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
    images: { domains: ["localhost"] },
    experimental: {
      esmExternals: false,
    },
    eslint: {
      dirs: ["pages", "backend", "frontend", "config"],
    },
    assetPrefix: process.env.NEXT_PUBLIC_CHECKOUT_APP_URL,
  }),
  {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore

    silent: true, // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
  }
);
