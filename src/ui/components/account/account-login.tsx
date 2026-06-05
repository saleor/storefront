"use client";

import { Suspense } from "react";
import { AuthProvider } from "@/lib/auth";
import { LoginForm } from "@/ui/components/login-form";

function LoginFormSkeleton() {
	return (
		<div className="mx-auto my-16 w-full max-w-md">
			<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
				<div className="mb-6 flex flex-col items-center gap-2">
					<div className="h-7 w-40 animate-pulse rounded bg-secondary" />
					<div className="h-4 w-56 animate-pulse rounded bg-secondary" />
				</div>
				<div className="space-y-4">
					<div className="h-12 w-full animate-pulse rounded-md bg-secondary" />
					<div className="h-12 w-full animate-pulse rounded-md bg-secondary" />
					<div className="h-12 w-full animate-pulse rounded-md bg-secondary" />
				</div>
			</div>
		</div>
	);
}

/** Login UI for /account when the user is signed out or the session is invalid. */
export function AccountLogin() {
	return (
		<AuthProvider>
			<Suspense fallback={<LoginFormSkeleton />}>
				<LoginForm />
			</Suspense>
		</AuthProvider>
	);
}
