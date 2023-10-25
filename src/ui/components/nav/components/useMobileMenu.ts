import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const useMobileMenu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();
	useSearchParams();

	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	useEffect(() => {
		const handleResize = (ev: MediaQueryListEvent) => {
			if (ev.matches) {
				setIsOpen(false);
			}
		};

		const matchMedia = window.matchMedia(`(min-width: 768px)`);
		matchMedia.addEventListener("change", handleResize, { passive: true });
		return () => matchMedia.removeEventListener("change", handleResize);
	}, []);

	const closeMenu = useCallback(() => setIsOpen(false), []);
	const openMenu = useCallback(() => setIsOpen(true), []);

	return { isOpen, closeMenu, openMenu };
};
