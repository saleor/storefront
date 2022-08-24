module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "formatjs"],
  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  parserOptions: {
    project: ["tsconfig.json"],
  },
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
    react: {
      version: "999.999.999",
    },
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
    "array-callback-return": "error",
    "no-alert": ["error"],
    "no-debugger": ["error"],
    eqeqeq: ["error", "always", { null: "ignore" }],
    "@typescript-eslint/no-misused-promises": ["error"],
    "@typescript-eslint/no-floating-promises": ["error"],

    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          // allow {} even though it's unsafe but comes handy
          "{}": false,
        },
      },
    ],

    // we allow empty interfaces
    "no-empty-pattern": "off",
    "@typescript-eslint/no-empty-interface": "off",

    // we allow empty functions
    "@typescript-eslint/no-empty-function": "off",

    // we sometimes use async functions that don't await anything
    "@typescript-eslint/require-await": "off",

    // @todo
    "react/display-name": "off",
    "react/no-children-prop": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-misused-promises": "off",
  },
};
