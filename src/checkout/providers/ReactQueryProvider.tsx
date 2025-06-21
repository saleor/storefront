"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

interface ReactQueryProviderProps {
	children: ReactNode;
}

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// Disable automatic refetching for checkout flow stability
						refetchOnWindowFocus: false,
						refetchOnMount: false,
						refetchOnReconnect: false,
						// Keep data fresh for 5 minutes
						staleTime: 5 * 60 * 1000,
						// Cache data for 10 minutes
						gcTime: 10 * 60 * 1000,
						// Retry failed requests once
						retry: 1,
					},
					mutations: {
						// Retry failed mutations once
						retry: 1,
					},
				},
			}),
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
