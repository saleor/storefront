module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: "./",
    project: ["./tsconfig.json"],
  },
  plugins: ["@typescript-eslint"],
  extends: ["prettier"],
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
  },
  rules: {
    "array-callback-return": "error",
    "no-alert": ["error"],
    "no-debugger": ["error"],
    eqeqeq: ["error", "always", { null: "ignore" }],
    "require-await": ["error"],
    "no-restricted-syntax": [
      "error",
      {
        selector: "ForInStatement",
        message: "for ... in disallowed, use for ... of instead",
      },
    ],
    "@typescript-eslint/no-misused-promises": ["error"],
    "@typescript-eslint/no-floating-promises": ["error"],
  },
};
