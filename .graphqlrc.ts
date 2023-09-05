
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://zaiste.saleor.cloud/graphql/",
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
