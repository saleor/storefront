"use client";

import clsx from "clsx";
import { type NavMenuItem, hasNavMenuChildren, isExternalNavHref } from "@/lib/menus/serialize-menu-for-nav";
import { formatContentLabel } from "@/lib/content/format-label";
import type { NavChromeContent } from "@/lib/content/types";
import {
	Accordion,
	AccordionContent,
	AccordionItemWrapper,
	AccordionTrigger,
} from "@/ui/components/ui/accordion";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import useSelectedPathname from "@/hooks/use-selected-pathname";

function MobileNavLeafLink({ item }: { item: NavMenuItem }) {
	const pathname = useSelectedPathname();

	if (!item.href) {
		return null;
	}

	const className = clsx(
		"block rounded-md py-1.5 text-sm transition-colors",
		pathname === item.href && !isExternalNavHref(item.href)
			? "font-medium text-foreground"
			: "text-muted-foreground hover:text-foreground",
	);

	if (isExternalNavHref(item.href)) {
		return (
			<a href={item.href} className={className} rel="noopener noreferrer">
				{item.label}
			</a>
		);
	}

	return (
		<LinkWithChannel href={item.href} className={className}>
			{item.label}
		</LinkWithChannel>
	);
}

/** L2 category — section heading when it has children, otherwise a direct sub-link. */
function MobileNavSectionHeading({ item, hasChildren }: { item: NavMenuItem; hasChildren: boolean }) {
	const pathname = useSelectedPathname();
	const className = clsx(
		"block text-sm font-semibold tracking-tight",
		hasChildren ? "text-foreground" : "transition-colors hover:text-foreground",
		!hasChildren && pathname === item.href ? "text-foreground" : !hasChildren && "text-foreground/90",
		hasChildren && item.href && "hover:underline",
	);

	if (!item.href) {
		return <p className={className}>{item.label}</p>;
	}

	if (isExternalNavHref(item.href)) {
		return (
			<a href={item.href} className={className} rel="noopener noreferrer">
				{item.label}
			</a>
		);
	}

	return (
		<LinkWithChannel href={item.href} className={className}>
			{item.label}
		</LinkWithChannel>
	);
}

function MobileNavSection({ item }: { item: NavMenuItem }) {
	const grandchildren = item.children ?? [];
	const hasGrandchildren = grandchildren.length > 0;

	return (
		<div className="space-y-1.5">
			<MobileNavSectionHeading item={item} hasChildren={hasGrandchildren} />
			{hasGrandchildren ? (
				<ul className="ml-1 space-y-0.5 border-l-2 border-border pl-3">
					{grandchildren.map((grandchild) => (
						<li key={grandchild.id}>
							<MobileNavLeafLink item={grandchild} />
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}

function MobileNavGroup({ item, nav }: { item: NavMenuItem; nav: NavChromeContent }) {
	const children = item.children ?? [];

	return (
		<Accordion type="single" className="w-full">
			<AccordionItemWrapper value={item.id} className="border-none">
				<AccordionTrigger className="py-0 text-base font-semibold text-foreground hover:no-underline">
					{item.label}
				</AccordionTrigger>
				<AccordionContent className="pt-3">
					<div className="space-y-5">
						{children.map((child) => (
							<MobileNavSection key={child.id} item={child} />
						))}
					</div>
					{item.href ? (
						<div className="mt-5 border-t border-border pt-4">
							<LinkWithChannel href={item.href} className="text-sm font-medium text-primary hover:underline">
								{formatContentLabel(nav.viewAllLabel, { label: item.label })}
							</LinkWithChannel>
						</div>
					) : null}
				</AccordionContent>
			</AccordionItemWrapper>
		</Accordion>
	);
}

function MobileNavTopLink({ item }: { item: NavMenuItem }) {
	const pathname = useSelectedPathname();

	if (!item.href) {
		return null;
	}

	const className = clsx(
		"block text-base font-medium transition-colors",
		pathname === item.href && !isExternalNavHref(item.href)
			? "text-foreground"
			: "text-muted-foreground hover:text-foreground",
	);

	if (isExternalNavHref(item.href)) {
		return (
			<a href={item.href} className={className} rel="noopener noreferrer">
				{item.label}
			</a>
		);
	}

	return (
		<LinkWithChannel href={item.href} className={className}>
			{item.label}
		</LinkWithChannel>
	);
}

export function MobileNavLinks({ items, nav }: { items: NavMenuItem[]; nav: NavChromeContent }) {
	return (
		<>
			<li>
				<MobileNavTopLink item={{ id: "all-products", label: nav.allProductsLabel, href: "/products" }} />
			</li>
			{items.map((item) => {
				if (hasNavMenuChildren(item)) {
					return (
						<li key={item.id} className="py-0">
							<MobileNavGroup item={item} nav={nav} />
						</li>
					);
				}

				return (
					<li key={item.id}>
						<MobileNavTopLink item={item} />
					</li>
				);
			})}
		</>
	);
}
