import { type ReactNode, Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { AuthFormSection } from "@/ui/components/auth/auth-form-section";
import { AccountLogin } from "@/ui/components/account/account-login";
import { AccountNav } from "@/ui/components/account/account-nav";
import { AccountSkeleton } from "@/ui/components/account/account-skeleton";
import { AccountProvider } from "@/ui/components/account/account-context";
import { AccountUnavailable } from "@/ui/components/account/account-unavailable";
import { getAccountAuthState } from "./get-current-user";

type LayoutProps = {
	children: ReactNode;
	params: Promise<{ locale: string; channel: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "account.metadata" });
	return {
		title: t("accountTitle"),
	};
}

export default function AccountLayout({ children, params }: LayoutProps) {
	return (
		<Suspense fallback={<AccountSkeleton />}>
			<AccountShell params={params}>{children}</AccountShell>
		</Suspense>
	);
}

async function AccountShell({ children, params }: LayoutProps) {
	const { locale } = await params;
	const auth = await getAccountAuthState();

	if (auth.status === "guest") {
		return (
			<AuthFormSection>
				<AccountLogin />
			</AuthFormSection>
		);
	}

	if (auth.status === "unavailable") {
		return <AccountUnavailable locale={locale} />;
	}

	return (
		<AccountProvider user={auth.user}>
			<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-8 md:flex-row">
					<aside className="shrink-0 md:min-h-[60vh] md:w-52">
						<AccountNav />
					</aside>
					<div className="min-w-0 flex-1">{children}</div>
				</div>
			</div>
		</AccountProvider>
	);
}
