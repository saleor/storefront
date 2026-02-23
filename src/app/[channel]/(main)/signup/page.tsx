import { Suspense } from "react";
import { SignUpForm } from "@/ui/components/sign-up-form";

export const metadata = {
	title: "Create Account",
	description: "Create a new account to save your addresses and order history.",
};

export default function SignUpPage() {
	return (
		<Suspense fallback={<SignUpSkeleton />}>
			<section className="mx-auto max-w-7xl p-8 pb-24">
				<SignUpForm />
			</section>
		</Suspense>
	);
}

function SignUpSkeleton() {
	return (
		<section className="mx-auto max-w-7xl p-8 pb-24">
			<div className="mx-auto my-16 w-full max-w-md">
				<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="mb-6 flex flex-col items-center gap-2">
						<div className="h-7 w-44 animate-pulse rounded bg-secondary" />
						<div className="h-4 w-52 animate-pulse rounded bg-secondary" />
					</div>
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1.5">
								<div className="h-4 w-20 animate-pulse rounded bg-secondary" />
								<div className="h-12 w-full animate-pulse rounded-md bg-secondary" />
							</div>
							<div className="space-y-1.5">
								<div className="h-4 w-20 animate-pulse rounded bg-secondary" />
								<div className="h-12 w-full animate-pulse rounded-md bg-secondary" />
							</div>
						</div>
						<div className="space-y-1.5">
							<div className="h-4 w-24 animate-pulse rounded bg-secondary" />
							<div className="h-12 w-full animate-pulse rounded-md bg-secondary" />
						</div>
						<div className="space-y-1.5">
							<div className="h-4 w-16 animate-pulse rounded bg-secondary" />
							<div className="h-12 w-full animate-pulse rounded-md bg-secondary" />
						</div>
						<div className="space-y-1.5">
							<div className="h-4 w-32 animate-pulse rounded bg-secondary" />
							<div className="h-12 w-full animate-pulse rounded-md bg-secondary" />
						</div>
						<div className="bg-foreground/10 h-12 w-full animate-pulse rounded-md" />
					</div>
				</div>
			</div>
		</section>
	);
}
