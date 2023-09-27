import { loadEnvConfig } from "@next/env";
import type { CodegenConfig } from "@graphql-codegen/cli";

loadEnvConfig(process.cwd());

const config: CodegenConfig = {
	overwrite: true,
	schema: process.env.SALEOR_API_URL,
	documents: "src/graphql/**/*.graphql",
	generates: {
		"src/gql/": {
			preset: "client",
			plugins: [],
			config: {
				documentMode: "string",
			},
			presetConfig: {
				fragmentMasking: false,
			},
		},
	},
};

export default config;
