"use client";

import { usePathname } from "next/navigation";
import { Fragment, type ReactNode } from "react";

/** Remount user menu on navigation so auth chrome re-fetches from the server. Must stay inside `<Suspense>` (uses `usePathname`). */
export function HeaderAuthRefresh({ children }: { children: ReactNode }) {
	const pathname = usePathname();

	return <Fragment key={pathname}>{children}</Fragment>;
}
