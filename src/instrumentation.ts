/** Runs once when a Next.js server instance starts. */
export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		// Production without a shared rate-limit store says so in the server log.
		const { warnIfRateLimitsArePerInstance } = await import("@/lib/rate-limit/limiter");
		warnIfRateLimitsArePerInstance();
	}
}
