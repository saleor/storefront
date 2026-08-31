/**
 * Speed Insights sampling — the cost lever for high-traffic deployments.
 *
 * Vercel bills roughly 3–6 data points per hard navigation. Unsampled, a
 * storefront with millions of visits can spend more on Speed Insights than on
 * the rest of its Vercel infrastructure (see the `paper-vercel-cost` rule).
 * A 1% sample is still statistically strong at that scale; set
 * `NEXT_PUBLIC_SPEED_INSIGHTS_SAMPLE_RATE=1` only for short investigations.
 */
const DEFAULT_SPEED_INSIGHTS_SAMPLE_RATE = 0.01;

export function speedInsightsSampleRate(): number {
	const raw = process.env.NEXT_PUBLIC_SPEED_INSIGHTS_SAMPLE_RATE?.trim();
	if (!raw) return DEFAULT_SPEED_INSIGHTS_SAMPLE_RATE;

	const parsed = Number(raw);
	if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
		// A typo must not take the page down — fall back to the safe default.
		console.warn(
			`[speed-insights] Ignoring invalid NEXT_PUBLIC_SPEED_INSIGHTS_SAMPLE_RATE="${raw}". ` +
				`Expected a number between 0 and 1.`,
		);
		return DEFAULT_SPEED_INSIGHTS_SAMPLE_RATE;
	}

	return parsed;
}
