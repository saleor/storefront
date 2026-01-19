import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { NavLink } from "./nav-link";
import { executeGraphQL } from "@/lib/graphql";
import { MenuGetBySlugDocument } from "@/gql/graphql";

export const NavLinks = async ({ channel }: { channel: string }) => {
	"use cache";
	cacheLife("hours"); // 1 hour cache - navigation rarely changes
	cacheTag("navigation"); // Tag for on-demand revalidation

	let navLinks;
	try {
		navLinks = await executeGraphQL(MenuGetBySlugDocument, {
			variables: { slug: "navbar", channel },
			revalidate: 60 * 60, // 1 hour
			withAuth: false, // Public data - no cookies in cache scope
		});
	} catch (error) {
		// During build, if the API is unreachable, render minimal nav.
		// The page will re-fetch when a user visits.
		console.warn(`[NavLinks] Failed to fetch navigation for ${channel}:`, error);
		return <NavLink href="/products">All</NavLink>;
	}

	return (
		<>
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
		</>
	);
};
