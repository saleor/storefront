"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
	const isSignatureExpired = error.message?.includes("Signature has expired");

	useEffect(() => {
		console.error(error);

		// Auto-handle signature expiration errors
		if (isSignatureExpired) {
			console.warn("[AUTH] JWT signature expired, clearing tokens and reloading...");

			// Clear all auth-related cookies
			const authCookies = ["saleor-access-token", "saleor-refresh-token"];
			authCookies.forEach((cookieName) => {
				document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
			});

			// Force a full page reload after a short delay to clear stale state
			setTimeout(() => {
				window.location.href = window.location.pathname;
			}, 1500);
		}
	}, [error, isSignatureExpired]);

	if (isSignatureExpired) {
		return (
			<div className="bg-white">
				<div className="mx-auto max-w-7xl px-6 py-12">
					<h1 className="text-2xl font-bold leading-10 tracking-tight text-neutral-800">
						Session Expired
					</h1>
					<p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600">
						Your session has expired for security reasons. You have been logged out and the page
						will refresh automatically.
					</p>
					<div className="mt-4 flex items-center gap-2">
						<div className="h-5 w-5 animate-spin rounded-full border-b-2 border-neutral-800"></div>
						<span className="text-sm text-neutral-600">Refreshing...</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white">
			<div className="mx-auto max-w-7xl px-6 py-12">
				<h1 className="text-2xl font-bold leading-10 tracking-tight text-neutral-800">
					Something went wrong
				</h1>
				<p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600">
					<code>{error.message}</code>
				</p>
				<button
					className="mt-8 h-10 rounded-md bg-red-500 px-6 font-semibold text-white"
					onClick={() => reset()}
				>
					Try again
				</button>
			</div>
		</div>
	);
}
