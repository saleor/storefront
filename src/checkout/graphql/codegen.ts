/**
 * GraphQL Code Generator Configuration for Checkout
 *
 * Run: pnpm generate:checkout
 */
import { loadEnvConfig } from "@next/env";
import type { CodegenConfig } from "@graphql-codegen/cli";
import { existsSync } from "node:fs";

loadEnvConfig(process.cwd());

function getSchemaSource(): string | null {
	const configuredSchemaPath = process.env.SALEOR_SCHEMA_PATH;

	if (configuredSchemaPath && existsSync(configuredSchemaPath)) {
		return configuredSchemaPath;
	}

	const defaultSchemaPath = "schema.graphql";
	if (existsSync(defaultSchemaPath)) {
		return defaultSchemaPath;
	}

	return process.env.NEXT_PUBLIC_SALEOR_API_URL ?? null;
}

const schemaSource = getSchemaSource();

if (!schemaSource) {
	console.error(
		"Missing GraphQL schema source (NEXT_PUBLIC_SALEOR_API_URL or SALEOR_SCHEMA_PATH/schema.graphql)",
	);
	process.exit(1);
}

const config: CodegenConfig = {
	overwrite: true,
	schema: schemaSource,
	documents: "src/checkout/graphql/**/*.graphql",
	generates: {
		"src/checkout/graphql/generated/index.ts": {
			plugins: ["typescript", "typescript-operations", "typescript-urql"],
			config: {
				useTypeImports: true,
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
			},
		},
	},
};

export default config;
