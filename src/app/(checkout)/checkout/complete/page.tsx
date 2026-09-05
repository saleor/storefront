import { redirect } from "next/navigation";

import { buildOrderStatusPath } from "@paper/session-bridge";
import { formatPageTitle } from "@/config/brand";

export const instant = false;
export const prefetch = "force-disabled";

export const metadata = {
	title: formatPageTitle("Order confirmed"),
	robots: { index: false, follow: false },
};

/**
 * Legacy confirmation URL. Same access rules as `/order/{id}` — redirect so
 * there is only one order page.
 */
export default async function OrderCompletePage(props: {
	searchParams: Promise<{ order?: string; locale?: string }>;
}) {
	const searchParams = await props.searchParams;
	const orderId = searchParams.order;

	if (!orderId) {
		redirect("/order/find");
	}

	redirect(buildOrderStatusPath(orderId, searchParams.locale));
}
