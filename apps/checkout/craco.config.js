const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@/icons": path.resolve(__dirname, "src/assets/icons/"),
      "@/images": path.resolve(__dirname, "src/assets/images/"),
      "@": path.resolve(__dirname, "src/"),
    },
  },
};
