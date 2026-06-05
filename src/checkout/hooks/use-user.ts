import { useAuthChange } from "@saleor/auth-sdk/react";
import { useUserQuery } from "@/checkout/graphql";
import { hasAuthCookies } from "@/lib/auth/has-auth-cookies";

const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL ?? "";

export const useUser = () => {
	const sessionCookiesPresent = hasAuthCookies();

	// requestPolicy is chosen on mount; same-tab sign-in/out is handled via useAuthChange refetch below.
	const [{ data, fetching: loading, stale }, refetch] = useUserQuery({
		requestPolicy: sessionCookiesPresent ? "network-only" : "cache-first",
	});

	useAuthChange({
		saleorApiUrl,
		onSignedIn: () => {
			void refetch({ requestPolicy: "network-only" });
		},
		onSignedOut: () => {
			void refetch({ requestPolicy: "network-only" });
		},
	});

	const user = data?.user;
	const authenticated = !!user?.id;

	return { user, loading: loading || stale, authenticated, refetch };
};
