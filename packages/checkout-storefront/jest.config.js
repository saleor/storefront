const { pathsToModuleNameMapper } = require("ts-jest");
const requireJSON = require("json-easy-strip");
const { compilerOptions } = requireJSON("./tsconfig.json");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testMatch: ["**/**/*.test.ts"],
  clearMocks: false,
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  modulePathIgnorePatterns: ["<rootDir>/dist", "<rootDir>/.rollup.cache"],
  preset: "ts-jest/presets/default-esm",
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: {
        ...compilerOptions,
        jsx: "react-jsx",
      },
    },
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!url-join)"],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: "<rootDir>/",
    }),
    "^lodash-es$": "lodash",
    "^lodash-es/(.*)$": "lodash/$1",
  },
  testEnvironment: "jsdom",
};
