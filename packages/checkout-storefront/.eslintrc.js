module.exports = {
  root: true,
  ignorePatterns: ["next-env.d.ts"],
  extends: ["checkout"],
  rules: {
    "@next/next/no-img-element": "off",
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
