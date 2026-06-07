"use client";

import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, type ReactNode } from "react";

/**
 * Keeps header auth chrome in sync with HttpOnly session cookies.
 * `key={pathname}` alone does not re-run `UserMenuServer` — refresh busts the Router Cache
 * (e.g. after checkout sign-in or returning from `/checkout` with a stale anonymous shell).
 */
export function HeaderAuthRefresh({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		router.refresh();
	}, [pathname, router]);

	return <Fragment key={pathname}>{children}</Fragment>;
}
