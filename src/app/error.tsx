"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error("Application error:", error);
	}, [error]);

	return (
		<div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4">
			<div className="max-w-md w-full text-center">
				{/* Error Icon */}
				<div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
					<AlertTriangle className="h-8 w-8 text-red-600" />
				</div>

				{/* Message */}
				<h1 className="text-2xl font-bold text-secondary-900 mb-2">
					Something went wrong
				</h1>
				<p className="text-secondary-600 mb-8">
					We apologize for the inconvenience. An unexpected error has occurred. 
					Please try again or contact support if the problem persists.
				</p>

				{/* Error Details (only in development) */}
				{process.env.NODE_ENV === "development" && error.message && (
					<div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 text-left">
						<p className="text-sm font-mono text-red-700 break-all">
							{error.message}
						</p>
						{error.digest && (
							<p className="text-xs text-red-500 mt-2">
								Error ID: {error.digest}
							</p>
						)}
					</div>
				)}

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<button
						onClick={reset}
						className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
					>
						<RefreshCw className="h-5 w-5" />
						Try Again
					</button>
					<Link
						href="/"
						className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-secondary-300 bg-white text-secondary-700 font-medium hover:bg-secondary-50 transition-colors"
					>
						<Home className="h-5 w-5" />
						Go Home
					</Link>
				</div>

				{/* Support Link */}
				<div className="mt-8">
					<p className="text-sm text-secondary-500">
						Need help?{" "}
						<Link href="/contact" className="text-primary-600 hover:text-primary-700">
							Contact Support
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
