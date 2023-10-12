import { defineConfig, devices } from "@playwright/test";
import NextEnv from "@next/env";

NextEnv.loadEnvConfig(".");

const PORT = process.env.PORT || 3000;
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
	testDir: "./__tests__",
	fullyParallel: !process.env.CI,
	workers: process.env.CI ? 1 : undefined,
	forbidOnly: !!process.env.CI,
	retries: 0,
	reporter: process.env.CI ? [["html"], ["github"], ["list"]] : [["html"], ["list"]],

	use: {
		baseURL,
		trace: "on-first-retry",
	},

	projects: [
		{
			name: "Desktop Chrome",
			use: { ...devices["Desktop Chrome"] },
		},

		// {
		// 	name: "Desktop Safari",
		// 	use: { ...devices["Desktop Safari"] },
		// },

		// {
		// 	name: "Mobile Chrome",
		// 	use: {
		// 		...devices["Pixel 5"],
		// 	},
		// },
		// {
		// 	name: "Mobile Safari",
		// 	use: devices["iPhone 12 Mini"],
		// },
	],

	timeout: 60 * 1000,

	webServer: process.env.BASE_URL
		? undefined
		: {
				command: "pnpm run start",
				url: baseURL,
				reuseExistingServer: !process.env.CI,
		  },
});
