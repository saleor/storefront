import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Loader } from "@/ui/atoms/Loader";
import { LoginForm } from "@/ui/components/LoginForm";
import { executeGraphQL } from "@/lib/graphql";
import { CurrentUserDocument } from "@/gql/graphql";

export const metadata = {
	title: "Sign In",
	description: "Sign in to your account to access your orders and saved addresses.",
};

export default async function LoginPage(props: { params: Promise<{ channel: string }> }) {
	const { channel } = await props.params;

	// Check if user is already logged in
	const { me: user } = await executeGraphQL(CurrentUserDocument, {
		cache: "no-cache",
	});

	// Redirect logged-in users to home
	if (user) {
		redirect(`/${channel}`);
	}

	return (
		<Suspense fallback={<Loader />}>
			<section className="mx-auto max-w-7xl p-8">
				<LoginForm />
			</section>
		</Suspense>
	);
}
