import { Logo } from "./Logo";
import { Nav } from "./nav/Nav";

export function Header({ channel }: { channel: string }) {
	return (
		<header className="sticky top-0 z-20 border-b border-base-900/50 bg-black/95 backdrop-blur-xl supports-[backdrop-filter]:bg-black/80">
			<div className="mx-auto max-w-7xl px-6 lg:px-12">
				<div className="flex h-20 items-center justify-between gap-8">
					<Logo />
					<Nav channel={channel} />
				</div>
			</div>
			{/* Subtle gradient underline */}
			<div className="via-accent-500/30 absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent"></div>
		</header>
	);
}
