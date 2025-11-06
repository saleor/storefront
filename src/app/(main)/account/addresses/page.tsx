import { CurrentUserWithAddressesDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { LoginForm } from "@/ui/components/LoginForm";
import { SITE_CONFIG } from "@/lib/constants";
import { AddressManagement } from "./AddressManagement";

export const metadata = {
	title: "My Addresses",
	description: `Manage your ${SITE_CONFIG.name} shipping and billing addresses.`,
};

export default async function AddressesPage() {
	const { me: user } = await executeGraphQL(CurrentUserWithAddressesDocument, {
		cache: "no-cache",
	});

	if (!user) {
		return <LoginForm />;
	}

	return (
		<div className="mx-auto max-w-7xl p-8">
			<h1 className="mb-8 text-3xl font-bold tracking-tight text-white">
				My Addresses
			</h1>
			<AddressManagement initialUser={user} />
		</div>
	);
}
