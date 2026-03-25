import { type ReactNode, Suspense } from "react";
import { cookies } from "next/headers";
import { LoginForm } from "@/ui/components/login-form";
import { AccountNav } from "@/ui/components/account/account-nav";
import { AccountSkeleton } from "@/ui/components/account/account-skeleton";
import { AccountProvider } from "@/ui/components/account/account-context";
import { noIndexRobots } from "@/lib/seo";
import { getCurrentUser } from "./get-current-user";

export const metadata = {
	title: "My Account",
	robots: noIndexRobots,
};

export default function AccountLayout({ children }: { children: ReactNode }) {
	return (
		<Suspense fallback={<AccountSkeleton />}>
			<AccountShell>{children}</AccountShell>
		</Suspense>
	);
}

async function AccountShell({ children }: { children: ReactNode }) {
	let hasCookies = false;
	try {
		const cookieStore = await cookies();
		hasCookies = cookieStore.getAll().length > 0;
	} catch {
		// Static generation
	}

	if (!hasCookies) {
		return (
			<div className="relative min-h-[80vh] bg-neutral-950">
				<div className="pointer-events-none absolute inset-0 overflow-hidden">
					<div className="absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-emerald-500/[0.04] blur-[100px]" />
					<div className="absolute -right-40 bottom-1/4 h-80 w-80 rounded-full bg-teal-500/[0.03] blur-[100px]" />
				</div>
				<div className="relative flex items-center justify-center px-6 py-16 sm:py-24">
					<LoginForm />
				</div>
			</div>
		);
	}

	const user = await getCurrentUser();

	if (!user) {
		return (
			<div className="relative min-h-[80vh] bg-neutral-950">
				<div className="pointer-events-none absolute inset-0 overflow-hidden">
					<div className="absolute -left-40 top-1/4 h-80 w-80 rounded-full bg-emerald-500/[0.04] blur-[100px]" />
					<div className="absolute -right-40 bottom-1/4 h-80 w-80 rounded-full bg-teal-500/[0.03] blur-[100px]" />
				</div>
				<div className="relative flex items-center justify-center px-6 py-16 sm:py-24">
					<LoginForm />
				</div>
			</div>
		);
	}

	return (
		<AccountProvider user={user}>
			<div className="min-h-[80vh] bg-neutral-950">
				<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="flex flex-col gap-8 md:flex-row">
						<aside className="shrink-0 md:min-h-[60vh] md:w-52">
							<AccountNav />
						</aside>
						<div className="min-w-0 flex-1">{children}</div>
					</div>
				</div>
			</div>
		</AccountProvider>
	);
}
