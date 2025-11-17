import { type Exchange } from "urql";
import { pipe, tap } from "wonka";

/**
 * URQL error exchange that handles JWT signature expiration errors
 * Automatically clears auth cookies and reloads the page when tokens expire
 */
export const authErrorExchange: Exchange =
	({ forward }) =>
	(ops$) => {
		return pipe(
			forward(ops$),
			tap(({ error }) => {
				if (!error) return;

				// Check if any error message indicates signature expiration
				const isSignatureExpired =
					error.message?.includes("Signature has expired") ||
					error.graphQLErrors?.some((e) => e.message?.includes("Signature has expired"));

				if (isSignatureExpired) {
					console.warn("[AUTH] JWT signature expired (client-side), clearing tokens and reloading...");

					// Clear auth cookies
					const authCookies = ["saleor-access-token", "saleor-refresh-token"];
					authCookies.forEach((cookieName) => {
						document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
					});

					// Reload to home page with clean state
					setTimeout(() => {
						window.location.href = "/";
					}, 500);
				}
			}),
		);
	};
