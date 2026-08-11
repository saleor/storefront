import { defineConfig } from "vitest/config";
import path from "path";

/** Used only by `pnpm content:export-seed` — includes the export harness file. */
export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		setupFiles: ["./vitest.setup.ts"],
		include: ["src/lib/content/configurator-seed.export-harness.test.ts"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
