import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { AuthFormSection } from "@/ui/components/auth/auth-form-section";
import { AccountUnavailable } from "@/ui/components/account/account-unavailable";
import { SignUpForm } from "@/ui/components/sign-up-form";
import { CurrentUserDocument } from "@/gql/graphql";
import { fetchAuthenticatedUserIfSession } from "@/lib/auth/fetch-authenticated-user";
import { resolveSessionUser } from "@/lib/auth/resolve-session-user";
import { buildStorefrontPath } from "@/lib/storefront-path";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "account.metadata" });
	return {
		title: t("signupTitle"),
		description: t("signupDescription"),
	};
}

type SignUpPageProps = {
	params: Promise<{ locale: string; channel: string }>;
};

export default function SignUpPage(props: SignUpPageProps) {
	return (
		<Suspense fallback={<SignUpSkeleton />}>
			<SignUpContent params={props.params} />
		</Suspense>
	);
}

async function SignUpContent({ params }: { params: Promise<{ locale: string; channel: string }> }) {
	// Uncaught — `hasAuthSession` swallows `cookies()` throws and can hide this hole.
	await cookies();

	const { locale, channel } = await params;
	const auth = await resolveSessionUser(() =>
		fetchAuthenticatedUserIfSession(CurrentUserDocument, { cache: "no-cache" }),
	);

	if (auth.status === "authenticated") {
		redirect(buildStorefrontPath(locale, channel, "/account"));
	}

	if (auth.status === "unavailable") {
		return <AccountUnavailable locale={locale} />;
	}

	return (
		<AuthFormSection>
			<SignUpForm />
		</AuthFormSection>
	);
}

function SignUpSkeleton() {
	return (
		<AuthFormSection>
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
						<div className="h-12 w-full animate-pulse rounded-md bg-foreground/10" />
					</div>
				</div>
			</div>
		</AuthFormSection>
	);
}
