import { loadEnvConfig } from "@next/env";
import type { CodegenConfig } from '@graphql-codegen/cli';

loadEnvConfig(process.cwd());

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GRAPHQL_URL,
  documents: "graphql/**/*.graphql",
  generates: {
    "gql/": {
      preset: "client",
      plugins: [],
      config: {
        documentMode: 'string',
      },
      presetConfig: {
        fragmentMasking: false
      }
    }
  }
};

export default config;
