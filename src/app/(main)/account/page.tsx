import { CurrentUserWithAddressesDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { LoginForm } from "@/ui/components/LoginForm";
import { SITE_CONFIG } from "@/lib/constants";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { User, MapPin, Package } from "lucide-react";

export const metadata = {
	title: "My Account",
	description: `Manage your ${SITE_CONFIG.name} account, view your orders, and update your addresses.`,
};

export default async function AccountPage() {
	const { me: user } = await executeGraphQL(CurrentUserWithAddressesDocument, {
		cache: "no-cache",
	});

	if (!user) {
		return <LoginForm />;
	}

	return (
		<div className="mx-auto max-w-7xl p-8">
			<h1 className="mb-8 text-3xl font-bold tracking-tight text-neutral-900">
				My Account
			</h1>

			<div className="mb-8 rounded-lg border border-neutral-200 bg-white p-6">
				<div className="flex items-center gap-3 mb-4">
					<User className="h-6 w-6 text-neutral-600" />
					<h2 className="text-xl font-semibold text-neutral-900">Account Information</h2>
				</div>
				<div className="space-y-2 text-neutral-700">
					<p>
						<span className="font-medium">Email:</span> {user.email}
					</p>
					{user.firstName && (
						<p>
							<span className="font-medium">Name:</span> {user.firstName} {user.lastName}
						</p>
					)}
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<LinkWithChannel
					href="/account/addresses"
					className="group rounded-lg border border-neutral-200 bg-white p-6 transition-all hover:border-accent-400 hover:shadow-md"
				>
					<div className="flex items-center gap-3 mb-3">
						<MapPin className="h-6 w-6 text-accent-400" />
						<h2 className="text-xl font-semibold text-neutral-900">Addresses</h2>
					</div>
					<p className="text-neutral-600 mb-4">
						Manage your shipping and billing addresses
					</p>
					<div className="text-sm text-neutral-500">
						{user.addresses && user.addresses.length > 0 ? (
							<span>{user.addresses.length} saved {user.addresses.length === 1 ? "address" : "addresses"}</span>
						) : (
							<span>No saved addresses</span>
						)}
					</div>
					<div className="mt-4 text-accent-400 font-medium group-hover:text-accent-500">
						Manage addresses →
					</div>
				</LinkWithChannel>

				<LinkWithChannel
					href="/orders"
					className="group rounded-lg border border-neutral-200 bg-white p-6 transition-all hover:border-accent-400 hover:shadow-md"
				>
					<div className="flex items-center gap-3 mb-3">
						<Package className="h-6 w-6 text-accent-400" />
						<h2 className="text-xl font-semibold text-neutral-900">Orders</h2>
					</div>
					<p className="text-neutral-600 mb-4">
						View your order history and track shipments
					</p>
					<div className="text-sm text-neutral-500">
						{user.orders && user.orders.edges && user.orders.edges.length > 0 ? (
							<span>{user.orders.edges.length} {user.orders.edges.length === 1 ? "order" : "orders"}</span>
						) : (
							<span>No orders yet</span>
						)}
					</div>
					<div className="mt-4 text-accent-400 font-medium group-hover:text-accent-500">
						View orders →
					</div>
				</LinkWithChannel>
			</div>
		</div>
	);
}
