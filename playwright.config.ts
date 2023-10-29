import { defineConfig, devices } from "@playwright/test";
import NextEnv from "@next/env";

NextEnv.loadEnvConfig(".");

const PORT = process.env.PORT || 3000;
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
	testDir: "./__tests__",
	fullyParallel: true,
	workers: process.env.CI ? 3 : undefined,
	forbidOnly: !!process.env.CI,
	retries: 0,
	reporter: process.env.CI ? [["html"], ["github"], ["list"]] : [["html"], ["list"]],

	use: {
		baseURL,
		trace: "on-first-retry",
		screenshot: process.env.CI ? "only-on-failure" : "off",
		video: process.env.CI ? "retain-on-failure" : "off",
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
