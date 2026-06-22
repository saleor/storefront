"use client";

import { useParams, usePathname } from "next/navigation";
import { stripStorefrontPrefix } from "@/lib/storefront-path";

function useSelectedPathname() {
	const pathname = usePathname();
	const { locale, channel } = useParams<{ locale?: string; channel?: string }>();

	if (locale && channel) {
		return stripStorefrontPrefix(pathname, locale, channel);
	}

	return pathname;
}

export default useSelectedPathname;
