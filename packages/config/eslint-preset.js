module.exports = {
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
    "no-restricted-syntax": [
      "error",
      {
        selector: "ForInStatement",
        message: "for ... in disallowed, use for ... of instead",
      },
    ],
  },
};
