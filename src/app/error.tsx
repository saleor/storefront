"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	const handleRetry = () => {
		// Clear auth cookies as a safety net before retrying
		// This helps recover from stale authentication state
		const authCookies = ["saleor-access-token", "saleor-refresh-token"];
		authCookies.forEach((cookieName) => {
			document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
		});

		// Try to reset the error boundary
		reset();

		// If reset doesn't work, force reload as fallback
		setTimeout(() => {
			window.location.reload();
		}, 100);
	};

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
					onClick={handleRetry}
				>
					Try again
				</button>
			</div>
		</div>
	);
}
