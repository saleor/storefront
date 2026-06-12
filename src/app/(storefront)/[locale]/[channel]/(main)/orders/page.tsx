import { redirect } from "next/navigation";
import { buildStorefrontPath } from "@/lib/storefront-path";

type Props = {
	params: Promise<{ locale: string; channel: string }>;
};

/**
 * Redirect legacy /orders route to the new /account/orders route.
 */
export default async function LegacyOrdersPage({ params }: Props) {
	const { locale, channel } = await params;
	redirect(buildStorefrontPath(locale, channel, "/account/orders"));
}
