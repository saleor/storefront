import type { KnipConfig } from "knip";

const config: KnipConfig = {
	// Entry points
	entry: [
		"src/app/**/{page,layout,loading,error,not-found,route}.{ts,tsx}",
		"src/app/api/**/route.ts",
		"src/checkout/Root.tsx",
	],

	// Project files to analyze
	project: ["src/**/*.{ts,tsx}"],

	// Ignore patterns
	ignore: [
		// Generated files
		"src/gql/**",
		"src/checkout/graphql/generated/**",
		// Reference code (kept for documentation, excluded from build)
		"src/_reference/**",
		// Codegen configs (run via CLI, not imported)
		"src/checkout/graphql/codegen.ts",
	],

	// Ignore specific dependencies (used at runtime or by framework)
	ignoreDependencies: [
		"sharp", // Used by Next.js image optimization at runtime
	],

	// Next.js plugin understands App Router conventions
	next: {
		entry: [
			"next.config.{js,ts,mjs}",
			"src/app/**/{page,layout,loading,error,not-found,route,template,default}.{js,ts,jsx,tsx}",
			"src/middleware.{js,ts}",
		],
	},
};

export default config;
