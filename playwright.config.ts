import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3020";

/** Lets CI reach a protected Vercel preview. The cookie keeps client navigations and fetches through. */
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const extraHTTPHeaders = bypassSecret
	? { "x-vercel-protection-bypass": bypassSecret, "x-vercel-set-bypass-cookie": "true" }
	: undefined;

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	reporter: "list",
	use: {
		...devices["Desktop Chrome"],
		baseURL,
		extraHTTPHeaders,
		trace: "on-first-retry",
	},
	webServer: process.env.PLAYWRIGHT_BASE_URL
		? undefined
		: {
				command: "PORT=3020 pnpm start",
				url: `${baseURL}/en/${process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "default-channel"}`,
				reuseExistingServer: true,
				timeout: 120_000,
			},
});
