const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@/checkout/icons": path.resolve(__dirname, "src/assets/icons/"),
      "@/checkout/images": path.resolve(__dirname, "src/assets/images/"),
      "@/checkout": path.resolve(__dirname, "src/"),
    },
  },
};
