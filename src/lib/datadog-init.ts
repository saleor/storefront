"use client";

import { datadogRum } from "@datadog/browser-rum";

datadogRum.init({
	applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID || "",
	clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || "",
	site: "datadoghq.com",
	service: "storefront-rum",
	env: "staging",
	sessionSampleRate: 100,
	sessionReplaySampleRate: 20,
	trackUserInteractions: true,
	trackResources: true,
	trackLongTasks: true,
	allowedTracingUrls: [
		// TODO: narrow down matching key to specific API endpoints
		{ match: () => true, propagatorTypes: ["tracecontext"] },
	],
});

export default function DatadogInit() {
	return null;
}
