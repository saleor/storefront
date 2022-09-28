import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import json from "@rollup/plugin-json";
import image from "@rollup/plugin-image";
import dts from "rollup-plugin-dts";
import svg from "rollup-plugin-svg-import";

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
        sourcemap: isProd,
        inlineDynamicImports: true,
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
        overrideIdFn: "[sha512:contenthash:base64:6]",
        ast: true,
        tsconfig: "./tsconfig.json",
        noEmit: false,
        jsx: "react-jsx",
      }),
      json(),
      image(),
      isProd && terser(),
      postcss({
        extract: true,
        plugins: [require("tailwindcss")(), require("autoprefixer")(), require("postcss-import")()],
      }),
      svg({
        stringify: false,
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
