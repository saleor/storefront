"use client";
import { ChevronDown } from "lucide-react";
import { DropdownLink } from "@/ui/components/nav/components/DropdownLink";
import { type MenuItemFragment } from "@/gql/graphql";

export function NavDropdown({
	itemName,
	itemChildren,
}: {
	itemName: string;
	itemChildren: MenuItemFragment[];
}) {
	const toggleDropdown = () =>
		document.getElementById(`dropdownMenuBottom-${itemName}`)?.classList.toggle("hidden");

	return (
		<div className="inline-flex items-center" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
			<li className="relative inline-block border-b-2 border-transparent pt-2 text-left text-sm font-medium text-neutral-200">
				<button className="inline-flex border-transparent text-neutral-200 hover:text-neutral-400 focus:outline-none">
					{itemName} <ChevronDown className="pb-1" />
				</button>
				<div
					id={`dropdownMenuBottom-${itemName}`}
					className="animate-fadeIn absolute left-0 mt-2 hidden w-56 origin-top-left bg-blue-950 shadow-lg ring-1 ring-black ring-opacity-5"
				>
					{itemChildren.map((child) => {
						if (child.category) {
							return (
								<DropdownLink key={child.id} href={`/categories/${child.category.slug}`}>
									{child.category.name}
								</DropdownLink>
							);
						}
						if (child.collection) {
							return (
								<DropdownLink key={child.id} href={`/collections/${child.collection.slug}`}>
									{child.collection.name}
								</DropdownLink>
							);
						}
						if (child.page) {
							return (
								<DropdownLink key={child.id} href={`/collections/${child.page.slug}`}>
									{child.page.title}
								</DropdownLink>
							);
						}
						if (child.url) {
							return (
								<DropdownLink key={child.id} href={child.url}>
									{child.name}
								</DropdownLink>
							);
						}
					})}
				</div>
			</li>
		</div>
	);
}
