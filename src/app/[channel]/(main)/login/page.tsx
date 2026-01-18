import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Loader } from "@/ui/atoms/loader";
import { LoginForm } from "@/ui/components/login-form";
import { executeGraphQL } from "@/lib/graphql";
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

	// Check if user is already logged in (reads cookies)
	const { me: user } = await executeGraphQL(CurrentUserDocument, {
		cache: "no-cache",
	});

	// Redirect logged-in users to home
	if (user) {
		redirect(`/${channel}`);
	}

	return (
		<section className="mx-auto max-w-7xl p-8">
			<LoginForm />
		</section>
	);
}
