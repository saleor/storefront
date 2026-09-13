import Script from "next/script";
import type { AnalyticsConsentMode } from "@/lib/analytics/consent";

/**
 * Optional merchant tag. The default-consent stub is a blocking inline script
 * so it runs before `gtag.js` (`afterInteractive`). Automatic page views are
 * off — `AnalyticsPathnameViews` sends a redacted `page_view` after storage is allowed.
 *
 * Ads consents stay denied; Paper core has no ad pixels.
 */
export function GoogleAnalytics({
	measurementId,
	consentMode,
}: {
	measurementId: string;
	consentMode: AnalyticsConsentMode;
}) {
	const analyticsDefault = consentMode === "implied" ? "granted" : "denied";

	return (
		<>
			<script
				dangerouslySetInnerHTML={{
					__html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'${analyticsDefault}',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`,
				}}
			/>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
				strategy="afterInteractive"
			/>
			<Script id="paper-ga4-config" strategy="afterInteractive">
				{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true,send_page_view:false});`}
			</Script>
		</>
	);
}
