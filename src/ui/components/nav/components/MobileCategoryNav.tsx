"use client";

import { useState } from "react";
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

type MobileCategoryNavProps = {
	categories: Category[];
	collections?: Collection[];
};

export function MobileCategoryNav({ categories, collections = [] }: MobileCategoryNavProps) {
	const pathname = useSelectedPathname();
	const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

	const toggleCategory = (categoryId: string) => {
		setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
	};

	return (
		<>
			{/* All Products Link */}
			<li className="py-3">
				<LinkWithChannel
					href="/products"
					className={clsx(
						pathname === "/products" ? "font-semibold text-primary-600" : "text-secondary-700",
						"block text-base transition-colors hover:text-primary-600",
					)}
				>
					All Products
				</LinkWithChannel>
			</li>

			{/* Category Links */}
			{categories.map((category) => {
				const hasChildren = category.children && category.children.length > 0;
				const isActive = pathname === `/categories/${category.slug}`;
				const isExpanded = expandedCategory === category.id;

				return (
					<li key={category.id} className="border-t border-secondary-100 py-3">
						<div className="flex items-center justify-between">
							<LinkWithChannel
								href={`/categories/${category.slug}`}
								className={clsx(
									isActive ? "font-semibold text-primary-600" : "text-secondary-700",
									"block text-base transition-colors hover:text-primary-600",
								)}
							>
								{category.name}
							</LinkWithChannel>
							{hasChildren && (
								<button
									onClick={() => toggleCategory(category.id)}
									className="-mr-2 p-2 text-secondary-500 hover:text-secondary-700"
									aria-expanded={isExpanded}
									aria-label={`${isExpanded ? "Collapse" : "Expand"} ${category.name} subcategories`}
								>
									<ChevronDown
										className={clsx("h-5 w-5 transition-transform duration-200", isExpanded && "rotate-180")}
									/>
								</button>
							)}
						</div>

						{/* Subcategories */}
						{hasChildren && isExpanded && (
							<ul className="ml-4 mt-2 space-y-2">
								{category.children?.map((child) => (
									<li key={child.id}>
										<LinkWithChannel
											href={`/categories/${child.slug}`}
											className={clsx(
												pathname === `/categories/${child.slug}`
													? "font-medium text-primary-600"
													: "text-secondary-600",
												"block py-1 text-sm transition-colors hover:text-primary-600",
											)}
										>
											{child.name}
										</LinkWithChannel>
									</li>
								))}
							</ul>
						)}
					</li>
				);
			})}

			{/* Collections Section */}
			{collections.length > 0 && (
				<li className="border-t border-secondary-100 py-3">
					<div className="flex items-center justify-between">
						<LinkWithChannel
							href="/collections"
							className={clsx(
								pathname?.startsWith("/collections")
									? "font-semibold text-primary-600"
									: "text-secondary-700",
								"block text-base transition-colors hover:text-primary-600",
							)}
						>
							Collections
						</LinkWithChannel>
						<button
							onClick={() => toggleCategory("collections")}
							className="-mr-2 p-2 text-secondary-500 hover:text-secondary-700"
							aria-expanded={expandedCategory === "collections"}
							aria-label={`${expandedCategory === "collections" ? "Collapse" : "Expand"} collections`}
						>
							<ChevronDown
								className={clsx(
									"h-5 w-5 transition-transform duration-200",
									expandedCategory === "collections" && "rotate-180",
								)}
							/>
						</button>
					</div>

					{/* Collection Links */}
					{expandedCategory === "collections" && (
						<ul className="ml-4 mt-2 space-y-2">
							{collections.map((collection) => (
								<li key={collection.id}>
									<LinkWithChannel
										href={`/collections/${collection.slug}`}
										className={clsx(
											pathname === `/collections/${collection.slug}`
												? "font-medium text-primary-600"
												: "text-secondary-600",
											"block py-1 text-sm transition-colors hover:text-primary-600",
										)}
									>
										{collection.name}
									</LinkWithChannel>
								</li>
							))}
						</ul>
					)}
				</li>
			)}
		</>
	);
}
