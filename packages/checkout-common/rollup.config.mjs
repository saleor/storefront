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

export default [
  {
    input: "src/index.ts",
    output: __([
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: isProd,
      },
      isProd && {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
    ]),
    external: ["react", "react-dom", "graphql"],
    plugins: __([
      external(),
      resolve({
        browser: true,
      }),
      commonjs({ sourceMap: isProd }),
      typescript({
        tsconfig: "./tsconfig.json",
        noEmit: false,
        jsx: "react-jsx",
        // Let Rollup resolve JSON modules via the @rollup/plugin-json
        resolveJsonModule: false,
      }),
      json(),
      image(),
      isProd && terser(),
      postcss({
        extract: true,
        plugins: [tailwindcss, autoprefixer, postcssImport],
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
