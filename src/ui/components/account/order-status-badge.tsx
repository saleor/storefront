import { Circle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { type OrderStatus } from "@/gql/graphql";
import { orderStatusBadgeStyle } from "./order-status-config";
import { getCustomerOrderStatusLabel } from "./order-status-labels";

type Props = {
	status: OrderStatus;
	statusDisplay: string;
	localeSlug: string;
};

export async function OrderStatusBadge({ status, statusDisplay, localeSlug }: Props) {
	const tStatus = await getTranslations({ locale: localeSlug, namespace: "account.orderStatus" });
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
			{getCustomerOrderStatusLabel(tStatus, status, statusDisplay)}
		</span>
	);
}
