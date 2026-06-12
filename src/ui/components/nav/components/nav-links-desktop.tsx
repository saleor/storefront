import dynamic from "next/dynamic";
import type { NavMenuItem } from "@/lib/menus/serialize-menu-for-nav";

function NavLinksDesktopSkeleton() {
	return (
		<div className="flex gap-6" aria-hidden="true">
			<span className="h-4 w-8 animate-pulse rounded bg-muted" />
			<span className="h-4 w-16 animate-pulse rounded bg-muted" />
			<span className="h-4 w-12 animate-pulse rounded bg-muted" />
		</div>
	);
}

const MegaMenuDesktop = dynamic(() => import("./mega-menu-desktop").then((mod) => mod.MegaMenuDesktop), {
	loading: () => <NavLinksDesktopSkeleton />,
});

export function NavLinksDesktop({ items }: { items: NavMenuItem[] }) {
	return <MegaMenuDesktop items={items} />;
}
