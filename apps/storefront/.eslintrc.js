module.exports = {
  root: true,
  extends: ["checkout"],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },

  ignorePatterns: ["saleor/api.tsx", "pnpm-lock.yaml", "graphql.schema.json", "lib/$path.ts"],

  rules: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "jsx-a11y/alt-text": "off",
    "import/no-restricted-paths": [
      "error",
      {
        basePath: __dirname,
        zones: [
          { target: "./", from: "../../packages/" },
          { target: "./", from: "../../apps/", except: ["./storefront/"] },
        ],
      },
    ],
  },
};
