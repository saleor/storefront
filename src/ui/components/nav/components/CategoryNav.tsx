"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import useSelectedPathname from "@/hooks/useSelectedPathname";

type Category = {
	id: string;
	name: string;
	slug: string;
	children?: { id: string; name: string; slug: string }[];
};

type Collection = {
	id: string;
	name: string;
	slug: string;
};

type CategoryNavProps = {
	categories: Category[];
	collections?: Collection[];
};

export function CategoryNav({ categories, collections = [] }: CategoryNavProps) {
	const pathname = useSelectedPathname();
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleMouseEnter = (categoryId: string) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setOpenDropdown(categoryId);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setOpenDropdown(null);
		}, 150);
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<>
			{/* All Products Link */}
			<li className="inline-flex">
				<LinkWithChannel
					href="/products"
					className={clsx(
						pathname === "/products"
							? "border-primary-600 text-primary-600"
							: "border-transparent text-secondary-600",
						"inline-flex items-center border-b-2 px-1 pt-px text-sm font-medium transition-colors hover:text-primary-600",
					)}
				>
					All
				</LinkWithChannel>
			</li>

			{/* Category Links with Dropdowns */}
			{categories.map((category) => {
				const hasChildren = category.children && category.children.length > 0;
				const isActive = pathname === `/categories/${category.slug}`;
				const isOpen = openDropdown === category.id;

				return (
					<li
						key={category.id}
						className="relative inline-flex"
						onMouseEnter={() => hasChildren && handleMouseEnter(category.id)}
						onMouseLeave={handleMouseLeave}
					>
						<LinkWithChannel
							href={`/categories/${category.slug}`}
							className={clsx(
								isActive ? "border-primary-600 text-primary-600" : "border-transparent text-secondary-600",
								"inline-flex items-center gap-1 border-b-2 px-1 pt-px text-sm font-medium transition-colors hover:text-primary-600",
							)}
						>
							{category.name}
							{hasChildren && (
								<ChevronDown
									className={clsx("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")}
								/>
							)}
						</LinkWithChannel>

						{/* Dropdown Menu */}
						{hasChildren && isOpen && (
							<div
								className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-lg border border-secondary-200 bg-white py-2 shadow-lg"
								onMouseEnter={() => handleMouseEnter(category.id)}
								onMouseLeave={handleMouseLeave}
							>
								{/* View All in Category */}
								<LinkWithChannel
									href={`/categories/${category.slug}`}
									className="block px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
								>
									View All {category.name}
								</LinkWithChannel>
								<div className="my-1 border-t border-secondary-100" />
								{/* Subcategories */}
								{category.children?.map((child) => (
									<LinkWithChannel
										key={child.id}
										href={`/categories/${child.slug}`}
										className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 hover:text-primary-600"
									>
										{child.name}
									</LinkWithChannel>
								))}
							</div>
						)}
					</li>
				);
			})}

			{/* Collections Dropdown */}
			{collections.length > 0 && (
				<li
					className="relative inline-flex"
					onMouseEnter={() => handleMouseEnter("collections")}
					onMouseLeave={handleMouseLeave}
				>
					<LinkWithChannel
						href="/collections"
						className={clsx(
							pathname?.startsWith("/collections")
								? "border-primary-600 text-primary-600"
								: "border-transparent text-secondary-600",
							"inline-flex items-center gap-1 border-b-2 px-1 pt-px text-sm font-medium transition-colors hover:text-primary-600",
						)}
					>
						Collections
						<ChevronDown
							className={clsx(
								"h-3.5 w-3.5 transition-transform duration-200",
								openDropdown === "collections" && "rotate-180",
							)}
						/>
					</LinkWithChannel>

					{/* Collections Dropdown Menu */}
					{openDropdown === "collections" && (
						<div
							className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-lg border border-secondary-200 bg-white py-2 shadow-lg"
							onMouseEnter={() => handleMouseEnter("collections")}
							onMouseLeave={handleMouseLeave}
						>
							<LinkWithChannel
								href="/collections"
								className="block px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50"
							>
								View All Collections
							</LinkWithChannel>
							<div className="my-1 border-t border-secondary-100" />
							{collections.map((collection) => (
								<LinkWithChannel
									key={collection.id}
									href={`/collections/${collection.slug}`}
									className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 hover:text-primary-600"
								>
									{collection.name}
								</LinkWithChannel>
							))}
						</div>
					)}
				</li>
			)}
		</>
	);
}
