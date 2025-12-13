import { redirect } from "next/navigation";
import { executeGraphQL } from "@/lib/graphql";
import { UserAccountDocument } from "@/gql/graphql";
import { Breadcrumb } from "@/ui/components/Breadcrumb";
import { AccountSettings } from "@/ui/components/AccountSettings";
import { getServerAuthClient } from "@/app/config";

export const metadata = {
	title: "Account Settings | Luxior Mall",
	description: "Manage your account settings, profile, and addresses.",
};

export default async function AccountPage() {
	// Check if user is authenticated
	const authClient = await getServerAuthClient();
	const isAuthenticated = await authClient.isSignedIn();

	if (!isAuthenticated) {
		redirect("/login");
	}

	// Fetch user data
	const { me } = await executeGraphQL(UserAccountDocument, {
		cache: "no-store",
		withAuth: true,
	});

	if (!me) {
		redirect("/login");
	}

	return (
		<section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<Breadcrumb items={[{ label: "Account Settings" }]} className="mb-6" />
			<AccountSettings user={me} />
		</section>
	);
}
