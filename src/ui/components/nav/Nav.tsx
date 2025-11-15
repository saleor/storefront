import { NavLinks } from "./components/NavLinks";

export const Nav = ({ channel }: { channel: string }) => {
	return (
		<nav id="navmenu" className="navmenu" aria-label="Main navigation">
			<ul id="navmenu-list">
				<NavLinks channel={channel} />
			</ul>
		</nav>
	);
};
