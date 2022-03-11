const withTM = require("next-transpile-modules")(["@saleor/checkout"]);

module.exports = withTM({
  i18n: {
    locales: ["en-US", "pl-PL"],
    defaultLocale: "en-US",
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/channels",
        permanent: true,
      },
    ];
  },
});
