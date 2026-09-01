"use client";

import { useEffect, useRef, type FC, type ReactNode } from "react";

type CheckoutIssueBannerProps = {
	title: string;
	children: ReactNode;
	action?: ReactNode;
};

/**
 * Page-level checkout issue — Shopify `s-banner` tone="critical" / `$.cart` target.
 * Not a field error. Persistent until the shopper resolves it.
 */
export const CheckoutIssueBanner: FC<CheckoutIssueBannerProps> = ({ title, children, action }) => {
	const bannerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const node = bannerRef.current;
		if (!node) {
			return;
		}

		node.focus({ preventScroll: true });
		node.scrollIntoView({ block: "nearest", behavior: "smooth" });
	}, []);

	return (
		<div
			ref={bannerRef}
			tabIndex={-1}
			role="alert"
			className="rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-3 outline-none"
		>
			<p className="text-sm font-semibold text-destructive">{title}</p>
			<div className="mt-1 text-pretty text-sm text-foreground">{children}</div>
			{action ? <div className="mt-3">{action}</div> : null}
		</div>
	);
};
