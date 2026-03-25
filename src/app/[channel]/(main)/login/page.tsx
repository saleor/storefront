import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/ui/components/login-form";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";
import { AuthProvider } from "@/lib/auth";
import { noIndexRobots } from "@/lib/seo";

export const metadata = {
	title: "Sign In",
	description: "Sign in to your account to access your orders and saved addresses.",
	robots: noIndexRobots,
};

export default function LoginPage(props: { params: Promise<{ channel: string }> }) {
	return (
		<Suspense fallback={<LoginSkeleton />}>
			<LoginContent params={props.params} />
		</Suspense>
	);
}

function LoginSkeleton() {
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
							<div className="mb-3 h-3 w-28 animate-pulse rounded bg-neutral-800" />
							<div className="h-7 w-48 animate-pulse rounded bg-neutral-800" />
							<div className="mt-3 h-4 w-64 animate-pulse rounded bg-neutral-800" />
						</div>
						<div className="space-y-4">
							<div className="space-y-1.5">
								<div className="h-3 w-24 animate-pulse rounded bg-neutral-800" />
								<div className="h-12 w-full animate-pulse rounded-xl bg-neutral-800/60" />
							</div>
							<div className="space-y-1.5">
								<div className="h-3 w-16 animate-pulse rounded bg-neutral-800" />
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

async function LoginContent({ params: paramsPromise }: { params: Promise<{ channel: string }> }) {
	const { channel } = await paramsPromise;

	let hasCookies = false;
	try {
		const cookieStore = await cookies();
		hasCookies = cookieStore.getAll().length > 0;
	} catch {
		// Static generation -- cookies() unavailable
	}

	if (hasCookies) {
		const result = await executeAuthenticatedGraphQL(CurrentUserDocument, {
			cache: "no-cache",
		});

		if (result.ok && result.data.me) {
			redirect(`/${channel}`);
		}
	}

	return (
		<div className="relative min-h-[80vh] bg-neutral-950">
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-emerald-500/[0.04] blur-[100px]" />
				<div className="absolute -right-40 bottom-1/4 h-80 w-80 rounded-full bg-teal-500/[0.03] blur-[100px]" />
			</div>
			<div className="relative flex items-center justify-center px-6 py-16 sm:py-24">
				<AuthProvider>
					<LoginForm />
				</AuthProvider>
			</div>
		</div>
	);
}
