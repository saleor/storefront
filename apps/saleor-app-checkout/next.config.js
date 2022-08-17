const withTM = require("next-transpile-modules")();

/** @type {import('next').NextConfig} */
module.exports = withTM({
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
});
