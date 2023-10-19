import { useMemo, useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type Args = {
	breakpoint: number;
};

export const useMobileMenu = ({ breakpoint }: Args) => {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > breakpoint) {
				setIsOpen(false);
			}
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [breakpoint, isOpen]);

	useEffect(() => {
		setIsOpen(false);
	}, [pathname, searchParams]);

	const closeMenu = useCallback(() => setIsOpen(false), []);
	const openMenu = useCallback(() => setIsOpen(true), []);

	return useMemo(
		() => ({
			isOpen,
			closeMenu,
			openMenu,
		}),
		[closeMenu, isOpen, openMenu],
	);
};
