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
  },
};
