/* eslint-disable import/no-anonymous-default-export */
const { pathsToModuleNameMapper } = require("ts-jest");
const requireJSON = require("json-easy-strip");
const { compilerOptions } = requireJSON("./tsconfig.json");

delete compilerOptions.paths["react"];

module.exports = {
  clearMocks: false,
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: "<rootDir>/",
    }),
    "^lodash-es/(.*)$": "lodash/$1",
  },
  setupFiles: ["./setupTestsBeforeEnv"],
  setupFilesAfterEnv: ["./setupTestsAfterEnv"],
  testEnvironment: "setup-polly-jest/jest-environment-node",
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!lodash-es)"],
};
