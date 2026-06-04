import Link from "next/link";
import { NavLink } from "./nav-link";
import type { MenuItem } from "@/lib/menus/get-menu-data";

export function NavLinksView({ items }: { items: MenuItem[] }) {
	return (
		<>
			<NavLink href="/products">All</NavLink>
			{items.map((item) => {
				if (item.category) {
					return (
						<NavLink key={item.id} href={`/categories/${item.category.slug}`}>
							{item.category.name}
						</NavLink>
					);
				}
				if (item.collection) {
					return (
						<NavLink key={item.id} href={`/collections/${item.collection.slug}`}>
							{item.collection.name}
						</NavLink>
					);
				}
				if (item.page) {
					return (
						<NavLink key={item.id} href={`/pages/${item.page.slug}`}>
							{item.page.title}
						</NavLink>
					);
				}
				if (item.url) {
					return (
						<li key={item.id} className="inline-flex">
							<Link
								href={item.url}
								prefetch={false}
								className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
							>
								{item.name}
							</Link>
						</li>
					);
				}
				return null;
			})}
		</>
	);
}
