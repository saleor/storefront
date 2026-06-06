import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthFormSection } from "@/ui/components/auth/auth-form-section";
import { LoginForm } from "@/ui/components/login-form";
import { CurrentUserDocument } from "@/gql/graphql";
import { fetchAuthenticatedUserIfSession } from "@/lib/auth/fetch-authenticated-user";

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
		<AuthFormSection>
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
		</AuthFormSection>
	);
}

async function LoginContent({ params: paramsPromise }: { params: Promise<{ channel: string }> }) {
	const { channel } = await paramsPromise;

	const result = await fetchAuthenticatedUserIfSession(CurrentUserDocument, {
		cache: "no-cache",
	});

	if (result?.ok && result.data.me) {
		redirect(`/${channel}`);
	}

	return (
		<AuthFormSection>
			<LoginForm />
		</AuthFormSection>
	);
}
