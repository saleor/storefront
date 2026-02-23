import { Circle } from "lucide-react";
import { type OrderStatus } from "@/gql/graphql";
import { orderStatusBadgeStyle, customerStatusLabel } from "./order-status-config";

type Props = {
	status: OrderStatus;
	statusDisplay: string;
};

export function OrderStatusBadge({ status, statusDisplay }: Props) {
	const config = orderStatusBadgeStyle[status] ?? {
		icon: Circle,
		badgeClassName: "text-muted-foreground bg-secondary border-border",
	};
	const Icon = config.icon;

	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${config.badgeClassName}`}
		>
			<Icon className="h-4 w-4" strokeWidth={1.75} />
			{customerStatusLabel[status] ?? statusDisplay}
		</span>
	);
}
