import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, CreditCard } from "lucide-react";
import { OrderByNumberDocument } from "@/gql/graphql";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { formatDate, formatMoney } from "@/lib/utils";
import { OrderTimeline } from "@/ui/components/account/order-timeline";
import { OrderStatusBadge } from "@/ui/components/account/order-status-badge";
import { type AddressDetailsFragment } from "@/gql/graphql";

type Props = {
	params: Promise<{ number: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
	const { number } = await params;

	// Saleor's `me.orders` doesn't support filtering by number (UserOrdersArgs
	// only has pagination args). We fetch a page and find client-side. This covers
	// the vast majority of customers; a dedicated `orderByToken` query would be
	// more efficient if order counts grow large.
	const result = await executeAuthenticatedGraphQL(OrderByNumberDocument, {
		variables: { first: 100 },
		cache: "no-cache",
	});

	if (!result.ok || !result.data.me) {
		return null;
	}

	const orders = result.data.me.orders?.edges ?? [];
	const order = orders.find(({ node }) => node.number === number)?.node;

	if (!order) {
		notFound();
	}

	const itemCount = order.lines.reduce((sum, l) => sum + l.quantity, 0);

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">ORD-{order.number}</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Placed on {formatDate(new Date(order.created))}
					</p>
				</div>
				<OrderStatusBadge status={order.status} statusDisplay={order.statusDisplay} />
			</div>

			<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
				<div className="space-y-6">
					<div className="rounded-xl border">
						<div className="border-b px-5 py-4">
							<h2 className="text-sm font-semibold">Items ({itemCount})</h2>
						</div>
						<div className="divide-y">
							{order.lines.map((line) => {
								if (!line.variant) return null;
								const product = line.variant.product;
								const lineTotal = line.variant.pricing?.price?.gross
									? line.variant.pricing.price.gross.amount * line.quantity
									: null;
								const currency = line.variant.pricing?.price?.gross.currency;
								return (
									<div key={line.id} className="flex items-center gap-4 px-5 py-4">
										{product.thumbnail && (
											<div className="bg-secondary/30 h-16 w-16 shrink-0 overflow-hidden rounded-lg border">
												<Image
													src={product.thumbnail.url}
													alt={product.thumbnail.alt ?? ""}
													width={128}
													height={128}
													className="h-full w-full object-contain"
												/>
											</div>
										)}
										<div className="min-w-0 flex-1">
											<LinkWithChannel
												href={`/products/${product.slug}`}
												className="text-sm font-medium hover:underline"
											>
												{product.name}
											</LinkWithChannel>
											{line.variant.name !== line.variant.id && Boolean(line.variant.name) && (
												<p className="text-[13px] text-muted-foreground">{line.variant.name}</p>
											)}
											<p className="text-[13px] text-muted-foreground">Qty: {line.quantity}</p>
										</div>
										{lineTotal != null && currency && (
											<span className="text-sm font-medium tabular-nums">
												{formatMoney(lineTotal, currency)}
											</span>
										)}
									</div>
								);
							})}
						</div>

						<div className="border-t px-5 py-4">
							<dl className="space-y-2 text-sm">
								<div className="flex justify-between">
									<dt className="text-muted-foreground">Subtotal</dt>
									<dd className="tabular-nums">
										{formatMoney(order.subtotal.gross.amount, order.subtotal.gross.currency)}
									</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-muted-foreground">Shipping</dt>
									<dd className="tabular-nums">
										{order.shippingPrice.gross.amount === 0
											? "Free"
											: formatMoney(order.shippingPrice.gross.amount, order.shippingPrice.gross.currency)}
									</dd>
								</div>
								{order.total.tax.amount > 0 && (
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Tax</dt>
										<dd className="tabular-nums">
											{formatMoney(order.total.tax.amount, order.total.tax.currency)}
										</dd>
									</div>
								)}
								<div className="flex justify-between border-t pt-2 font-semibold">
									<dt>Total</dt>
									<dd className="tabular-nums">
										{formatMoney(order.total.gross.amount, order.total.gross.currency)}
									</dd>
								</div>
							</dl>
						</div>
					</div>

					<OrderTimeline order={order} />
				</div>

				<div className="space-y-4">
					{order.shippingAddress && <OrderAddress title="Shipping Address" address={order.shippingAddress} />}
					{order.billingAddress && <OrderAddress title="Billing Address" address={order.billingAddress} />}

					{order.isPaid && (
						<div className="rounded-xl border px-5 py-4">
							<h3 className="mb-3 text-sm font-semibold">Payment Method</h3>
							<div className="flex items-center gap-3">
								<CreditCard className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">
									{order.paymentStatus === "FULLY_CHARGED" ? "Paid" : order.paymentStatus}
								</span>
							</div>
						</div>
					)}

					<LinkWithChannel
						href="/contact"
						className="hover:bg-secondary/50 block w-full rounded-xl border px-5 py-3 text-center text-sm font-medium transition-colors"
					>
						Need Help?
					</LinkWithChannel>
				</div>
			</div>
		</div>
	);
}

function OrderAddress({ title, address }: { title: string; address: AddressDetailsFragment }) {
	return (
		<div className="rounded-xl border px-5 py-4">
			<h3 className="mb-3 text-sm font-semibold">{title}</h3>
			<div className="flex gap-3">
				<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
				<div className="text-sm leading-relaxed">
					<p className="font-medium">
						{address.firstName} {address.lastName}
					</p>
					<p className="text-muted-foreground">{address.streetAddress1}</p>
					{address.streetAddress2 && <p className="text-muted-foreground">{address.streetAddress2}</p>}
					<p className="text-muted-foreground">
						{address.postalCode} {address.city}
					</p>
					<p className="text-muted-foreground">{address.country.country}</p>
				</div>
			</div>
		</div>
	);
}
