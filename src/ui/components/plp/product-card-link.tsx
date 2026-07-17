"use client";

import Link, { useLinkStatus } from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ProductCardLinkProps = Omit<ComponentProps<typeof Link>, "prefetch"> & {
	children: ReactNode;
};

/**
 * Product grid link with immediate pending feedback on slow networks.
 * Next.js may not show route `loading.tsx` until prefetch/response is ready —
 * `useLinkStatus` closes that gap (see linking-and-navigating § Slow networks).
 */
export function ProductCardLink({ href, className, children, ...props }: ProductCardLinkProps) {
	return (
		<Link href={href} className={className} {...props}>
			<ProductCardLinkPending>{children}</ProductCardLinkPending>
		</Link>
	);
}

function ProductCardLinkPending({ children }: { children: ReactNode }) {
	const { pending } = useLinkStatus();

	// `opacity-60` dims the card even when children are a `fill` <Image> that positions against the
	// <Link> (this <span> collapses to 0 height): opacity opens a stacking context that applies to
	// absolutely-positioned descendants too.
	return (
		<span
			className={cn("block transition-opacity duration-150", pending && "pointer-events-none opacity-60")}
			aria-busy={pending}
		>
			{children}
		</span>
	);
}
