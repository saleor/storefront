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
import { SaleorAuthProvider, useAuthChange } from "@saleor/auth-sdk/react";
import { useMemo, useState } from "react";
import { createSaleorAuthClient } from "@saleor/auth-sdk";
import { alertsContainerProps } from "./hooks/useAlerts/consts";
import { RootViews } from "./views/RootViews";
import { PageNotFound } from "@/checkout/views/PageNotFound";
import "./index.css";

export const Root = ({ saleorApiUrl }: { saleorApiUrl: string }) => {
	const saleorAuthClient = useMemo(() => createSaleorAuthClient({ saleorApiUrl }), [saleorApiUrl]);

	const makeUrqlClient = () =>
		createClient({
			url: saleorApiUrl,
			suspense: true,
			requestPolicy: "cache-first",
			fetch: saleorAuthClient.fetchWithAuth,
			exchanges: [dedupExchange, cacheExchange, fetchExchange],
		});

	const [urqlClient, setUrqlClient] = useState<Client>(makeUrqlClient());
	useAuthChange({
		saleorApiUrl,
		onSignedOut: () => setUrqlClient(makeUrqlClient()),
		onSignedIn: () => setUrqlClient(makeUrqlClient()),
	});

	return (
		<SaleorAuthProvider client={saleorAuthClient}>
			<UrqlProvider value={urqlClient}>
				<ToastContainer {...alertsContainerProps} />
				<ErrorBoundary FallbackComponent={PageNotFound}>
					<RootViews />
				</ErrorBoundary>
			</UrqlProvider>
		</SaleorAuthProvider>
	);
};
