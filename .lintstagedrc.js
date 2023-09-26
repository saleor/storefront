// https://nextjs.org/docs/basic-features/eslint#lint-staged

import path from "path";

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

export default {
  "*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}": [buildEslintCommand],
  "*.*": "prettier --write --ignore-unknown",
};
