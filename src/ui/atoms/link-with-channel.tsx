"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type ComponentProps } from "react";

export const LinkWithChannel = ({
	href,
	...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) => {
	const { channel } = useParams<{ channel?: string }>();

	if (!href.startsWith("/")) {
		return <Link {...props} href={href} />;
	}

	// During hydration/recovery there can be a transient moment where params
	// are unavailable. Avoid generating malformed "//..." URLs in that case.
	if (!channel) {
		return <Link {...props} href={href} />;
	}

	const encodedChannel = encodeURIComponent(channel);
	const hrefWithChannel = `/${encodedChannel}${href}`;
	return <Link {...props} href={hrefWithChannel} />;
};
