import type { MenuItem } from "@/lib/menus/get-menu-data";
import { getMenuItemHref, getMenuItemLabel } from "@/lib/menus/menu-item-utils";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { NavHrefLink } from "@/ui/atoms/nav-href-link";

function FooterMenuChildLink({ child }: { child: MenuItem }) {
	const href = getMenuItemHref(child);
	const label = getMenuItemLabel(child);
	if (!href || !label) return null;

	if (child.category || child.collection || child.page) {
		return (
			<LinkWithChannel
				href={href}
				prefetch={false}
				className="text-sm text-inverse-subtle transition-colors hover:text-inverse"
			>
				{label}
			</LinkWithChannel>
		);
	}

	return (
		<NavHrefLink
			href={href}
			prefetch={false}
			className="text-sm text-inverse-subtle transition-colors hover:text-inverse"
		>
			{label}
		</NavHrefLink>
	);
}

/**
 * Columns of the Saleor `footer` menu. An empty menu renders no columns: Paper does not
 * invent links (Contact, Shipping, Returns, …) to pages the shop has not created.
 */
export function FooterMenuColumns({ items }: { items: MenuItem[] }) {
	return (
		<>
			{items.map((item) => (
				<div key={item.id}>
					<h4 className="mb-4 text-sm font-medium text-inverse">{item.name}</h4>
					<ul className="space-y-3">
						{item.children?.map((child) => (
							<li key={child.id}>
								<FooterMenuChildLink child={child} />
							</li>
						))}
					</ul>
				</div>
			))}
		</>
	);
}
