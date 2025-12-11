import { CurrentUserOrderListDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { AuthForms } from "@/ui/components/AuthForms";
import { OrderListItem } from "@/ui/components/OrderListItem";
import { Breadcrumb } from "@/ui/components/Breadcrumb";
import { Package, ShoppingBag } from "lucide-react";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import { Button } from "@/ui/atoms/Button";

export const metadata = {
	title: "My Orders | Luxior Mall",
	description: "View your order history and track your purchases at Luxior Mall.",
};

export default async function OrdersPage() {
	const { me: user } = await executeGraphQL(CurrentUserOrderListDocument, {
		cache: "no-cache",
	});

	if (!user) {
		return (
			<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
				<Breadcrumb 
					items={[{ label: "Sign In" }]} 
					className="mb-6"
				/>
				<AuthForms />
			</section>
		);
	}

	const orders = user.orders?.edges || [];
	const userName = user.firstName || user.email.split("@")[0];

	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
			{/* Breadcrumb */}
			<Breadcrumb 
				items={[
					{ label: "Account", href: "/orders" },
					{ label: "Orders" }
				]} 
				className="mb-6"
			/>

			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-secondary-900">My Orders</h1>
				<p className="mt-2 text-secondary-600">
					Welcome back, {userName}! Here&apos;s your order history.
				</p>
			</div>

			{/* Account Navigation */}
			<div className="flex flex-wrap gap-4 mb-8 pb-6 border-b border-secondary-200">
				<LinkWithChannel 
					href="/orders"
					className="px-4 py-2 rounded-md bg-primary-50 text-primary-700 font-medium"
				>
					Orders
				</LinkWithChannel>
				<LinkWithChannel 
					href="/account/addresses"
					className="px-4 py-2 rounded-md text-secondary-600 hover:bg-secondary-50 transition-colors"
				>
					Addresses
				</LinkWithChannel>
				<LinkWithChannel 
					href="/account/settings"
					className="px-4 py-2 rounded-md text-secondary-600 hover:bg-secondary-50 transition-colors"
				>
					Settings
				</LinkWithChannel>
			</div>

			{/* Orders List */}
			{orders.length === 0 ? (
				<div className="text-center py-16">
					<div className="mx-auto w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
						<Package className="h-8 w-8 text-secondary-400" />
					</div>
					<h2 className="text-xl font-semibold text-secondary-900 mb-2">
						No orders yet
					</h2>
					<p className="text-secondary-600 mb-8 max-w-md mx-auto">
						You haven&apos;t placed any orders yet. Start shopping to see your orders here!
					</p>
					<LinkWithChannel href="/products">
						<Button variant="primary" size="lg">
							<ShoppingBag className="h-5 w-5 mr-2" />
							Start Shopping
						</Button>
					</LinkWithChannel>
				</div>
			) : (
				<div className="space-y-6">
					{orders.map(({ node: order }) => (
						<OrderListItem order={order} key={order.id} />
					))}
				</div>
			)}
		</section>
	);
}
