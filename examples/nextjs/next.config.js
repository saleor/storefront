const withTM = require("next-transpile-modules")(["@saleor/checkout"]);

module.exports = withTM({
  reactStrictMode: true,
});
