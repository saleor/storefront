import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const requiredGeneratedFiles = ["src/gql/graphql.ts", "src/checkout/graphql/generated/index.ts"];

const result = spawnSync("pnpm", ["run", "generate:all"], {
	stdio: "inherit",
	env: process.env,
});

if (result.status === 0) {
	process.exit(0);
}

const missingFiles = requiredGeneratedFiles.filter((filePath) => !existsSync(filePath));

if (missingFiles.length === 0) {
	console.warn(
		"[codegen] generate:all failed. Continuing build with committed generated GraphQL artifacts.\n" +
			"         Ensure codegen passes in CI before deploying.",
	);
	process.exit(0);
}

console.error("[codegen] generate:all failed and required generated files are missing:");
for (const filePath of missingFiles) {
	console.error(` - ${filePath}`);
}

process.exit(result.status ?? 1);
