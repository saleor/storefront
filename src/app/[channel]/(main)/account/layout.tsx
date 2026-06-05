import { type ReactNode, Suspense } from "react";
import { LoginForm } from "@/ui/components/login-form";
import { AccountNav } from "@/ui/components/account/account-nav";
import { AccountSkeleton } from "@/ui/components/account/account-skeleton";
import { AccountProvider } from "@/ui/components/account/account-context";
import { hasAuthSession } from "@/lib/auth/has-auth-session";
import { getCurrentUser } from "./get-current-user";

export const metadata = {
	title: "My Account",
};

export default function AccountLayout({ children }: { children: ReactNode }) {
	return (
		<Suspense fallback={<AccountSkeleton />}>
			<AccountShell>{children}</AccountShell>
		</Suspense>
	);
}

async function AccountShell({ children }: { children: ReactNode }) {
	if (!(await hasAuthSession())) {
		return <LoginForm />;
	}

	const user = await getCurrentUser();

	if (!user) {
		return <LoginForm />;
	}

	return (
		<AccountProvider user={user}>
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
