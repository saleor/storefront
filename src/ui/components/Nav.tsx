import Link from "next/link";
import { Suspense } from "react";
import { ActiveLink } from "./ActiveLink";
import { AccountLink } from "./AccountLink";
import { CartNavItem } from "./CartNavItem";
import { executeGraphQL } from "@/lib/graphql";
import { MenuGetBySlugDocument } from "@/gql/graphql";

export async function Nav() {
	const navLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug: "navbar" },
		revalidate: 60 * 60 * 24,
	});

	return (
		<div className="sticky top-0 z-20 bg-neutral-100/50 backdrop-blur-md">
			<div className="mx-auto max-w-7xl px-2 sm:px-8">
				<div className="flex h-16 justify-between gap-4 md:gap-8">
					<div className="flex items-center font-bold">
						<Link aria-label="homepage" href="/">
							ACME
						</Link>
					</div>
					<div className="flex overflow-x-auto overflow-y-hidden whitespace-nowrap lg:px-0">
						<div className="flex flex-shrink-0 items-center"></div>
						<div className="flex gap-4 lg:gap-8">
							<ActiveLink href="/products">All</ActiveLink>
							{navLinks.menu?.items?.map((item) => {
								if (item.category) {
									return (
										<ActiveLink key={item.id} href={`/categories/${item.category.slug}`}>
											{item.category.name}
										</ActiveLink>
									);
								}
								if (item.collection) {
									return (
										<ActiveLink key={item.id} href={`/collections/${item.collection.slug}`}>
											{item.collection.name}
										</ActiveLink>
									);
								}
								if (item.page) {
									return (
										<ActiveLink key={item.id} href={`/pages/${item.page.slug}`}>
											{item.page.title}
										</ActiveLink>
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
						</div>
					</div>
					<div className="ml-auto flex items-center justify-center whitespace-nowrap">
						<AccountLink />
					</div>
					<div className="flex items-center">
						<Suspense fallback={<div className="w-12" />}>
							<CartNavItem />
						</Suspense>
					</div>
				</div>
			</div>
		</div>
	);
}
