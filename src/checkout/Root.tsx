"use client";
import { ErrorBoundary } from "react-error-boundary";
import {
	type Client,
	Provider as UrqlProvider,
	cacheExchange,
	createClient,
	dedupExchange,
	fetchExchange,
} from "urql";

import { ToastContainer } from "react-toastify";
import { useAuthChange, useSaleorAuthContext } from "@saleor/auth-sdk/react";
import { useState } from "react";
import { alertsContainerProps } from "./hooks/useAlerts/consts";
import { RootViews } from "./views/RootViews";
import { PageNotFound } from "@/checkout/views/PageNotFound";
import { GraphQLMonitor, createMonitoredFetch } from "@/ui/components/dev/GraphQLMonitor";
import { withRetry } from "@/lib/fetchRetry";
import "./index.css";

export const Root = ({ saleorApiUrl }: { saleorApiUrl: string }) => {
	const saleorAuthClient = useSaleorAuthContext();

	const makeUrqlClient = () => {
		// Build fetch chain: auth -> (monitor with chaos) -> retry -> actual fetch
		// Chaos is inside retry so failures get retried (tests retry behavior)
		const authFetch = (input: RequestInfo | URL, init?: RequestInit) =>
			saleorAuthClient.fetchWithAuth(input as NodeJS.fetch.RequestInfo, init);

		const monitoredFetch =
			process.env.NODE_ENV === "development" ? createMonitoredFetch(authFetch, "checkout") : authFetch;

		const finalFetch = withRetry(monitoredFetch);

		return createClient({
			url: saleorApiUrl,
			suspense: true,
			requestPolicy: "cache-first",
			// Type assertion needed due to urql's overloaded fetch type
			fetch: finalFetch as typeof fetch,
			exchanges: [dedupExchange, cacheExchange, fetchExchange],
		});
	};

	const [urqlClient, setUrqlClient] = useState<Client>(makeUrqlClient());
	useAuthChange({
		saleorApiUrl,
		onSignedOut: () => setUrqlClient(makeUrqlClient()),
		onSignedIn: () => setUrqlClient(makeUrqlClient()),
	});

	return (
		<UrqlProvider value={urqlClient}>
			<ToastContainer {...alertsContainerProps} />
			<ErrorBoundary FallbackComponent={PageNotFound}>
				<RootViews />
			</ErrorBoundary>
			{process.env.NODE_ENV === "development" && <GraphQLMonitor />}
		</UrqlProvider>
	);
};
