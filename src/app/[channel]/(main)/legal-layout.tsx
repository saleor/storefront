import type { ReactNode } from "react";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";

const legalNav = [
	{ label: "Privacy Policy", href: "/privacy" },
	{ label: "Terms of Service", href: "/terms" },
	{ label: "RUO Policy", href: "/ruo-policy" },
	{ label: "Waiver", href: "/waiver" },
];

export function LegalLayout({
	title,
	lastUpdated,
	children,
}: {
	title: string;
	lastUpdated: string;
	children: ReactNode;
}) {
	return (
		<div className="bg-neutral-950 text-white">
			{/* Header */}
			<section className="border-b border-neutral-800 py-14 sm:py-20">
				<div className="mx-auto max-w-3xl px-4 sm:px-6">
					<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1">
						<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
						<span className="text-xs font-medium text-neutral-400">Last updated {lastUpdated}</span>
					</div>
					<h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{title}</h1>
				</div>
			</section>

			{/* Cross-nav */}
			<div className="border-b border-neutral-800 bg-neutral-900/30">
				<div className="mx-auto max-w-3xl px-4 sm:px-6">
					<nav
						className="no-scrollbar flex gap-6 overflow-x-auto py-3 text-xs font-medium"
						aria-label="Legal pages"
					>
						{legalNav.map((item) => (
							<LinkWithChannel
								key={item.href}
								href={item.href}
								className="shrink-0 text-neutral-500 transition-colors hover:text-white"
							>
								{item.label}
							</LinkWithChannel>
						))}
					</nav>
				</div>
			</div>

			{/* Content */}
			<section className="py-12 sm:py-16">
				<div className="legal-content mx-auto max-w-3xl px-4 sm:px-6">{children}</div>
			</section>
		</div>
	);
}
