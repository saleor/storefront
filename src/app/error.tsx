"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { type SaleorError } from "@/lib/graphql";

interface ErrorPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}

/**
 * Global error page for uncaught errors.
 *
 * Displays user-friendly messages based on error type.
 * Technical details are logged but not shown to users in production.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
	// Log error for debugging (server-side in production)
	useEffect(() => {
		console.error("[Error Page]", error);
	}, [error]);

	// Extract error info
	const saleorError = error as SaleorError;
	const isRetryable = saleorError.isRetryable ?? true;
	const userMessage = saleorError.userMessage ?? "Something went wrong loading this page.";

	// Determine icon and action based on error type
	const errorType = saleorError.type ?? "unknown";

	const buttonBase =
		"inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring";

	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16">
			<div className="mx-auto max-w-md text-center">
				{/* Icon */}
				<div className="bg-destructive/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
					<AlertCircle className="h-8 w-8 text-destructive" />
				</div>

				{/* Heading */}
				<h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
					{errorType === "network" ? "Connection Error" : "Something Went Wrong"}
				</h1>

				{/* Message */}
				<p className="mb-8 text-muted-foreground">{userMessage}</p>

				{/* Actions */}
				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					{isRetryable && (
						<button
							onClick={reset}
							className={`${buttonBase} hover:bg-primary/90 bg-primary text-primary-foreground`}
						>
							<RefreshCw className="h-4 w-4" />
							Try Again
						</button>
					)}

					<Link
						href="/"
						className={`${buttonBase} ${
							isRetryable
								? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
								: "hover:bg-primary/90 bg-primary text-primary-foreground"
						}`}
					>
						<Home className="h-4 w-4" />
						Go Home
					</Link>
				</div>

				{/* Back link */}
				<button
					onClick={() => window.history.back()}
					className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="h-3 w-3" />
					Go back
				</button>

				{/* Error digest for support (production only) */}
				{error.digest && <p className="text-muted-foreground/60 mt-8 text-xs">Error ID: {error.digest}</p>}
			</div>
		</div>
	);
}
