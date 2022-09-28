module.exports = {
  root: true,
  extends: ["checkout"],
  rules: {
    "formatjs/enforce-id": [
      "error",
      {
        idInterpolationPattern: "[folder]/[name]/[sha512:contenthash:base64:6]",
      },
    ],
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
