import { getNavbarMenuItems } from "@/lib/menus/get-menu-data";
import { NavLinksView } from "./nav-links-view";

export async function NavLinks({ channel }: { channel: string }) {
	const items = await getNavbarMenuItems(channel);
	return <NavLinksView items={items ?? []} />;
}
