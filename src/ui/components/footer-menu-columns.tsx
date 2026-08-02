import Link from "next/link";
import type { MenuItem } from "@/lib/menus/get-menu-data";
import { getMenuItemHref, getMenuItemLabel } from "@/lib/menus/menu-item-utils";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { NavHrefLink } from "@/ui/atoms/nav-href-link";

const defaultFooterLinks = {
	support: [
		{ label: "Contact Us", href: "/contact" },
		{ label: "FAQs", href: "/faq" },
		{ label: "Shipping", href: "/shipping" },
		{ label: "Returns", href: "/returns" },
	],
	company: [
		{ label: "About", href: "/about" },
		{ label: "Sustainability", href: "/sustainability" },
		{ label: "Careers", href: "/careers" },
		{ label: "Press", href: "/press" },
	],
};

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
		<NavHrefLink href={href} className="text-sm text-inverse-subtle transition-colors hover:text-inverse">
			{label}
		</NavHrefLink>
	);
}

export function FooterMenuColumns({ items }: { items: MenuItem[] }) {
	if (items.length === 0) {
		return (
			<>
				<div>
					<h4 className="mb-4 text-sm font-medium text-inverse">Support</h4>
					<ul className="space-y-3">
						{defaultFooterLinks.support.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									prefetch={false}
									className="text-sm text-inverse-subtle transition-colors hover:text-inverse"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h4 className="mb-4 text-sm font-medium text-inverse">Company</h4>
					<ul className="space-y-3">
						{defaultFooterLinks.company.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									prefetch={false}
									className="text-sm text-inverse-subtle transition-colors hover:text-inverse"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</>
		);
	}

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
