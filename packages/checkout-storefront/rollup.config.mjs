import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import json from "@rollup/plugin-json";
import image from "@rollup/plugin-image";
import dts from "rollup-plugin-dts";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssImport from "postcss-import";
import packageJson from "./package.json" assert { type: "json" };

const isProd = process.env.NODE_ENV === "production";

const __ = (arr) => arr.filter((x) => !!x);

/**
 * @type {import('rollup').RollupOptions[]}
 */
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
        // Let Rollup resolve JSON modules via the @rollup/plugin-json
        resolveJsonModule: false,
      }),
      json({ preferConst: true, compact: true }),
      image(),
      isProd && terser(),
      postcss({
        extract: true,
        plugins: [tailwindcss(), autoprefixer(), postcssImport()],
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
