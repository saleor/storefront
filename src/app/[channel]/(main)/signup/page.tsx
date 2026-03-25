import { Suspense } from "react";
import { SignUpForm } from "@/ui/components/sign-up-form";

export const metadata = {
	title: "Create Account",
	description: "Create a new account to save your addresses and order history.",
};

export default function SignUpPage() {
	return (
		<Suspense fallback={<SignUpSkeleton />}>
			<div className="relative min-h-[80vh] bg-neutral-950">
				<div className="pointer-events-none absolute inset-0 overflow-hidden">
					<div className="absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-emerald-500/[0.04] blur-[100px]" />
					<div className="absolute -right-40 bottom-1/4 h-80 w-80 rounded-full bg-teal-500/[0.03] blur-[100px]" />
				</div>
				<div className="relative flex items-center justify-center px-6 py-16 sm:py-24">
					<SignUpForm />
				</div>
			</div>
		</Suspense>
	);
}

function SignUpSkeleton() {
	return (
		<div className="relative min-h-[80vh] bg-neutral-950">
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-emerald-500/[0.04] blur-[100px]" />
				<div className="absolute -right-40 bottom-1/4 h-80 w-80 rounded-full bg-teal-500/[0.03] blur-[100px]" />
			</div>
			<div className="relative flex items-center justify-center px-6 py-16 sm:py-24">
				<div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-neutral-800/80 to-neutral-900/90 shadow-2xl shadow-black/30">
					<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
					<div className="p-8 sm:p-10">
						<div className="mb-8">
							<div className="mb-3 h-3 w-24 animate-pulse rounded bg-neutral-800" />
							<div className="h-7 w-52 animate-pulse rounded bg-neutral-800" />
							<div className="mt-3 h-4 w-56 animate-pulse rounded bg-neutral-800" />
						</div>
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<div className="h-3 w-20 animate-pulse rounded bg-neutral-800" />
									<div className="h-12 w-full animate-pulse rounded-xl bg-neutral-800/60" />
								</div>
								<div className="space-y-1.5">
									<div className="h-3 w-20 animate-pulse rounded bg-neutral-800" />
									<div className="h-12 w-full animate-pulse rounded-xl bg-neutral-800/60" />
								</div>
							</div>
							<div className="space-y-1.5">
								<div className="h-3 w-24 animate-pulse rounded bg-neutral-800" />
								<div className="h-12 w-full animate-pulse rounded-xl bg-neutral-800/60" />
							</div>
							<div className="space-y-1.5">
								<div className="h-3 w-16 animate-pulse rounded bg-neutral-800" />
								<div className="h-12 w-full animate-pulse rounded-xl bg-neutral-800/60" />
							</div>
							<div className="space-y-1.5">
								<div className="h-3 w-32 animate-pulse rounded bg-neutral-800" />
								<div className="h-12 w-full animate-pulse rounded-xl bg-neutral-800/60" />
							</div>
							<div className="h-12 w-full animate-pulse rounded-xl bg-emerald-500/20" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
