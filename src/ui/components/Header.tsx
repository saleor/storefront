import Link from "next/link";
import { Suspense } from "react";
import { NavLink } from "./NavLink";
import { AccountLink } from "./AccountLink";
import { CartNavItem } from "./CartNavItem";
import { executeGraphQL } from "@/lib/graphql";
import { MenuGetBySlugDocument } from "@/gql/graphql";

export async function Header() {
	const navLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug: "navbar" },
		revalidate: 60 * 60 * 24,
	});

	return (
		<header className="sticky top-0 z-20 bg-neutral-100/50 backdrop-blur-md">
			<div className="mx-auto max-w-7xl px-2 sm:px-8">
				<div className="flex h-16 justify-between gap-4 md:gap-8">
					<div className="flex items-center font-bold">
						<Link aria-label="homepage" href="/">
							ACME
						</Link>
					</div>
					<nav className="flex w-full gap-4" aria-label="Main navigation">
						<ul className="flex gap-4 overflow-x-auto whitespace-nowrap lg:gap-8 lg:px-0">
							<NavLink href="/products">All</NavLink>
							{navLinks.menu?.items?.map((item) => {
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
										<Link key={item.id} href={item.url}>
											{item.name}
										</Link>
									);
								}
								return null;
							})}
						</ul>
						<div className="ml-auto flex items-center justify-center whitespace-nowrap">
							<AccountLink />
						</div>
						<div className="flex items-center">
							<Suspense fallback={<div className="w-12" />}>
								<CartNavItem />
							</Suspense>
						</div>
					</nav>
				</div>
			</div>
		</header>
	);
}
