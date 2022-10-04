import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import json from "@rollup/plugin-json";
import image from "@rollup/plugin-image";
import dts from "rollup-plugin-dts";

const packageJson = require("./package.json");

const isProd = process.env.NODE_ENV === "production";

const __ = (arr) => arr.filter((x) => !!x);

export default [
  {
    input: "src/index.tsx",
    output: __([
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
        inlineDynamicImports: true,
      },
    ]),
    external: ["react", "react-dom", "graphql"],
    plugins: __([
      external(),
      resolve({
        browser: true,
        sourceMap: true,
      }),
      commonjs({ sourceMap: true }),
      typescript({
        tsconfig: "./tsconfig.json",
        noEmit: false,
        sourceMap: true,
        jsx: isProd ? "react-jsx" : "react-jsxdev",
      }),
      json(),
      image(),
      isProd && terser(),
      postcss({
        extract: true,
        plugins: [require("tailwindcss")(), require("autoprefixer")(), require("postcss-import")()],
      }),
    ]),
  },
  {
    input: "./dist/esm/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    external: [/\.css$/],
    plugins: [dts()],
  },
];
