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
    // your project has type errors like no unsafe call
    "@typescript-eslint/no-unsafe-call": "off",
    // !! WARN !!
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
