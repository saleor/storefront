import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const useMobileMenu = () => {
	const [openRouteKey, setOpenRouteKey] = useState<string | null>(null);
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const routeKey = `${pathname}?${searchParams?.toString() ?? ""}`;

	useEffect(() => {
		const handleResize = (ev: MediaQueryListEvent) => {
			if (ev.matches) {
				setOpenRouteKey(null);
			}
		};

		const matchMedia = window.matchMedia(`(min-width: 768px)`);
		matchMedia.addEventListener("change", handleResize, { passive: true });
		return () => matchMedia.removeEventListener("change", handleResize);
	}, []);

	const closeMenu = useCallback(() => setOpenRouteKey(null), []);
	const openMenu = useCallback(() => setOpenRouteKey(routeKey), [routeKey]);

	const isOpen = openRouteKey === routeKey;

	return { isOpen, closeMenu, openMenu };
};
