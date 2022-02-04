const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@components": path.resolve(__dirname, "src/components/"),
      "@sections": path.resolve(__dirname, "src/sections/"),
      "@icons": path.resolve(__dirname, "src/assets/icons/"),
      "@assets": path.resolve(__dirname, "src/assets/"),
      "@graphql": path.resolve(__dirname, "src/graphql"),
    },
  },
};
