"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { type SaleorError } from "@/lib/graphql";
import { buttonClassName } from "@/ui/components/ui/button";

export interface ErrorContentProps {
	error: Error & { digest?: string };
	reset: () => void;
}

/**
 * Shared error UI for per-root-group `error.tsx` boundaries.
 * Displays user-friendly messages based on error type; technical details are logged only.
 */
export function ErrorContent({ error, reset }: ErrorContentProps) {
	useEffect(() => {
		console.error("[Error Page]", error);
	}, [error]);

	const saleorError = error as SaleorError;
	const isRetryable = saleorError.isRetryable ?? true;
	const userMessage = saleorError.userMessage ?? "Something went wrong loading this page.";
	const errorType = saleorError.type ?? "unknown";

	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16">
			<div className="mx-auto max-w-md text-center">
				<div className="bg-destructive/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
					<AlertCircle className="h-8 w-8 text-destructive" />
				</div>

				<h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
					{errorType === "network" ? "Connection Error" : "Something Went Wrong"}
				</h1>

				<p className="mb-8 text-muted-foreground">{userMessage}</p>

				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					{isRetryable && (
						<button onClick={reset} className={buttonClassName()}>
							<RefreshCw className="h-4 w-4" />
							Try Again
						</button>
					)}

					<Link
						href="/"
						className={buttonClassName({
							asLink: true,
							variant: isRetryable ? "outline-solid" : "default",
						})}
					>
						<Home className="h-4 w-4" />
						Go Home
					</Link>
				</div>

				<button
					onClick={() => window.history.back()}
					className="mt-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="h-3 w-3" />
					Go back
				</button>

				{error.digest && <p className="text-muted-foreground/60 mt-8 text-xs">Error ID: {error.digest}</p>}
			</div>
		</div>
	);
}
