module.exports = {
  extends: ["checkout", "next"],
  parserOptions: {
    tsconfigRootDir: "./",
    project: ["./tsconfig.json"],
  },
  settings: {
    next: {
      rootDir: ["."],
    },
  },
  rules: {
    "require-await": ["error"],
  },
};
