const mainConfig = require("../tailwind.config");

module.exports = {
  ...mainConfig,
  safelist: [{ pattern: /.*/ }],
};
