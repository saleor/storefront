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

    "import/no-restricted-paths": [
      "error",
      {
        basePath: __dirname,
        zones: [
          { target: "./", from: "../../apps/" },
          { target: "./", from: "../../packages/", except: ["./checkout-storefront/"] },
        ],
      },
    ],
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
