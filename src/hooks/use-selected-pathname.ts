"use client";

import { useParams, usePathname } from "next/navigation";

function useSelectedPathname() {
	const pathname = usePathname();

	const { channel } = useParams<{ channel?: string }>();

	const selectedPathname = channel ? pathname.replace(`/${channel}`, "") : pathname;
	return selectedPathname;
}

export default useSelectedPathname;
