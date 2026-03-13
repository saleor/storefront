"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollHeader({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	// Default to true so SSR renders a solid header (no hydration mismatch)
	const [scrolled, setScrolled] = useState(true);
	const rafRef = useRef<number>(0);

	const isHomepage = /^\/[^/]+\/?$/.test(pathname);

	useEffect(() => {
		const onScroll = () => {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = requestAnimationFrame(() => {
				setScrolled(window.scrollY > 50);
			});
		};

		// Check initial scroll position on mount
		onScroll();

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			cancelAnimationFrame(rafRef.current);
		};
	}, [isHomepage]);

	const showTransparent = isHomepage && !scrolled;

	return (
		<header
			className="sticky top-0 z-40 border-b transition-all duration-500 ease-out"
			style={{
				backgroundColor: showTransparent ? "transparent" : "var(--background)",
				borderColor: showTransparent ? "transparent" : "var(--border)",
				backdropFilter: showTransparent ? "none" : "blur(12px)",
			}}
			data-transparent={showTransparent ? "" : undefined}
			suppressHydrationWarning
		>
			{children}
		</header>
	);
}
