import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { WITHDRAW_PATH } from "@/config/legal";
import { canWithdrawOrder, getWithdrawableOrders } from "@/lib/withdrawals/account";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";

type Props = { locale: string; channel: string; orderId: string; className: string };

/**
 * "Withdraw from contract" for an order in the account. Streams on its own: the order pages
 * render at once and the link appears when the withdrawal backend has said which orders are still open.
 */
export function WithdrawOrderLink(props: Props) {
	return (
		<Suspense fallback={null}>
			<WithdrawOrderLinkContent {...props} />
		</Suspense>
	);
}

async function WithdrawOrderLinkContent({ locale, channel, orderId, className }: Props) {
	const [withdrawable, t] = await Promise.all([
		getWithdrawableOrders(locale, channel),
		getTranslations({ locale, namespace: "withdraw" }),
	]);
	if (!canWithdrawOrder(withdrawable, orderId)) return null;
	// The order ID goes into the link only when a backend has answered for this order; it reads the
	// order's details anonymously, so it is never put in a URL that cannot use it.
	const href =
		withdrawable.kind === "some" ? `${WITHDRAW_PATH}?order=${encodeURIComponent(orderId)}` : WITHDRAW_PATH;
	return (
		<LinkWithChannel href={href} className={className}>
			{t("entry")}
		</LinkWithChannel>
	);
}
