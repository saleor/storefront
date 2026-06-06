"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { logout } from "@/app/actions";

/** End Saleor session on the server and refresh RSC auth chrome. */
export function useLogout() {
	const router = useRouter();

	return useCallback(async () => {
		try {
			await logout();
		} catch {
			// Checkout detach / server cookie clear is best-effort.
		}

		router.refresh();
	}, [router]);
}
