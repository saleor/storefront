"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { useCheckoutLegalLinks } from "@/checkout/providers/checkout-legal-links";
import { cn } from "@/lib/utils";

function LegalLink({ href, children }: { href: string; children: ReactNode }) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="underline underline-offset-2 hover:text-foreground"
		>
			{children}
		</a>
	);
}

/**
 * The reference to terms, withdrawal information and privacy notice that belongs next to
 * the order button. Each sentence appears only when its Saleor Page exists, and the whole
 * notice renders nothing for a shop without legal pages. Links open in a new tab so the
 * shopper keeps the checkout.
 */
export function OrderLegalNotice({ className }: { className?: string }) {
	const links = useCheckoutLegalLinks();
	const t = useTranslations("checkout.legal");

	const sentences = [
		links.terms
			? t.rich("terms", { link: (chunks) => <LegalLink href={links.terms!}>{chunks}</LegalLink> })
			: null,
		links.withdrawal
			? t.rich("withdrawal", {
					link: (chunks) => <LegalLink href={links.withdrawal!}>{chunks}</LegalLink>,
				})
			: null,
		links.privacy
			? t.rich("privacy", { link: (chunks) => <LegalLink href={links.privacy!}>{chunks}</LegalLink> })
			: null,
	].filter((sentence) => sentence !== null);

	if (sentences.length === 0) {
		return null;
	}

	return (
		<p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
			{sentences.map((sentence, index) => (
				<span key={index}>
					{index > 0 ? " " : null}
					{sentence}
				</span>
			))}
		</p>
	);
}
