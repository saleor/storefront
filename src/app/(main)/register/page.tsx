import { RegisterForm } from "@/ui/components/RegisterForm";
import { SITE_CONFIG } from "@/lib/constants";
import { CurrentUserDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { redirect } from "next/navigation";

export const metadata = {
	title: "Create Account",
	description: `Create your ${SITE_CONFIG.name} account to access exclusive guitar tones, cab impulse responses, and amp captures.`,
};

export default async function RegisterPage() {
	// If user is already logged in, redirect to account page
	const { me: user } = await executeGraphQL(CurrentUserDocument, {
		cache: "no-cache",
	});

	if (user) {
		redirect("/account");
	}

	return (
		<section className="mx-auto max-w-7xl p-8">
			<RegisterForm />
		</section>
	);
}
