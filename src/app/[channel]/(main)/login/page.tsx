import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Loader } from "@/ui/atoms/loader";
import { LoginForm } from "@/ui/components/login-form";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";

export const metadata = {
	title: "Sign In",
	description: "Sign in to your account to access your orders and saved addresses.",
};

/**
 * Login page with Cache Components.
 * Static shell renders immediately, auth check streams in.
 */
export default function LoginPage(props: { params: Promise<{ channel: string }> }) {
	return (
		<Suspense fallback={<Loader />}>
			<LoginContent params={props.params} />
		</Suspense>
	);
}

/**
 * Dynamic login content - checks auth status at request time.
 */
async function LoginContent({ params: paramsPromise }: { params: Promise<{ channel: string }> }) {
	const { channel } = await paramsPromise;

	// During static generation, skip API call entirely - just show login form
	let hasCookies = false;
	try {
		const cookieStore = await cookies();
		hasCookies = cookieStore.getAll().length > 0;
	} catch {
		// Static generation - no cookies available
	}

	// Only check auth if we have cookies (runtime request with potential session)
	if (hasCookies) {
		const result = await executeAuthenticatedGraphQL(CurrentUserDocument, {
			cache: "no-cache",
		});

		// Redirect logged-in users to home
		if (result.ok && result.data.me) {
			redirect(`/${channel}`);
		}
	}

	return (
		<section className="mx-auto max-w-7xl p-8">
			<LoginForm />
		</section>
	);
}
