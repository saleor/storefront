import Link from "next/link";
import { NavLink } from "./NavLink";
import { executeGraphQL } from "@/lib/graphql";
import { MenuGetBySlugDocument } from "@/gql/graphql";
import { DEFAULT_CHANNEL } from "@/app/config";

export const NavLinks = async ({ isMobile = false }: { isMobile?: boolean }) => {
	const navLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug: "navbar", channel: DEFAULT_CHANNEL },
		revalidate: 60 * 60 * 24,
	});

	let linkIndex = 0;

	return (
		<>
			{isMobile && (
				<>
					<NavLink href="/" isMobile={isMobile} index={linkIndex++}>
						Home
					</NavLink>
					<NavLink href="/pages/about" isMobile={isMobile} index={linkIndex++}>
						About
					</NavLink>
				</>
			)}
			<NavLink href="/products" isMobile={isMobile} index={linkIndex++}>
				All
			</NavLink>
			{navLinks.menu?.items?.map((item) => {
				if (item.category) {
					return (
						<NavLink key={item.id} href={`/categories/${item.category.slug}`} isMobile={isMobile} index={linkIndex++}>
							{item.category.name}
						</NavLink>
					);
				}
				if (item.collection) {
					return (
						<NavLink key={item.id} href={`/collections/${item.collection.slug}`} isMobile={isMobile} index={linkIndex++}>
							{item.collection.name}
						</NavLink>
					);
				}
				if (item.page) {
					return (
						<NavLink key={item.id} href={`/pages/${item.page.slug}`} isMobile={isMobile} index={linkIndex++}>
							{item.page.title}
						</NavLink>
					);
				}
				if (item.url) {
					const currentIndex = linkIndex++;
					return (
						<Link
							key={item.id}
							href={item.url}
							className={
								isMobile
									? "mobile-nav-link block text-right text-4xl font-thin uppercase text-white transition-colors duration-300 hover:text-accent-400 sm:text-5xl md:text-6xl"
									: "inline-flex items-center pt-px text-sm font-light tracking-wide text-base-300 transition-colors duration-300 hover:text-accent-400"
							}
							style={isMobile ? ({ "--animation-delay": `${currentIndex * 0.1}s` } as React.CSSProperties) : undefined}
						>
							{item.name}
						</Link>
					);
				}
				return null;
			})}
		</>
	);
};
