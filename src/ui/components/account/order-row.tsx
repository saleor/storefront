import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { type OrderDetailsFragment } from "@/gql/graphql";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { formatDate, formatMoney } from "@/lib/utils";
import { orderStatusStyle, defaultStatusStyle, customerStatusLabel } from "./order-status-config";
import { accountRoutes } from "./routes";

type Props = {
	order: OrderDetailsFragment;
};

export function OrderRow({ order }: Props) {
	const thumbnails = order.lines
		.filter((l) => l.variant?.product.thumbnail)
		.map((l) => l.variant!.product.thumbnail!)
		.slice(0, 3);

	const itemCount = order.lines.reduce((sum, l) => sum + l.quantity, 0);

	const style = orderStatusStyle[order.status] ?? defaultStatusStyle;
	const StatusIcon = style.icon;

	return (
		<LinkWithChannel
			href={accountRoutes.orderDetail(order.number)}
			className="hover:bg-secondary/30 flex items-center gap-4 rounded-lg border px-5 py-4 transition-colors"
		>
			<div className="flex -space-x-3">
				{thumbnails.map((thumb, i) => (
					<div
						key={i}
						className="bg-secondary/40 h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 border-background"
					>
						<Image
							src={thumb.url}
							alt={thumb.alt ?? ""}
							width={96}
							height={96}
							className="h-full w-full object-contain"
						/>
					</div>
				))}
				{thumbnails.length === 0 && (
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-xs text-muted-foreground">
						#
					</div>
				)}
			</div>

			<div className="min-w-0 flex-1">
				<p className="text-sm font-semibold">ORD-{order.number}</p>
				<p className="text-[13px] text-muted-foreground">
					<time dateTime={order.created}>{formatDate(new Date(order.created))}</time>
					{" · "}
					{itemCount} {itemCount === 1 ? "item" : "items"}
				</p>
			</div>

			<div className="flex items-center gap-4">
				<span className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${style.className}`}>
					<StatusIcon className="h-4 w-4" strokeWidth={1.75} />
					<span className="hidden sm:inline">{customerStatusLabel[order.status] ?? order.statusDisplay}</span>
				</span>
				<span className="text-sm font-semibold tabular-nums">
					{formatMoney(order.total.gross.amount, order.total.gross.currency)}
				</span>
				<ArrowRight className="h-4 w-4 text-muted-foreground" />
			</div>
		</LinkWithChannel>
	);
}
