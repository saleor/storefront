import { NavLink } from "./NavLink";
import { executeGraphQL } from "@/lib/graphql";
import { MenuGetBySlugDocument } from "@/gql/graphql";
import { NavDropdown } from "@/ui/components/nav/components/NavDropdown";

export const NavLinks = async ({ channel, mobile }: { channel: string; mobile?: boolean }) => {
	const navLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug: "navbar", channel },
		revalidate: 60 * 60 * 24,
	});

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
						<NavLink key={item.id} href={item.url}>
							{item.name}
						</NavLink>
					);
				}
				if (item.children && item.children.length > 0) {
					return (
						<NavDropdown key={item.id} itemName={item.name} mobile={mobile} itemChildren={item.children} />
					);
				}
				return null;
			})}
		</>
	);
};
