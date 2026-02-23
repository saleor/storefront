import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/ui/components/login-form";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";
import { AuthProvider } from "@/lib/auth";

export const metadata = {
	title: "Sign In",
	description: "Sign in to your account to access your orders and saved addresses.",
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
		<section className="mx-auto max-w-7xl p-8 pb-24">
			<div className="mx-auto my-16 w-full max-w-md">
				<div className="rounded-lg border border-border bg-card p-8 shadow-sm">
					<div className="mb-6 flex flex-col items-center gap-2">
						<div className="h-7 w-40 animate-pulse rounded bg-secondary" />
						<div className="h-4 w-56 animate-pulse rounded bg-secondary" />
					</div>
					<div className="space-y-4">
						<div className="space-y-1.5">
							<div className="h-4 w-24 animate-pulse rounded bg-secondary" />
							<div className="h-12 w-full animate-pulse rounded-md bg-secondary" />
						</div>
						<div className="space-y-1.5">
							<div className="h-4 w-16 animate-pulse rounded bg-secondary" />
							<div className="h-12 w-full animate-pulse rounded-md bg-secondary" />
						</div>
						<div className="flex justify-end">
							<div className="h-4 w-28 animate-pulse rounded bg-secondary" />
						</div>
						<div className="bg-foreground/10 h-12 w-full animate-pulse rounded-md" />
					</div>
				</div>
			</div>
		</section>
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
		<section className="mx-auto max-w-7xl p-8 pb-24">
			<AuthProvider>
				<LoginForm />
			</AuthProvider>
		</section>
	);
}
