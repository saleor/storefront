/**
 * GraphQL Code Generator Configuration for Checkout
 *
 * Run: pnpm generate:checkout
 */
import { loadEnvConfig } from "@next/env";
import type { CodegenConfig } from "@graphql-codegen/cli";

loadEnvConfig(process.cwd());

const schemaUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;

if (!schemaUrl) {
	console.error("Missing NEXT_PUBLIC_SALEOR_API_URL environment variable");
	process.exit(1);
}

const scalarConfig = {
	strictScalars: true,
	enumsAsTypes: true,
	scalars: {
		Date: "string",
		DateTime: "string",
		Day: "number",
		Decimal: "number",
		GenericScalar: "unknown",
		JSON: "any",
		JSONString: "string",
		Metadata: "Record<string, string>",
		Hour: "number",
		Minute: "number",
		PositiveInt: "number",
		PositiveDecimal: "number",
		UUID: "string",
		Upload: "unknown",
		WeightScalar: "unknown",
		_Any: "unknown",
	},
} as const;

const config: CodegenConfig = {
	overwrite: true,
	schema: schemaUrl,
	documents: "src/checkout/graphql/**/*.graphql",
	generates: {
		// Server-safe types + gql documents (no urql hooks / React context).
		"src/checkout/graphql/generated/operations.ts": {
			plugins: ["typescript", "typescript-operations", "typescript-urql"],
			config: {
				useTypeImports: true,
				documentMode: "graphQLTag",
				withHooks: false,
				withComponent: false,
				...scalarConfig,
			},
		},
		// Client-only urql hooks; types and documents come from operations.ts.
		"src/checkout/graphql/generated/index.ts": {
			plugins: ["typescript-urql"],
			config: {
				useTypeImports: true,
				documentMode: "external",
				importOperationTypesFrom: "Operations",
				importDocumentNodeExternallyFrom: "./operations",
				...scalarConfig,
			},
		},
	},
};

export default config;
