module.exports = {
  extends: ["checkout"],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  rules: {
    "formatjs/enforce-id": [
      "error",
      {
        idInterpolationPattern: "[folder]/[name]/[sha512:contenthash:base64:6]",
      },
    ],

    "import/no-restricted-paths": [
      "error",
      {
        basePath: __dirname,
        zones: [
          { target: "./", from: "../../packages/" },
          { target: "./", from: "../../apps/", except: ["./saleor-app-checkout/"] },
        ],
      },
    ],
  },
};
