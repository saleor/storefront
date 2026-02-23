import { redirect } from "next/navigation";

type Props = {
	params: Promise<{ channel: string }>;
};

/**
 * Redirect legacy /orders route to the new /account/orders route.
 */
export default async function LegacyOrdersPage({ params }: Props) {
	const { channel } = await params;
	redirect(`/${channel}/account/orders`);
}
