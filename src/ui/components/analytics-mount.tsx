import { analyticsConsentMode } from "@/lib/analytics/consent";
import { gaMeasurementId } from "@/lib/analytics/ga4";
import { AnalyticsRuntime } from "@/ui/components/analytics-runtime";
import { GoogleAnalytics } from "@/ui/components/google-analytics";

/** Root-layout mount: merchant tag when a measurement id is set, plus the always-on runtime. */
export function AnalyticsMount() {
	const measurementId = gaMeasurementId();

	return (
		<>
			{measurementId ? (
				<GoogleAnalytics measurementId={measurementId} consentMode={analyticsConsentMode()} />
			) : null}
			<AnalyticsRuntime />
		</>
	);
}
